<?php
declare(strict_types=1);

namespace Baruck;

const AUDIENCE_PERIODS = [7 => '7 jours', 30 => '30 jours', 90 => '90 jours', 365 => '12 mois'];

/** Vues acceptées par visiteur et par jour : au-delà, la mesure cesse de croire ce qu’on lui envoie. */
const COLLECT_DAILY_LIMIT = 400;

function pageNames(): array
{
    return ['/' => 'Accueil', '/groupe/' => 'Le Groupe', '/actualites/' => 'Actualités', '/contact/' => 'Contact', '/jeca/' => 'JECA', '/espoir-de-vie/' => 'Espoir de Vie', '/studio-photo/' => 'Studio photo', '/hotesses-evenementielles/' => 'Hôtesses événementielles', '/mediatheque/' => 'Médiathèque', '/projets-realisations/' => 'Projets & réalisations', '/mentions-legales/' => 'Mentions légales', '/marque-baruck/' => 'La marque'];
}

function sourceNames(): array
{
    return ['' => 'Accès direct', 'facebook.com' => 'Facebook', 'instagram.com' => 'Instagram', 'google.com' => 'Google', 'linkedin.com' => 'LinkedIn', 't.co' => 'X (Twitter)', 'x.com' => 'X (Twitter)', 'whatsapp.com' => 'WhatsApp', 'youtube.com' => 'YouTube', 'tiktok.com' => 'TikTok', 'bing.com' => 'Bing', 'duckduckgo.com' => 'DuckDuckGo', 'yahoo.com' => 'Yahoo', 'autre' => 'Provenance inconnue'];
}

function sourceLabel(string $host): string
{
    if (isset(sourceNames()[$host])) return sourceNames()[$host];
    if (preg_match('~^google\.[a-z.]+$~', $host)) return 'Google';
    return $host;
}

function deviceNames(): array
{
    return ['mobile' => 'Mobile', 'tablette' => 'Tablette', 'ordinateur' => 'Ordinateur', 'inconnu' => 'Non précisé'];
}

/** Sel quotidien : l’empreinte visiteur change chaque jour, sans cookie ni adresse IP conservée. */
function visitorSalt(string $day): string
{
    $file = config()['storage'] . '/audience-secret';
    if (!is_file($file)) { file_put_contents($file, bin2hex(random_bytes(32)), LOCK_EX); chmod($file, 0600); }
    return hash('sha256', file_get_contents($file) . $day);
}

function isBot(string $agent): bool
{
    return $agent === '' || preg_match('~bot|crawl|spider|slurp|headless|lighthouse|preview|fetch|monitor|curl|wget|python|scan|validator~i', $agent) === 1;
}

function normalizePath(string $path): ?string
{
    $path = strtolower('/' . trim($path, '/'));
    if ($path !== '/') $path .= '/';
    return strlen($path) <= 255 && preg_match('~^/(?:[a-z0-9-]+/)*$~D', $path) ? $path : null;
}

/** Hôte de provenance normalisé : vide = accès direct, « interne » = navigation dans le site. */
function referrerHost(string $referrer, string $siteUrl): string
{
    $host = strtolower((string) parse_url(trim($referrer), PHP_URL_HOST));
    if ($host === '') return '';
    // Un nom d’hôte ne porte que lettres, chiffres, points et tirets, sur 120 caractères
    // au plus. Le reste vient d’une adresse forgée : la provenance est inconnue, pas un
    // accès direct, et rien qu’un tableur interpréterait n’est enregistré.
    if (!preg_match('~^[a-z0-9](?:[a-z0-9.-]{0,118}[a-z0-9])?$~D', $host)) return 'autre';
    $host = preg_replace('~^(?:www|m|l|lm|mobile)\.~', '', $host);
    $site = preg_replace('~^www\.~', '', strtolower((string) parse_url($siteUrl, PHP_URL_HOST)));
    return $host === $site ? 'interne' : $host;
}

function deviceFromWidth(int $width): string
{
    if ($width <= 0) return 'inconnu';
    return $width < 761 ? 'mobile' : ($width < 1051 ? 'tablette' : 'ordinateur');
}

