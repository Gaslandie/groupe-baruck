<?php
declare(strict_types=1);

namespace Baruck;

const LOGIN_CODE_LIFETIME = 600;
const LOGIN_CODE_ATTEMPTS = 5;

/** Le navigateur ne choisit jamais le destinataire ni le compte à confirmer. */
function pendingLoginChallenge(): ?array
{
    $pending = $_SESSION['login_challenge'] ?? null;
    if (!is_array($pending) || !is_string($pending['id'] ?? null) || !is_string($pending['user_id'] ?? null)
        || !is_string($pending['key'] ?? null) || strlen($pending['key']) !== 64) return null;
    $challenge = query('SELECT c.*,u.active,u.email AS current_email,u.session_version AS current_version FROM login_challenges c JOIN users u ON u.id=c.user_id WHERE c.id=? AND c.user_id=?', [$pending['id'], $pending['user_id']])->fetch();
    if (!$challenge || !$challenge['active'] || $challenge['expires'] <= time() || $challenge['attempts'] >= LOGIN_CODE_ATTEMPTS
        || $challenge['email'] !== $challenge['current_email'] || (int) $challenge['session_version'] !== (int) $challenge['current_version']) {
        unset($_SESSION['login_challenge']);
        return null;
    }
    return $challenge;
}

function cancelLoginChallenge(): void
{
    $pending = $_SESSION['login_challenge'] ?? null;
    if (is_array($pending) && is_string($pending['id'] ?? null) && is_string($pending['user_id'] ?? null)) {
        query('DELETE FROM login_challenges WHERE id=? AND user_id=?', [$pending['id'], $pending['user_id']]);
    }
    unset($_SESSION['login_challenge']);
}

/** Trois envois par compte et vingt par IP en quinze minutes ; une minute entre deux envois. */
function limitLoginMail(string $userId): void
{
    $directory = config()['storage'] . '/login-mail-limits';
    if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) throw new \RuntimeException('Compteur indisponible.');
    $limits = ['account-' . hash('sha256', $userId) => 3, 'ip-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown') => 20];
    $locks = $states = [];
    try {
        foreach ($limits as $key => $maximum) {
            $path = $directory . '/' . $key . '.json';
            if (is_link($path)) throw new \RuntimeException('Compteur invalide.');
            $lock = fopen($path, 'c+');
            if (!$lock) throw new \RuntimeException('Compteur indisponible.');
            $locks[$key] = $lock;
            if (!chmod($path, 0600) || !flock($lock, LOCK_EX)) throw new \RuntimeException('Compteur indisponible.');
            $raw = stream_get_contents($lock);
            $state = $raw === '' ? ['start' => time(), 'count' => 0, 'last' => 0] : json_decode($raw, true, 8, JSON_THROW_ON_ERROR);
            if (!is_array($state) || !isset($state['start'], $state['count'], $state['last'])) throw new \RuntimeException('Compteur invalide.');
            if (time() - $state['start'] >= 900) $state = ['start' => time(), 'count' => 0, 'last' => 0];
            if ($state['count'] >= $maximum) throw new ValidationError('Trop de codes demandés. Réessayez dans quinze minutes.');
            if (str_starts_with($key, 'account-') && time() - $state['last'] < 60) throw new ValidationError('Attendez une minute avant de demander un nouveau code.');
            $states[$key] = $state;
        }
        foreach ($states as $key => $state) {
            $state['count']++;
            $state['last'] = time();
            $encoded = json_encode($state, JSON_THROW_ON_ERROR);
            rewind($locks[$key]);
            if (!ftruncate($locks[$key], 0) || fwrite($locks[$key], $encoded) !== strlen($encoded) || !fflush($locks[$key])) throw new \RuntimeException('Compteur indisponible.');
        }
    } finally {
        foreach (array_reverse($locks) as $lock) { flock($lock, LOCK_UN); fclose($lock); }
    }
}

