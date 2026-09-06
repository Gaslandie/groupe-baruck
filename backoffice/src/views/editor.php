<?php namespace Baruck;
$gallery = is_array($article['gallery'] ?? null) ? $article['gallery'] : [];
?>
<a href="<?= e(url('articles')) ?>" class="mb-6 inline-block text-sm underline underline-offset-4">← Toutes les actualités</a>
<?php if ($publication): ?><p class="mb-6 rounded-lg bg-paper-deep p-4 text-sm">La version <?= (int) $publication['version'] ?> reste retenue pour la prochaine publication. Vous pouvez préparer un brouillon sans la remplacer.</p><?php endif; ?>
<form method="post" id="article-form">
    <?= csrfField() ?><input type="hidden" name="action" value="save_article"><input type="hidden" name="id" value="<?= e($article['id'] ?? '') ?>"><input type="hidden" name="version" value="<?= e($article['version'] ?? 0) ?>">
    <fieldset class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <div class="min-w-0 space-y-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <div><?php field('Titre de l’actualité', 'title', $article['title'] ?? '', 'text', 'required maxlength="240"'); ?></div>
            <div><?php field('Adresse de l’article', 'slug', $article['slug'] ?? '', 'text', 'required maxlength="180" pattern="[a-z0-9]+(-[a-z0-9]+)*" ' . (!empty($article['id']) ? 'readonly' : '')); ?><p class="mt-2 text-xs leading-relaxed text-ink/60">Minuscules, chiffres et tirets. Cette adresse reste fixe après le premier enregistrement.</p></div>
            <div><label for="excerpt" class="text-sm font-medium">Résumé</label><textarea id="excerpt" name="excerpt" rows="3" maxlength="2000" class="<?= $inputClass ?>"><?= e($article['excerpt'] ?? '') ?></textarea></div>
            <div><label for="body" class="text-sm font-medium">Contenu</label><p id="body-help" class="mt-2 text-xs leading-relaxed text-ink/60">Markdown : ## pour un intertitre, **texte** pour le gras, - pour une liste, [texte](/contact/) pour un lien.</p><textarea id="body" name="body" rows="20" maxlength="200000" aria-describedby="body-help" class="<?= $inputClass ?> leading-relaxed"><?= e($article['body'] ?? '') ?></textarea></div>
        </section>
        <?php require __DIR__ . '/article-media.php'; ?>
    </div>
    <aside class="space-y-5 self-start wide:sticky wide:top-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Préparation</h2>
            <div><label for="category" class="text-sm font-medium">Catégorie</label><select name="category" id="category" class="<?= $inputClass ?>"><?php foreach (categories() as $key => $label): ?><option value="<?= e($key) ?>" <?= ($article['category'] ?? '') === $key ? 'selected' : '' ?>><?= e($label) ?></option><?php endforeach; ?></select></div>
            <div><?php field('Date de l’actualité', 'date', $article['date'] ?? '', 'date'); ?></div>
            <p class="text-xs leading-relaxed text-ink/60">La date décrit l’actualité. Elle ne programme pas sa mise en ligne.</p>
            <button type="submit" name="status" value="draft" class="<?= $secondaryClass ?> w-full">Enregistrer le brouillon</button>
            <?php if ($user['role'] === 'admin'): ?><button type="submit" name="status" value="ready" class="<?= $buttonClass ?> w-full">Valider cette version</button><?php endif; ?>
            <p class="text-xs leading-relaxed text-ink/60">Seule la validation remplace la version retenue pour la prochaine publication.</p>
        </section>
        <?php if (!empty($article['id'])): ?><a href="<?= e(url('history', ['id' => $article['id']])) ?>" class="<?= $secondaryClass ?> w-full">Historique et restauration</a><?php endif; ?>
        <a href="<?= e(url('media')) ?>" target="_blank" rel="noreferrer" class="<?= $secondaryClass ?> w-full">Ouvrir la médiathèque ↗</a>
    </aside>
    </fieldset>

</form>
<?php require __DIR__ . '/media-dialog.php'; ?>
<script src="/media-picker.js" defer></script>
<?php if ($publication && $user['role'] === 'admin'): ?>
<details class="mt-8 rounded-xl border border-line bg-ivory p-6">
    <summary class="cursor-pointer text-sm font-semibold">Retirer cet article de la prochaine publication</summary>
    <p class="mt-4 max-w-2xl text-sm leading-relaxed text-ink/65">Le prochain export exclura cet article. Le brouillon et toutes ses versions resteront disponibles. Cette action ne modifie pas un site déjà en ligne.</p>
    <form method="post" class="mt-5 space-y-4">
        <?= csrfField() ?><input type="hidden" name="action" value="withdraw_publication"><input type="hidden" name="id" value="<?= e($article['id']) ?>"><input type="hidden" name="version" value="<?= e($article['version']) ?>">
        <label class="flex items-center gap-3 text-sm"><input type="checkbox" name="confirm_withdraw" value="yes" required>Je confirme le retrait de la prochaine publication.</label>
        <button class="<?= $secondaryClass ?>">Confirmer le retrait</button>
    </form>
</details>
<?php endif; ?>
