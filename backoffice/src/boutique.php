<?php
declare(strict_types=1);

namespace Baruck;

/** Identifiant lisible déduit du nom : l’équipe ne saisit jamais d’adresse. */
function slugify(string $name): string
{
    static $accents = ['à' => 'a', 'á' => 'a', 'â' => 'a', 'ã' => 'a', 'ä' => 'a', 'å' => 'a', 'ç' => 'c', 'è' => 'e', 'é' => 'e', 'ê' => 'e', 'ë' => 'e', 'ì' => 'i', 'í' => 'i', 'î' => 'i', 'ï' => 'i', 'ñ' => 'n', 'ò' => 'o', 'ó' => 'o', 'ô' => 'o', 'õ' => 'o', 'ö' => 'o', 'ù' => 'u', 'ú' => 'u', 'û' => 'u', 'ü' => 'u', 'ý' => 'y', 'ÿ' => 'y', 'œ' => 'oe', 'æ' => 'ae', 'ß' => 'ss'];
    $base = trim((string) preg_replace('/[^a-z0-9]+/', '-', strtr(mb_strtolower($name, 'UTF-8'), $accents)), '-');
    if (strlen($base) > 100) $base = trim(substr($base, 0, 100), '-');
    return $base === '' ? 'article' : $base;
}

function uniqueProductSlug(string $name): string
{
    $base = slugify($name);
    $slug = $base;
    for ($suffix = 2; query('SELECT id FROM products WHERE slug=?', [$slug])->fetch(); $suffix++) {
        if ($suffix > 200) throw new ValidationError('Trop d’articles portent ce nom. Choisissez un nom plus précis.');
        $slug = $base . '-' . $suffix;
    }
    return $slug;
}

function validateProduct(array $input): array
{
    $name = text($input, 'name', 160);
    $category = text($input, 'category', 32);
    if (!array_key_exists($category, brandCategories())) throw new ValidationError('Choisissez une catégorie de la boutique.');
    $images = $input['images'] ?? [];
    if (!is_array($images) || count($images) > 6) throw new ValidationError('Un article accepte au maximum 6 photos.');
    $photos = [];
    foreach ($images as $item) {
        if (!is_array($item)) throw new ValidationError('Photo invalide.');
        $src = text($item, 'src', 255, false);
        if ($src === '') continue;
        $photos[] = ['src' => imagePath($src), 'alt' => text($item, 'alt', 500)];
    }
    if (!$photos) throw new ValidationError('Ajoutez au moins une photo : c’est elle que les clients verront en premier.');
    return ['name' => $name, 'category' => $category, 'images' => $photos];
}

