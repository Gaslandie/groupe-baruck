<?php namespace Baruck;
// Deux lignes vides s’ajoutent toujours : ajouter et retirer se font sans JavaScript.
$rows = function (array $saved, int $extra = 2): array {
    return [...$saved, ...array_fill(0, $extra, [])];
};
?>
<form method="post" class="grid min-w-0 gap-6 wide:grid-cols-[minmax(0,1fr)_300px]">
    <?= csrfField() ?><input type="hidden" name="action" value="save_coordonnees"><input type="hidden" name="version" value="<?= (int) $version ?>">
    <div class="min-w-0 space-y-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Téléphones et e-mail</h2>
            <p class="text-caption text-ink/60">Les liens du site — appel, WhatsApp, e-mail — se construisent tout seuls à partir de ces valeurs. Les numéros commencent par l’indicatif du pays.</p>
            <?php foreach (contactLines() as $key => [$label, $type]): ?>
                <div><?php field($label, 'contacts[' . $key . ']', $coordonnees['contacts'][$key] ?? '', $type === 'email' ? 'email' : 'tel', 'required maxlength="40"' . ($type === 'phone' ? ' inputmode="tel" placeholder="+224 623 72 04 27"' : '')); ?></div>
            <?php endforeach; ?>
        </section>

        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Siège</h2>
            <div><label for="address" class="text-sm font-medium">Adresse affichée</label><textarea id="address" name="address" rows="2" maxlength="300" required class="<?= $inputClass ?>"><?= e($coordonnees['address'] ?? '') ?></textarea></div>
            <div><?php field('Lieu recherché sur la carte', 'mapQuery', $coordonnees['mapQuery'] ?? '', 'text', 'required maxlength="200"'); ?><p class="mt-2 text-caption text-ink/60">Ce que vous écririez dans Google Maps, par exemple « Kobayah, Conakry, Guinée ». La carte de la page Contact suit cette valeur.</p></div>
        </section>

        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Horaires du siège</h2>
            <p class="mt-2 text-caption text-ink/60">Videz une ligne pour la retirer. Sept lignes au maximum.</p>
            <div class="mt-5 space-y-4">
                <?php foreach ($rows($coordonnees['hours'] ?? []) as $index => $row): ?>
                <fieldset class="grid gap-4 rounded-lg border border-line p-4 tablet:grid-cols-2">
                    <legend class="px-2 text-caption font-semibold">Ligne <?= (int) $index + 1 ?></legend>
                    <div><?php field('Jours', 'hours[' . $index . '][days]', $row['days'] ?? '', 'text', 'maxlength="60" placeholder="Lundi – Samedi"'); ?></div>
                    <div><?php field('Horaires', 'hours[' . $index . '][hours]', $row['hours'] ?? '', 'text', 'maxlength="60" placeholder="8h – 17h"'); ?></div>
                </fieldset>
                <?php endforeach; ?>
            </div>
        </section>

        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Pages Facebook</h2>
            <p class="mt-2 text-caption text-ink/60">Une page par pays. Videz une ligne pour la retirer. Dix lignes au maximum.</p>
            <div class="mt-5 space-y-4">
                <?php foreach ($rows($coordonnees['facebookPages'] ?? []) as $index => $row): ?>
                <fieldset class="grid gap-4 rounded-lg border border-line p-4 tablet:grid-cols-[220px_minmax(0,1fr)]">
                    <legend class="px-2 text-caption font-semibold">Page <?= (int) $index + 1 ?></legend>
                    <div><?php field('Pays', 'facebook[' . $index . '][country]', $row['country'] ?? '', 'text', 'maxlength="60" placeholder="Guinée"'); ?></div>
                    <div><?php field('Lien de la page', 'facebook[' . $index . '][href]', $row['href'] ?? '', 'url', 'maxlength="300" placeholder="https://www.facebook.com/…"'); ?></div>
                </fieldset>
                <?php endforeach; ?>
            </div>
        </section>
    </div>

    <aside class="space-y-5 self-start wide:sticky wide:top-6">
        <section class="space-y-5 rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-2xl">Enregistrer</h2>
            <p class="text-sm leading-relaxed text-ink/65">Ces coordonnées apparaissent dans le menu, le pied de page, la page Contact et l’assistant. Elles partiront sur le site avec la prochaine publication.</p>
            <button class="<?= $buttonClass ?> w-full">Enregistrer les coordonnées</button>
        </section>
        <section class="rounded-xl border border-line bg-ivory p-6">
            <h2 class="font-display text-title">Liens obtenus</h2>
            <ul class="mt-4 space-y-3 text-caption text-ink/70">
                <li>Appel : <span class="break-all"><?= e('tel:' . preg_replace('/[^0-9+]/', '', $coordonnees['contacts']['landline'] ?? '')) ?></span></li>
                <li>WhatsApp : <span class="break-all"><?= e('https://wa.me/' . preg_replace('/[^0-9]/', '', $coordonnees['contacts']['whatsappHq'] ?? '')) ?></span></li>
                <li>E-mail : <span class="break-all"><?= e('mailto:' . ($coordonnees['contacts']['email'] ?? '')) ?></span></li>
            </ul>
            <p class="mt-4 text-caption text-ink/60">Vérifiez le numéro WhatsApp : c’est lui qui reçoit les commandes de la boutique.</p>
        </section>
    </aside>
</form>
