<?php
namespace Baruck;

function emptyPageField(array $field): mixed
{
    return match ($field['kind']) {
        'list' => [],
        'object' => array_map(fn($child) => emptyPageField($child), $field['fields']),
        'image' => ['src'=>'','alt'=>['fr'=>'','en'=>''],'width'=>1,'height'=>1],
        'text', 'textarea' => ['fr'=>'','en'=>''],
        default => '',
    };
}

/** Champs autorisés par le modèle serveur ; aucun nom de champ créé par le navigateur. */
function pageField(array $field, mixed $value, string $name): void
{
    global $secondaryClass, $pageInputClass, $pageCatalog;
    $id = 'field-' . preg_replace('/[^a-zA-Z0-9_-]/', '-', $name);
    $value = displayPageField($field, $value);
    echo '<fieldset class="min-w-0 space-y-4"><legend class="text-small font-bold">' . e($field['label']) . '</legend>';
    if ($field['kind'] === 'list') {
        echo '<div data-page-list data-list-name="' . e($name) . '" data-max="' . (int) $field['max'] . '" class="space-y-4"><input type="hidden" name="' . e($name) . '[__empty]" value="1"><div data-list-items class="space-y-4">';
        foreach (is_array($value) ? $value : [] as $index => $item) pageListItem($field['item'], $item, $name . '[' . $index . ']');
        echo '</div><template data-list-template>';
        pageListItem($field['item'], emptyPageField($field['item']), $name . '[__new__]');
        echo '</template><button type="button" data-list-add class="' . $secondaryClass . '">Ajouter un élément</button><p data-list-status role="status" class="text-caption text-ink/60">' . count(is_array($value) ? $value : []) . ' élément(s) sur ' . (int) $field['max'] . '.</p></div>';
    } elseif ($field['kind'] === 'object') {
        foreach ($field['fields'] as $key => $child) pageField($child, is_array($value) ? ($value[$key] ?? null) : null, $name . '[' . $key . ']');
    } elseif ($field['kind'] === 'image') {
        $value = is_array($value) ? $value : emptyPageField($field);
        $media = $pageCatalog[$value['src'] ?? ''] ?? null;
        echo '<div data-page-image><div data-image-preview ' . ($media ? '' : 'hidden') . '><img data-preview src="' . e($media['preview'] ?? '') . '" alt="" width="' . (int) ($media['width'] ?? 1) . '" height="' . (int) ($media['height'] ?? 1) . '" loading="lazy" class="mb-4 max-h-[240px] w-full object-contain"></div><input data-image-path type="hidden" name="' . e($name) . '[src]" value="' . e($value['src'] ?? '') . '">';
        foreach (['width','height'] as $dimension) echo '<input data-image-' . $dimension . ' type="hidden" name="' . e($name) . '[' . $dimension . ']" value="' . (int) ($value[$dimension] ?? 1) . '">';
        echo '<p data-image-empty ' . ($media ? 'hidden' : '') . ' class="text-caption">Aucune image sélectionnée.</p><div class="my-4 flex flex-wrap gap-3"><button type="button" data-media-choose class="' . $secondaryClass . '">Choisir ou importer une image</button><button type="button" data-media-remove class="' . $secondaryClass . '">Retirer l’image</button></div>';
        pageField(['kind'=>'text','label'=>'Description de la photo','max'=>500], $value['alt'] ?? null, $name . '[alt]');
        echo '</div>';
    } elseif (in_array($field['kind'], ['text','textarea'], true)) {
        echo '<p class="text-caption text-ink/60">' . (int) $field['max'] . ' caractères maximum par langue.</p><div class="grid min-w-0 gap-4 tablet:grid-cols-2">';
        foreach (['fr'=>'Français','en'=>'Anglais'] as $language => $label) {
            $control = $id . '-' . $language;
            echo '<div class="min-w-0"><label for="' . e($control) . '" class="text-small">' . e($label) . '</label>';
            $attrs = ' id="' . e($control) . '" name="' . e($name) . '[' . $language . ']" lang="' . $language . '" maxlength="' . (int) $field['max'] . '" class="' . $pageInputClass . '"';
            if ($language === 'fr' && str_ends_with($name, '[alt]')) $attrs .= ' data-image-alt';
            if ($field['kind'] === 'textarea' || $field['max'] > 300) echo '<textarea rows="4"' . $attrs . '>' . e(is_array($value) ? ($value[$language] ?? '') : '') . '</textarea>';
            else echo '<input' . $attrs . ' value="' . e(is_array($value) ? ($value[$language] ?? '') : '') . '">';
            echo '</div>';
        }
        echo '</div>';
    } elseif (in_array($field['kind'], ['video','slug','background'], true)) {
        $options = match ($field['kind']) {
            'video' => array_combine($field['options'], $field['options']),
            'background' => [$field['original']=>'Photo d’origine', ...array_column($pageCatalog, 'label', 'path')],
            default => array_column(query('SELECT slug,title FROM articles ORDER BY article_date DESC,slug')->fetchAll(), 'title', 'slug'),
        };
        echo '<label for="' . e($id) . '" class="sr-only">' . e($field['label']) . '</label><select id="' . e($id) . '" name="' . e($name) . '" class="' . $pageInputClass . '"><option value="">À choisir</option>';
        foreach ($options as $key => $label) echo '<option value="' . e($key) . '" ' . ($value === $key ? 'selected' : '') . '>' . e($label) . '</option>';
        echo '</select>';
    } else {
        echo '<label for="' . e($id) . '" class="sr-only">' . e($field['label']) . '</label><input id="' . e($id) . '" name="' . e($name) . '" value="' . e(is_string($value) ? $value : '') . '" maxlength="' . (int) $field['max'] . '" class="' . $pageInputClass . '"' . ($field['kind'] === 'link' ? ' list="page-known-links"' : '') . '>';
        if ($field['kind'] === 'link') echo '<p class="text-caption text-ink/60">' . match ($field['scope'] ?? '') { 'external'=>'Adresse complète commençant par https://.', 'anchor'=>'Rubrique de cette page, par exemple #identite.', 'internal'=>'Page du site, par exemple /contact/.', default=>'Page du site ou rubrique de cette page, par exemple /contact/ ou #identite.' } . '</p>';
        if ($field['kind'] === 'date') echo '<p class="text-caption text-ink/60">Année : 2015. Date complète : 2015-12-23.</p>';
    }
    echo '</fieldset>';
}