function saveProduct(array $input, array $user): string
{
    requireAdmin($user);
    $status = text($input, 'status', 16);
    if (!in_array($status, ['draft', 'ready'], true)) throw new ValidationError('Statut invalide.');
    $product = validateProduct($input);
    $id = text($input, 'id', 32, false);
    $version = filter_var($input['version'] ?? 0, FILTER_VALIDATE_INT);
    try {
        return transaction(function () use ($id, $version, $product, $status, $user, $input) {
            requireEditorialActor($user,true);
            $product = validateProduct($input);
            $old = $id ? query('SELECT * FROM products WHERE id=? FOR UPDATE', [$id])->fetch() : false;
            if ($id && (!$old || $version !== (int) $old['version'])) throw new ConflictError('Cet article a été modifié ailleurs. Rechargez la page avant d’enregistrer. Votre saisie est conservée ci-dessous.');
            confirmEnglish($input,$status === 'ready');
            $english=englishInput($input);
            if ($english===null && $old && productEnglish($id)!==null) throw new ValidationError('Rechargez le formulaire pour conserver les traductions de cet article.');
            $translation=validateEnglish($product,$english ?? initialEnglish($product,'product'),'product',$status === 'ready');
            $images = json($product['images']);
            if ($old) {
                query('UPDATE products SET name=?,category=?,images=?,status=?,updated_at=?,updated_by=?,version=version+1 WHERE id=?', [$product['name'], $product['category'], $images, $status, now(), $user['id'], $id]);
            } else {
                $id = id();
                // Les nouveautés ouvrent la boutique ; l’ordre reste modifiable ensuite.
                $first = (int) query('SELECT COALESCE(MIN(position),0) FROM products')->fetchColumn() - 1;
                query('INSERT INTO products (id,slug,name,category,images,position,status,updated_at,updated_by) VALUES (?,?,?,?,?,?,?,?,?)', [$id, uniqueProductSlug($product['name']), $product['name'], $product['category'], $images, $first, $status, now(), $user['id']]);
            }
            query('INSERT INTO settings (name,payload,version,updated_at,updated_by) VALUES (?,?,1,?,?) ON DUPLICATE KEY UPDATE payload=VALUES(payload),version=version+1,updated_at=VALUES(updated_at),updated_by=VALUES(updated_by)', ['product:' . $id,json(['en'=>$translation]),now(),$user['id']]);
            if ($status === 'ready') validateProductPublication(query('SELECT * FROM products WHERE id=?',[$id])->fetch());
            audit($status === 'ready' ? 'Article mis en boutique' : 'Article de boutique enregistré', $product['name'], $user['id']);
            return $id;
        });
    } catch (\PDOException $error) {
        if ($error->getCode() === '23000') throw new ValidationError('Un article porte déjà ce nom. Modifiez-le légèrement.');
        throw $error;
    }
}

/** Mise en ligne et retrait sans repasser par le formulaire. */
function switchProduct(array $input, array $user): array
{
    requireAdmin($user);
    $id = text($input, 'id', 32);
    $status = text($input, 'status', 16);
    if (!in_array($status, ['draft', 'ready'], true)) throw new ValidationError('Statut invalide.');
    return transaction(function () use ($id, $status, $user, $input) {
        requireEditorialActor($user,true);
        $row = query('SELECT * FROM products WHERE id=? FOR UPDATE', [$id])->fetch();
        if (!$row) throw new ValidationError('Article introuvable.');
        if ((int)$row['version'] !== filter_var($input['version'] ?? null,FILTER_VALIDATE_INT)) throw new ConflictError('Cet article a changé. Rechargez sa fiche.');
        $publication=query('SELECT product_id FROM product_publications WHERE product_id=?',[$id])->fetch();
        if ($status === 'draft' && !$publication) throw new ValidationError('Cet article est déjà retiré de la boutique.');
        if ($status === 'ready') {
            confirmEnglish($input,true);
            $data=productData($row);
            if (!isset($data['translations']['en'])) throw new ValidationError('Ouvrez la fiche pour compléter et relire les deux langues.');
            validateEnglish($data,$data['translations']['en'],'product',true);
        } else query('DELETE FROM product_publications WHERE product_id=?',[$id]);
        if ($row['status'] === $status && $status === 'ready') throw new ValidationError('Cet article est déjà dans cet état. Rechargez la page.');
        query('UPDATE products SET status=?,version=version+1,updated_at=?,updated_by=? WHERE id=?', [$status, now(), $user['id'], $id]);
        if ($status === 'ready') validateProductPublication(query('SELECT * FROM products WHERE id=?',[$id])->fetch());
        audit($status === 'ready' ? 'Article mis en boutique' : 'Article retiré de la boutique', $row['name'], $user['id']);
        return $row;
    });
}

