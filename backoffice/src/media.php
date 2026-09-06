<?php
declare(strict_types=1);
namespace Baruck;

function mediaCatalog(): array
{
    $items = [];
    foreach (query('SELECT id,filename,alt,width,height FROM media ORDER BY created_at DESC,id')->fetchAll() as $row) {
        $items[] = ['id' => $row['id'], 'path' => '/images/actualites/uploads/' . $row['filename'], 'alt' => $row['alt'], 'label' => $row['alt'], 'width' => (int) $row['width'], 'height' => (int) $row['height'], 'preview' => url('image', ['id' => $row['id']])];
    }
    $seed = json_decode(file_get_contents(dirname(__DIR__) . '/seed.json'), true, 512, JSON_THROW_ON_ERROR);
    $descriptions = [];
    foreach ($seed['articles'] as $article) {
        if (!empty($article['cover'])) $descriptions[$article['cover']] = $article['coverAlt'] ?? '';
        foreach ($article['gallery'] ?? [] as $image) $descriptions[$image['src']] = $image['alt'];
    }
    foreach ($seed['existingImages'] as $path) {
        $file = dirname(__DIR__) . '/seed-media/' . substr($path, strlen('/images/'));
        if (!is_file($file)) continue;
        $dimensions = @getimagesize($file);
        if (!$dimensions) continue;
        $id = 'seed-' . hash('sha256', $path);
        $alt = $descriptions[$path] ?? '';
        $items[] = ['id' => $id, 'path' => $path, 'alt' => $alt, 'label' => $alt ?: str_replace(['-', '_'], ' ', pathinfo($path, PATHINFO_FILENAME)), 'width' => $dimensions[0], 'height' => $dimensions[1], 'preview' => url('image', ['id' => $id])];
    }
    return $items;
}

function mediaApi(?array $user): never
{
    header('Content-Type: application/json; charset=utf-8');
    if (!$user) { http_response_code(401); echo json(['error' => 'Reconnectez-vous dans un autre onglet, puis réessayez. Votre article reste dans cet onglet.']); exit; }
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') echo json(['items' => mediaCatalog()]);
        elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
            requireCsrf();
            $image = uploadMedia($_FILES['image'] ?? [], text($_POST, 'alt', 500), $user);
            http_response_code(201); echo json(['item' => $image]);
        } else { header('Allow: GET, POST'); http_response_code(405); echo json(['error' => 'Méthode non autorisée.']); }
    } catch (ValidationError $error) { http_response_code(422); echo json(['error' => $error->getMessage()]); }
    exit;
}

function serveMedia(): never
{
    $id = is_string($_GET['id'] ?? null) ? $_GET['id'] : '';
    if (str_starts_with($id, 'seed-')) {
        $image = null;
        foreach (mediaCatalog() as $item) if ($item['id'] === $id) { $image = $item; break; }
        if (!$image) { http_response_code(404); exit; }
        $filename = basename($image['path']);
        $file = dirname(__DIR__) . '/seed-media/' . substr($image['path'], strlen('/images/'));
        $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file);
    } else {
        $image = query('SELECT filename,mime FROM media WHERE id=?', [$id])->fetch();
        if (!$image) { http_response_code(404); exit; }
        $filename = $image['filename']; $mime = $image['mime'];
        $file = config()['storage'] . '/media/' . $filename;
    }
    header('Content-Type: ' . $mime);
    header('Content-Length: ' . filesize($file));
    if (($_GET['download'] ?? '') === '1') header('Content-Disposition: attachment; filename="' . basename($filename) . '"');
    readfile($file); exit;
}