function recordView(array $input, array $server, string $day, ?string $salt = null): bool
{
    $path = normalizePath(is_string($input['p'] ?? null) ? $input['p'] : '');
    $agent = is_string($server['HTTP_USER_AGENT'] ?? null) ? $server['HTTP_USER_AGENT'] : '';
    if ($path === null || isBot($agent)) return false;
    $referrer = referrerHost(is_string($input['r'] ?? null) ? $input['r'] : '', config()['site_url']);
    $device = deviceFromWidth((int) filter_var($input['w'] ?? 0, FILTER_VALIDATE_INT));
    $visitor = substr(hash('sha256', ($salt ?? visitorSalt($day)) . '|' . ($server['REMOTE_ADDR'] ?? '') . '|' . $agent), 0, 32);
    // Le point de collecte est public : l’en-tête Origin n’engage que les navigateurs.
    // Un plafond par visiteur et par jour empêche un envoi massif de fausser les chiffres.
    if ((int) query('SELECT COUNT(*) FROM page_views WHERE day=? AND visitor=?', [$day, $visitor])->fetchColumn() >= COLLECT_DAILY_LIMIT) return false;
    query('INSERT INTO page_views (id,day,path,referrer,device,visitor,created_at) VALUES (?,?,?,?,?,?,?)', [id(), $day, $path, $referrer, $device, $visitor, now()]);
    return true;
}

function shiftDay(string $day, int $days): string
{
    return (new \DateTimeImmutable($day . ' UTC'))->modify(($days >= 0 ? '+' : '') . $days . ' days')->format('Y-m-d');
}

function frenchDate(string $day, bool $withYear = false): string
{
    $months = ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];
    [$year, $month, $date] = array_map('intval', explode('-', substr($day, 0, 10) . '-01-01'));
    if (strlen($day) === 7) return $months[$month - 1] . ' ' . $year;
    return $date . ' ' . $months[$month - 1] . ($withYear ? ' ' . $year : '');
}

function percent(int|float $part, int|float $total): int
{
    return $total > 0 ? (int) round($part * 100 / $total) : 0;
}

function delta(int $current, int $previous): ?int
{
    return $previous > 0 ? (int) round(($current - $previous) * 100 / $previous) : null;
}

