<?php
declare(strict_types=1);

require dirname(__DIR__) . '/src/bootstrap.php';
use Baruck\ValidationError;

$count = 0;
function check(bool $value, string $name): void {
    global $count;
    if (!$value) throw new RuntimeException('Échec : ' . $name);
    $count++;
}
function accepts(callable $operation): bool {
    try { $operation(); return true; } catch (ValidationError $error) { return false; }
}

check(!accepts(fn() => Baruck\password('😀😀😀😀')), 'quatre emojis refusés');
check(!accepts(fn() => Baruck\password(str_repeat('é', 8))), 'huit lettres accentuées refusées');
check(!accepts(fn() => Baruck\password(str_repeat("e\u{0301}", 8))), 'caractères combinés comptés comme caractères visibles');
check(accepts(fn() => Baruck\password('Une phrase très longue')), 'phrase Unicode acceptée');
check(!accepts(fn() => Baruck\password('Abcdefghij1')), 'onze caractères refusés');
check(accepts(fn() => Baruck\password('Abcdefghij12')), 'douze caractères acceptés');
check(accepts(fn() => Baruck\password(str_repeat('é', 12))), 'douze caractères Unicode acceptés');
check(!accepts(fn() => Baruck\password(str_repeat('a', 73))), 'aucune troncature bcrypt');
check(!accepts(fn() => Baruck\password("Un mot de passe\0interdit")), 'caractère NUL refusé');
check(!accepts(fn() => Baruck\password("Une phrase longue\xFF")), 'UTF-8 invalide refusé');

$cases = json_decode(file_get_contents(__DIR__ . '/markdown-cases.json'), true, 512, JSON_THROW_ON_ERROR);
foreach ($cases as $case) check(accepts(fn() => Baruck\validateMarkdown($case['body'])) === $case['valid'], 'Markdown : ' . $case['name']);

$session = ['user_id' => 'owner', 'csrf' => str_repeat('a', 64)];
$post = ['action' => 'save_article', 'csrf' => $session['csrf'], 'id' => 'article', 'version' => '2', 'title' => 'Ma saisie', 'body' => 'Texte privé', 'password' => 'secret à exclure', 'status' => 'ready'];
$server = ['REQUEST_METHOD' => 'POST'];
$recovery = Baruck\recoverExpiredSubmission($session, $post, $server, 1000);
check($recovery['user_id'] === 'owner' && $recovery['draft']['body'] === 'Texte privé', 'saisie liée au propriétaire');
check(array_intersect_key($recovery['draft'], array_flip(['password', 'csrf', 'status'])) === [], 'aucun secret ni validation automatique à restaurer');
check($recovery['expires'] === 4600, 'conservation limitée à une heure');
check(Baruck\recoverExpiredSubmission($session, [...$post, 'csrf' => 'faux'], $server, 1000) === null, 'CSRF forgé non conservé');
check(Baruck\recoverExpiredSubmission($session, [...$post, 'action' => 'create_user'], $server, 1000) === null, 'formulaire de compte non conservé');
check(Baruck\recoverExpiredSubmission($session, [...$post, 'body' => str_repeat('x', 300001)], $server, 1000) === null, 'saisie surdimensionnée refusée');

// Un proxy n’est cru sur parole que s’il a été déclaré de confiance.
check(Baruck\overHttps([], ['HTTPS' => 'on']), 'connexion chiffrée directe reconnue');
check(!Baruck\overHttps([], []), 'connexion en clair refusée');
check(!Baruck\overHttps([], ['HTTP_X_FORWARDED_PROTO' => 'https']), 'en-tête de proxy ignoré sans déclaration');
check(Baruck\overHttps(['trusted_proxy' => true], ['HTTP_X_FORWARDED_PROTO' => 'https']), 'proxy déclaré de confiance accepté');
check(!Baruck\overHttps(['trusted_proxy' => true], ['HTTP_X_FORWARDED_PROTO' => 'http']), 'proxy de confiance annonçant du clair refusé');
check(!Baruck\overHttps(['trusted_proxy' => 'oui'], ['HTTP_X_FORWARDED_PROTO' => 'https']), 'déclaration non booléenne sans effet');

