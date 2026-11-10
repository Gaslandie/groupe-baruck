<?php namespace Baruck;
require_once __DIR__ . '/image-fields.php';
require_once __DIR__ . '/editorial-fields.php';
$english=is_array($product['english'] ?? null) ? $product['english'] : initialEnglish($product,'product');
$catalog = array_column(mediaCatalog(), null, 'path');
$photos = is_array($product['images'] ?? null) ? $product['images'] : [];
$online = !empty($productPublication);
$saved = !empty($product['id']);
?>
<a href="<?= e(url('boutique')) ?>" class="mb-6 inline-block text-sm underline underline-offset-4">← Toute la boutique</a>
<p class="mb-6 max-w-[760px] text-small leading-relaxed text-ink/70">Le nom et les descriptions des photos se préparent dans les deux langues. Le brouillon garde la dernière version validée.</p>
<?php if ($online): ?><p class="mb-6 rounded-lg bg-paper-deep p-4 text-sm">Cet article est en boutique. La dernière version validée est conservée pendant votre travail.</p><?php endif; ?>
<form method="post" id="product-form" data-media-form data-editorial-form="product">
    <?= csrfField() ?><input type="hidden" name="action" value="save_product"><input type="hidden" name="id" value="<?= e($product['id'] ?? '') ?>"><input type="hidden" name="version" value="<?= e($product['version'] ?? 0) ?>">
    <fieldset class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <div class="min-w-0 space-y-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <div><?php field('Nom de l’article', 'name', $product['name'] ?? '', 'text', 'required maxlength="160"'); translationField('Nom de l’article','english[name]',$english['name'] ?? '',160); ?><p class="mt-2 text-xs leading-relaxed text-ink/60">Le nom apparaît sur la fiche et dans le message WhatsApp du client.</p></div>
            <div><label for="category" class="text-sm font-medium">Rayon</label><select name="category" id="category" class="<?= $inputClass ?>"><?php foreach (brandCategories() as $key => $label): ?><option value="<?= e($key) ?>" <?= ($product['category'] ?? '') === $key ? 'selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?></select></div>
        </section>
        <noscript><p class="rounded-lg bg-paper-deep p-4 text-body">Activez JavaScript pour choisir ou importer les photos. Les photos déjà enregistrées sont conservées.</p></noscript>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-title">Photos</h2>
            <p class="mt-2 text-caption text-ink/60">Jusqu’à 6 photos. La première est celle que voient les clients dans la collection ; Monter et Descendre changent l’ordre.</p>
            <div data-gallery data-field="images" data-max="6" class="mt-5 space-y-5"><?php foreach ($photos as $index => $item): if (!is_array($item) || empty($item['src'])) continue; ?><fieldset data-gallery-item class="rounded-lg border border-line p-4"><legend class="px-2 text-caption font-semibold">Image <?= (int) $index + 1 ?></legend><?php imageFields((string) $index, $item, $catalog, false, 'images', false, $english['images'][$index] ?? []); ?></fieldset><?php endforeach; ?></div>
            <button type="button" data-gallery-add class="<?= $secondaryClass ?> mt-5">Ajouter une photo</button>
            <p data-gallery-status role="status" class="mt-3 text-caption text-ink/60"></p>
        </section>
    </div>
    <aside class="space-y-5 self-start wide:sticky wide:top-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Préparation</h2>
            <p class="text-sm text-ink/65"><?= $online ? 'En boutique' : 'Masqué : visible ici seulement.' ?></p>
            <button type="button" data-open-editorial-preview class="<?= $secondaryClass ?> w-full">Voir l’aperçu</button>
            <button type="submit" name="status" value="draft" class="<?= $secondaryClass ?> w-full">Enregistrer le brouillon</button>
            <?php editorialReview(); ?>
            <button type="submit" name="status" value="ready" data-editorial-validate class="<?= $buttonClass ?> w-full">Valider les deux versions</button>
            <p class="text-xs leading-relaxed text-ink/60">Les prix restent échangés par WhatsApp : ils ne figurent pas sur le site.</p>
        </section>
        <a href="<?= e(url('media')) ?>" target="_blank" rel="noreferrer" class="<?= $secondaryClass ?> w-full">Ouvrir la médiathèque ↗</a>
    </aside>
    </fieldset>
</form>
<template id="gallery-item-template"><fieldset data-gallery-item class="rounded-lg border border-line p-4"><legend class="px-2 text-caption font-semibold">Image</legend><?php imageFields('new', [], [], false, 'images', false); ?></fieldset></template>
<?php editorialPreview($product,$catalog,'product'); require __DIR__ . '/media-dialog.php'; ?>
<script src="/media-picker.js" defer></script>
<?php if ($saved): ?>
<section class="mt-8 flex flex-wrap items-center gap-3 rounded-xl border border-line bg-ivory p-6">
    <p class="mr-auto text-sm text-ink/65"><?= $online ? 'Retirer l’article le fait disparaître du site à la prochaine publication. Sa fiche et ses photos sont conservées ici.' : 'Cet article n’est pas en boutique. Le supprimer efface sa fiche définitivement.' ?></p>
    <?php if ($online) confirmForm('switch_product', ['id' => $product['id'], 'version'=>$product['version'], 'status' => 'draft'], 'Retirer de la boutique ?', 'L’article « ' . $product['name'] . ' » ne figurera plus dans la collection du site. Sa fiche reste disponible ici.', 'Retirer de la boutique', $dangerClass);
    else confirmForm('delete_product', ['id' => $product['id'], 'version'=>$product['version']], 'Supprimer cet article ?', 'La fiche de « ' . $product['name'] . ' » sera définitivement supprimée. Ses photos restent dans la médiathèque.', 'Supprimer l’article', $dangerClass); ?>
</section>
<?php endif; ?>
