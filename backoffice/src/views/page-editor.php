<?php namespace Baruck;
$pageInputClass = 'mt-2 w-full min-w-0 rounded-lg border border-line bg-ivory px-4 py-3 text-body focus:border-accent';
?>
<a href="<?= e(url('pages')) ?>" class="mb-6 inline-block text-small underline underline-offset-4">Toutes les pages</a>
<p class="mb-6 max-w-[760px] text-body leading-relaxed text-ink/70">Enregistrez vos modifications, puis relisez les deux langues avant de valider. Une modification française remet l’anglais à relire. La version validée est conservée pendant votre travail.</p>
<div class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <form method="post" id="page-draft-form" data-page-editor data-unrecorded="<?= $pagePosted ? 'true' : 'false' ?>" class="min-w-0 space-y-6">
        <?= csrfField() ?><input type="hidden" name="action" value="save_page"><input type="hidden" name="id" value="<?= e($pageId) ?>"><input type="hidden" name="version" value="<?= (int) $version ?>">
        <?php foreach ($pageModel['sections'] as $sectionIndex => $section): ?>
        <section id="section-<?= (int) $sectionIndex ?>" class="min-w-0 rounded-xl border border-line bg-ivory p-5 tablet:p-6">
            <h2 class="font-display text-title"><?= e($section['label']) ?></h2>
            <p class="mt-2 text-caption leading-relaxed text-ink/60"><?= e($section['help']) ?></p>
            <div class="mt-5 space-y-5">
            <?php foreach ($section['fields'] as $key): $field = $pageModel['fields'][$key]; ?>
                <fieldset class="min-w-0">
                    <legend class="text-small font-bold"><?= e($field['label']) ?> <span class="font-normal text-ink/60">· <?= (int) $field['max'] ?> caractères maximum</span></legend>
                    <div class="mt-3 grid min-w-0 gap-4 tablet:grid-cols-2">
                    <?php foreach (['fr' => 'Français', 'en' => 'Anglais'] as $language => $label): $control = 'page-' . str_replace('.', '-', $key) . '-' . $language; ?>
                        <div class="min-w-0">
                            <label for="<?= e($control) ?>" class="text-small"><?= e($label) ?></label>
                            <?php if ($field['kind'] === 'textarea'): ?>
                            <textarea id="<?= e($control) ?>" name="fields[<?= e($key) ?>][<?= e($language) ?>]" lang="<?= e($language) ?>" rows="4" maxlength="<?= (int) $field['max'] ?>" class="<?= $pageInputClass ?>"><?= e($pageValues[$key][$language]) ?></textarea>
                            <?php else: ?>
                            <input id="<?= e($control) ?>" name="fields[<?= e($key) ?>][<?= e($language) ?>]" lang="<?= e($language) ?>" value="<?= e($pageValues[$key][$language]) ?>" maxlength="<?= (int) $field['max'] ?>" class="<?= $pageInputClass ?>">
                            <?php endif; ?>
                        </div>
                    <?php endforeach; ?>
                    </div>
                </fieldset>
            <?php endforeach; ?>
            </div>
        </section>
        <?php endforeach; ?>
        <button class="<?= $buttonClass ?>" type="submit">Enregistrer le brouillon</button>
    </form>
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
            <p class="text-small leading-relaxed text-ink/70">Cette action valide les textes déjà enregistrés. Les champs français et anglais doivent être complets.</p>
            <label class="flex items-start gap-3 text-small leading-relaxed"><input type="checkbox" name="english_reviewed" value="yes" required class="mt-1"><span>J’ai relu le français et l’anglais. Les deux versions disent la même chose.</span></label>
            <button type="submit" data-page-validate <?= $pagePosted ? 'disabled' : '' ?> class="<?= $secondaryClass ?> w-full disabled:opacity-50">Valider les deux versions</button>
            <p class="text-caption leading-relaxed text-ink/60">La mise en ligne se lance ensuite depuis la rubrique Publication.</p>
        </form>
        <?php if (pagePending($pageState)): ?>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="mb-4 font-display text-title">Reprendre</h2>
            <?php confirmForm('restore_page', ['id' => $pageId, 'version' => $version], 'Reprendre la version conservée ?', 'Le brouillon sera remplacé par la dernière version validée, ou par les contenus initiaux si aucune version n’a encore été validée.', 'Reprendre la version conservée', $secondaryClass); ?>
        </section>
        <?php endif; ?>
    </aside>
</div>
<script src="/pages.js" defer></script>
