<?php
declare(strict_types=1);

namespace Baruck;

ini_set('display_errors', '0');
require dirname(__DIR__) . '/src/bootstrap.php';
require dirname(__DIR__) . '/src/contact.php';

header('Content-Type: application/json; charset=UTF-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
header('Vary: Origin');

try {
    $configuration = config();
    $local = $configuration['environment'] === 'local';
    if (!$local && (($_SERVER['HTTPS'] ?? '') !== 'on') && !(($configuration['trusted_proxy'] ?? false) && ($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')) {
        throw new ContactError('HTTPS requis.', 403);
    }
    // Une navigation permet au navigateur d'effectuer la vérification JavaScript
    // de l'hébergeur. Cette page fixe ne lit ni n'envoie aucune donnée du formulaire.
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'GET' && ($_GET['prepare'] ?? '') === '1') {
        header('Content-Type: text/html; charset=UTF-8');
        header("Content-Security-Policy: default-src 'none'; frame-ancestors 'self'");
        echo '<!doctype html><html lang="fr"><meta charset="utf-8"><title>Formulaire Baruck</title></html>';
        exit;
    }
    $site = rtrim($configuration['site_url'], '/');
    $allowed = $local ? [$site] : [$site, preg_replace('~^https://(?!www\.)~', 'https://www.', $site)];
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
    if (!in_array($origin, $allowed, true) || $origin === '') throw new ContactError('Origine refusée.', 403);
    header('Access-Control-Allow-Origin: ' . $origin);
    $method = $_SERVER['REQUEST_METHOD'] ?? '';
    if ($method === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 600');
        http_response_code(204); exit;
    }
    if ($method !== 'POST') { header('Allow: POST, OPTIONS'); throw new ContactError('Méthode refusée.', 405); }
    if (strtolower(trim(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0])) !== 'application/json') throw new ContactError('Format refusé.', 415);
    if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 24000) throw new ContactError('Message trop volumineux.', 413);
    $raw = file_get_contents('php://input', false, null, 0, 24001);
    if ($raw === false || strlen($raw) > 24000) throw new ContactError('Message trop volumineux.', 413);
    try { $input = json_decode($raw, true, 8, JSON_THROW_ON_ERROR); }
    catch (\JsonException) { throw new ContactError('Message invalide.', 422); }
    if (!is_array($input) || array_is_list($input)) throw new ContactError('Message invalide.', 422);
    sendContact($input, $_SERVER);
    echo '{"success":true}';
} catch (ContactError $error) {
    http_response_code($error->getCode());
    if ($error->getCode() === 429) header('Retry-After: 3600');
    echo '{"success":false}';
} catch (\Throwable $error) {
    error_log('Baruck contact: ' . get_class($error));
    http_response_code(503);
    echo '{"success":false}';
}
