<?php
declare(strict_types=1);

namespace Baruck;

function startSession(): void
{
    $settings = config();
    $expectedHost = parse_url($settings['origin'], PHP_URL_HOST);
    $port = parse_url($settings['origin'], PHP_URL_PORT);
    if (($_SERVER['HTTP_HOST'] ?? '') !== $expectedHost . ($port ? ':' . $port : '')) {
        http_response_code(400); exit('Adresse du back-office incorrecte.');
    }
    if ($settings['environment'] === 'production' && ($_SERVER['HTTPS'] ?? '') !== 'on') {
        http_response_code(400); exit('La connexion HTTPS est nécessaire.');
    }
    header('Cache-Control: no-store, private');
    header('X-Content-Type-Options: nosniff');
    header('X-Frame-Options: DENY');
    header('Referrer-Policy: no-referrer');
    header('X-Robots-Tag: noindex, nofollow');
    header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'none'");
    if ($settings['environment'] === 'production') header('Strict-Transport-Security: max-age=31536000');
    $sessions = $settings['storage'] . '/sessions';
    if (!is_dir($sessions)) mkdir($sessions, 0700, true);
    ini_set('session.use_strict_mode', '1');
    ini_set('session.use_only_cookies', '1');
    ini_set('session.use_trans_sid', '0');
    session_save_path($sessions);
    session_name($settings['environment'] === 'production' ? '__Host-baruck_admin' : 'baruck_admin_local');
    session_set_cookie_params(['lifetime' => 0, 'path' => '/', 'secure' => $settings['environment'] === 'production', 'httponly' => true, 'samesite' => 'Strict']);
    session_start();
    if (isset($_SESSION['user_id']) && (time() - ($_SESSION['last_seen'] ?? 0) > 1800 || time() - ($_SESSION['started'] ?? 0) > 28800)) {
        $recovery = recoverExpiredSubmission($_SESSION, $_POST, $_SERVER, time());
        $_SESSION = $recovery ? ['recovery' => $recovery] : [];
        session_regenerate_id(true);
    }
    if (isset($_SESSION['recovery']) && $_SESSION['recovery']['expires'] <= time()) unset($_SESSION['recovery']);
    $_SESSION['last_seen'] = time();
    $_SESSION['csrf'] ??= bin2hex(random_bytes(32));
}

/** Ne conserver qu’une saisie légitime de la session expirée, jamais ses secrets. */
function recoverExpiredSubmission(array $session, array $post, array $server, int $time): ?array
{
    if (($server['REQUEST_METHOD'] ?? '') !== 'POST' || ($post['action'] ?? '') !== 'save_article'
        || !is_string($post['csrf'] ?? null) || !is_string($session['csrf'] ?? null)
        || !hash_equals($session['csrf'], $post['csrf']) || !is_string($session['user_id'] ?? null)
        || (isset($server['HTTP_ORIGIN']) && $server['HTTP_ORIGIN'] !== config()['origin'])) return null;
    $fields = ['id', 'version', 'slug', 'title', 'category', 'date', 'excerpt', 'body', 'cover', 'cover_alt', 'gallery'];
    $draft = array_intersect_key($post, array_flip($fields));
    foreach ($draft as $key => $value) {
        if ($key === 'gallery' ? !is_array($value) : !is_string($value)) return null;
    }
    if (strlen(json_encode($draft, JSON_INVALID_UTF8_SUBSTITUTE)) > 300000) return null;
    return ['user_id' => $session['user_id'], 'draft' => $draft, 'expires' => $time + 3600, 'token' => bin2hex(random_bytes(16))];
}

function loginDestination(): never
{
    $recovery = $_SESSION['recovery'] ?? null;
    if ($recovery) redirect('edit', ['id' => $recovery['draft']['id'] ?? '', 'recover' => $recovery['token']]);
    redirect('dashboard');
}

function csrfField(): string { return '<input type="hidden" name="csrf" value="' . e($_SESSION['csrf']) . '">'; }

function requireCsrf(): void
{
    $token = $_POST['csrf'] ?? null;
    if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token) || (isset($_SERVER['HTTP_ORIGIN']) && $_SERVER['HTTP_ORIGIN'] !== config()['origin'])) {
        http_response_code(403); exit('La session du formulaire a expiré. Rechargez la page.');
    }
}

function currentUser(): ?array
{
    if (!isset($_SESSION['user_id'])) return null;
    $user = query('SELECT id,email,name,role,active,session_version FROM users WHERE id = ?', [$_SESSION['user_id']])->fetch();
    if (!$user || !$user['active'] || (int) $user['session_version'] !== ($_SESSION['session_version'] ?? 0)) {
        $_SESSION = ['csrf' => bin2hex(random_bytes(32))]; session_regenerate_id(true); return null;
    }
    return $user;
}

