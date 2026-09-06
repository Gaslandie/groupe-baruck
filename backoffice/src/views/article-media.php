<?php namespace Baruck;
$catalog = array_column(mediaCatalog(), null, 'path');
function imageFields(string $index, array $item, array $catalog, bool $cover = false): void {
    global $inputClass, $secondaryClass;
    $path = is_string($item['src'] ?? null) ? $item['src'] : '';
    $media = $catalog[$path] ?? null;
    $prefix = $cover ? 'cover' : 'gallery-' . $index;
?>
    <div data-image-preview <?= $media ? '' : 'hidden' ?>>
        <img data-preview src="<?= e($media['preview'] ?? '') ?>" alt="<?= e($item['alt'] ?? '') ?>" width="<?= (int) ($media['width'] ?? 1) ?>" height="<?= (int) ($media['height'] ?? 1) ?>" loading="lazy" class="mb-4 max-h-[240px] w-full rounded-lg object-contain">
    </div>
    <input type="hidden" data-image-path name="<?= $cover ? 'cover' : 'gallery[' . e($index) . '][src]' ?>" value="<?= e($path) ?>">
    <p data-image-empty class="text-caption text-ink/60" <?= $path !== '' ? 'hidden' : '' ?>>Aucune image sélectionnée.</p>
    <div class="mt-3 flex flex-wrap gap-3"><button type="button" data-media-choose class="<?= $secondaryClass ?>">Choisir ou importer une image</button><button type="button" data-media-remove class="<?= $secondaryClass ?>" <?= $path !== '' || !$cover ? '' : 'hidden' ?>>Retirer l’image</button></div>
    <div class="mt-4"><label data-alt-label for="<?= e($prefix) ?>-alt" class="text-caption font-medium">Description de l’image</label><input data-image-alt class="<?= $inputClass ?>" id="<?= e($prefix) ?>-alt" name="<?= $cover ? 'cover_alt' : 'gallery[' . e($index) . '][alt]' ?>" value="<?= e($item['alt'] ?? '') ?>" maxlength="500" <?= $path !== '' ? 'required' : '' ?>><p class="mt-2 text-caption text-ink/60">Décrivez ce que montre la photo pour les personnes qui ne peuvent pas la voir.</p></div>
    <?php if (!$cover): ?>
    <div class="mt-3"><label data-caption-label for="<?= e($prefix) ?>-caption" class="text-caption">Légende (facultative)</label><input data-image-caption class="<?= $inputClass ?>" id="<?= e($prefix) ?>-caption" name="gallery[<?= e($index) ?>][caption]" value="<?= e($item['caption'] ?? '') ?>" maxlength="500"></div>
    <div class="mt-4 flex flex-wrap gap-3"><button type="button" data-media-up class="<?= $secondaryClass ?>">Monter</button><button type="button" data-media-down class="<?= $secondaryClass ?>">Descendre</button></div>
    <?php endif; ?>
<?php } ?>
<noscript><p class="rounded-lg bg-paper-deep p-4 text-body">Activez JavaScript pour choisir ou importer les images. Les images déjà enregistrées sont conservées.</p></noscript>
<section data-cover class="rounded-xl border border-line bg-ivory p-6"><h2 class="mb-5 font-display text-title">Image de couverture</h2><?php imageFields('cover', ['src' => $article['cover'] ?? '', 'alt' => $article['cover_alt'] ?? ''], $catalog, true); ?></section>
<section class="rounded-xl border border-line bg-ivory p-6"><h2 class="font-display text-title">Galerie</h2><p class="mt-2 text-caption text-ink/60">Ajoutez jusqu’à 30 images. Les boutons Monter et Descendre définissent leur ordre.</p><div data-gallery class="mt-5 space-y-5"><?php foreach ($gallery as $index => $item): if (!is_array($item) || empty($item['src'])) continue; ?><fieldset data-gallery-item class="rounded-lg border border-line p-4"><legend class="px-2 text-caption font-semibold">Image <?= (int) $index + 1 ?></legend><?php imageFields((string) $index, $item, $catalog); ?></fieldset><?php endforeach; ?></div><button type="button" data-gallery-add class="<?= $secondaryClass ?> mt-5">Ajouter une image à la galerie</button><p data-gallery-status role="status" class="mt-3 text-caption text-ink/60"></p></section>
<template id="gallery-item-template"><fieldset data-gallery-item class="rounded-lg border border-line p-4"><legend class="px-2 text-caption font-semibold">Image</legend><?php imageFields('new', [], []); ?></fieldset></template>