// Mesure d’audience : normalisation des chemins, provenances, appareils et robots.
check(Baruck\normalizePath('/actualites/mon-article') === '/actualites/mon-article/', 'chemin normalisé avec barre finale');
check(Baruck\normalizePath('') === '/' && Baruck\normalizePath('/') === '/', 'accueil accepté');
check(Baruck\normalizePath('/../config.php') === null && Baruck\normalizePath('/a?b=1') === null && Baruck\normalizePath('/' . str_repeat('a', 300)) === null, 'chemins hors site refusés');
check(Baruck\referrerHost('https://www.groupebaruck.com/actualites/', 'https://groupebaruck.com') === 'interne', 'navigation interne reconnue');
check(Baruck\referrerHost('https://l.facebook.com/l.php?u=x', 'https://groupebaruck.com') === 'facebook.com', 'sous-domaine de partage ramené à la source');
check(Baruck\referrerHost('', 'https://groupebaruck.com') === '' && Baruck\referrerHost('pas une adresse', 'https://groupebaruck.com') === '', 'accès direct sans provenance');
check(Baruck\sourceLabel('google.fr') === 'Google' && Baruck\sourceLabel('') === 'Accès direct' && Baruck\sourceLabel('exemple.org') === 'exemple.org', 'libellés des sources');
check(Baruck\referrerHost('http://=cmd|calc.evil.com/', 'https://groupebaruck.com') === 'autre'
    && Baruck\referrerHost('https://@=SUM(1,2).com/', 'https://groupebaruck.com') === 'autre'
    && Baruck\referrerHost('https://' . str_repeat('a', 200) . '.com/', 'https://groupebaruck.com') === 'autre', 'provenance forgée écartée, jamais comptée comme accès direct');
check(Baruck\referrerHost('https://xn--80ak6aa92e.com/page', 'https://groupebaruck.com') === 'xn--80ak6aa92e.com', 'nom de domaine international conservé');
check(Baruck\sourceLabel('autre') === 'Provenance inconnue', 'libellé d’une provenance illisible');
check(Baruck\csvCell('=1+1') === "'=1+1" && Baruck\csvCell('+33 6') === "'+33 6" && Baruck\csvCell('-5') === "'-5" && Baruck\csvCell('@x') === "'@x", 'cellules interprétables neutralisées');
check(Baruck\csvCell('Accueil') === 'Accueil' && Baruck\csvCell('') === '' && Baruck\csvCell(12) === '12', 'cellules ordinaires inchangées');
$hostile = Baruck\statsCsv([
    'start' => '2026-09-01', 'end' => '2026-09-07', 'views' => 1, 'visitors' => 1, 'previousViews' => 0, 'previousVisitors' => 0,
    'series' => [], 'pages' => [['label' => '=HYPERLINK("http://x")', 'path' => '/', 'views' => 1, 'visitors' => 1]],
    'sources' => [['label' => '=cmd|calc', 'visitors' => 1]], 'devices' => [], 'categoryViews' => array_fill_keys(array_keys(Baruck\categories()), 0),
], ['byCategory' => array_fill_keys(array_keys(Baruck\categories()), 0), 'months' => []]);
check(str_contains($hostile, "\"'=HYPERLINK") && str_contains($hostile, "'=cmd|calc") && !preg_match('~;=~', $hostile), 'export CSV sans formule active');
check(Baruck\deviceFromWidth(390) === 'mobile' && Baruck\deviceFromWidth(800) === 'tablette' && Baruck\deviceFromWidth(1440) === 'ordinateur' && Baruck\deviceFromWidth(0) === 'inconnu', 'appareils selon la largeur');
check(Baruck\isBot('Mozilla/5.0 (compatible; Googlebot/2.1)') && Baruck\isBot('') && !Baruck\isBot('Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'), 'robots écartés, navigateurs conservés');
check(Baruck\delta(120, 100) === 20 && Baruck\delta(80, 100) === -20 && Baruck\delta(5, 0) === null && Baruck\percent(1, 3) === 33, 'écarts et pourcentages');
check(Baruck\frenchDate('2026-09-10', true) === '10 sept. 2026' && Baruck\frenchDate('2026-01') === 'janv. 2026', 'dates en français');
check(Baruck\shiftDay('2026-03-01', -1) === '2026-02-28', 'décalage de jours');