function sendLoginCode(string $email, string $code): void
{
    $settings = config();
    $mail = $settings['login_mail'] ?? [];
    $from = ($mail['from'] ?? '') ?: ($settings['contact_mail']['from'] ?? '');
    if (!is_string($from) || !preg_match('/^[a-zA-Z0-9._+-]+@groupebaruck\.com$/D', $from)
        || !filter_var($email, FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n\x00-\x20\x7f]/', $email)) {
        throw new ValidationError('Le code ne peut pas être envoyé pour le moment. Contactez la personne qui gère le site.');
    }
    $body = "Votre code de connexion au back-office Groupe Baruck : $code\n\nValable 10 minutes, pour une seule connexion. Ne le communiquez à personne.\n\nSi vous n’avez pas demandé ce code, changez votre mot de passe et contactez la personne qui gère le site.\n";
    // Recette locale explicite, jamais disponible en production ni dans une réponse HTTP.
    if (($mail['transport'] ?? 'mail') === 'file') {
        if ($settings['environment'] !== 'local') throw new \RuntimeException('Transport local interdit en production.');
        $directory = $settings['storage'] . '/login-outbox';
        if (!is_dir($directory) && !mkdir($directory, 0700, true) && !is_dir($directory)) throw new \RuntimeException('Envoi indisponible.');
        $path = $directory . '/' . hash('sha256', $email) . '.txt';
        if (is_link($path)) throw new \RuntimeException('Destination invalide.');
        $oldMask = umask(0077);
        try {
            if (file_put_contents($path, $body, LOCK_EX) === false || !chmod($path, 0600)) throw new \RuntimeException('Envoi indisponible.');
        } finally { umask($oldMask); }
        return;
    }
    if (($mail['transport'] ?? 'mail') !== 'mail') throw new \RuntimeException('Transport invalide.');
    $headers = ['From' => 'Groupe Baruck <' . $from . '>', 'MIME-Version' => '1.0', 'Content-Type' => 'text/plain; charset=UTF-8', 'Content-Transfer-Encoding' => 'quoted-printable'];
    if (!@mail($email, 'Groupe Baruck - Code de connexion', quoted_printable_encode(str_replace("\n", "\r\n", $body)), $headers, '-f' . $from)) {
        throw new ValidationError('Le code ne peut pas être envoyé pour le moment. Réessayez dans une minute.');
    }
}

function issueLoginChallenge(array $user): void
{
    limitLoginMail($user['id']);
    $id = id();
    $key = bin2hex(random_bytes(32));
    $code = str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    $expires = time() + LOGIN_CODE_LIFETIME;
    transaction(function () use ($user, $id, $key, $code, $expires) {
        $fresh = query('SELECT * FROM users WHERE id=? FOR UPDATE', [$user['id']])->fetch();
        if (!$fresh || !$fresh['active'] || $fresh['email'] !== $user['email'] || (int) $fresh['session_version'] !== (int) $user['session_version']) throw new ValidationError('Votre accès a changé. Recommencez la connexion.');
        query('DELETE FROM login_challenges WHERE expires < ?', [time() - 3600]);
        query('INSERT INTO login_challenges (user_id,id,email,session_version,code_hash,expires,attempts) VALUES (?,?,?,?,?,?,0) ON DUPLICATE KEY UPDATE id=VALUES(id),email=VALUES(email),session_version=VALUES(session_version),code_hash=VALUES(code_hash),expires=VALUES(expires),attempts=0', [$user['id'], $id, $fresh['email'], $fresh['session_version'], hash_hmac('sha256', $code, $key), $expires]);
    });
    try {
        // Le transport ne garde aucun verrou SQL ouvert.
        sendLoginCode($user['email'], $code);
    } catch (\Throwable $error) {
        query('DELETE FROM login_challenges WHERE id=?', [$id]);
        unset($_SESSION['login_challenge']);
        throw $error;
    }
    $recovery = $_SESSION['recovery'] ?? null;
    session_regenerate_id(true);
    $_SESSION = ['csrf' => bin2hex(random_bytes(32)), 'login_challenge' => ['id' => $id, 'user_id' => $user['id'], 'key' => $key]];
    if (is_array($recovery) && $recovery['user_id'] === $user['id'] && $recovery['expires'] > time()) $_SESSION['recovery'] = $recovery;
}

