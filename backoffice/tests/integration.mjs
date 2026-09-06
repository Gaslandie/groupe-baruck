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
  const admin = new Browser(origin);
  const editor = new Browser(origin);
  const anonymous = new Browser(origin);
  const password = 'Recette-locale-' + crypto.randomBytes(12).toString('hex');
  const adminEmail = 'admin@example.test';
  const editorEmail = 'editor@example.test';
  let articleId;
  const fields = { action: 'save_article', id: '', version: '0', slug: 'recette-mysql', title: 'Recette MySQL', date: '2026-09-06', category: 'groupe', excerpt: 'Résumé de recette', body: 'Texte de recette.', cover: '', cover_alt: '', status: 'draft' };
  await t.test('premier compte, cookie HTTPOnly et protection CSRF', async () => {
    const page = await anonymous.request('/?page=articles');
    assert.match(page.html, /Créez votre compte/);
    assert.match(page.headers.get('set-cookie'), /HttpOnly/i);
    assert.match(page.headers.get('set-cookie'), /SameSite=Strict/i);
    assert.match(page.headers.get('content-security-policy'), /frame-ancestors 'none'/);
    assert.equal((await anonymous.request('/', { action: 'setup', email: adminEmail, password, name: 'Recette' })).status, 403);
    assert.equal((await admin.post('/', { action: 'setup', email: adminEmail, password, name: 'Administrateur recette' })).status, 303);
    assert.match((await admin.request('/')).html, /Vue d’ensemble/);
    assert.match((await anonymous.request('/?page=articles')).html, /Connectez-vous/);
    assert.equal((await admin.post('/?page=users', { action: 'create_user', email: editorEmail, password, name: 'Rédacteur recette', role: 'editor' })).status, 303);
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
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', slug: 'adresse-modifiee' })).status, 422);
    assert.equal((await admin.post(route, { ...fields, id: articleId, version: '1', status: 'ready' })).status, 303);
    const stale = await admin.post(route, { ...fields, id: articleId, version: '1' });
    assert.equal(stale.status, 409);
    assert.match(stale.html, /Votre saisie est conservée/);
    assert.equal((await editor.post(route, { ...fields, id: articleId, version: '2' })).status, 422);
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
    const imagePath = media.html.match(/value="(\/images\/actualites\/uploads\/[a-f0-9]{32}\.png)"/)?.[1];
    assert.ok(imagePath);
    assert.equal((await admin.post('/?page=edit&id=' + articleId, { ...fields, id: articleId, version: '2', status: 'ready', cover: imagePath, cover_alt: 'Image de recette' })).status, 303);
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
    for (let i = 0; i < 10; i++) await anonymous.post('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    const response = await anonymous.post('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    assert.equal(response.status, 422);
    assert.match(response.html, /Trop de tentatives/);
  });
});
