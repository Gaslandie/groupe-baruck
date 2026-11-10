<?php namespace Baruck;
$pageInputClass = 'mt-2 w-full min-w-0 rounded-lg border border-line bg-ivory px-4 py-3 text-body focus:border-accent';
require __DIR__ . '/page-fields.php';
$pageCatalog = array_column(mediaCatalog(), null, 'path');
?>
<a href="<?= e(url('pages')) ?>" class="mb-6 inline-block text-small underline underline-offset-4">Toutes les pages</a>
<p class="mb-6 max-w-[760px] text-body leading-relaxed text-ink/70">Enregistrez vos modifications, puis relisez les deux langues avant de valider. Une modification française remet l’anglais à relire. La version validée est conservée pendant votre travail.</p>
<details class="mb-6 rounded-lg border border-line bg-ivory p-4"><summary class="cursor-pointer text-small font-bold">Choisir une section · <?= e($pageSection['label']) ?></summary><nav aria-label="Sections de la page" class="mt-4 flex flex-wrap gap-2">
<?php foreach ($pageModel['sections'] as $candidate): ?><a href="<?= e(url('page_edit', ['id'=>$pageId,'section'=>$candidate['id']])) ?>" <?= $candidate['id'] === $pageSection['id'] ? 'aria-current="page"' : '' ?> class="rounded-lg border border-line px-4 py-3 text-small <?= $candidate['id'] === $pageSection['id'] ? 'bg-ink text-ivory' : 'bg-ivory' ?>"><?= e($candidate['label']) ?></a><?php endforeach; ?>
</nav></details>
<?php if ($pageId === 'home'): ?><p class="mb-6 text-small text-ink/65">Le nom du dirigeant et ses portraits se modifient dans Pages, puis Le Groupe. Les activités ci-dessous sont aussi reprises sur la page Groupe.</p><?php elseif ($pageId === 'groupe'): ?><p class="mb-6 text-small text-ink/65">La présentation et les cartes d’activité partagées se modifient dans Pages, puis Accueil. Les éditions JECA et les repères Espoir de Vie se modifient dans leurs pages.</p><?php elseif ($pageId === 'jeca'): ?><p class="mb-6 text-small text-ink/65">Le nom du président se modifie dans Le Groupe. Les éditions, leur menu et les galeries de la Médiathèque utilisent cette liste unique.</p><?php elseif ($pageId === 'espoir-de-vie'): ?><p class="mb-6 text-small text-ink/65">Les photos partagées servent aussi sur l’accueil et le Groupe. Dans une action, choisissez la photo correspondante. Les dates inconnues restent vides.</p><?php elseif (in_array($pageId, ['studio-photo','hotesses-evenementielles','marque-baruck'], true)): ?><p class="mb-6 text-small text-ink/65">La photo d’ouverture partagée se modifie dans Pages, puis Accueil. Les coordonnées gardent leur rubrique unique. Les articles de la marque et leurs photos se modifient dans Boutique.</p><?php elseif ($pageId === 'actualites'): ?><p class="mb-6 text-small text-ink/65">Les textes de cette page et les libellés des articles se modifient ici. Les articles, leurs photos, leurs groupes et leurs vidéos restent dans Actualités.</p><?php elseif ($pageId === 'mediatheque'): ?><p class="mb-6 text-small text-ink/65">Les galeries viennent automatiquement de JECA, Espoir de Vie et Studio photo. Modifiez leurs photos et leur ordre dans la page d’origine.</p><?php elseif ($pageId === 'contact'): ?><p class="mb-6 text-small text-ink/65">Les adresses, numéros, horaires et réseaux se modifient dans Coordonnées. Les repères entre accolades les reprennent automatiquement dans les réponses.</p><?php elseif ($pageId === 'projets-realisations'): ?><p class="mb-6 text-small text-ink/65">Cette page conserve son état en construction. Aucun projet n’est ajouté tant que le client n’a pas fourni ses contenus.</p><?php elseif ($pageId === 'mentions-legales'): ?><p class="mb-6 text-small text-ink/65">Les textes légaux actuels sont repris sans ajout d’informations. Les coordonnées et les crédits des photos gardent leurs sources existantes.</p><?php endif; ?>
<div class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <form method="post" id="page-draft-form" data-page-editor data-unrecorded="<?= $pagePosted ? 'true' : 'false' ?>" class="min-w-0 space-y-6">
        <?= csrfField() ?><input type="hidden" name="action" value="save_page"><input type="hidden" name="id" value="<?= e($pageId) ?>"><input type="hidden" name="version" value="<?= (int) $version ?>">
        <input type="hidden" name="section" value="<?= e($pageSection['id']) ?>">
        <?php foreach ([$pageSection] as $sectionIndex => $section): ?>
        <section id="section-<?= (int) $sectionIndex ?>" class="min-w-0 rounded-xl border border-line bg-ivory p-5 tablet:p-6">
            <h2 class="font-display text-title"><?= e($section['label']) ?></h2>
            <p class="mt-2 text-caption leading-relaxed text-ink/60"><?= e($section['help']) ?></p>
            <div class="mt-5 space-y-5">
            <?php foreach ($section['fields'] as $key) pageField($pageModel['fields'][$key], $pageValues[$key] ?? null, 'fields[' . $key . ']'); ?>
            </div>
        </section>
        <?php endforeach; ?>
        <button class="<?= $buttonClass ?>" type="submit">Enregistrer le brouillon</button>
    </form>
    <datalist id="page-known-links"><?php foreach (seed()['pageLinkTargets'] as $target): ?><option value="<?= e($target) ?>"></option><?php if (str_starts_with($target, $pageModel['route'] . '#')): ?><option value="<?= e(substr($target, strlen($pageModel['route']))) ?>"></option><?php endif; ?><?php endforeach; ?></datalist>
    <aside class="space-y-5 self-start wide:sticky wide:top-6">
        <section class="space-y-4 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-title">Préparation</h2>
            <p class="text-small leading-relaxed text-ink/70"><?= pagePending($pageState) || $pagePosted ? 'Des modifications attendent une relecture.' : ($pageState['validated_at'] ? 'Les deux versions enregistrées sont validées.' : 'Les contenus actuels du site sont conservés.') ?></p>
            <button type="submit" form="page-draft-form" class="<?= $buttonClass ?> w-full">Enregistrer le brouillon</button>
            <p id="page-unsaved" role="status" <?= $pagePosted ? '' : 'hidden' ?> class="text-caption leading-relaxed text-accent">Enregistrez les modifications affichées avant de valider les deux langues.</p>
        </section>
        <form method="post" id="page-validate-form" class="space-y-4 rounded-xl border border-line bg-ivory p-6">
            <?= csrfField() ?><input type="hidden" name="action" value="validate_page"><input type="hidden" name="id" value="<?= e($pageId) ?>"><input type="hidden" name="version" value="<?= (int) $version ?>">
            <h2 class="font-display text-title">Relire et valider</h2>
            <p class="text-small leading-relaxed text-ink/70">Cette action valide les contenus enregistrés de toutes les sections. Les champs français et anglais doivent être complets.</p>
            <label class="flex items-start gap-3 text-small leading-relaxed"><input type="checkbox" name="english_reviewed" value="yes" required class="mt-1"><span>J’ai relu le français et l’anglais dans toutes les sections. Les deux versions disent la même chose.</span></label>
            <button type="submit" data-page-validate <?= $pagePosted ? 'disabled' : '' ?> class="<?= $secondaryClass ?> w-full disabled:opacity-50">Valider les deux versions</button>
            <p class="text-caption leading-relaxed text-ink/60">La mise en ligne se lance ensuite depuis la rubrique Publication.</p>
        </form>
        <?php if (pagePending($pageState)): ?>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="mb-4 font-display text-title">Reprendre</h2>
            <?php confirmForm('restore_page', ['id' => $pageId, 'version' => $version, 'section' => $pageSection['id']], 'Reprendre la version conservée ?', 'Le brouillon sera remplacé par la dernière version validée, ou par les contenus initiaux si aucune version n’a encore été validée.', 'Reprendre la version conservée', $secondaryClass); ?>
        </section>
        <?php endif; ?>
    </aside>
</div>
<?php require __DIR__ . '/media-dialog.php'; ?>
<script src="/pages.js" defer></script><script src="/media-picker.js" defer></script>