$audience = ['active' => true, 'days' => 30, 'visitors' => 150, 'previousVisitors' => 100, 'views' => 300, 'previousViews' => 200, 'devices' => ['mobile' => 90, 'ordinateur' => 60], 'sources' => [['referrer' => 'facebook.com', 'label' => 'Facebook', 'visitors' => 60], ['referrer' => '', 'label' => 'Accès direct', 'visitors' => 40]], 'pages' => [['label' => 'Accueil', 'path' => '/', 'views' => 120, 'visitors' => 80]], 'categoryViews' => ['groupe' => 10, 'jeca' => 70, 'espoir-de-vie' => 0, 'studio-photo' => 0, 'hotesses' => 0], 'articleViews' => 80];
$editorial = ['pendingExport' => 2, 'withdrawnSinceExport' => 0, 'lastExport' => '2026-08-01T00:00:00Z', 'unpublished' => 1, 'revising' => 0, 'daysSinceLast' => 60, 'withoutCover' => 1, 'staleDrafts' => 0, 'unusedMedia' => 0];
$texts = array_column(Baruck\insights($audience, $editorial, true), 'text');
check(count(array_filter($texts, fn($text) => str_contains($text, '2 versions validées'))) === 1, 'versions en attente de publication signalées');
check(count(array_filter($texts, fn($text) => str_contains($text, '1 brouillon attend'))) === 1, 'brouillon à valider signalé');
check(count(array_filter($texts, fn($text) => str_contains($text, 'depuis 60 jours'))) === 1, 'silence éditorial signalé');
check(count(array_filter($texts, fn($text) => str_contains($text, 'hausse de 50 %'))) === 1, 'hausse de fréquentation signalée');
check(count(array_filter($texts, fn($text) => str_contains($text, '60 % des visiteurs viennent d’un mobile'))) === 1, 'part mobile signalée');
check(count(array_filter($texts, fn($text) => str_contains($text, 'Facebook apporte 60 %'))) === 1, 'source principale signalée');
check(count(array_filter($texts, fn($text) => str_contains($text, '« JECA » concentrent 88 %'))) === 1, 'catégorie la plus lue signalée');
$editorTexts = array_column(Baruck\insights($audience, $editorial, false), 'text');
check(!array_filter($editorTexts, fn($text) => str_contains($text, 'validation') || str_contains($text, 'publication')), 'un rédacteur ne voit pas les actions réservées à l’administrateur');
$inactive = Baruck\insights([...$audience, 'active' => false, 'visitors' => 0, 'previousVisitors' => 0], [...$editorial, 'pendingExport' => 0, 'unpublished' => 0, 'daysSinceLast' => 3, 'withoutCover' => 0], true);
check(count($inactive) === 1 && str_contains($inactive[0]['text'], 'pas encore active'), 'mesure inactive signalée à l’administrateur seulement');
$chart = Baruck\barChart([['label' => '1 sept.', 'visitors' => 0], ['label' => '2 sept.', 'visitors' => 7], ['label' => '3 sept.', 'visitors' => 14]], 'visitors', 'visiteurs');
check(substr_count($chart, '<rect') === 3 && str_contains($chart, 'height="100"') && str_contains($chart, 'height="50"') && str_contains($chart, 'Maximum : 14 visiteurs') && !str_contains($chart, 'style='), 'graphique SVG proportionnel sans style en ligne');
check(str_contains(Baruck\shareBar(1, 4), 'width="25"'), 'barre de part proportionnelle');
// Un site sans aucune visite : les séries sont vides et `max(1, ...[])` ferait échouer la page.
check(Baruck\topValue([]) === 1 && Baruck\topValue([0, 0]) === 1 && Baruck\topValue([3, 14, 7]) === 14, 'maximum d’une série vide ramené à 1');
check(str_contains(Baruck\barChart([['label' => '1 sept.', 'visitors' => 0], ['label' => '2 sept.', 'visitors' => 0]], 'visitors', 'visiteurs'), 'Maximum : 1 visiteurs'), 'graphique d’une série entièrement à zéro');
// Boutique : identifiants déduits du nom, rayons et photos.
check(Baruck\slugify('Sac à main noir') === 'sac-a-main-noir', 'accents et espaces transformés en identifiant');
check(Baruck\slugify('Chemise  —  «  Été 2026  »') === 'chemise-ete-2026', 'ponctuation et espaces multiples réduits');
check(Baruck\slugify('Œuf & Æther') === 'oeuf-aether', 'ligatures françaises transcrites');
check(Baruck\slugify('   ') === 'article' && Baruck\slugify('日本') === 'article', 'nom sans lettre latine reste enregistrable');
check(strlen(Baruck\slugify(str_repeat('mot ', 60))) <= 100 && !str_ends_with(Baruck\slugify(str_repeat('mot ', 60)), '-'), 'identifiant tronqué proprement');

$photo = ['src' => '/images/marque-baruck/sac-main-noir.jpg', 'alt' => 'Sac à main noir Baruck'];
$product = ['name' => 'Sac à main noir', 'category' => 'sacs', 'images' => [$photo]];
check(accepts(fn() => Baruck\validateProduct($product)), 'article de boutique complet accepté');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'images' => []])), 'article sans photo refusé');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'images' => array_fill(0, 7, $photo)])), 'plus de six photos refusées');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'category' => 'groupe'])), 'catégorie d’actualité refusée comme rayon');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'images' => [['src' => '/images/../config.php', 'alt' => 'Fuite']]])), 'chemin sortant refusé');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'images' => [['src' => $photo['src'], 'alt' => '']]])), 'photo sans description refusée');
check(!accepts(fn() => Baruck\validateProduct([...$product, 'name' => ''])), 'article sans nom refusé');
check(Baruck\validateProduct([...$product, 'images' => [['src' => '', 'alt' => ''], $photo]])['images'] === [$photo], 'ligne de photo vide ignorée');
check(array_keys(Baruck\brandCategories()) === ['homme', 'femme', 'enfant', 'vetements', 'sacs', 'chaussures', 'parfums', 'accessoires'], 'rayons repris du site');

