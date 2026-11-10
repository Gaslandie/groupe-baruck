<?php namespace Baruck; ?>
<p class="mb-6 max-w-[760px] text-body leading-relaxed text-ink/70">Préparez vos textes en français et en anglais. Enregistrer un brouillon garde la dernière version validée. Seule une version validée sera prise en compte lors de la prochaine publication.</p>
<p class="mb-6 max-w-[760px] text-small leading-relaxed text-ink/60">Toutes les pages se modifient section par section : textes, photos, liens et listes. Les textes communs sont dans Accueil. Projets conserve sa page en construction. Les actualités et les articles de la marque gardent leurs rubriques dédiées.</p>
<div class="grid gap-4 tablet:grid-cols-2 wide:grid-cols-3">
<?php foreach (pageModels() as $id => $model): $state = pageState($id); $pending = pagePending($state); ?>
    <article class="flex min-w-0 flex-col items-start rounded-xl border border-line bg-ivory p-6">
        <h2 class="font-display text-title"><?= e($model['label']) ?></h2>
        <p class="mt-2 break-words text-caption text-ink/60"><?= e($model['route']) ?></p>
        <p class="mt-4 text-small <?= $pending ? 'text-accent' : 'text-ink/70' ?>"><?= $pending ? 'Brouillon à relire' : ($state['validated_at'] ? 'Version validée' : 'Contenus actuels du site') ?></p>
        <p class="mt-2 text-caption text-ink/60"><?= count($model['sections']) ?> rubriques à modifier</p>
        <a href="<?= e(url('page_edit', ['id' => $id])) ?>" class="<?= $secondaryClass ?> mt-5">Modifier cette page</a>
    </article>
<?php endforeach; ?>
</div>
