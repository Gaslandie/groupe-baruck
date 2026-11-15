<?php namespace Baruck;
$today = gmdate('Y-m-d');
$days = (int) filter_var($_GET['days'] ?? 30, FILTER_VALIDATE_INT);
$audience = audienceSummary($days, $today);
$editorial = editorialSummary($today);
$advice = insights($audience, $editorial, $user['role'] === 'admin');
$deviceTotal = array_sum($audience['devices']);
$sourceTotal = array_sum(array_column($audience['sources'], 'visitors'));
$topViews = topValue(array_column($audience['pages'], 'views'));
$period = AUDIENCE_PERIODS[$audience['days']];
function statsTable(string $title, array $rows, string $unit, int $total, int $max, string $empty): void {
    global $cardClass;
    echo '<section class="' . $cardClass . ' p-6"><h2 class="font-display text-2xl">' . e($title) . '</h2>';
    if (!$rows) { echo '<p class="mt-4 text-sm text-ink/60">' . e($empty) . '</p></section>'; return; }
    echo '<table class="mt-4 w-full text-sm"><caption class="sr-only">' . e($title) . '</caption><thead class="sr-only"><tr><th scope="col">Libellé</th><th scope="col">' . e($unit) . '</th></tr></thead><tbody>';
    foreach ($rows as $row) {
        echo '<tr><td class="py-2 pr-4"><span class="block">' . e($row['label']) . '</span>' . shareBar((int) $row['value'], $max) . '</td><td class="whitespace-nowrap py-2 text-right tabular-nums">' . (int) $row['value'] . ' <span class="text-caption text-ink/60">' . percent((int) $row['value'], $total) . ' %</span></td></tr>';
    }
    echo '</tbody></table></section>';
}
?>
<div class="mb-6 flex flex-wrap items-center justify-between gap-4">
    <nav aria-label="Période" class="flex flex-wrap gap-2"><?php foreach (AUDIENCE_PERIODS as $value => $label): $current = $value === $audience['days']; ?><a href="<?= e(url('stats', ['days' => $value])) ?>" <?= $current ? 'aria-current="page"' : '' ?> class="rounded-lg border px-4 py-2 text-sm font-semibold <?= $current ? 'border-ink bg-ink text-ivory' : 'border-line hover:bg-paper-deep' ?>"><?= e($label) ?></a><?php endforeach; ?></nav>
    <form method="post"><?= csrfField() ?><input type="hidden" name="action" value="export_stats"><input type="hidden" name="days" value="<?= (int) $audience['days'] ?>"><button class="<?= $secondaryClass ?>">Télécharger en CSV</button></form>
</div>
<?php if (!$audience['active']): ?>
<section class="mb-8 <?= $cardClass ?> p-6"><h2 class="font-display text-2xl">Aucune page vue mesurée</h2><p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">Aucune page vue n’a encore été enregistrée. La mesure ne pose aucun cookie et ne conserve aucune adresse IP en clair.</p><?php if ($user['role'] === 'admin'): ?><p class="mt-3 max-w-2xl text-sm leading-relaxed text-ink/65">Pour l’activer, la personne qui construit le site renseigne l’adresse de collecte lors du build :</p><pre class="mt-3 overflow-x-auto rounded-lg bg-paper p-4 text-caption">NEXT_PUBLIC_AUDIENCE_URL=<?= e(config()['origin']) ?>/collect.php</pre><?php endif; ?></section>
<?php endif; ?>
<section class="mb-8"><h2 class="mb-4 font-display text-2xl">Ce que disent les chiffres</h2><?php adviceList($advice, 'Rien de particulier à signaler pour cette période.'); ?></section>
<div class="grid gap-4 tablet:grid-cols-2 wide:grid-cols-4">
    <?php kpi('Visiteurs · ' . $period, (string) $audience['visitors'], 'vs période précédente', delta($audience['visitors'], $audience['previousVisitors'])); ?>
    <?php kpi('Pages vues · ' . $period, (string) $audience['views'], 'vs période précédente', delta($audience['views'], $audience['previousViews'])); ?>
    <?php kpi('Pages par visiteur', $audience['visitors'] > 0 ? number_format($audience['views'] / $audience['visitors'], 1, ',', ' ') : '—', 'profondeur de visite'); ?>
    <?php kpi('Part du mobile', $deviceTotal > 0 ? percent($audience['devices']['mobile'] ?? 0, $deviceTotal) . ' %' : '—', 'des visiteurs'); ?>
