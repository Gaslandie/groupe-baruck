<?php
declare(strict_types=1);

namespace Baruck;

final class ValidationError extends \RuntimeException {}
final class ConflictError extends \RuntimeException {}

function config(): array
{
    static $config;
    if ($config !== null) return $config;
    $file = getenv('BARUCK_CONFIG') ?: dirname(__DIR__) . '/config.local.php';
    if (!is_file($file)) throw new \RuntimeException('Configuration absente.');
    $config = require $file;
    if (!is_array($config) || !in_array($config['environment'] ?? '', ['local', 'production'], true)) {
        throw new \RuntimeException('Configuration invalide.');
    }
    $origin = $config['origin'] ?? '';
    $local = $config['environment'] === 'local';
    if (($local && !preg_match('~^http://127\.0\.0\.1:[0-9]{1,5}$~D', $origin)) || (!$local && !preg_match('~^https://[a-z0-9.-]+(?::[0-9]+)?$~D', $origin))) {
        throw new \RuntimeException('Origine invalide.');
    }
    if (!is_dir($config['storage'])) mkdir($config['storage'], 0700, true);
    $storage = realpath($config['storage']);
    $public = realpath(dirname(__DIR__) . '/public');
    if (!$storage || !$public || $storage === $public || str_starts_with($storage, $public . DIRECTORY_SEPARATOR)) {
        throw new \RuntimeException('Le stockage doit rester hors de la racine publique.');
    }
    return $config;
}

function db(): \PDO
{
    static $pdo;
    if ($pdo) return $pdo;
    $database = config()['database'];
    $pdo = new \PDO($database['dsn'], $database['user'], $database['password'], [
        \PDO::ATTR_ERRMODE => \PDO::ERRMODE_EXCEPTION,
        \PDO::ATTR_DEFAULT_FETCH_MODE => \PDO::FETCH_ASSOC,
        \PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    return $pdo;
}

function query(string $sql, array $args = []): \PDOStatement
{
    $statement = db()->prepare($sql);
    $statement->execute($args);
    return $statement;
}

function id(): string { return bin2hex(random_bytes(16)); }
function now(): string { return gmdate('Y-m-d\TH:i:s\Z'); }
function e(mixed $value): string { return htmlspecialchars((string) $value, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function url(string $page, array $params = []): string { return '/?' . http_build_query(['page' => $page] + $params); }
function redirect(string $page, array $params = []): never { header('Location: ' . url($page, $params), true, 303); exit; }

function audit(string $action, string $subject, ?string $userId): void
{
    query('INSERT INTO audit_log (id,user_id,action,subject,created_at) VALUES (?,?,?,?,?)', [id(), $userId, $action, $subject, now()]);
}

function transaction(callable $operation): mixed
{
    db()->beginTransaction();
    try { $result = $operation(); db()->commit(); return $result; }
    catch (\Throwable $error) { if (db()->inTransaction()) db()->rollBack(); throw $error; }
}

function text(array $input, string $field, int $max, bool $required = true): string
{
    if (!isset($input[$field]) && !$required) return '';
    $value = $input[$field] ?? null;
    if (!is_string($value) || preg_match('//u', $value) !== 1 || str_contains($value, "\0")) throw new ValidationError('Champ invalide : ' . $field . '.');
    $value = trim($value);
    if (($required && $value === '') || strlen($value) > $max) throw new ValidationError('Vérifiez le champ « ' . $field . ' » et sa longueur.');
    return $value;
}

function categories(): array
{
    return ['groupe' => 'Groupe Baruck', 'jeca' => 'JECA', 'espoir-de-vie' => 'Espoir de Vie', 'studio-photo' => 'Studio photo', 'hotesses' => 'Hôtesses événementielles'];
}

require __DIR__ . '/auth.php';
require __DIR__ . '/markdown.php';
require __DIR__ . '/content.php';
require __DIR__ . '/editorial.php';
