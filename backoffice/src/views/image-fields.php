<?php namespace Baruck;
/**
 * Champs d’une image choisie dans la médiathèque, partagés par les actualités
 * et la boutique. Le nom du groupe (« gallery », « images ») pilote aussi la
 * renumérotation côté navigateur.
 */
function imageFields(string $index, array $item, array $catalog, bool $cover = false, string $field = 'gallery', bool $caption = true): void {
    global $inputClass, $secondaryClass;
    $path = is_string($item['src'] ?? null) ? $item['src'] : '';
    $media = $catalog[$path] ?? null;
    $prefix = $cover ? 'cover' : $field . '-' . $index;
    $name = fn(string $key) => $cover ? ($key === 'src' ? 'cover' : 'cover_alt') : $field . '[' . e($index) . '][' . $key . ']';
?>
    <div data-image-preview <?= $media ? '' : 'hidden' ?>>
        <img data-preview src="<?= e($media['preview'] ?? '') ?>" alt="<?= e($item['alt'] ?? '') ?>" width="<?= (int) ($media['width'] ?? 1) ?>" height="<?= (int) ($media['height'] ?? 1) ?>" loading="lazy" class="mb-4 max-h-[240px] w-full rounded-lg object-contain">
    </div>
    <input type="hidden" data-image-path name="<?= $name('src') ?>" value="<?= e($path) ?>">
    <p data-image-empty class="text-caption text-ink/60" <?= $path !== '' ? 'hidden' : '' ?>>Aucune image sélectionnée.</p>
    <div class="mt-3 flex flex-wrap gap-3"><button type="button" data-media-choose class="<?= $secondaryClass ?>">Choisir ou importer une image</button><button type="button" data-media-remove class="<?= $secondaryClass ?>" <?= $path !== '' || !$cover ? '' : 'hidden' ?>>Retirer l’image</button></div>
    <div class="mt-4"><label data-alt-label for="<?= e($prefix) ?>-alt" class="text-caption font-medium">Description de l’image</label><input data-image-alt class="<?= $inputClass ?>" id="<?= e($prefix) ?>-alt" name="<?= $name('alt') ?>" value="<?= e($item['alt'] ?? '') ?>" maxlength="500" <?= $path !== '' ? 'required' : '' ?>><p class="mt-2 text-caption text-ink/60">Décrivez ce que montre la photo pour les personnes qui ne peuvent pas la voir.</p></div>
    <?php if (!$cover): ?>
    <?php if ($caption): ?><div class="mt-3"><label data-caption-label for="<?= e($prefix) ?>-caption" class="text-caption">Légende (facultative)</label><input data-image-caption class="<?= $inputClass ?>" id="<?= e($prefix) ?>-caption" name="<?= $name('caption') ?>" value="<?= e($item['caption'] ?? '') ?>" maxlength="500"></div><?php endif; ?>
    <div class="mt-4 flex flex-wrap gap-3"><button type="button" data-media-up class="<?= $secondaryClass ?>">Monter</button><button type="button" data-media-down class="<?= $secondaryClass ?>">Descendre</button></div>
    <?php endif; ?>
<?php }