</div>
<section class="mt-6 <?= $cardClass ?> p-6"><h2 class="font-display text-2xl">Visiteurs par <?= $audience['days'] > 90 ? 'mois' : 'jour' ?></h2><p class="mt-1 text-caption text-ink/60">Du <?= e(frenchDate($audience['start'], true)) ?> au <?= e(frenchDate($audience['end'], true)) ?>. Survolez une barre pour lire sa valeur.</p><div class="mt-4"><?= barChart($audience['series'], 'visitors', 'visiteurs') ?></div></section>
<section class="mt-6 <?= $cardClass ?> p-6" aria-labelledby="contacts-title">
    <h2 id="contacts-title" class="font-display text-title">Actions de contact · <?= e($period) ?></h2>
    <p class="mt-3 text-small">Un clic ne prouve pas un échange. Un formulaire accepté par le serveur ne prouve pas sa réception en boîte mail. Ces actions ne sont pas ajoutées aux visites.</p>
    <p class="mt-2 text-caption text-ink/60">L’activité correspond à la page du clic ou au sujet du formulaire. Les demandes qualifiées et réservations sont à suivre séparément par l’équipe. Ces compteurs publics peuvent contenir du bruit ; ils ne prouvent pas une origine SEO.</p>
    <?php $contacts = $audience['contacts']; $contactRows = array_filter($contacts['rows'], fn($row) => $row['current'] > 0 || $row['previous'] > 0); ?>
    <?php if (!$contacts['available']): ?>
        <p class="mt-4 text-small">Le suivi des contacts attend la mise à jour du stockage.</p>
    <?php elseif (!$contactRows): ?>
        <p class="mt-4 text-small">Aucune action mesurée sur ces périodes. Cela ne signifie pas qu’aucune demande n’a été reçue.</p>
    <?php else: ?>
        <p class="mt-3 text-caption">Période actuelle : <?= e(frenchDate($audience['start'], true)) ?> au <?= e(frenchDate($audience['end'], true)) ?>. Précédente : <?= e(frenchDate($contacts['previousStart'], true)) ?> au <?= e(frenchDate($contacts['previousEnd'], true)) ?>. Les périodes antérieures à l’activation ne sont pas renseignées.</p>
        <?php if (!$contacts['previousComplete']): ?><p class="mt-2 text-caption">La comparaison sur douze mois est indisponible : les événements sont conservés au maximum 365 jours.</p><?php endif; ?>
        <div class="mt-4 overflow-x-auto"><table class="w-full text-small">
            <caption class="sr-only">Actions de contact par activité et période</caption>
            <thead><tr><th scope="col" class="p-2 text-left">Activité / action</th><th scope="col" class="p-2 text-right">Actuelle</th><th scope="col" class="p-2 text-right">Précédente</th></tr></thead>
            <tbody class="divide-y divide-line"><?php foreach ($contactRows as $row): ?><tr>
                <th scope="row" class="p-2 text-left font-normal"><?= e($row['activity']) ?><span class="block text-caption text-ink/60"><?= e($row['action']) ?></span></th>
                <td class="p-2 text-right tabular-nums"><?= $row['current'] ?></td><td class="p-2 text-right tabular-nums"><?= $contacts['previousComplete'] ? $row['previous'] : '—' ?></td>
            </tr><?php endforeach; ?></tbody>
        </table></div>
    <?php endif; ?>
</section>
<div class="mt-6 grid gap-6 wide:grid-cols-2">
    <?php statsTable('Pages les plus vues', array_map(fn($row) => ['label' => $row['label'], 'value' => $row['views']], $audience['pages']), 'Vues', max(1, $audience['views']), $topViews, 'Aucune page vue sur cette période.'); ?>
    <?php statsTable('D’où viennent les visiteurs', array_map(fn($row) => ['label' => $row['label'], 'value' => $row['visitors']], $audience['sources']), 'Visiteurs', max(1, $sourceTotal), topValue(array_column($audience['sources'], 'visitors')), 'Aucune visite sur cette période.'); ?>
    <?php $deviceRows = []; foreach (deviceNames() as $key => $label) if (($audience['devices'][$key] ?? 0) > 0) $deviceRows[] = ['label' => $label, 'value' => $audience['devices'][$key]]; statsTable('Appareils utilisés', $deviceRows, 'Visiteurs', max(1, $deviceTotal), topValue(array_column($deviceRows, 'value')), 'Aucune visite sur cette période.'); ?>
    <?php $categoryRows = []; foreach (categories() as $key => $label) $categoryRows[] = ['label' => $label . ' · ' . $editorial['byCategory'][$key] . ' validée' . ($editorial['byCategory'][$key] > 1 ? 's' : ''), 'value' => $audience['categoryViews'][$key]]; usort($categoryRows, fn($first, $second) => $second['value'] <=> $first['value']); statsTable('Lectures d’articles par catégorie', $audience['articleViews'] > 0 ? $categoryRows : [], 'Vues', max(1, $audience['articleViews']), topValue(array_column($categoryRows, 'value')), 'Aucune lecture d’article mesurée sur cette période.'); ?>
</div>
<section class="mt-6 <?= $cardClass ?> p-6"><h2 class="font-display text-2xl">Rythme de publication</h2><p class="mt-1 text-caption text-ink/60">Actualités validées par mois de parution, douze derniers mois. <?= $editorial['validated'] ?> validée(s) au total.</p><div class="mt-4"><?= barChart($editorial['months'], 'value', 'actualités') ?></div></section>
<?php if ($user['role'] === 'admin'): ?>
<section class="mt-6 <?= $cardClass ?> p-6"><h2 class="font-display text-2xl">Activité de l’équipe · 30 jours</h2><?php if (!$editorial['team']): ?><p class="mt-4 text-sm text-ink/60">Aucune action enregistrée sur les trente derniers jours.</p><?php else: ?><table class="mt-4 w-full text-sm"><caption class="sr-only">Actions par membre</caption><thead class="text-xs text-ink/60"><tr><th scope="col" class="py-2 text-left">Membre</th><th scope="col" class="py-2 text-right">Actions</th><th scope="col" class="py-2 text-right">Dernière action</th></tr></thead><tbody class="divide-y divide-line"><?php foreach ($editorial['team'] as $member): ?><tr><td class="py-3"><?= e($member['name']) ?></td><td class="py-3 text-right tabular-nums"><?= (int) $member['actions'] ?></td><td class="whitespace-nowrap py-3 text-right"><?= e(frenchDate(substr($member['last_seen'], 0, 10), true)) ?></td></tr><?php endforeach; ?></tbody></table><?php endif; ?><p class="mt-4 text-caption text-ink/60">Médiathèque : <?= $editorial['mediaCount'] ?> image(s) importée(s), <?= $editorial['unusedMedia'] ?> non utilisée(s).</p></section>
<?php endif; ?>
