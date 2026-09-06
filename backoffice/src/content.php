<?php
declare(strict_types=1);

namespace Baruck;

function imagePath(string $value): string
{
    if (!preg_match('~^/images/(?:[a-zA-Z0-9_-]+/)*[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$~D', $value)) {
        throw new ValidationError('Le chemin d’image doit désigner un fichier JPG, PNG ou WebP dans /images/.');
    }
    if (str_starts_with($value, '/images/actualites/uploads/')) {
        if (!query('SELECT id FROM media WHERE filename = ?', [basename($value)])->fetch()) throw new ValidationError('Cette image n’existe plus dans la médiathèque.');
    } else {
        $manifest = json_decode(file_get_contents(dirname(__DIR__) . '/seed.json'), true, 512, JSON_THROW_ON_ERROR);
        if (!in_array($value, $manifest['existingImages'], true)) throw new ValidationError('Choisissez une image du site ou de la médiathèque.');
    }
    return $value;
}

function validateArticle(array $input, bool $ready): array
{
    $slug = text($input, 'slug', 180);
    if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $slug) || $slug === 'a-venir') throw new ValidationError('L’adresse doit contenir des minuscules, chiffres et tirets, sans espace.');
    $category = text($input, 'category', 32);
    if (!array_key_exists($category, categories())) throw new ValidationError('Catégorie invalide.');
    $date = text($input, 'date', 10, $ready);
    $parsed = \DateTimeImmutable::createFromFormat('!Y-m-d', $date);
    if ($date !== '' && (!$parsed || $parsed->format('Y-m-d') !== $date)) throw new ValidationError('Date invalide.');
    $body = text($input, 'body', 200000, $ready);
    validateMarkdown($body);
    $cover = text($input, 'cover', 255, false);
    $coverAlt = text($input, 'cover_alt', 500, false);
    if ($cover !== '') {
        imagePath($cover);
        if ($coverAlt === '') throw new ValidationError('Décrivez l’image de couverture.');
    }
    $gallery = $input['gallery'] ?? [];
    if (!is_array($gallery) || count($gallery) > 30) throw new ValidationError('La galerie accepte au maximum 30 images.');
    $images = [];
    foreach ($gallery as $item) {
        if (!is_array($item)) throw new ValidationError('Image de galerie invalide.');
        $src = text($item, 'src', 255, false);
        if ($src === '') continue;
        $images[] = ['src' => imagePath($src), 'alt' => text($item, 'alt', 500), 'caption' => text($item, 'caption', 500, false)];
    }
    return [
        'slug' => $slug, 'title' => text($input, 'title', 240), 'category' => $category,
        'date' => $date, 'excerpt' => text($input, 'excerpt', 2000, $ready), 'body' => $body,
        'cover' => $cover, 'cover_alt' => $coverAlt, 'gallery' => $images,
    ];
}

function saveArticle(array $input, array $user): string
{
    $status = text($input, 'status', 16);
    if (!in_array($status, ['draft', 'ready'], true)) throw new ValidationError('Statut invalide.');
    if ($status === 'ready') requireAdmin($user);
    $article = validateArticle($input, $status === 'ready');
    $id = text($input, 'id', 32, false);
    $version = filter_var($input['version'] ?? 0, FILTER_VALIDATE_INT);
    try {
        return transaction(function () use ($id, $version, $article, $status, $user) {
            $old = $id ? query('SELECT * FROM articles WHERE id = ? FOR UPDATE', [$id])->fetch() : false;
            if ($id && (!$old || $version !== (int) $old['version'])) throw new ConflictError('Cet article a été modifié ailleurs. Rechargez la page avant d’enregistrer. Votre saisie est conservée ci-dessous.');
            if ($old && $old['slug'] !== $article['slug']) throw new ValidationError('L’adresse d’un article existant ne peut pas changer.');
            $values = [$article['title'], $article['category'], $article['date'], $article['excerpt'], $article['body'], $article['cover'], $article['cover_alt'], json_encode($article['gallery'], JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR), $status, now(), $user['id']];
            if ($old) {
                query('UPDATE articles SET title=?,category=?,article_date=?,excerpt=?,body=?,cover=?,cover_alt=?,gallery=?,status=?,updated_at=?,updated_by=?,version=version+1 WHERE id=?', [...$values, $id]);
            } else {
                $id = id();
                query('INSERT INTO articles (title,category,article_date,excerpt,body,cover,cover_alt,gallery,status,updated_at,updated_by,id,slug) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)', [...$values, $id, $article['slug']]);
            }
            $nextVersion = $old ? (int) $old['version'] + 1 : 1;
            recordRevision($id, $nextVersion, $article, $status === 'ready' ? 'Version validée' : 'Brouillon enregistré', $user['id']);
            if ($status === 'ready') validatePublication($id, $nextVersion, $article);
            audit($status === 'ready' ? 'Article validé' : 'Brouillon enregistré', $article['title'], $user['id']);
            return $id;
        });
    } catch (\PDOException $error) {
        if ($error->getCode() === '23000') throw new ValidationError('Cette adresse d’article est déjà utilisée.');
        throw $error;
    }
}

