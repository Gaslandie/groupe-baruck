<?php
declare(strict_types=1);

namespace Baruck;

require dirname(__DIR__) . '/src/bootstrap.php';
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, private');
header('X-Content-Type-Options: nosniff');
header('X-Robots-Tag: noindex, nofollow');
$buffers = ob_get_level();
ob_start();
try {
    $settings = config();
    if (($_SERVER['HTTP_HOST'] ?? '') !== parse_url($settings['origin'], PHP_URL_HOST) . (($port = parse_url($settings['origin'], PHP_URL_PORT)) ? ':' . $port : '')
        || ($settings['environment'] === 'production' && !overHttps($settings, $_SERVER))) { http_response_code(400); echo '{"error":"Adresse incorrecte."}'; exit; }
    $key = publicationKey();
    $authorization = $_SERVER['HTTP_AUTHORIZATION'] ?? $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '';
    if ($key === '' || !hash_equals('Bearer ' . $key, $authorization)) { http_response_code(401); echo '{"error":"Accès refusé."}'; exit; }
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST'); http_response_code(405); echo '{"error":"Méthode refusée."}'; exit; }
    if (strtolower(explode(';', $_SERVER['CONTENT_TYPE'] ?? '')[0]) !== 'application/json') throw new ValidationError('Format incorrect.');
    $body = file_get_contents('php://input', false, null, 0, 1025);
    if ($body === false || strlen($body) > 1024) throw new ValidationError('Requête trop volumineuse.');
    $input = json_decode($body, true, 8, JSON_THROW_ON_ERROR);
    if (!is_array($input)) throw new ValidationError('Requête incorrecte.');
    $result = publicationWorker($input);
    if (isset($result['obsolete'])) @unlink(publicationFile($result['obsolete']));
    unset($result['obsolete']);
    if (isset($result['snapshot'])) {
        header('X-Baruck-Publication: ' . $result['id']);
        header('X-Baruck-Sha256: ' . $result['sha256']);
        header('X-Baruck-Claimed: ' . ($result['claimed'] ? 'yes' : 'no'));
        echo $result['snapshot'];
    } else {
        http_response_code($result['code'] ?? 200);
        echo json($result);
    }
    ob_end_flush();
} catch (ValidationError | \JsonException $error) {
    while (ob_get_level() > $buffers) ob_end_clean();
    http_response_code(422); echo '{"error":"Requête de publication invalide."}';
} catch (\Throwable $error) {
    while (ob_get_level() > $buffers) ob_end_clean();
    error_log('Baruck publication: ' . get_class($error));
    http_response_code(503); echo '{"error":"Publication temporairement indisponible."}';
}