// Coordonnées : numéros internationaux, e-mail, horaires et pages Facebook.
$base = ['contacts' => ['landline' => '+224 625 19 72 58', 'mobile' => '+224 623 54 66 57', 'whatsappHq' => '+224 623 72 04 27', 'whatsappCeo' => '+33 7 55 42 37 54', 'email' => 'jokrasso2@gmail.com'], 'address' => 'Kobayah, Conakry.', 'hours' => [['days' => 'Lundi – Samedi', 'hours' => '8h – 17h']], 'facebook' => [['country' => 'Guinée', 'href' => 'https://www.facebook.com/BaruckCommunication']], 'mapQuery' => 'Kobayah, Conakry, Guinée'];
check(accepts(fn() => Baruck\validateCoordonnees($base)), 'coordonnées complètes acceptées');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'contacts' => [...$base['contacts'], 'whatsappHq' => '623 72 04 27']])), 'numéro sans indicatif refusé');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'contacts' => [...$base['contacts'], 'mobile' => '+224 62']])), 'numéro trop court refusé');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'contacts' => [...$base['contacts'], 'landline' => '+224 abc 12 34 56']])), 'numéro non numérique refusé');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'contacts' => [...$base['contacts'], 'email' => 'sans-arobase.fr']])), 'adresse e-mail invalide refusée');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'contacts' => 'pas un tableau'])), 'contacts non structurés refusés');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'hours' => []])), 'horaires vides refusés');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'hours' => [['days' => 'Lundi', 'hours' => '']]])), 'ligne d’horaire incomplète refusée');
check(count(Baruck\validateCoordonnees([...$base, 'hours' => [...$base['hours'], ['days' => '', 'hours' => '']]])['hours']) === 1, 'ligne entièrement vide ignorée');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'hours' => array_fill(0, 8, $base['hours'][0])])), 'plus de sept horaires refusés');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'facebook' => [['country' => 'Guinée', 'href' => 'https://exemple.test/page']]])), 'lien hors Facebook refusé');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'facebook' => [['country' => 'Guinée', 'href' => 'http://www.facebook.com/x']]])), 'lien Facebook non chiffré refusé');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'facebook' => [['country' => 'Guinée', 'href' => 'https://faux-facebook.test/x']]])), 'domaine imitant Facebook refusé');
check(Baruck\validateCoordonnees([...$base, 'facebook' => []])['facebookPages'] === [], 'aucune page Facebook accepté');
check(!accepts(fn() => Baruck\validateCoordonnees([...$base, 'address' => ''])), 'adresse vide refusée');
check(array_keys(Baruck\contactLines()) === ['landline', 'mobile', 'whatsappHq', 'whatsappCeo', 'email'], 'lignes de contact du site');

// Textes de l’accueil : structure du site imposée, longueurs plafonnées.
$reference = Baruck\seed()['textes'];
$textInput = [];
foreach ($reference as $group => $entries) {
    foreach ($entries as $key => $entry) $textInput[$group][$key] = ['title' => $entry['title'], 'description' => $entry['description']];
}
check(Baruck\validateTextes($textInput) === $textInput, 'textes du site acceptés tels quels');
check(!accepts(fn() => Baruck\validateTextes([])), 'formulaire vide refusé');
$missing = $textInput;
unset($missing['activities']['cinema']);
check(!accepts(fn() => Baruck\validateTextes($missing)), 'entrée manquante refusée');
$extra = $textInput;
$extra['activities']['invente'] = ['title' => 'Nouveau', 'description' => 'Texte'];
check(!array_key_exists('invente', Baruck\validateTextes($extra)['activities']), 'entrée inventée ignorée');
$long = $textInput;
$long['activities']['cinema']['description'] = str_repeat('é', 131);
check(!accepts(fn() => Baruck\validateTextes($long)), 'texte d’activité trop long refusé');
$long['activities']['cinema']['description'] = str_repeat('é', 130);
check(accepts(fn() => Baruck\validateTextes($long)), 'longueur comptée en caractères, pas en octets');
$longTitle = $textInput;
$longTitle['heroSlides']['guinee']['title'] = str_repeat('a', 61);
check(!accepts(fn() => Baruck\validateTextes($longTitle)), 'titre de diaporama trop long refusé');
$emptyText = $textInput;
$emptyText['heroSlides']['guinee']['description'] = '';
check(!accepts(fn() => Baruck\validateTextes($emptyText)), 'texte vide refusé');
check(array_keys(Baruck\textGroups()) === ['heroSlides', 'activities'], 'groupes de textes déclarés');

echo $count . " contrôles de validation réussis.\n";