/** Conserver une saisie refusée sans faire interpréter sa forme par la vue. */
function displayPageField(array $field, mixed $value): mixed
{
    if ($field['kind'] === 'list') return is_array($value) && array_is_list($value) ? array_map(fn($item) => displayPageField($field['item'], $item), $value) : [];
    if ($field['kind'] === 'object') {
        $result = [];
        foreach ($field['fields'] as $key => $child) $result[$key] = displayPageField($child, is_array($value) ? ($value[$key] ?? null) : null);
        return $result;
    }
    if ($field['kind'] === 'image') return ['src'=>is_string($value['src'] ?? null) ? $value['src'] : '', 'alt'=>displayPageField(['kind'=>'text'], $value['alt'] ?? null), 'width'=>is_numeric($value['width'] ?? null) ? (int)$value['width'] : 1, 'height'=>is_numeric($value['height'] ?? null) ? (int)$value['height'] : 1];
    if (in_array($field['kind'], ['text','textarea'], true)) return ['fr'=>is_string($value['fr'] ?? null) ? $value['fr'] : '', 'en'=>is_string($value['en'] ?? null) ? $value['en'] : ''];
    return is_string($value) ? $value : '';
}

function pageListItem(array $field, mixed $value, string $name): void
{
    global $secondaryClass;
    echo '<div data-list-item data-item-prefix="' . e($name) . '" class="min-w-0 space-y-4 rounded-lg border border-line p-4">';
    pageField($field, $value, $name);
    echo '<div class="flex flex-wrap gap-3"><button type="button" data-list-up class="' . $secondaryClass . '">Monter</button><button type="button" data-list-down class="' . $secondaryClass . '">Descendre</button><button type="button" data-list-remove class="' . $secondaryClass . '">Retirer cet élément</button></div></div>';
}