function audienceSummary(int $days, string $today): array
{
    $days = isset(AUDIENCE_PERIODS[$days]) ? $days : 30;
    $start = shiftDay($today, -($days - 1));
    $previous = [shiftDay($today, -(2 * $days - 1)), shiftDay($today, -$days)];
    $totals = fn(string $from, string $to): array => query('SELECT COUNT(*) AS views, COUNT(DISTINCT CONCAT(day,visitor)) AS visitors FROM page_views WHERE day BETWEEN ? AND ?', [$from, $to])->fetch();
    $current = array_map('intval', $totals($start, $today));
    $before = array_map('intval', $totals($previous[0], $previous[1]));
    $monthly = $days > 90;
    $rows = query('SELECT ' . ($monthly ? 'LEFT(day,7)' : 'day') . ' AS bucket, COUNT(*) AS views, COUNT(DISTINCT CONCAT(day,visitor)) AS visitors FROM page_views WHERE day BETWEEN ? AND ? GROUP BY bucket', [$start, $today])->fetchAll();
    $indexed = array_column($rows, null, 'bucket');
    $series = [];
    if ($monthly) {
        $month = new \DateTimeImmutable(substr($start, 0, 7) . '-01 UTC');
        for ($index = 0; $index < 12; $index++) {
            $key = $month->format('Y-m');
            $series[] = ['label' => frenchDate($key), 'views' => (int) ($indexed[$key]['views'] ?? 0), 'visitors' => (int) ($indexed[$key]['visitors'] ?? 0)];
            $month = $month->modify('+1 month');
        }
    } else {
        for ($index = 0; $index < $days; $index++) {
            $key = shiftDay($start, $index);
            $series[] = ['label' => frenchDate($key, true), 'views' => (int) ($indexed[$key]['views'] ?? 0), 'visitors' => (int) ($indexed[$key]['visitors'] ?? 0)];
        }
    }
    $pages = query('SELECT path, COUNT(*) AS views, COUNT(DISTINCT CONCAT(day,visitor)) AS visitors FROM page_views WHERE day BETWEEN ? AND ? GROUP BY path ORDER BY views DESC, path LIMIT 10', [$start, $today])->fetchAll();
    $titles = array_column(query('SELECT slug,title,category FROM articles')->fetchAll(), null, 'slug');
    foreach ($pages as &$row) {
        $row['views'] = (int) $row['views']; $row['visitors'] = (int) $row['visitors'];
        $row['label'] = pageNames()[$row['path']] ?? (preg_match('~^/actualites/([a-z0-9-]+)/$~', $row['path'], $match) && isset($titles[$match[1]]) ? $titles[$match[1]]['title'] : $row['path']);
    }
    unset($row);
    $sources = query("SELECT referrer, COUNT(DISTINCT CONCAT(day,visitor)) AS visitors FROM page_views WHERE day BETWEEN ? AND ? AND referrer <> 'interne' GROUP BY referrer ORDER BY visitors DESC, referrer LIMIT 8", [$start, $today])->fetchAll();
    foreach ($sources as &$row) { $row['visitors'] = (int) $row['visitors']; $row['label'] = sourceLabel($row['referrer']); }
    unset($row);
    $devices = [];
    foreach (query('SELECT device, COUNT(DISTINCT CONCAT(day,visitor)) AS visitors FROM page_views WHERE day BETWEEN ? AND ? GROUP BY device', [$start, $today])->fetchAll() as $row) $devices[$row['device']] = (int) $row['visitors'];
    $categories = array_fill_keys(array_keys(categories()), 0);
    $articleViews = 0;
    foreach (query("SELECT path, COUNT(*) AS views FROM page_views WHERE day BETWEEN ? AND ? AND path LIKE '/actualites/%/' GROUP BY path", [$start, $today])->fetchAll() as $row) {
        if (!preg_match('~^/actualites/([a-z0-9-]+)/$~', $row['path'], $match) || !isset($titles[$match[1]])) continue;
        $categories[$titles[$match[1]]['category']] += (int) $row['views'];
        $articleViews += (int) $row['views'];
    }
    $first = query('SELECT MIN(day) FROM page_views')->fetchColumn();
    return [
        'days' => $days, 'start' => $start, 'end' => $today, 'active' => $first !== null, 'since' => $first ?: '',
        'views' => $current['views'], 'visitors' => $current['visitors'],
        'previousViews' => $before['views'], 'previousVisitors' => $before['visitors'],
        'series' => $series, 'pages' => $pages, 'sources' => $sources, 'devices' => $devices,
        'categoryViews' => $categories, 'articleViews' => $articleViews,
    ];
}

