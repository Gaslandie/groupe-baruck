<?php
declare(strict_types=1);

// Installé uniquement sur Bluehost, jamais dans l'export GitHub Pages.
// Les deux racines Baruck sont voisines, vérifiées dans cPanel.
$endpoint = dirname(__DIR__) . '/baruck-admin/public/contact.php';
if (!is_file($endpoint)) {
    header('Content-Type: application/json; charset=UTF-8');
    header('Cache-Control: no-store');
    http_response_code(503);
    echo '{"success":false}';
    exit;
}
require $endpoint;
