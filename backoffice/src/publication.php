<?php
declare(strict_types=1);

namespace Baruck;

/** Les clés privées restent hors du dossier public. */
function publicationKey(): string
{
    $key = config()['publication_key'] ?? '';
    $file = dirname(__DIR__) . '/publication.local.php';
    if ($key === '' && is_file($file)) $key = (@include $file)['key'] ?? '';
    return is_string($key) && preg_match('/^[a-f0-9]{64}$/D', $key) ? $key : '';
}

function publicationToken(): string
{
    $token = config()['publication_github_token'] ?? '';
    $file = dirname(__DIR__) . '/publication.local.php';
    if ($token === '' && is_file($file)) $token = (@include $file)['github_token'] ?? '';
    return is_string($token) && preg_match('/^[A-Za-z0-9_]{20,512}$/D', $token) ? $token : '';
}

function publicationConfigured(): bool { return publicationKey() !== '' && publicationToken() !== ''; }

function dispatchPublication(): bool
{
    $url = 'https://api.github.com/repos/Gaslandie/groupe-baruck/actions/workflows/bluehost.yml/dispatches';
    // Une fausse API sur la boucle locale permet la recette sans envoyer vers GitHub.
    if (config()['environment'] === 'local' && isset(config()['publication_dispatch_url'])) {
        $testUrl = config()['publication_dispatch_url'];
        if (!is_string($testUrl) || !preg_match('~^http://127\.0\.0\.1:[0-9]{1,5}/dispatch$~D', $testUrl)) throw new \RuntimeException('Adresse de recette invalide.');
        $url = $testUrl;
    }
    $context = stream_context_create(['http' => ['method' => 'POST', 'timeout' => 15, 'follow_location' => 0, 'ignore_errors' => true,
        'header' => "Content-Type: application/json\r\nAccept: application/vnd.github+json\r\nUser-Agent: Baruck-Publication\r\nAuthorization: Bearer " . publicationToken() . "\r\nX-GitHub-Api-Version: 2026-03-10\r\n",
        'content' => json(['ref' => 'main', 'inputs' => ['publication' => true]])], 'ssl' => ['verify_peer' => true, 'verify_peer_name' => true]]);
    @file_get_contents($url, false, $context, 0, 1024);
    return preg_match('~^HTTP/\S+ (?:200|204)\b~', $http_response_header[0] ?? '') === 1;
}

function publicationState(): array
{
    $value = query("SELECT payload FROM settings WHERE name='publication'")->fetchColumn();
    return $value ? json_decode($value, true, 32, JSON_THROW_ON_ERROR) : ['job' => null, 'published' => null];
}

/** Un seul envoi peut travailler sur cette installation. */
function changePublication(callable $operation): mixed
{
    return transaction(function () use ($operation) {
        query("INSERT IGNORE INTO settings (name,payload,updated_at) VALUES ('publication',?,?)", [json(['job' => null, 'published' => null]), now()]);
        $state = json_decode(query("SELECT payload FROM settings WHERE name='publication' FOR UPDATE")->fetchColumn(), true, 32, JSON_THROW_ON_ERROR);
        if (in_array($state['job']['status'] ?? '', ['queued', 'running'], true)
            && strtotime($state['job']['started_at'] ?? $state['job']['requested_at']) < time() - 3600) {
            $state['job']['status'] = 'failed';
            $state['job']['message'] = 'La mise en ligne a été interrompue. Vous pouvez la relancer.';
        }
        $result = $operation($state);
        query("UPDATE settings SET payload=?,version=version+1,updated_at=? WHERE name='publication'", [json($state), now()]);
        return $result;
    });
}

function publicationFile(string $id): string
{
    if (!preg_match('/^[a-f0-9]{32}$/D', $id)) throw new ValidationError('Publication invalide.');
    return config()['storage'] . '/publications/' . $id . '.json';
}

/** Recontrôle en base : le rôle reçu du navigateur ou d'une ancienne session ne suffit pas. */
function publicationAuthor(array $job): ?array
{
    $user = query('SELECT id,role,active,session_version FROM users WHERE id=?', [$job['user_id']])->fetch();
    return $user && $user['active'] && $user['role'] === 'admin'
        && (int) $user['session_version'] === (int) $job['session_version'] ? $user : null;
}

function requestPublication(array $user): void
{
    requireAdmin($user);
    if (!publicationConfigured()) throw new ValidationError('La mise en ligne automatique n’est pas encore activée sur cette installation.');
    $file = null;
    try {
        $old = changePublication(function (array &$state) use ($user, &$file) {
            if (!publicationAuthor(['user_id' => $user['id'], 'session_version' => $user['session_version']])) throw new ValidationError('Vos droits ont changé. Reconnectez-vous.');
            if (in_array($state['job']['status'] ?? '', ['queued', 'running'], true)) throw new ConflictError('Une publication est déjà en attente ou en cours.');
            if (strtotime($state['job']['requested_at'] ?? '1970-01-01') > time() - 60) throw new ValidationError('Attendez une minute avant de relancer la publication.');
            $snapshot = json(exportContent($user, false));
            if (strlen($snapshot) > 48 * 1024 * 1024) throw new ValidationError('Les contenus dépassent la taille maximale de publication.');
            $id = id();
            $file = publicationFile($id);
            if (!is_dir(dirname($file)) && !@mkdir(dirname($file), 0700, true)) throw new \RuntimeException('Stockage de publication indisponible.');
            if (@file_put_contents($file, $snapshot, LOCK_EX) !== strlen($snapshot) || !@chmod($file, 0600)) throw new \RuntimeException('Écriture de la publication impossible.');
            $old = $state['job']['id'] ?? null;
            $state['job'] = ['id' => $id, 'sha256' => hash('sha256', $snapshot), 'status' => 'queued', 'requested_at' => now(),
                'user_id' => $user['id'], 'session_version' => (int) $user['session_version'], 'run' => '', 'message' => ''];
            audit('Mise en ligne demandée', 'Contenus validés du site', $user['id']);
            return $old !== ($state['published']['id'] ?? null) ? $old : null;
        });
        if ($old) @unlink(publicationFile($old));
    } catch (\Throwable $error) {
        if ($file && is_file($file)) @unlink($file);
        throw $error;
    }
    if (!dispatchPublication()) {
        $failed = changePublication(function (array &$state) use ($file, $user) {
            if (publicationFile($state['job']['id']) !== $file || $state['job']['status'] !== 'queued') return false;
            $state['job']['status'] = 'failed';
            $state['job']['message'] = 'Le service de mise en ligne n’a pas accepté la demande. Réessayez ou contactez la personne qui gère le site.';
            audit('Déclenchement échoué', 'La connexion au service de mise en ligne est à vérifier', $user['id']);
            return true;
        });
        if ($failed) throw new ValidationError('La mise en ligne n’a pas démarré. La connexion au service doit être vérifiée.');
    }
}