function editorialSummary(string $today): array
{
    $counts = query("SELECT COUNT(*) AS total, SUM(p.article_id IS NULL) AS unpublished, SUM(p.article_id IS NOT NULL AND a.status='draft') AS revising, SUM(p.article_id IS NOT NULL) AS validated, SUM(p.article_id IS NOT NULL AND a.cover='') AS withoutCover FROM articles a LEFT JOIN article_publications p ON p.article_id=a.id")->fetch();
    $lastExport = query("SELECT MAX(created_at) FROM audit_log WHERE action='Publication préparée'")->fetchColumn() ?: '';
    $pendingExport = (int) query('SELECT COUNT(*) FROM article_publications WHERE validated_at > ?', [$lastExport])->fetchColumn();
    $withdrawn = $lastExport === '' ? 0 : (int) query("SELECT COUNT(*) FROM audit_log WHERE action='Retrait de la prochaine publication' AND created_at > ?", [$lastExport])->fetchColumn();
    $byCategory = array_fill_keys(array_keys(categories()), 0);
    foreach (query('SELECT a.category, COUNT(*) AS total FROM article_publications p JOIN articles a ON a.id=p.article_id GROUP BY a.category')->fetchAll() as $row) $byCategory[$row['category']] = (int) $row['total'];
    $months = [];
    $month = (new \DateTimeImmutable(substr($today, 0, 7) . '-01 UTC'))->modify('-11 months');
    $perMonth = array_column(query("SELECT LEFT(a.article_date,7) AS month, COUNT(*) AS total FROM article_publications p JOIN articles a ON a.id=p.article_id WHERE a.article_date <> '' GROUP BY month")->fetchAll(), 'total', 'month');
    for ($index = 0; $index < 12; $index++) {
        $key = $month->format('Y-m');
        $months[] = ['label' => frenchDate($key), 'value' => (int) ($perMonth[$key] ?? 0)];
        $month = $month->modify('+1 month');
    }
    $lastDate = query("SELECT MAX(a.article_date) FROM article_publications p JOIN articles a ON a.id=p.article_id WHERE a.article_date <> ''")->fetchColumn() ?: '';
    $staleDrafts = (int) query('SELECT COUNT(*) FROM articles a LEFT JOIN article_publications p ON p.article_id=a.id WHERE p.article_id IS NULL AND a.updated_at < ?', [shiftDay($today, -30) . 'T00:00:00Z'])->fetchColumn();
    $media = query('SELECT COUNT(*) AS total, COALESCE(SUM(bytes),0) AS bytes FROM media')->fetch();
    $unusedMedia = 0;
    foreach (mediaUsage() as $usage) if ($usage === 0) $unusedMedia++;
    $team = query('SELECT u.name, COUNT(*) AS actions, MAX(l.created_at) AS last_seen FROM audit_log l JOIN users u ON u.id=l.user_id WHERE l.created_at >= ? GROUP BY u.id, u.name ORDER BY actions DESC, u.name', [shiftDay($today, -30) . 'T00:00:00Z'])->fetchAll();
    return [
        'total' => (int) $counts['total'], 'unpublished' => (int) $counts['unpublished'], 'revising' => (int) $counts['revising'], 'validated' => (int) $counts['validated'], 'withoutCover' => (int) $counts['withoutCover'],
        'lastExport' => $lastExport, 'pendingExport' => $pendingExport, 'withdrawnSinceExport' => $withdrawn,
        'byCategory' => $byCategory, 'months' => $months, 'lastDate' => $lastDate,
        'daysSinceLast' => $lastDate === '' ? null : (int) (new \DateTimeImmutable($lastDate . ' UTC'))->diff(new \DateTimeImmutable($today . ' UTC'))->days,
        'staleDrafts' => $staleDrafts, 'mediaCount' => (int) $media['total'], 'mediaBytes' => (int) $media['bytes'], 'unusedMedia' => $unusedMedia, 'team' => $team,
    ];
}

/** Nombre de contenus (actualités et articles de boutique) qui utilisent chaque image importée. */
function mediaUsage(): array
{
    $usage = [];
    foreach (query('SELECT id,filename FROM media')->fetchAll() as $row) $usage[$row['id']] = ['path' => '/images/actualites/uploads/' . $row['filename'], 'count' => 0];
    $documents = [];
    foreach (query('SELECT id,cover,gallery FROM articles')->fetchAll() as $row) $documents[$row['id']] = $row['cover'] . ' ' . $row['gallery'];
    foreach (query('SELECT article_id,payload FROM article_publications')->fetchAll() as $row) $documents[$row['article_id']] = ($documents[$row['article_id']] ?? '') . ' ' . $row['payload'];
    foreach (query('SELECT id,images FROM products')->fetchAll() as $row) $documents['produit-' . $row['id']] = $row['images'];
    foreach ($usage as $id => $item) {
        foreach ($documents as $document) if (str_contains($document, $item['path'])) $usage[$id]['count']++;
    }
    return array_map(fn($item) => $item['count'], $usage);
}

