<?php
declare(strict_types=1);

namespace Baruck;
if (PHP_SAPI !== 'cli') { http_response_code(404); exit; }
require dirname(__DIR__) . '/src/bootstrap.php';

$command = $argv[1] ?? 'init';
try {
    if ($command === 'init') {
        db()->exec(file_get_contents(dirname(__DIR__) . '/schema.sql'));
        $seed = json_decode(file_get_contents(dirname(__DIR__) . '/seed.json'), true, 512, JSON_THROW_ON_ERROR);
        transaction(function () use ($seed) {
            foreach ($seed['articles'] as $article) {
                // Ne jamais écraser un contenu modifié lors d’une réinstallation.
                if (query('SELECT id FROM articles WHERE slug=?', [$article['slug']])->fetch()) continue;
                query('INSERT INTO articles (id,slug,title,category,article_date,excerpt,body,cover,cover_alt,gallery,status,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)', [id(), $article['slug'], $article['title'], $article['category'], $article['date'], $article['excerpt'], $article['body'], $article['cover'] ?? '', $article['coverAlt'] ?? '', json_encode($article['gallery'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), ($article['draft'] ?? false) ? 'draft' : 'ready', now()]);
            }
        });
        echo "Tables initialisées ; articles existants préservés.\n";
    } elseif ($command === 'user' || $command === 'reset-password') {
        // Entrée JSON sur stdin : aucun mot de passe dans l’historique de commande.
        $input = json_decode(stream_get_contents(STDIN), true, 32, JSON_THROW_ON_ERROR);
        if ($command === 'user') {
            createUser($input);
            echo "Compte créé.\n";
        } else {
            $hash = password($input['password'] ?? '');
            $user = query('SELECT id,name FROM users WHERE email=?', [strtolower(text($input, 'email', 190))])->fetch();
            if (!$user) throw new ValidationError('Compte introuvable.');
            transaction(function () use ($hash, $user) {
                query('UPDATE users SET password_hash=?,session_version=session_version+1 WHERE id=?', [$hash, $user['id']]);
                audit('Mot de passe réinitialisé', $user['name'], null);
            });
            echo "Mot de passe modifié ; sessions invalidées.\n";
        }
    } else throw new ValidationError('Commande inconnue.');
} catch (\Throwable $error) {
    fwrite(STDERR, ($error instanceof ValidationError ? $error->getMessage() : 'Installation impossible : vérifiez la configuration et les extensions PHP.') . "\n"); exit(1);
}
