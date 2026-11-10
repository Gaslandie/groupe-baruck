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

/** HTML envoie un marqueur pour les listes vides ; aucune autre clé n’est écartée. */
function normalizePagePost(array $field, mixed $input): mixed
{
    if (!is_array($input)) return $input;
    if ($field['kind'] === 'list') {
        unset($input['__empty']);
        return array_map(fn($value) => normalizePagePost($field['item'], $value), $input);
    }
    if ($field['kind'] === 'object') foreach ($field['fields'] as $key => $child) {
        if (array_key_exists($key, $input)) $input[$key] = normalizePagePost($child, $input[$key]);
    }
    return $input;
}

function validatePageValues(array $model, mixed $input, bool $ready, array $options = []): array
{
    if (!is_array($input) || count($input) !== count($model['fields']) || array_diff_key($input, $model['fields'])) throw new ValidationError('Les champs de cette page sont incomplets ou inconnus.');
    $options['values'] = array_replace($options['values'] ?? [], $input);
    $values = [];
    foreach ($model['fields'] as $key => $field) $values[$key] = validatePageField($field, $input[$key] ?? null, $ready, $options);
    return $values;
}

function validatePageField(array $field, mixed $input, bool $ready, array $options = []): mixed
{
    $invalid = fn() => throw new ValidationError('Vérifiez « ' . $field['label'] . ' ».');
    if ($field['kind'] === 'list') {
        if (!is_array($input) || !array_is_list($input) || count($input) > $field['max']) $invalid();
        $values = array_map(fn($value) => validatePageField($field['item'], $value, $ready, $options), $input);
        if ($field['item']['kind'] === 'image') {
            $paths = array_filter(array_column($values, 'src'));
            if (count(array_unique($paths)) !== count($paths)) $invalid();
        }
        if (isset($field['uniqueBy'])) {
            $paths = [];
            foreach ($values as $value) {
                foreach (explode('.', $field['uniqueBy']) as $part) $value = $value[$part];
                if ($value) $paths[] = $value;
            }
            if (count(array_unique($paths)) !== count($paths)) $invalid();
        }
        if (isset($field['keyField']) && count(array_unique(array_column($values, $field['keyField']))) !== count($values)) $invalid();
        return $values;
    }
    if ($field['kind'] === 'object') {
        if (!is_array($input) || count($input) !== count($field['fields']) || array_diff_key($input, $field['fields'])) $invalid();
        $values = [];
        foreach ($field['fields'] as $key => $child) $values[$key] = validatePageField($child, $input[$key] ?? null, $ready, $options);
        if ($ready && array_key_exists('iso', $values) && isset($values['label']) && (bool) $values['iso'] !== (bool) ($values['label']['fr'] ?: $values['label']['en'])) $invalid();
        if (!empty($values['iso']) && !empty($values['endIso']) && $values['iso'] > $values['endIso']) $invalid();
        return $values;
    }
    if ($field['kind'] === 'image') {
        if (!is_array($input) || count($input) !== 4 || array_diff_key($input, array_flip(['src','alt','width','height']))) $invalid();
        $alt = validatePageField(['kind'=>'text','label'=>$field['label'],'max'=>500], $input['alt'] ?? null, $ready && !($field['decorative'] ?? false));
        $src = text($input, 'src', 255, $ready);
        if ($src === '' && !$ready) return ['src'=>'','alt'=>$alt,'width'=>1,'height'=>1];
        imagePath($src);
        $root = str_starts_with($src, '/images/actualites/uploads/') ? config()['storage'] . '/media' : dirname(__DIR__) . '/seed-media';
        $file = $root . '/' . (str_starts_with($src, '/images/actualites/uploads/') ? basename($src) : substr($src, strlen('/images/')));
        $real = realpath($file); $base = realpath($root);
        if (!$real || !$base || !str_starts_with($real, $base . DIRECTORY_SEPARATOR) || !is_file($real)) $invalid();
        $size = @getimagesize($real);
        if (!$size || !in_array($size['mime'] ?? '', ['image/jpeg','image/png','image/webp'], true) || $size[0] * $size[1] > 40000000) $invalid();
        return ['src'=>$src,'alt'=>$alt,'width'=>$size[0],'height'=>$size[1]];
    }
    if (!in_array($field['kind'], ['text','textarea'], true)) {
        $value = text(['value'=>$input], 'value', $field['max'], $ready && !($field['optional'] ?? false));
        if ($value === '' && (!$ready || ($field['optional'] ?? false))) return '';
        if ($field['kind'] === 'link') {
            $internal = preg_match('~^(?:/(?:[a-z0-9-]+/)*|/(?:[a-z0-9-]+/)*#[a-z0-9-]+|#[a-z0-9-]+)$~D', $value);
            $scope = $field['scope'] ?? 'local';
            if ($scope === 'external') {
                $url = parse_url($value);
                if (!filter_var($value, FILTER_VALIDATE_URL) || ($url['scheme'] ?? '') !== 'https' || isset($url['user']) || isset($url['pass']) || str_contains($value, '\\') || preg_match('/[\s\x00-\x1f]/', $value)) $invalid();
            } elseif (!$internal || ($scope === 'anchor' ? !str_starts_with($value, '#') : $scope === 'internal' && str_starts_with($value, '#'))) $invalid();
            if ($scope !== 'external') {
                $target = str_starts_with($value, '#') ? pageModel($field['page'])['route'] . $value : $value;
                if (preg_match('~^/actualites/([a-z0-9-]+)/$~D', $target, $matches)) {
                    $exists = in_array($matches[1], array_column(seed()['articles'], 'slug'), true) || query('SELECT id FROM articles WHERE slug=?', [$matches[1]])->fetch();
                    if (!$exists) $invalid();
                } elseif (!in_array($target, seed()['pageLinkTargets'], true)) $invalid();
            }
        } elseif ($field['kind'] === 'background') {
            if ($value !== $field['original']) validatePageField(['kind'=>'image','label'=>$field['label']], ['src'=>$value,'alt'=>['fr'=>'Image','en'=>'Image'],'width'=>1,'height'=>1], $ready);
        } elseif ($field['kind'] === 'date') {
            if (!preg_match('/^[0-9]{4}(?:-[0-9]{2}-[0-9]{2})?$/D', $value)) $invalid();
            if (strlen($value) > 4) { $date = \DateTimeImmutable::createFromFormat('!Y-m-d', $value); if (!$date || $date->format('Y-m-d') !== $value) $invalid(); }
        } elseif ($field['kind'] === 'video') {
            if (!in_array($value, $field['options'], true)) $invalid();
        } elseif ($field['kind'] === 'key') {
            if (!in_array($value, $field['options'], true) && !preg_match('/^item-[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/D', $value)) $invalid();
        } elseif ($field['kind'] === 'choice') {
            $references = isset($field['referenceList']) ? ($options['values'][$field['referenceList']] ?? []) : [];
            if (!in_array($value, $field['options'], true) && !in_array($value, array_column(is_array($references) ? $references : [], 'key'), true)) $invalid();
        } elseif ($field['kind'] === 'slug') {
            if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/D', $value) || (!in_array($value, array_column(seed()['articles'], 'slug'), true) && !query('SELECT id FROM articles WHERE slug=?', [$value])->fetch())) $invalid();
        } else $invalid();
        return $value;
    }
    if (!is_array($input) || count($input) !== 2 || array_diff_key($input, ['fr'=>true,'en'=>true])) $invalid();
    $optionalEmpty = ($field['optional'] ?? false) && $input['fr'] === '' && $input['en'] === '';
    $values = [];
    foreach (['fr','en'] as $language) {
        if (!is_string($input[$language] ?? null)) $invalid();
        $value = text($input, $language, $field['max'] * 4, $ready && !$optionalEmpty);
        if (mb_strlen($value,'UTF-8') > $field['max'] || preg_match('~</?[a-z][^>]*>~iu',$value) || ($field['kind'] === 'text' && preg_match('/[\r\n]/',$value))) $invalid();
        $values[$language] = $value;
    }
    return $values;
}