function requireAdmin(array $user): void
{
    if ($user['role'] !== 'admin') { http_response_code(403); exit('Cette action est réservée à un administrateur.'); }
}

function password(string $value): string
{
    // Compter les caractères visibles, pas les octets UTF-8. Aucune troncature.
    if (preg_match('//u', $value) !== 1 || str_contains($value, "\0")) throw new ValidationError('Le mot de passe contient un caractère invalide.');
    if (preg_match_all('/\X/u', $value) < 15) throw new ValidationError('Choisissez un mot de passe d’au moins 15 caractères. Une phrase de plusieurs mots convient.');
    if (strlen($value) > 72) throw new ValidationError('Ce mot de passe est trop long pour être enregistré. Réduisez sa longueur.');
    return password_hash($value, PASSWORD_BCRYPT, ['cost' => 12]);
}

function createUser(array $input, ?string $actor = null): string
{
    $email = strtolower(text($input, 'email', 190));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) throw new ValidationError('Adresse e-mail invalide.');
    $name = text($input, 'name', 100);
    $role = text($input, 'role', 16);
    if (!in_array($role, ['admin', 'editor'], true)) throw new ValidationError('Rôle invalide.');
    $hash = password(is_string($input['password'] ?? null) ? $input['password'] : '');
    $id = id();
    try {
        transaction(function () use ($id, $email, $name, $hash, $role, $actor) {
            query('INSERT INTO users (id,email,name,password_hash,role,created_at) VALUES (?,?,?,?,?,?)', [$id, $email, $name, $hash, $role, now()]);
            audit('Compte créé', $name, $actor);
        });
    } catch (\PDOException $error) {
        if ($error->getCode() === '23000') throw new ValidationError('Cette adresse possède déjà un compte.');
        throw $error;
    }
    return $id;
}

/** Limites distinctes par compte et par IP, partagées entre toutes les sessions. */
function withAttemptLimit(string $identity, callable $verify, string $scope = 'login'): mixed
{
    $dir = config()['storage'] . '/throttle';
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    $limits = [
        'account-' . hash('sha256', $scope . ':' . $identity) => 10,
        'ip-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown') => 50,
    ];
    $locks = [];
    $states = [];
    try {
        foreach ($limits as $key => $limit) {
            $lock = fopen($dir . '/' . $key . '.json', 'c+');
            if (!$lock) throw new \RuntimeException('Compteur de connexion indisponible.');
            $locks[$key] = $lock;
            if (!flock($lock, LOCK_EX)) throw new \RuntimeException('Verrou de connexion indisponible.');
            $state = json_decode(stream_get_contents($lock), true);
            if (!is_array($state) || !isset($state['start'], $state['count']) || time() - $state['start'] >= 900) $state = ['start' => time(), 'count' => 0];
            if ($state['count'] >= $limit) throw new ValidationError('Trop de tentatives. Réessayez dans quinze minutes.');
            $states[$key] = $state;
        }
        $result = $verify();
        foreach ($states as $key => $state) {
            if (!$result) $state['count']++;
            // Une connexion valide ne remet pas à zéro le compteur IP global.
            elseif (str_starts_with($key, 'account-')) $state = ['start' => time(), 'count' => 0];
            $lock = $locks[$key];
            rewind($lock); ftruncate($lock, 0); fwrite($lock, json_encode($state)); fflush($lock);
        }
        return $result;
    } finally {
        foreach (array_reverse($locks) as $lock) { flock($lock, LOCK_UN); fclose($lock); }
    }
}

function login(array $input): void
{
    $email = strtolower(text($input, 'email', 190));
    $value = $input['password'] ?? '';
    if (!is_string($value) || strlen($value) > 72 || str_contains($value, "\0")) throw new ValidationError('Connexion impossible. Vérifiez vos identifiants.');
    $user = withAttemptLimit($email, function () use ($email, $value) {
        $user = query('SELECT * FROM users WHERE email = ?', [$email])->fetch();
        $dummyHash = '$2y$12$QwErTyUiOpAsDfGhJkLzXuVs5vr9iUkzV/lN/mNVjjkmdm.Qvye/6';
        $verified = password_verify($value, $user['password_hash'] ?? $dummyHash);
        return $user && $verified && $user['active'] ? $user : null;
    });
    if (!$user) throw new ValidationError('Connexion impossible. Vérifiez vos identifiants.');
    $recovery = $_SESSION['recovery'] ?? null;
    session_regenerate_id(true);
    $_SESSION = ['user_id' => $user['id'], 'session_version' => (int) $user['session_version'], 'started' => time(), 'last_seen' => time(), 'csrf' => bin2hex(random_bytes(32))];
    if (is_array($recovery) && $recovery['user_id'] === $user['id'] && $recovery['expires'] > time()) $_SESSION['recovery'] = $recovery;
}
