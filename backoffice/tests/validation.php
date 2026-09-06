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
echo $count . " contrôles de validation réussis.\n";