/** Compléter les anciens instantanés avec les seuls contenus déjà publics du code. */
function completePageState(string $id, array $state): array
{
    $initial = initialPageState($id);
    $added = array_diff_key($initial['draft'], $state['draft']) + array_diff_key($initial['validated'], $state['validated']);
    $state['draft'] = array_replace($initial['draft'], $state['draft']);
    $state['validated'] = array_replace($initial['validated'], $state['validated']);
    $state['needs_review'] = (bool) ($state['needs_review'] ?? false) || count($added) > 0;
    if ($state['needs_review']) $state['reviewed'] = false;
    return $state;
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
    return $row ? [...completePageState($id, json_decode($row['payload'], true, 512, JSON_THROW_ON_ERROR)), 'version' => (int) $row['version']] : [...initialPageState($id), 'version' => 0];
}

function pagePending(array $state): bool { return ($state['needs_review'] ?? false) || $state['draft'] !== $state['validated']; }

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
            query('SELECT id FROM media ORDER BY id FOR UPDATE')->fetchAll();
            $row = query('SELECT payload,version FROM settings WHERE name=? FOR UPDATE', ['page:' . $id])->fetch();
            if ((int) ($row['version'] ?? 0) !== $expected) throw new ConflictError('Cette page a été modifiée ailleurs. Votre saisie reste affichée. Copiez-la puis rechargez la page.');
            $state = $row ? completePageState($id, json_decode($row['payload'], true, 512, JSON_THROW_ON_ERROR)) : initialPageState($id);
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

