import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';

const directory = path.resolve('backoffice');
const docker = (args, input) => {
  const result = spawnSync('docker', args, { encoding: 'utf8', input, maxBuffer: 4 * 1024 * 1024 });
  assert.equal(result.status, 0, result.stderr || 'Commande Docker échouée');
  return result.stdout.trim();
};
const sql = (input) => docker(['exec', '-i', 'baruck-admin-mysql', 'sh', '-c', 'MYSQL_PWD="$MYSQL_ROOT_PASSWORD" mysql -uroot'], input);
class Browser {
  cookie = '';
  constructor(origin) { this.origin = origin; }
  async request(route = '/', data, extraHeaders = {}) {
    const response = await fetch(this.origin + route, { method: data ? 'POST' : 'GET', redirect: 'manual', headers: { Cookie: this.cookie, ...extraHeaders }, body: data instanceof FormData ? data : data ? new URLSearchParams(data) : undefined });
    for (const cookie of response.headers.getSetCookie()) this.cookie = cookie.split(';')[0];
    const html = await response.text();
    return { status: response.status, headers: response.headers, html, csrf: html.match(/name="csrf" value="([a-f0-9]+)"/)?.[1] };
  }
  async post(route, fields, extraHeaders = {}) {
    const { csrf } = await this.request(route);
    assert.ok(csrf, 'Formulaire avec jeton CSRF attendu');
    return this.request(route, { csrf, ...fields }, extraHeaders);
  }
}

