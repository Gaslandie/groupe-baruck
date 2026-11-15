<?php
declare(strict_types=1);

// Mesure d’audience du site public : une requête par page vue, sans cookie,
// sans adresse IP conservée. Le site n’envoie rien tant que NEXT_PUBLIC_AUDIENCE_URL est vide.
namespace Baruck;

require dirname(__DIR__) . '/src/bootstrap.php';

try {
    $site = rtrim(config()['site_url'], '/');
    $allowed = array_unique([$site, preg_replace('~^(https?://)(?!www\.)~', '$1www.', $site)]);
    $origin = is_string($_SERVER['HTTP_ORIGIN'] ?? null) ? $_SERVER['HTTP_ORIGIN'] : '';
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex, nofollow');
    header('Vary: Origin');
    if (!in_array($origin, $allowed, true)) { http_response_code(403); exit; }
    header('Access-Control-Allow-Origin: ' . $origin);
    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        header('Access-Control-Allow-Methods: POST');
        header('Access-Control-Allow-Headers: Content-Type');
        header('Access-Control-Max-Age: 86400');
        http_response_code(204); exit;
    }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST, OPTIONS'); http_response_code(405); exit; }
    $raw = (string) file_get_contents('php://input', false, null, 0, 2049);
    if (strlen($raw) > 2048) { http_response_code(413); exit; }
    $input = json_decode($raw, true, 8);
    if (is_array($input) && !array_is_list($input)) {
        if (array_key_exists('e', $input)) recordContactEvent($input, $_SERVER);
        else recordView($input, $_SERVER, gmdate('Y-m-d'));
    }
    http_response_code(204);
} catch (\Throwable $exception) {
    error_log('Baruck collect: ' . get_class($exception));
    http_response_code(204);
}
