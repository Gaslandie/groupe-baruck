<?php
declare(strict_types=1);

namespace Baruck;

/**
 * Réglages du site : une ligne versionnée par sujet. Tant qu'un sujet n'a pas
 * été modifié, les valeurs du site servent de point de départ.
 */
function setting(string $name): array
{
    $saved = query('SELECT payload FROM settings WHERE name=?', [$name])->fetch();
    return $saved ? json_decode($saved['payload'], true, 512, JSON_THROW_ON_ERROR) : seed()[$name];
}

function settingVersion(string $name): int
{
    return (int) (query('SELECT version FROM settings WHERE name=?', [$name])->fetchColumn() ?: 0);
}

function saveSetting(string $name, array $data, mixed $version, array $user, string $action, string $subject): void
{
    requireAdmin($user);
    $expected = filter_var($version, FILTER_VALIDATE_INT);
    transaction(function () use ($name, $data, $expected, $user, $action, $subject) {
        $current = query('SELECT version FROM settings WHERE name=? FOR UPDATE', [$name])->fetchColumn();
        if ((int) ($current ?: 0) !== $expected) throw new ConflictError('Cette page a été modifiée ailleurs. Rechargez-la avant d’enregistrer.');
        query(
            'INSERT INTO settings (name,payload,version,updated_at,updated_by) VALUES (?,?,1,?,?) ON DUPLICATE KEY UPDATE payload=VALUES(payload),version=version+1,updated_at=VALUES(updated_at),updated_by=VALUES(updated_by)',
            [$name, json($data), now(), $user['id']],
        );
        audit($action, $subject, $user['id']);
    });
}
