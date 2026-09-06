<?php
declare(strict_types=1);

namespace Baruck;

require dirname(__DIR__) . '/src/bootstrap.php';

try {
    startSession();
    $user = currentUser();
    $page = is_string($_GET['page'] ?? null) ? $_GET['page'] : 'dashboard';
    $error = '';
    $flash = $_SESSION['flash'] ?? '';
    unset($_SESSION['flash']);
    $setup = config()['environment'] === 'local' && (int) query('SELECT COUNT(*) FROM users')->fetchColumn() === 0;
    if ($setup) $page = 'setup';
    elseif (!$user) $page = 'login';
    if (!in_array($page, ['setup', 'login', 'dashboard', 'articles', 'edit', 'media', 'users', 'account', 'publication', 'image'], true)) {
        http_response_code(404); $page = 'missing';
    }
    if ($user && in_array($page, ['users', 'publication'], true)) requireAdmin($user);

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        requireCsrf();
        try {
            $action = text($_POST, 'action', 32);
            if ($setup && $action === 'setup') {
                // Initialisation locale uniquement. En production : commande CLI privée.
                if ((int) query("SELECT GET_LOCK('baruck_setup', 10)")->fetchColumn() !== 1) throw new ConflictError('Une initialisation est déjà en cours. Réessayez dans quelques instants.');
                try {
                    if ((int) query('SELECT COUNT(*) FROM users')->fetchColumn() > 0) throw new ConflictError('Le premier compte existe déjà. Rechargez la page.');
                    createUser([...$_POST, 'role' => 'admin']);
                } finally { query("SELECT RELEASE_LOCK('baruck_setup')"); }
                login($_POST); redirect('dashboard');
            }
            if (!$setup && !$user && $action === 'login') { login($_POST); redirect('dashboard'); }
            if (!$user) throw new ValidationError('Connectez-vous pour continuer.');
            switch ($action) {
                case 'logout':
                    $_SESSION = []; session_regenerate_id(true); redirect('login');
                case 'save_article':
                    $id = saveArticle($_POST, $user);
                    $_SESSION['flash'] = ($_POST['status'] ?? '') === 'ready' ? 'Article validé. Il sera inclus dans la prochaine publication du site.' : 'Brouillon enregistré.';
                    redirect('edit', ['id' => $id]);
                case 'upload':
                    uploadMedia($_FILES['image'] ?? [], text($_POST, 'alt', 500), $user);
                    $_SESSION['flash'] = 'Image ajoutée à la médiathèque.'; redirect('media');
                case 'create_user':
                    requireAdmin($user); createUser($_POST, $user['id']);
                    $_SESSION['flash'] = 'Compte créé.'; redirect('users');
                case 'toggle_user':
                    requireAdmin($user);
                    $id = text($_POST, 'id', 32);
                    if ($id === $user['id']) throw new ValidationError('Vous ne pouvez pas désactiver votre propre compte.');
                    transaction(function () use ($id, $user) {
                        $target = query('SELECT * FROM users WHERE id=? FOR UPDATE', [$id])->fetch();
                        if (!$target) throw new ValidationError('Compte introuvable.');
                        query('UPDATE users SET active=?,session_version=session_version+1 WHERE id=?', [$target['active'] ? 0 : 1, $id]);
                        audit($target['active'] ? 'Compte désactivé' : 'Compte réactivé', $target['name'], $user['id']);
                    });
                    $_SESSION['flash'] = 'Accès mis à jour. Les anciennes sessions sont invalidées.'; redirect('users');
                case 'change_password':
                    $old = is_string($_POST['current_password'] ?? null) ? $_POST['current_password'] : '';
                    $hash = query('SELECT password_hash FROM users WHERE id=?', [$user['id']])->fetchColumn();
                    if (!password_verify($old, $hash)) throw new ValidationError('Le mot de passe actuel est incorrect.');
                    $newHash = password(is_string($_POST['password'] ?? null) ? $_POST['password'] : '');
                    transaction(function () use ($newHash, $user) {
                        query('UPDATE users SET password_hash=?,session_version=session_version+1 WHERE id=?', [$newHash, $user['id']]);
                        audit('Mot de passe modifié', $user['name'], $user['id']);
                    });
                    $_SESSION = []; session_regenerate_id(true); redirect('login');
                case 'export':
                    $export = exportContent($user);
                    header('Content-Type: application/json; charset=utf-8');
                    header('Content-Disposition: attachment; filename="baruck-publication-' . gmdate('Y-m-d-His') . '.json"');
                    echo json_encode($export, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR); exit;
                default: throw new ValidationError('Action inconnue.');
            }
        } catch (ValidationError | ConflictError $exception) {
            http_response_code($exception instanceof ConflictError ? 409 : 422);
            $error = $exception->getMessage();
        }
    } elseif ($_SERVER['REQUEST_METHOD'] !== 'GET' && $_SERVER['REQUEST_METHOD'] !== 'HEAD') {
        header('Allow: GET, HEAD, POST'); http_response_code(405); exit;
    }

    if ($page === 'image' && $user) {
        $image = query('SELECT * FROM media WHERE id=?', [is_string($_GET['id'] ?? null) ? $_GET['id'] : ''])->fetch();
        if (!$image) { http_response_code(404); exit; }
        header('Content-Type: ' . $image['mime']);
        header('Content-Length: ' . $image['bytes']);
        readfile(config()['storage'] . '/media/' . $image['filename']); exit;
    }

    $article = null;
    if ($page === 'edit') {
        $id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
        $article = $id ? query('SELECT * FROM articles WHERE id=?', [$id])->fetch() : null;
        if ($id && !$article) { http_response_code(404); $page = 'missing'; }
        if ($article) {
            $article['date'] = $article['article_date'];
            $article['gallery'] = json_decode($article['gallery'], true, 512, JSON_THROW_ON_ERROR);
        }
        if ($error && ($_POST['action'] ?? '') === 'save_article') $article = $_POST;
        $article ??= ['id' => '', 'version' => 0, 'title' => '', 'slug' => '', 'category' => 'groupe', 'date' => '', 'excerpt' => '', 'body' => '', 'cover' => '', 'cover_alt' => '', 'gallery' => [], 'status' => 'draft'];
    }
    require dirname(__DIR__) . '/src/views/layout.php';
} catch (\Throwable $exception) {
    // Ne jamais afficher DSN, chemins, mots de passe ou trace dans la réponse.
    error_log('Baruck admin: ' . get_class($exception) . ' code=' . $exception->getCode());
    http_response_code(503);
    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    echo '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Administration indisponible</title><h1>Administration temporairement indisponible</h1><p>Réessayez dans quelques instants. Si le problème persiste, contactez la personne qui gère le site.</p></html>';
}
