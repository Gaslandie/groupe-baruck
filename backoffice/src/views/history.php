<?php namespace Baruck;
$revisions = query('SELECT r.id,r.version,r.payload,r.action,r.created_at,u.name FROM article_revisions r LEFT JOIN users u ON u.id=r.user_id WHERE r.article_id=? ORDER BY r.version DESC LIMIT 50', [$article['id']])->fetchAll();
?>
<a href="<?= e(url('edit', ['id' => $article['id']])) ?>" class="mb-6 inline-block text-sm underline underline-offset-4">← Retour à l’actualité</a>
<h2 class="font-display text-2xl"><?= e($article['title']) ?></h2>
<p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">Restaurer crée un nouveau brouillon. La version validée et les autres versions sont conservées. Les 50 versions les plus récentes sont affichées.</p>
<ol class="mt-7 space-y-4">
<?php foreach ($revisions as $revision): $data = json_decode($revision['payload'], true, 512, JSON_THROW_ON_ERROR); ?>
    <li class="rounded-xl border border-line bg-ivory p-6">
        <div class="flex flex-wrap items-center justify-between gap-3">
            <h3 class="text-sm font-semibold">Version <?= (int) $revision['version'] ?> · <?= e($revision['action']) ?></h3>
            <?php if ($publication && (int) $publication['version'] === (int) $revision['version']): ?><span class="rounded-full bg-paper px-3 py-1 text-xs">Retenue pour publication</span><?php endif; ?>
        </div>
        <p class="mt-2 text-xs text-ink/60"><?= e($revision['name'] ?? 'Import initial') ?> · <?= e(str_replace(['T', 'Z'], [' ', ' UTC'], $revision['created_at'])) ?></p>
        <details class="mt-4">
            <summary class="cursor-pointer text-sm underline underline-offset-4">Consulter cette version</summary>
            <dl class="mt-4 space-y-2 text-sm"><dt class="font-semibold">Titre</dt><dd><?= e($data['title']) ?></dd><dt class="font-semibold">Résumé</dt><dd><?= e($data['excerpt']) ?></dd><dt class="font-semibold">Catégorie et date</dt><dd><?= e(categories()[$data['category']]) ?> · <?= e($data['date']) ?></dd></dl>
            <pre class="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap break-words rounded-lg bg-paper p-4 text-sm font-sans"><?= e($data['body']) ?></pre>
            <p class="mt-3 text-xs text-ink/60"><?= count($data['gallery']) ?> image(s) de galerie<?= $data['cover'] !== '' ? ' · Couverture : ' . e($data['cover_alt']) : '' ?></p>
        </details>
        <?php if ((int) $revision['version'] !== (int) $article['version']): ?>
        <form method="post" class="mt-5">
            <?= csrfField() ?><input type="hidden" name="action" value="restore_revision"><input type="hidden" name="id" value="<?= e($article['id']) ?>"><input type="hidden" name="version" value="<?= (int) $article['version'] ?>"><input type="hidden" name="revision" value="<?= e($revision['id']) ?>">
            <button class="<?= $secondaryClass ?>">Restaurer en brouillon</button>
        </form>
        <?php endif; ?>
    </li>
<?php endforeach; ?>
</ol>
