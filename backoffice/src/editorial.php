<?php
declare(strict_types=1);

namespace Baruck;

function articleData(array $row): array
{
    return [
        'slug' => $row['slug'], 'title' => $row['title'], 'category' => $row['category'],
        'date' => $row['article_date'], 'excerpt' => $row['excerpt'], 'body' => $row['body'],
        'cover' => $row['cover'], 'cover_alt' => $row['cover_alt'],
        'gallery' => json_decode($row['gallery'], true, 512, JSON_THROW_ON_ERROR),
    ];
}

function publicationData(array $article): array
{
    return [
        'slug' => $article['slug'], 'title' => $article['title'], 'date' => $article['date'],
        'category' => $article['category'], 'excerpt' => $article['excerpt'], 'body' => $article['body'],
        'cover' => $article['cover'], 'coverAlt' => $article['cover_alt'], 'gallery' => $article['gallery'],
    ];
}

function json(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_THROW_ON_ERROR);
}

function recordRevision(string $id, int $version, array $data, string $action, ?string $userId): void
{
    query('INSERT INTO article_revisions (id,article_id,version,payload,action,user_id,created_at) VALUES (?,?,?,?,?,?,?)', [id(), $id, $version, json($data), $action, $userId, now()]);
}

function validatePublication(string $id, int $version, array $article): void
{
    query('INSERT INTO article_publications (article_id,version,payload,validated_at) VALUES (?,?,?,?) ON DUPLICATE KEY UPDATE version=VALUES(version),payload=VALUES(payload),validated_at=VALUES(validated_at)', [$id, $version, json(publicationData($article)), now()]);
}

/** Migration additive : aucun écrasement des brouillons ni recréation d’un retrait. */
function migrateEditorial(): void
{
    $name = 'editorial-snapshots-v1';
    $lock = 'baruck-migrate-' . substr(hash('sha256', query('SELECT DATABASE()')->fetchColumn()), 0, 32);
    if ((int) query('SELECT GET_LOCK(?,10)', [$lock])->fetchColumn() !== 1) throw new \RuntimeException('Migration déjà en cours.');
    try {
        transaction(function () use ($name) {
            if (query('SELECT name FROM schema_migrations WHERE name=?', [$name])->fetch()) return;
            foreach (query('SELECT * FROM articles FOR UPDATE')->fetchAll() as $row) {
                $data = articleData($row);
                recordRevision($row['id'], (int) $row['version'], $data, 'Version initiale', $row['updated_by']);
                if ($row['status'] === 'ready') validatePublication($row['id'], (int) $row['version'], $data);
            }
            query('INSERT INTO schema_migrations (name,applied_at) VALUES (?,?)', [$name, now()]);
        });
    } finally { query('SELECT RELEASE_LOCK(?)', [$lock]); }
}

function restoreRevision(array $input, array $user): string
{
    $id = text($input, 'id', 32);
    $revision = text($input, 'revision', 32);
    $version = filter_var($input['version'] ?? '', FILTER_VALIDATE_INT);
    return transaction(function () use ($id, $revision, $version, $user) {
        $row = query('SELECT * FROM articles WHERE id=? FOR UPDATE', [$id])->fetch();
        if (!$row || (int) $row['version'] !== $version) throw new ConflictError('Cet article a changé. Rechargez son historique avant de restaurer une version.');
        $saved = query('SELECT payload,version FROM article_revisions WHERE id=? AND article_id=?', [$revision, $id])->fetch();
        if (!$saved) throw new ValidationError('Cette version n’appartient pas à cet article.');
        $data = json_decode($saved['payload'], true, 512, JSON_THROW_ON_ERROR);
        // Les versions proviennent d’enregistrements serveur validés. Restaurer
        // un brouillon ne modifie jamais la copie destinée à la publication.
        query('UPDATE articles SET title=?,category=?,article_date=?,excerpt=?,body=?,cover=?,cover_alt=?,gallery=?,status=?,version=version+1,updated_at=?,updated_by=? WHERE id=?', [$data['title'], $data['category'], $data['date'], $data['excerpt'], $data['body'], $data['cover'], $data['cover_alt'], json($data['gallery']), 'draft', now(), $user['id'], $id]);
        recordRevision($id, $version + 1, $data, 'Restauration de la version ' . $saved['version'], $user['id']);
        audit('Version restaurée en brouillon', $data['title'], $user['id']);
        return $id;
    });
}

function withdrawPublication(array $input, array $user): void
{
    requireAdmin($user);
    if (($input['confirm_withdraw'] ?? '') !== 'yes') throw new ValidationError('Confirmez le retrait de cet article de la prochaine publication.');
    $id = text($input, 'id', 32);
    $version = filter_var($input['version'] ?? '', FILTER_VALIDATE_INT);
    transaction(function () use ($id, $version, $user) {
        $row = query('SELECT * FROM articles WHERE id=? FOR UPDATE', [$id])->fetch();
        if (!$row || (int) $row['version'] !== $version) throw new ConflictError('Cet article a changé. Rechargez la page avant de confirmer son retrait.');
        if (!query('SELECT article_id FROM article_publications WHERE article_id=?', [$id])->fetch()) throw new ValidationError('Cet article est déjà exclu de la prochaine publication.');
        query('DELETE FROM article_publications WHERE article_id=?', [$id]);
        query('UPDATE articles SET status=?,version=version+1,updated_at=?,updated_by=? WHERE id=?', ['draft', now(), $user['id'], $id]);
        recordRevision($id, $version + 1, articleData($row), 'Retrait de la publication', $user['id']);
        audit('Retrait de la prochaine publication', $row['title'], $user['id']);
    });
}