/** Suppression réservée aux articles retirés de la boutique. */
function deleteProduct(array $input, array $user): void
{
    requireAdmin($user);
    $id = text($input, 'id', 32);
    transaction(function () use ($id, $user, $input) {
        requireEditorialActor($user,true);
        $row = query('SELECT * FROM products WHERE id=? FOR UPDATE', [$id])->fetch();
        if (!$row) throw new ValidationError('Article introuvable.');
        if ((int)$row['version'] !== filter_var($input['version'] ?? null,FILTER_VALIDATE_INT)) throw new ConflictError('Cet article a changé. Rechargez sa fiche.');
        if (query('SELECT product_id FROM product_publications WHERE product_id=?',[$id])->fetch()) throw new ValidationError('Retirez d’abord cet article de la boutique.');
        query('DELETE FROM settings WHERE name=?',['product:' . $id]);
        query('DELETE FROM products WHERE id=?', [$id]);
        audit('Article de boutique supprimé', $row['name'], $user['id']);
    });
}

/** Échange de rang avec le voisin ; toute la liste est renumérotée. */
function moveProduct(array $input, array $user): void
{
    requireAdmin($user);
    $id = text($input, 'id', 32);
    $direction = text($input, 'direction', 8);
    if (!in_array($direction, ['up', 'down'], true)) throw new ValidationError('Déplacement invalide.');
    transaction(function () use ($id, $direction) {
        $rows = query('SELECT id FROM products ORDER BY position,id FOR UPDATE')->fetchAll();
        $index = null;
        foreach ($rows as $rank => $row) if ($row['id'] === $id) $index = $rank;
        if ($index === null) throw new ValidationError('Article introuvable.');
        $target = $direction === 'up' ? $index - 1 : $index + 1;
        if ($target < 0 || $target >= count($rows)) throw new ValidationError('Cet article est déjà à cette extrémité de la boutique.');
        [$rows[$index], $rows[$target]] = [$rows[$target], $rows[$index]];
        foreach ($rows as $rank => $row) query('UPDATE products SET position=? WHERE id=?', [$rank, $row['id']]);
    });
}

function productImages(array $row): array
{
    return json_decode($row['images'], true, 512, JSON_THROW_ON_ERROR);
}

function productEnglish(string $id): ?array
{
    $saved=query('SELECT payload FROM settings WHERE name=?',['product:' . $id])->fetchColumn();
    return $saved ? json_decode($saved,true,32,JSON_THROW_ON_ERROR)['en'] : null;
}

function productData(array $row): array
{
    $data=['id'=>$row['slug'],'name'=>$row['name'],'category'=>$row['category'],'images'=>productImages($row)];
    $english=productEnglish($row['id']);
    if ($english!==null) $data['translations']=['en'=>$english];
    return $data;
}

function validateProductPublication(array $row): void
{
    query('INSERT INTO product_publications (product_id,version,payload,validated_at) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE version=VALUES(version),payload=VALUES(payload),validated_at=VALUES(validated_at)',[$row['id'],$row['version'],json(productData($row)),now()]);
}

/** Les produits déjà publics gardent leur contenu ; aucune ancienne saisie n’est remplacée. */
function migrateProductPublications(): void
{
    $lock='baruck-products-' . substr(hash('sha256',query('SELECT DATABASE()')->fetchColumn()),0,32);
    if ((int)query('SELECT GET_LOCK(?,10)',[$lock])->fetchColumn()!==1) throw new \RuntimeException('Migration déjà en cours.');
    try { transaction(function () {
        if (query('SELECT name FROM schema_migrations WHERE name=?',['product-snapshots-v1'])->fetch()) return;
        foreach (query("SELECT * FROM products WHERE status='ready' FOR UPDATE")->fetchAll() as $row) validateProductPublication($row);
        query('INSERT INTO schema_migrations (name,applied_at) VALUES (?,?)',['product-snapshots-v1',now()]);
    }); } finally { query('SELECT RELEASE_LOCK(?)',[$lock]); }
}

/** Dernières versions validées, indépendantes des brouillons. L’ordre reste partagé. */
function publishedProducts(): array
{
    return array_map(fn($row)=>json_decode($row['payload'],true,32,JSON_THROW_ON_ERROR),query('SELECT p.payload FROM product_publications p JOIN products d ON d.id=p.product_id ORDER BY d.position,d.id')->fetchAll());
}