/** Lectures des chiffres, en français simple, avec l’action à mener. Fonction pure, testée sans base. */
function insights(array $audience, array $editorial, bool $admin): array
{
    $items = [];
    $add = function (string $level, string $text, string $page = '', array $params = [], string $action = '') use (&$items) {
        $items[] = ['level' => $level, 'text' => $text, 'page' => $page, 'params' => $params, 'action' => $action];
    };
    if ($admin && $editorial['pendingExport'] + $editorial['withdrawnSinceExport'] > 0) {
        $count = $editorial['pendingExport'];
        $add('action', ($count > 0 ? $count . ' version' . ($count > 1 ? 's validées' : ' validée') : 'Un retrait') . ($editorial['lastExport'] === '' ? ' en attente de mise en ligne.' : ' depuis la dernière publication préparée.'), 'publication', [], 'Préparer la publication');
    }
    if ($admin && $editorial['unpublished'] + $editorial['revising'] > 0) {
        $count = $editorial['unpublished'] + $editorial['revising'];
        $add('action', $count . ' brouillon' . ($count > 1 ? 's attendent' : ' attend') . ' une validation.', 'articles', ['status' => 'draft'], 'Relire les brouillons');
    }
    if ($editorial['daysSinceLast'] !== null && $editorial['daysSinceLast'] > 45) {
        $add('action', 'Aucune nouvelle actualité depuis ' . $editorial['daysSinceLast'] . ' jours. Une actualité par mois garde le site vivant et visible.', 'edit', [], 'Rédiger une actualité');
    }
    if ($editorial['withoutCover'] > 0) {
        $add('action', $editorial['withoutCover'] . ' actualité' . ($editorial['withoutCover'] > 1 ? 's validées sont' : ' validée est') . ' sans image de couverture : elle' . ($editorial['withoutCover'] > 1 ? 's ressortent' : ' ressort') . ' moins sur l’accueil et les réseaux.', 'articles', ['status' => 'ready'], 'Ajouter des couvertures');
    }
    if ($audience['active'] && $audience['visitors'] + $audience['previousVisitors'] > 0) {
        $change = delta($audience['visitors'], $audience['previousVisitors']);
        $period = AUDIENCE_PERIODS[$audience['days']];
        if ($change !== null && $change >= 20) $add('good', 'Fréquentation en hausse de ' . $change . ' % sur ' . $period . ' par rapport à la période précédente.', 'stats');
        elseif ($change !== null && $change <= -20) $add('info', 'Fréquentation en baisse de ' . abs($change) . ' % sur ' . $period . '. Une nouvelle actualité partagée sur les réseaux relance les visites.', 'edit', [], 'Rédiger une actualité');
        $mobile = percent($audience['devices']['mobile'] ?? 0, array_sum($audience['devices']));
        if ($mobile >= 50) $add('info', $mobile . ' % des visiteurs viennent d’un mobile : privilégiez des photos légères et des paragraphes courts.');
        $sourceTotal = array_sum(array_column($audience['sources'], 'visitors'));
        $top = $audience['sources'][0] ?? null;
        if ($top && $sourceTotal > 0 && $top['referrer'] !== '' && percent($top['visitors'], $sourceTotal) >= 30) {
            $add('good', $top['label'] . ' apporte ' . percent($top['visitors'], $sourceTotal) . ' % des visiteurs : partagez-y chaque nouvelle actualité.');
        } elseif ($top && $sourceTotal > 0 && $top['referrer'] === '' && percent($top['visitors'], $sourceTotal) >= 70) {
            $add('info', percent($top['visitors'], $sourceTotal) . ' % des visites sont directes. Partager les actualités sur les réseaux élargirait l’audience.');
        }
        if ($audience['articleViews'] > 0) {
            arsort($audience['categoryViews']);
            $category = array_key_first($audience['categoryViews']);
            $share = percent($audience['categoryViews'][$category], $audience['articleViews']);
            if ($share >= 50) $add('good', 'Les actualités « ' . categories()[$category] . ' » concentrent ' . $share . ' % des lectures d’articles : ce sujet intéresse vos visiteurs.');
        }
        if (($audience['pages'][0]['views'] ?? 0) > 0) $add('info', 'Page la plus vue : ' . $audience['pages'][0]['label'] . ' (' . $audience['pages'][0]['views'] . ' vues).', 'stats');
    } elseif ($admin && !$audience['active']) {
        $add('info', 'La mesure d’audience n’est pas encore active sur le site public.', 'stats', [], 'Voir comment l’activer');
    }
    if ($admin && $editorial['staleDrafts'] > 0) $add('info', $editorial['staleDrafts'] . ' brouillon' . ($editorial['staleDrafts'] > 1 ? 's inactifs' : ' inactif') . ' depuis plus de 30 jours.', 'articles', ['status' => 'draft'], 'Trier les brouillons');
    if ($admin && $editorial['unusedMedia'] >= 5) $add('info', $editorial['unusedMedia'] . ' images de la médiathèque ne sont utilisées par aucune actualité.', 'media', [], 'Ranger la médiathèque');
    return $items;
}