function uploadMedia(array $file, string $alt, array $user): void
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK || !is_string($file['tmp_name'] ?? null) || !is_uploaded_file($file['tmp_name'])) throw new ValidationError('L’image n’a pas pu être reçue. Vérifiez sa taille et réessayez.');
    $size = filesize($file['tmp_name']);
    if (!$size || $size > 8 * 1024 * 1024) throw new ValidationError('Chaque image doit peser moins de 8 Mo.');
    $mime = (new \finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    $extensions = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $dimensions = @getimagesize($file['tmp_name']);
    if (!isset($extensions[$mime]) || !$dimensions || ($dimensions['mime'] ?? '') !== $mime || $dimensions[0] * $dimensions[1] > 40000000) throw new ValidationError('Choisissez une image JPG, PNG ou WebP valide, de moins de 40 mégapixels.');
    $alt = text(['alt' => $alt], 'alt', 500);
    $id = id(); $filename = $id . '.' . $extensions[$mime];
    $dir = config()['storage'] . '/media';
    if (!is_dir($dir)) mkdir($dir, 0700, true);
    if (!move_uploaded_file($file['tmp_name'], $dir . '/' . $filename)) throw new \RuntimeException('Écriture du média impossible.');
    chmod($dir . '/' . $filename, 0600);
    try {
        transaction(function () use ($id, $filename, $file, $mime, $dimensions, $size, $alt, $user) {
            $name = substr(basename(is_string($file['name'] ?? null) ? $file['name'] : 'image'), 0, 200);
            query('INSERT INTO media (id,filename,original_name,mime,width,height,bytes,alt,created_at) VALUES (?,?,?,?,?,?,?,?,?)', [$id, $filename, $name, $mime, $dimensions[0], $dimensions[1], $size, $alt, now()]);
            audit('Image ajoutée', $alt, $user['id']);
        });
    } catch (\Throwable $error) { unlink($dir . '/' . $filename); throw $error; }
}

function exportContent(array $user): array
{
    requireAdmin($user);
    $articles = query('SELECT payload FROM article_publications')->fetchAll();
    $data = array_map(fn($row) => json_decode($row['payload'], true, 512, JSON_THROW_ON_ERROR), $articles);
    usort($data, fn($first, $second) => strcmp($second['date'], $first['date']) ?: strcmp($first['slug'], $second['slug']));
    $encoded = json_encode($data, JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
    $media = [];
    $total = 0;
    foreach (query('SELECT * FROM media')->fetchAll() as $row) {
        $path = '/images/actualites/uploads/' . $row['filename'];
        if (!str_contains($encoded, $path)) continue;
        $file = config()['storage'] . '/media/' . $row['filename'];
        $total += filesize($file);
        if ($total > 32 * 1024 * 1024) throw new ValidationError('Les images à exporter dépassent 32 Mo. Réduisez leur taille avant de préparer la publication.');
        $media[] = ['path' => $path, 'sha256' => hash_file('sha256', $file), 'data' => base64_encode(file_get_contents($file))];
    }
    audit('Publication préparée', count($data) . ' article(s) validé(s)', $user['id']);
    return ['format' => 'baruck-editorial-v1', 'createdAt' => now(), 'articles' => $data, 'media' => $media];
}