/** Transport d’un grand formulaire : mêmes champs et mêmes contrôles côté serveur. */
function decodePageFields(array $input): mixed
{
    if (!array_key_exists('page_fields_json', $input)) return $input['fields'] ?? null;
    if (isset($input['fields']) || !is_string($input['page_fields_json']) || strlen($input['page_fields_json']) > 2000000) throw new ValidationError('Le formulaire est trop grand ou invalide.');
    try { return json_decode($input['page_fields_json'], true, 32, JSON_THROW_ON_ERROR); }
    catch (\JsonException $error) { throw new ValidationError('Le formulaire est incomplet. Rechargez la page et réessayez.'); }
}

function savePageDraft(array $input, array $user): string
{
    return writePage($input, $user, function ($state, $model) use ($input) {
        if (isset($input['status']) && $input['status'] !== 'draft') throw new ValidationError('Enregistrez le brouillon puis validez les deux versions.');
        $fields = $model['fields'];
        if (isset($input['section'])) {
            $section = text($input, 'section', 100);
            $match = null;
            foreach ($model['sections'] as $candidate) if ($candidate['id'] === $section) $match = $candidate;
            if (!$match) throw new ValidationError('Cette section n’existe pas.');
            $fields = array_intersect_key($fields, array_flip($match['fields']));
        }
        $sent = $input['fields'] ?? null;
        if (is_array($sent)) foreach ($fields as $key => $field) {
            if (array_key_exists($key, $sent)) $sent[$key] = normalizePagePost($field, $sent[$key]);
        }
        $patch = validatePageValues(['fields'=>$fields], $sent, false, ['values'=>$state['draft']]);
        $values = array_replace($state['draft'], $patch);
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
        $state['needs_review'] = false;
        $state['validated_at'] = now();
        return $state;
    }, 'Page validée en français et en anglais');
}

function restorePage(array $input, array $user): string
{
    return writePage($input, $user, function ($state) {
        $state['draft'] = $state['validated'];
        $state['reviewed'] = !($state['needs_review'] ?? false) && $state['validated_at'] !== null;
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