test('recette PHP 8.2 / MySQL 8 : comptes, droits, articles, médias et export', async (t) => {
  const nonce = crypto.randomBytes(6).toString('hex');
  const database = `baruck_test_${nonce}`;
  const container = `baruck-admin-test-${nonce}`;
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-mysql-test-'));
  const secret = JSON.parse(await fs.readFile(path.join(directory, '.local/secrets.json'), 'utf8'));
  sql(`CREATE DATABASE ${database} CHARACTER SET utf8mb4; GRANT ALL ON ${database}.* TO 'baruck'@'%';`);
  t.after(async () => {
    spawnSync('docker', ['rm', '-f', container], { stdio: 'ignore' });
    sql(`DROP DATABASE ${database};`);
    await fs.rm(folder, { recursive: true, force: true });
  });
  const configFile = path.join(folder, 'config.php');
  await fs.writeFile(configFile, '<?php return [];');
  docker(['run', '-d', '--name', container, '--network', 'baruck-admin', '-p', '127.0.0.1::8080', '-e', 'BARUCK_CONFIG=/config.php', '-v', `${directory}:/app:ro`, '-v', `${configFile}:/config.php:ro`, 'baruck-backoffice-php:local']);
  const address = docker(['port', container, '8080/tcp']);
  const origin = 'http://' + address;
  await fs.writeFile(configFile, `<?php return ['environment'=>'local','origin'=>'${origin}','site_url'=>'https://groupebaruck.com','storage'=>'/tmp/baruck-data','database'=>['dsn'=>'mysql:host=baruck-admin-mysql;dbname=${database};charset=utf8mb4','user'=>'baruck','password'=>'${secret.password}']];`);
  docker(['exec', container, 'php', 'bin/install.php', 'init']);
  docker(['exec', container, 'php', 'tests/validation.php']);
  const admin = new Browser(origin);
  const editor = new Browser(origin);
  const anonymous = new Browser(origin);
  const password = 'Recette-locale-' + crypto.randomBytes(12).toString('hex');
  const adminEmail = 'admin@example.test';
  const editorEmail = 'editor+recette@sous.example.test';
  let articleId;
  const fields = { action: 'save_article', id: '', version: '0', slug: 'recette-mysql', title: 'Recette MySQL', date: '2026-09-06', category: 'groupe', excerpt: 'Résumé de recette', body: 'Texte de recette.', cover: '', cover_alt: '', status: 'draft' };
  await t.test('migration additive et réinstallation conservent les versions initiales', () => {
    const counts = () => sql(`SELECT (SELECT COUNT(*) FROM ${database}.articles),(SELECT COUNT(*) FROM ${database}.article_revisions),(SELECT COUNT(*) FROM ${database}.article_publications);`);
    const before = counts();
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(counts(), before);
  });
  await t.test('premier compte, cookie HTTPOnly et protection CSRF', async () => {
    const page = await anonymous.request('/?page=articles');
    assert.match(page.html, /Créez votre compte/);
    assert.ok(page.html.includes('pattern="[^\\s@]+@[^\\s@]+\\.[^\\s@]+"'));
    assert.match(page.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(page.headers.get('set-cookie'), /SameSite=Strict/i);
    assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal(page.headers.get('referrer-policy'), 'same-origin');
    assert.equal((await anonymous.request('/', { action: 'setup', email: adminEmail, password, name: 'Recette' })).status, 403);
    for (const Origin of ['null', 'https://hostile.example']) {
      assert.equal((await admin.post('/', { action: 'setup', email: adminEmail, password, name: 'Recette' }, { Origin })).status, 403);
    }
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory, 'tests/browser-form.mjs'), origin], { encoding: 'utf8', timeout: 30000 });
      assert.equal(browser.status, 0, browser.stderr || browser.stdout);
    }
    assert.equal((await admin.post('/', { action: 'setup', email: adminEmail, password: '😀😀😀😀', name: 'Recette' })).status, 422);
    for (const email of ['kkkk@dddd', 'kkkk\\@dddd', 'sans-arobase.fr', 'nom@@exemple.fr', 'nom espace@exemple.fr', 'nom..prenom@exemple.fr', 'nom@-exemple.fr']) {
      const invalid = await admin.post('/', { action: 'setup', email, password, name: 'Recette' });
      assert.equal(invalid.status, 422, email);
      assert.match(invalid.html, /adresse e-mail complète et valide/);
    }
    assert.equal((await admin.post('/', { action: 'setup', email: adminEmail, password, name: 'Administrateur recette' })).status, 303);
    assert.match((await admin.request('/')).html, /Vue d’ensemble/);
    assert.match((await anonymous.request('/?page=articles')).html, /Connectez-vous/);
    assert.equal((await admin.post('/?page=users', { action: 'create_user', email: editorEmail, password, name: 'Rédacteur recette', role: 'editor' })).status, 303);
    assert.equal((await admin.post('/?page=users', { action: 'create_user', email: 'kkkk@dddd', password, name: 'Recette', role: 'editor' })).status, 422);
    const duplicate = await admin.post('/?page=users', { action: 'create_user', email: editorEmail.toUpperCase(), password, name: 'Doublon', role: 'editor' });
    assert.equal(duplicate.status, 422);
    assert.match(duplicate.html, /Cette adresse possède déjà un compte/);
    assert.equal((await editor.post('/', { action: 'login', email: editorEmail, password })).status, 303);
  });
  await t.test('rédacteur : brouillons autorisés, validation et comptes interdits', async () => {
    assert.equal((await editor.request('/?page=users')).status, 403);
    assert.equal((await editor.post('/?page=edit', { ...fields, status: 'ready' })).status, 403);
    const saved = await editor.post('/?page=edit', fields);
    assert.equal(saved.status, 303, saved.html);
    articleId = new URL(saved.headers.get('location'), origin).searchParams.get('id');
    assert.ok(articleId);
    assert.equal((await editor.post('/?page=edit', { ...fields, slug: 'autre', action: 'export' })).status, 403);
  });
  await t.test('contrôle des dates, adresses fixes, HTML et conflits d’édition', async () => {
    const route = '/?page=edit&id=' + articleId;
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', status: 'ready', date: '2026-02-30' })).status, 422);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', body: '<script>alert(1)</script>' })).status, 422);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', status: 'ready', body: '[Lien](ftp://example.test)' })).status, 422);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', slug: 'adresse-modifiee' })).status, 422);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', status: 'ready' })).status, 303);
    const stale = await admin.post(route, { ...fields, id: articleId, version: '1' });
    assert.equal(stale.status, 409);
    assert.match(stale.html, /Votre saisie est conservée/);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '2' }, { Origin: 'https://hostile.example' })).status, 403);
  });
  await t.test('upload réel, MIME vérifié et médias accessibles uniquement après connexion', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=', 'base64');
    for (const [bytes, filename, expected] of [[Buffer.from('<?php echo 1;'), 'attaque.jpg', 422], [png, 'image.png', 303]]) {
      const { csrf } = await admin.request('/?page=media');
      const form = new FormData(); form.set('csrf', csrf); form.set('action', 'upload'); form.set('alt', 'Image de recette'); form.set('image', new Blob([bytes], { type: 'image/png' }), filename);
      const response = await admin.request('/?page=media', form);
      assert.equal(response.status, expected, response.html);
    }
    const media = await admin.request('/?page=media');
    const imageId = media.html.match(/page=image&amp;id=([a-f0-9]{32})/)?.[1];
    assert.ok(imageId);
    assert.match((await anonymous.request('/?page=image&id=' + imageId)).html, /Connectez-vous/);
    const image = await admin.request('/?page=image&id=' + imageId);
    assert.equal(image.headers.get('content-type'), 'image/png');
    assert.equal((await anonymous.request('/?page=media_api')).status, 401);
    const catalog = JSON.parse((await admin.request('/?page=media_api')).html).items;
    const imagePath = catalog.find(item => item.id === imageId)?.path;
    assert.ok(imagePath);
    const seed = catalog.find(item => item.id.startsWith('seed-'));
    assert.ok(seed);
    assert.equal((await admin.request(seed.preview)).status, 200);
    assert.equal((await admin.request('/?page=image&id=seed-../../config.php')).status, 404);
    const download = await admin.request('/?page=image&id=' + imageId + '&download=1');
    assert.match(download.headers.get('content-disposition'), /^attachment;/);
    assert.match((await anonymous.request('/?page=image&id=' + imageId + '&download=1')).html, /Connectez-vous/);
    const apiFile = new FormData(); apiFile.set('image', new Blob([png], { type: 'image/png' }), 'recette.png'); apiFile.set('alt', 'Image API');
    assert.equal((await editor.request('/?page=media_api', apiFile)).status, 403);
    apiFile.set('csrf', (await editor.request('/?page=edit')).csrf);
    assert.equal((await editor.request('/?page=media_api', apiFile, { Origin: 'https://hostile.example' })).status, 403);
    const imported = await editor.request('/?page=media_api', apiFile);
    assert.equal(imported.status, 201);
    assert.ok(JSON.parse(imported.html).item.path.startsWith('/images/actualites/uploads/'));
    assert.equal((await admin.post('/?page=edit&id=' + articleId, { ...fields, id: articleId, version: '2', status: 'ready', cover: imagePath, cover_alt: 'Image de recette' })).status, 303);
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory, 'tests/browser-form.mjs'), origin, 'media'], { input: JSON.stringify({ cookie: editor.cookie, articleId }), encoding: 'utf8', timeout: 30000 });
      assert.equal(browser.status, 0, browser.stderr || browser.stdout);
    }
  });
  await t.test('export exclut brouillons, utilisateurs, secrets et médias non utilisés', async () => {
    assert.equal((await admin.post('/?page=edit', { ...fields, slug: 'brouillon-prive', title: 'Brouillon privé' })).status, 303);
    const response = await admin.post('/?page=publication', { action: 'export' });
    assert.equal(response.status, 200, response.html);
    const exported = JSON.parse(response.html);
    assert.ok(exported.articles.some((item) => item.slug === 'recette-mysql'));
    assert.ok(!exported.articles.some((item) => item.slug === 'brouillon-prive'));
    assert.equal(exported.media.length, 1);
    assert.ok(!response.html.includes(adminEmail));
    assert.ok(!response.html.includes(password));
    assert.ok(!response.html.includes(secret.password));
    // Artifact de recette temporaire, jamais une mutation des vrais contenus.
    if (process.env.BARUCK_TEST_EXPORT) await fs.writeFile(process.env.BARUCK_TEST_EXPORT, response.html, { mode: 0o600 });
  });
  await t.test('révision privée, restauration et retrait explicite sans perte de version validée', async () => {
    const first = { ...fields, slug: 'versions-recette', title: 'Version initiale', body: 'Version publique initiale', status: 'ready' };
    const created = await admin.post('/?page=edit', first);
    assert.equal(created.status, 303);
    const id = new URL(created.headers.get('location'), origin).searchParams.get('id');
    const route = '/?page=edit&id=' + id;
    const exported = async () => JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html).articles.find((article) => article.slug === first.slug);
    const changed = { ...first, id, version: '1', body: 'Révision privée du rédacteur', status: 'draft' };
    assert.equal((await editor.post(route, changed)).status, 303);
    assert.equal((await exported()).body, first.body);
    assert.match((await editor.request(route)).html, /Révision privée du rédacteur/);
    const history = await editor.request('/?page=history&id=' + id);
    const revision = history.html.match(/name="revision" value="([a-f0-9]{32})"/)?.[1];
    assert.ok(revision);
    assert.equal((await editor.post('/?page=history&id=' + articleId, { action: 'restore_revision', id: articleId, version: '3', revision })).status, 422);
    assert.equal((await editor.post('/?page=history&id=' + id, { action: 'restore_revision', id, version: '1', revision })).status, 409);
    assert.equal((await editor.post('/?page=history&id=' + id, { action: 'restore_revision', id, version: '2', revision })).status, 303);
    assert.match((await editor.request(route)).html, /Version publique initiale/);
    assert.equal((await exported()).body, first.body);
    assert.equal((await admin.post(route, { ...changed, version: '3', body: 'Nouvelle version validée', status: 'ready' })).status, 303);
    assert.equal((await exported()).body, 'Nouvelle version validée');
    const withdraw = { action: 'withdraw_publication', id, version: '4', confirm_withdraw: 'yes' };
    assert.equal((await editor.post(route, withdraw)).status, 403);
    assert.equal((await admin.post(route, { ...withdraw, confirm_withdraw: '' })).status, 422);
    assert.equal((await admin.post(route, { ...withdraw, version: '3' })).status, 409);
    assert.equal((await admin.post(route, withdraw)).status, 303);
    assert.equal(await exported(), undefined);
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(await exported(), undefined, 'une réinstallation ne rétablit pas un article retiré');
    assert.match((await editor.request('/?page=history&id=' + id)).html, /Version publique initiale/);
  });
  await t.test('une saisie après expiration revient au même compte sans écraser une édition concurrente', async () => {
    const route = '/?page=edit&id=' + articleId;
    const pending = await editor.request(route);
    const sessionId = editor.cookie.split('=')[1];
    docker(['exec', container, 'php', '-r', 'session_save_path("/tmp/baruck-data/sessions"); session_id($argv[1]); session_start(); $_SESSION["last_seen"]=time()-1900; session_write_close();', sessionId]);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '3', status: 'ready', body: 'Modification plus récente' })).status, 303);
    const submission = { ...fields, id: articleId, version: '3', body: 'Ma saisie à récupérer', csrf: pending.csrf };
    const expired = await editor.request(route, submission);
    assert.equal(expired.status, 303);
    const loginPage = await editor.request('/?page=login');
    assert.match(loginPage.html, /Votre session a expiré/);
    assert.ok(!loginPage.html.includes('Ma saisie à récupérer'));
    const logged = await editor.post('/?page=login', { action: 'login', email: editorEmail, password });
    assert.equal(logged.status, 303);
    const recoverRoute = logged.headers.get('location');
    assert.ok(recoverRoute.includes('recover='));
    const recovered = await editor.request(recoverRoute);
    assert.match(recovered.html, /Ma saisie à récupérer/);
    assert.match(recovered.html, /name="version" value="3"/);
    assert.equal((await editor.request(route, { ...submission, csrf: recovered.csrf })).status, 409);
    const exported = JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    assert.equal(exported.articles.find((item) => item.slug === fields.slug).body, 'Modification plus récente');
    // Une autre identité ne reçoit jamais la saisie liée à ce compte.
    const pendingAgain = await editor.request(route);
    docker(['exec', container, 'php', '-r', 'session_save_path("/tmp/baruck-data/sessions"); session_id($argv[1]); session_start(); $_SESSION["last_seen"]=time()-1900; session_write_close();', editor.cookie.split('=')[1]]);
    await editor.request(route, { ...submission, csrf: pendingAgain.csrf });
    const otherIdentity = await editor.post('/?page=login', { action: 'login', email: adminEmail, password });
    assert.equal(otherIdentity.headers.get('location'), '/?page=dashboard');
    assert.ok(!(await editor.request(recoverRoute)).html.includes('Ma saisie à récupérer'));
    await editor.post('/', { action: 'logout' });
    await editor.post('/', { action: 'login', email: editorEmail, password });
  });
  await t.test('désactivation et changement de mot de passe invalident les sessions', async () => {
    const users = await admin.request('/?page=users');
    const editorId = users.html.match(/name="id" value="([a-f0-9]{32})"/)?.[1];
    assert.ok(editorId);
    assert.equal((await admin.post('/?page=users', { action: 'toggle_user', id: editorId })).status, 303);
    assert.match((await editor.request('/?page=articles')).html, /Connectez-vous/);
    const other = new Browser(origin);
    assert.equal((await other.post('/', { action: 'login', email: adminEmail, password })).status, 303);
    assert.equal((await admin.post('/?page=account', { action: 'change_password', current_password: password, password: password + '2' })).status, 303);
    assert.match((await other.request('/')).html, /Connectez-vous/);
  });
  await t.test('limitation des tentatives, même sur un compte inexistant', async () => {
    for (let i = 0; i < 9; i++) await anonymous.post('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    const legitimate = new Browser(origin);
    assert.equal((await legitimate.post('/', { action: 'login', email: adminEmail, password: password + '2' })).status, 303);
    await anonymous.post('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    const response = await anonymous.post('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    assert.equal(response.status, 422);
    assert.match(response.html, /Trop de tentatives/);
  });
});
