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

// Mesure d’audience : normalisation des chemins, provenances, appareils et robots.
check(Baruck\normalizePath('/actualites/mon-article') === '/actualites/mon-article/', 'chemin normalisé avec barre finale');
check(Baruck\normalizePath('') === '/' && Baruck\normalizePath('/') === '/', 'accueil accepté');
check(Baruck\normalizePath('/../config.php') === null && Baruck\normalizePath('/a?b=1') === null && Baruck\normalizePath('/' . str_repeat('a', 300)) === null, 'chemins hors site refusés');
check(Baruck\referrerHost('https://www.groupebaruck.com/actualites/', 'https://groupebaruck.com') === 'interne', 'navigation interne reconnue');
check(Baruck\referrerHost('https://l.facebook.com/l.php?u=x', 'https://groupebaruck.com') === 'facebook.com', 'sous-domaine de partage ramené à la source');
check(Baruck\referrerHost('', 'https://groupebaruck.com') === '' && Baruck\referrerHost('pas une adresse', 'https://groupebaruck.com') === '', 'accès direct sans provenance');
check(Baruck\sourceLabel('google.fr') === 'Google' && Baruck\sourceLabel('') === 'Accès direct' && Baruck\sourceLabel('exemple.org') === 'exemple.org', 'libellés des sources');
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

echo $count . " contrôles de validation réussis.\n";