/** Barres d’une seule série. Les valeurs restent lisibles au survol et dans le tableau associé. */
function barChart(array $points, string $key, string $unit): string
{
    $max = max(1, ...array_map(fn($point) => (int) $point[$key], $points));
    $count = count($points);
    $svg = '<svg viewBox="0 0 ' . $count . ' 100" preserveAspectRatio="none" class="h-40 w-full" role="img" aria-label="' . e($unit . ' par période, maximum ' . $max) . '">';
    $svg .= '<line x1="0" y1="50" x2="' . $count . '" y2="50" stroke="rgba(11,12,14,0.12)" stroke-width="0.5" vector-effect="non-scaling-stroke"/>';
    $svg .= '<line x1="0" y1="100" x2="' . $count . '" y2="100" stroke="rgba(11,12,14,0.25)" stroke-width="1" vector-effect="non-scaling-stroke"/>';
    foreach ($points as $index => $point) {
        $value = (int) $point[$key];
        $height = $value > 0 ? max(1, $value * 100 / $max) : 0;
        $svg .= '<rect x="' . ($index + 0.15) . '" y="' . (100 - $height) . '" width="0.7" height="' . $height . '" class="' . ($value > 0 ? 'fill-accent' : 'fill-paper-deep') . '"><title>' . e($point['label'] . ' : ' . $value . ' ' . $unit) . '</title></rect>';
    }
    $svg .= '</svg>';
    $labels = [$points[0]['label'], $points[intdiv($count, 2)]['label'], $points[$count - 1]['label']];
    return '<figure><p class="text-caption text-ink/60">Maximum : ' . $max . ' ' . e($unit) . '</p>' . $svg . '<figcaption class="mt-2 flex justify-between text-caption text-ink/60"><span>' . e($labels[0]) . '</span><span>' . e($labels[1]) . '</span><span>' . e($labels[2]) . '</span></figcaption></figure>';
}

function shareBar(int $value, int $total): string
{
    return '<svg viewBox="0 0 100 6" preserveAspectRatio="none" class="h-1.5 w-full" aria-hidden="true"><rect width="100" height="6" class="fill-paper-deep"/><rect width="' . percent($value, $total) . '" height="6" class="fill-accent"/></svg>';
}

/** Une cellule ne doit jamais devenir une formule à l’ouverture du fichier dans un tableur. */
function csvCell(mixed $value): string
{
    $value = (string) $value;
    return $value !== '' && str_contains("=+-@\t\r", $value[0]) ? "'" . $value : $value;
}

function statsCsv(array $audience, array $editorial): string
{
    $lines = [['section', 'libelle', 'vues', 'visiteurs']];
    $lines[] = ['periode', $audience['start'] . ' au ' . $audience['end'], $audience['views'], $audience['visitors']];
    $lines[] = ['periode precedente', '', $audience['previousViews'], $audience['previousVisitors']];
    foreach ($audience['series'] as $point) $lines[] = ['evolution', $point['label'], $point['views'], $point['visitors']];
    foreach ($audience['pages'] as $page) $lines[] = ['pages', $page['label'] . ' (' . $page['path'] . ')', $page['views'], $page['visitors']];
    foreach ($audience['sources'] as $source) $lines[] = ['sources', $source['label'], '', $source['visitors']];
    foreach ($audience['devices'] as $device => $visitors) $lines[] = ['appareils', deviceNames()[$device] ?? $device, '', $visitors];
    foreach (categories() as $key => $label) $lines[] = ['categories', $label . ' (' . $editorial['byCategory'][$key] . ' validee(s))', $audience['categoryViews'][$key], ''];
    foreach ($editorial['months'] as $month) $lines[] = ['actualites validees par mois', $month['label'], $month['value'], ''];
    $output = fopen('php://memory', 'r+');
    fwrite($output, "\u{FEFF}");
    foreach ($lines as $line) fputcsv($output, array_map(csvCell(...), $line), ';', '"', '\\', "\r\n");
    rewind($output);
    return stream_get_contents($output);
}
