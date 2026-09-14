<?php namespace Baruck; ?>
<form method="post" class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <?= csrfField() ?><input type="hidden" name="action" value="save_textes"><input type="hidden" name="version" value="<?= (int) $version ?>">
    <div class="min-w-0 space-y-6">
        <?php foreach (textGroups() as $group => [$label, $help, $titleMax, $textMax]): ?>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl"><?= e($label) ?></h2>
            <p class="mt-2 text-caption text-ink/60"><?= e($help) ?> Titre : <?= (int) $titleMax ?> caractères au maximum. Texte : <?= (int) $textMax ?> caractères au maximum.</p>
            <div class="mt-5 space-y-5">
                <?php foreach ($textes[$group] as $key => $entry): $id = e($group . '-' . $key); ?>
                <fieldset class="space-y-4 rounded-lg border border-line p-4">
                    <legend class="px-2 text-caption font-semibold"><?= e($entry['title'] !== '' ? $entry['title'] : $key) ?></legend>
                    <div>
                        <label for="<?= $id ?>-title" class="text-sm font-medium">Titre</label>
                        <input class="<?= $inputClass ?>" id="<?= $id ?>-title" name="<?= e($group) ?>[<?= e($key) ?>][title]" value="<?= e($entry['title'] ?? '') ?>" required maxlength="<?= (int) $titleMax ?>">
                    </div>
                    <div>
                        <label for="<?= $id ?>-text" class="text-sm font-medium">Texte</label>
                        <textarea class="<?= $inputClass ?>" id="<?= $id ?>-text" name="<?= e($group) ?>[<?= e($key) ?>][description]" rows="3" required maxlength="<?= (int) $textMax ?>"><?= e($entry['description'] ?? '') ?></textarea>
                        <p class="mt-2 text-caption text-ink/60">Longueur actuelle : <?= mb_strlen($entry['description'] ?? '', 'UTF-8') ?> caractères.</p>
                    </div>
                </fieldset>
                <?php endforeach; ?>
            </div>
        </section>
        <?php endforeach; ?>
    </div>

    <aside class="space-y-5 self-start wide:sticky wide:top-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Enregistrer</h2>
            <p class="text-sm leading-relaxed text-ink/65">Ces textes sont ceux de la page d’accueil. Ils partiront sur le site avec la prochaine publication.</p>
            <button class="<?= $buttonClass ?> w-full">Enregistrer les textes</button>
        </section>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-title">Bon à savoir</h2>
            <p class="mt-3 text-caption leading-relaxed text-ink/70">Les longueurs maximales protègent la mise en page : un texte plus long déborderait de son encadré. Les images, les couleurs et les boutons de ces blocs restent du ressort de votre prestataire.</p>
        </section>
    </aside>
</form>