function resendLoginCode(): void
{
    $pending = pendingLoginChallenge();
    if (!$pending) throw new ValidationError('Le code a expiré. Recommencez avec votre mot de passe.');
    $user = query('SELECT * FROM users WHERE id=?', [$pending['user_id']])->fetch();
    if (!$user) throw new ValidationError('Recommencez la connexion.');
    issueLoginChallenge($user);
}

function verifyLoginCode(array $input): void
{
    $pending = $_SESSION['login_challenge'] ?? null;
    if (!pendingLoginChallenge()) throw new ValidationError('Ce code a expiré ou n’est plus valable. Recommencez avec votre mot de passe.');
    $code = $input['code'] ?? '';
    $user = withAttemptLimit($pending['user_id'], function () use ($pending, $code) {
        return transaction(function () use ($pending, $code) {
            $user = query('SELECT * FROM users WHERE id=? FOR UPDATE', [$pending['user_id']])->fetch();
            $challenge = query('SELECT * FROM login_challenges WHERE user_id=? AND id=? FOR UPDATE', [$pending['user_id'], $pending['id']])->fetch();
            if (!$user || !$user['active'] || !$challenge || $challenge['expires'] <= time() || $challenge['attempts'] >= LOGIN_CODE_ATTEMPTS
                || $user['email'] !== $challenge['email'] || (int) $user['session_version'] !== (int) $challenge['session_version']) return null;
            if (!is_string($code) || !preg_match('/^[0-9]{6}$/D', $code) || !hash_equals($challenge['code_hash'], hash_hmac('sha256', $code, $pending['key']))) {
                query('UPDATE login_challenges SET attempts=attempts+1 WHERE id=?', [$pending['id']]);
                return null;
            }
            query('DELETE FROM login_challenges WHERE id=?', [$pending['id']]);
            audit('Connexion confirmée par e-mail', $user['name'], $user['id']);
            return $user;
        });
    }, 'login-code');
    if (!$user) throw new ValidationError('Code incorrect ou expiré. Vérifiez le dernier e-mail reçu.');
    completeLogin($user);
}

function maskedLoginEmail(string $email): string
{
    [$name, $domain] = explode('@', $email, 2);
    return substr($name, 0, 2) . '***@' . $domain;
}

/** Outil CLI privé : conserve mot de passe et droits, révoque les anciennes sessions et codes. */
function changeLoginEmail(array $input): void
{
    $old = strtolower(text($input, 'email', 190));
    $new = strtolower(text($input, 'new_email', 190));
    if (!filter_var($new, FILTER_VALIDATE_EMAIL)) throw new ValidationError('Adresse e-mail invalide.');
    if ($old === $new) throw new ValidationError('Cette adresse est déjà utilisée par ce compte.');
    try {
        transaction(function () use ($old, $new) {
            $user = query('SELECT * FROM users WHERE email=? FOR UPDATE', [$old])->fetch();
            if (!$user || !$user['active'] || $user['role'] !== 'admin') throw new ValidationError('Compte administrateur actif introuvable.');
            query('UPDATE users SET email=?,session_version=session_version+1 WHERE id=?', [$new, $user['id']]);
            query('DELETE FROM login_challenges WHERE user_id=?', [$user['id']]);
            audit('Identifiant de connexion modifié', $user['name'], null);
        });
    } catch (\PDOException $error) {
        if ($error->getCode() === '23000') throw new ValidationError('Cette adresse possède déjà un compte.');
        throw $error;
    }
}