function publicationSnapshot(array $job): string
{
    $snapshot = @file_get_contents(publicationFile($job['id']));
    if ($snapshot === false || !hash_equals($job['sha256'], hash('sha256', $snapshot))) throw new \RuntimeException('Publication endommagée.');
    return $snapshot;
}

/** Appel réservé au robot de déploiement, avec une clé privée et HTTPS en production. */
function publicationWorker(array $input): array
{
    $action = text($input, 'action', 16);
    if (!in_array($action, ['status', 'claim', 'authorize', 'complete', 'fail'], true)) throw new ValidationError('Action inconnue.');
    return changePublication(function (array &$state) use ($input, $action) {
        $job = $state['job'];
        $pending = in_array($job['status'] ?? '', ['queued', 'running'], true);
        if ($pending && !publicationAuthor($job)) {
            $state['job']['status'] = 'failed';
            $state['job']['message'] = 'Les droits du compte qui a demandé la publication ont changé. Un administrateur doit la relancer.';
            $pending = false;
        }
        if ($action === 'status') return ['pending' => $pending];
        $run = text($input, 'run', 40);
        if (!preg_match('/^[0-9]+$/D', $run)) throw new ValidationError('Envoi invalide.');
        if ($action === 'claim') {
            if ($pending) {
                if ($job['status'] === 'running' && $job['run'] !== $run) return ['error' => 'Une autre mise en ligne est en cours.', 'code' => 409];
                $state['job']['status'] = 'running';
                $state['job']['run'] = $run;
                $state['job']['started_at'] ??= now();
                return ['snapshot' => publicationSnapshot($job), 'id' => $job['id'], 'sha256' => $job['sha256'], 'claimed' => true];
            }
            // Un déploiement du code doit garder les derniers contenus publiés.
            if ($state['published']) return ['snapshot' => publicationSnapshot($state['published']), ...$state['published'], 'claimed' => false];
            if (($input['bootstrap'] ?? false) !== true || $state['job'] !== null) return ['error' => 'Aucune publication autorisée.', 'code' => 409];
            // Premier raccordement : importer les contenus validés de MySQL, jamais les brouillons.
            $admin = query("SELECT id,role,session_version FROM users WHERE active=1 AND role='admin' ORDER BY created_at LIMIT 1")->fetch();
            if (!$admin) return ['error' => 'Aucun administrateur actif.', 'code' => 409];
            $snapshot = json(exportContent($admin, false));
            if (strlen($snapshot) > 48 * 1024 * 1024) throw new ValidationError('Publication trop volumineuse.');
            $id = id();
            $file = publicationFile($id);
            if (!is_dir(dirname($file)) && !@mkdir(dirname($file), 0700, true)) throw new \RuntimeException('Stockage de publication indisponible.');
            if (@file_put_contents($file, $snapshot, LOCK_EX) !== strlen($snapshot) || !@chmod($file, 0600)) throw new \RuntimeException('Écriture de la publication impossible.');
            $state['job'] = ['id' => $id, 'sha256' => hash('sha256', $snapshot), 'status' => 'running', 'requested_at' => now(), 'started_at' => now(),
                'user_id' => $admin['id'], 'session_version' => (int) $admin['session_version'], 'run' => $run, 'message' => ''];
            return ['snapshot' => $snapshot, 'id' => $id, 'sha256' => $state['job']['sha256'], 'claimed' => true];
        }
        if (!$pending || $job['status'] !== 'running' || $job['run'] !== $run
            || ($input['id'] ?? '') !== $job['id'] || ($input['sha256'] ?? '') !== $job['sha256']) return ['error' => 'Cet envoi n’est plus autorisé.', 'code' => 409];
        if ($action === 'authorize') return ['authorized' => true];
        $state['job']['status'] = $action === 'complete' ? 'published' : 'failed';
        $state['job']['message'] = $action === 'complete' ? '' : 'La mise en ligne a échoué. Relancez-la ou contactez la personne qui gère le site.';
        if ($action === 'complete') {
            $obsolete = $state['previous']['id'] ?? null;
            $state['previous'] = $state['published'];
            $state['published'] = ['id' => $job['id'], 'sha256' => $job['sha256'], 'published_at' => now()];
            audit('Site mis en ligne', 'Contenus validés du site', $job['user_id']);
            return ['ok' => true, 'obsolete' => $obsolete];
        }
        audit('Mise en ligne échouée', 'Consultez la demande de publication', $job['user_id']);
        return ['ok' => true];
    });
}
