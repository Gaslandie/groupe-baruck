<?php
declare(strict_types=1);

namespace Baruck;

function pageModels(): array { return seed()['pageModels']; }

function pageModel(string $id): array
{
    $model = pageModels()[$id] ?? null;
    if (!$model) throw new ValidationError('Cette page n’existe pas.');
    return $model;
}

function validatePageValues(array $model, mixed $input, bool $ready): array
{
    if (!is_array($input) || count($input) !== count($model['fields']) || array_diff_key($input, $model['fields'])) throw new ValidationError('Les champs de cette page sont incomplets ou inconnus.');
    $values = [];
    foreach ($model['fields'] as $key => $field) {
        $pair = $input[$key] ?? null;
        if (!is_array($pair) || count($pair) !== 2 || array_diff_key($pair, ['fr' => true, 'en' => true])) throw new ValidationError('Chaque champ demande une version française et une version anglaise.');
        foreach (['fr', 'en'] as $language) {
            if (!is_string($pair[$language] ?? null)) throw new ValidationError('Chaque version doit contenir du texte.');
            $value = text($pair, $language, $field['max'] * 4, $ready);
            if (mb_strlen($value, 'UTF-8') > $field['max'] || preg_match('~</?[a-z][^>]*>~iu', $value) || ($field['kind'] === 'text' && preg_match('/[\r\n]/', $value))) throw new ValidationError('Vérifiez « ' . $field['label'] . ' » (' . strtoupper($language) . '). Utilisez du texte simple dans la longueur indiquée.');
            $values[$key][$language] = $value;
        }
    }
    return $values;
}

/** Lecture sans migration destructive : les réglages existants restent la référence initiale. */
function initialPageState(string $id): array
{
    $values = array_map(fn($field) => $field['initial'], pageModel($id)['fields']);
    $draft = $values;
    if ($id === 'home') {
        $legacy = setting('textes');
        foreach (seed()['textes'] as $group => $entries) {
            foreach ($entries as $key => $entry) {
                foreach (['title', 'description'] as $name) {
                    $field = $group . '.' . $key . '.' . $name;
                    $fr = $legacy[$group][$key][$name];
                    $englishKey = trim(preg_replace('/\s+/u', ' ', $fr));
                    $en = seed()['english'][$englishKey] ?? null;
                    $values[$field] = ['fr' => $fr, 'en' => $en ?? $fr];
                    $draft[$field] = ['fr' => $fr, 'en' => $en ?? ($fr === $entry[$name] ? $values[$field]['en'] : '')];
                }
            }
        }
    }
    return ['draft' => $draft, 'validated' => $values, 'reviewed' => false, 'validated_at' => null];
}

function pageState(string $id): array
{
    pageModel($id);
    $row = query('SELECT payload,version FROM settings WHERE name=?', ['page:' . $id])->fetch();
    return $row ? [...json_decode($row['payload'], true, 512, JSON_THROW_ON_ERROR), 'version' => (int) $row['version']] : [...initialPageState($id), 'version' => 0];
}

function pagePending(array $state): bool { return $state['draft'] !== $state['validated']; }

/** La version et le compte sont relus dans la transaction, y compris au premier enregistrement. */
function writePage(array $input, array $user, callable $change, string $action): string
{
    requireAdmin($user);
    $id = text($input, 'id', 60);
    $model = pageModel($id);
    $expected = filter_var($input['version'] ?? null, FILTER_VALIDATE_INT);
    if ($expected === false || $expected === null || $expected < 0) throw new ValidationError('Rechargez la page avant d’enregistrer.');
    try {
        transaction(function () use ($id, $model, $expected, $user, $change, $action) {
            $account = query('SELECT role,active,session_version FROM users WHERE id=? FOR UPDATE', [$user['id']])->fetch();
            if (!$account || !$account['active'] || $account['role'] !== 'admin' || (int) $account['session_version'] !== (int) $user['session_version']) {
                http_response_code(403); exit('Vos accès ont changé. Reconnectez-vous.');
            }
            $row = query('SELECT payload,version FROM settings WHERE name=? FOR UPDATE', ['page:' . $id])->fetch();
            if ((int) ($row['version'] ?? 0) !== $expected) throw new ConflictError('Cette page a été modifiée ailleurs. Votre saisie reste affichée. Copiez-la puis rechargez la page.');
            $state = $row ? json_decode($row['payload'], true, 512, JSON_THROW_ON_ERROR) : initialPageState($id);
            $state = $change($state, $model);
            if ($row) query('UPDATE settings SET payload=?,version=version+1,updated_at=?,updated_by=? WHERE name=?', [json($state), now(), $user['id'], 'page:' . $id]);
            else query('INSERT INTO settings (name,payload,version,updated_at,updated_by) VALUES (?,?,1,?,?)', ['page:' . $id, json($state), now(), $user['id']]);
            audit($action, $model['label'], $user['id']);
        });
    } catch (\PDOException $error) {
        if (in_array($error->getCode(), ['23000', '40001'], true)) throw new ConflictError('Cette page vient d’être enregistrée ailleurs. Rechargez-la avant de continuer.');
        throw $error;
    }
    return $id;
}

function savePageDraft(array $input, array $user): string
{
    return writePage($input, $user, function ($state, $model) use ($input) {
        if (isset($input['status']) && $input['status'] !== 'draft') throw new ValidationError('Enregistrez le brouillon puis validez les deux versions.');
        $values = validatePageValues($model, $input['fields'] ?? null, false);
        if ($values !== $state['draft']) $state['reviewed'] = false;
        $state['draft'] = $values;
        return $state;
    }, 'Brouillon de page enregistré');
}

function validatePage(array $input, array $user): string
{
    return writePage($input, $user, function ($state, $model) use ($input) {
        if (($input['english_reviewed'] ?? '') !== 'yes') throw new ValidationError('Confirmez la relecture du français et de l’anglais avant de valider.');
        $state['validated'] = validatePageValues($model, $state['draft'], true);
        $state['reviewed'] = true;
        $state['validated_at'] = now();
        return $state;
    }, 'Page validée en français et en anglais');
}

function restorePage(array $input, array $user): string
{
    return writePage($input, $user, function ($state) {
        $state['draft'] = $state['validated'];
        $state['reviewed'] = $state['validated_at'] !== null;
        return $state;
    }, 'Brouillon de page repris depuis la version validée');
}

function publishedPages(): array
{
    $pages = [];
    foreach (pageModels() as $id => $model) {
        $state = pageState($id);
        if ($state['validated_at'] !== null) $pages[$id] = validatePageValues($model, $state['validated'], true);
    }
    return $pages;
}

function publishedTextes(): array
{
    $state = pageState('home');
    if ($state['validated_at'] === null) return setting('textes');
    $texts = [];
    foreach (['fr', 'en'] as $language) {
        foreach (seed()['textes'] as $group => $entries) foreach ($entries as $key => $entry) foreach (['title', 'description'] as $name) $texts[$language][$group][$key][$name] = $state['validated'][$group . '.' . $key . '.' . $name][$language];
    }
    return [...$texts['fr'], 'translations' => ['en' => $texts['en']]];
}
