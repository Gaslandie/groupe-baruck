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
  constructor(origin, mailbox) { this.origin = origin; this.mailbox = mailbox; }
  async request(route = '/', data, extraHeaders = {}) {
    const response = await fetch(this.origin + route, { method: data ? 'POST' : 'GET', redirect: 'manual', headers: { Cookie: this.cookie, ...extraHeaders }, body: data instanceof FormData ? data : data ? new URLSearchParams(data) : undefined });
    for (const cookie of response.headers.getSetCookie()) this.cookie = cookie.split(';')[0];
    const html = await response.text();
    return { status: response.status, headers: response.headers, html, csrf: html.match(/name="csrf" value="([a-f0-9]+)"/)?.[1] };
  }
  async login(route, fields) {
    this.mailbox.allow(); // La recette avance la fenêtre d’envoi, sans attendre quinze minutes.
    const response = await this.post(route, fields);
    if (response.status !== 303 || response.headers.get('location') !== '/?page=verify') return response;
    return this.post('/?page=verify', { action: 'verify_code', code: this.mailbox.code(fields.email) });
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
  docker(['run', '-d', '--name', container, '--network', 'baruck-admin', '-p', '127.0.0.1::8080', '-e', 'BARUCK_CONFIG=/config.php', '-v', `${directory}:/app:ro`, '-v', `${configFile}:/config.php:ro`, 'baruck-backoffice-php:local', 'php', '-d', 'opcache.enable=0', '-d', 'upload_max_filesize=8M', '-d', 'post_max_size=10M', '-S', '0.0.0.0:8080', '-t', 'public']);
  const address = docker(['port', container, '8080/tcp']);
  const origin = 'http://' + address;
  await fs.writeFile(configFile, `<?php return ['environment'=>'local','origin'=>'${origin}','site_url'=>'https://groupebaruck.com','storage'=>'/tmp/baruck-data','login_mail'=>['from'=>'contact@groupebaruck.com','transport'=>'file'],'database'=>['dsn'=>'mysql:host=baruck-admin-mysql;dbname=${database};charset=utf8mb4','user'=>'baruck','password'=>'${secret.password}']];`);
  docker(['exec', container, 'php', 'bin/install.php', 'init']);
  docker(['exec', container, 'php', 'tests/validation.php']);
  const mailbox = {
    allow: () => docker(['exec', container, 'rm', '-rf', '/tmp/baruck-data/login-mail-limits']),
    code: (email) => {
      const message = docker(['exec', container, 'cat', '/tmp/baruck-data/login-outbox/' + crypto.createHash('sha256').update(email).digest('hex') + '.txt']);
      const code = message.match(/: ([0-9]{6})/u)?.[1];
      assert.ok(code, 'Un code à six chiffres doit être présent dans le courrier de recette privé');
      return code;
    },
  };
  const admin = new Browser(origin, mailbox);
  const editor = new Browser(origin, mailbox);
  const anonymous = new Browser(origin, mailbox);
  const password = 'Recette-locale-' + crypto.randomBytes(12).toString('hex');
  const adminEmail = 'admin@example.test';
  const editorEmail = 'editor+recette@sous.example.test';
  let articleId;
  let imageId;
  let unusedImageId;
  let uploadedPath;
  let productId;
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
    assert.equal((await admin.post('/?page=verify', { action: 'verify_code', code: mailbox.code(adminEmail) })).status, 303);
    assert.match((await admin.request('/')).html, /Vue d’ensemble/);
    assert.match((await anonymous.request('/?page=articles')).html, /Connectez-vous/);
    assert.equal((await admin.post('/?page=users', { action: 'create_user', email: editorEmail, password, name: 'Rédacteur recette', role: 'editor' })).status, 303);
    assert.equal((await admin.post('/?page=users', { action: 'create_user', email: 'kkkk@dddd', password, name: 'Recette', role: 'editor' })).status, 422);
    const duplicate = await admin.post('/?page=users', { action: 'create_user', email: editorEmail.toUpperCase(), password, name: 'Doublon', role: 'editor' });
    assert.equal(duplicate.status, 422);
    assert.match(duplicate.html, /Cette adresse possède déjà un compte/);
    assert.equal((await editor.login('/', { action: 'login', email: editorEmail, password })).status, 303);
  });
  const freshLogin = async (tag, role = 'editor') => {
    const email = `${tag}@example.test`;
    docker(['exec', '-i', container, 'php', 'bin/install.php', 'user'], JSON.stringify({ email, password, name: 'Recette code', role }));
    mailbox.allow();
    const browser = new Browser(origin, mailbox);
    const start = await browser.post('/', { action: 'login', email, password });
    assert.equal(start.status, 303, start.html);
    assert.equal(start.headers.get('location'), '/?page=verify');
    return { browser, email, code: mailbox.code(email) };
  };
  const ageMail = () => docker(['exec', container, 'php', '-r', 'foreach (glob("/tmp/baruck-data/login-mail-limits/account-*.json") as $file) { $state=json_decode(file_get_contents($file),true); $state["last"]=time()-61; file_put_contents($file,json_encode($state)); }']);
  await t.test('mot de passe seul : aucun accès privé, code lié au serveur et session renouvelée', async () => {
    const { browser, email, code } = await freshLogin('code-private');
    const pendingCookie = browser.cookie;
    const page = await browser.request('/?page=users');
    assert.match(page.html, /Vérifiez votre e-mail/);
    assert.match(page.html, /autocomplete="one-time-code"/);
    assert.ok(!page.html.includes(code), 'Le code ne doit jamais apparaître dans la réponse HTTP');
    assert.equal((await browser.request('/?page=media_api')).status, 401);
    assert.equal((await browser.post('/', { action: 'create_user', email: 'intrus@example.test', password, role: 'admin', name: 'Intrus' })).status, 422);
    const hash = sql(`SELECT code_hash FROM ${database}.login_challenges WHERE email='${email}';`).split('\n')[1];
    assert.match(hash, /^[a-f0-9]{64}$/);
    assert.notEqual(hash, crypto.createHash('sha256').update(code).digest('hex'), 'Le secret HMAC n’est pas stocké avec le code');
    assert.equal((await browser.request('/', { action: 'verify_code', code })).status, 403);
    assert.equal((await browser.post('/', { action: 'verify_code', code }, { Origin: 'https://hostile.example' })).status, 403);
    const outsider = new Browser(origin, mailbox);
    assert.equal((await outsider.post('/', { action: 'verify_code', code })).status, 422);
    assert.equal((await browser.post('/', { action: 'verify_code', code, email: 'intrus@example.test', user_id: 'inventé' })).status, 303);
    assert.notEqual(browser.cookie, pendingCookie);
    assert.match((await browser.request('/?page=account')).html, /<h1[^>]*>Mon compte/);
    assert.equal((await browser.request('/?page=users')).status, 403, 'Le code ne donne pas de droits administrateur au rédacteur');
    assert.equal(sql(`SELECT COUNT(*) FROM ${database}.login_challenges WHERE email='${email}';`).split('\n')[1], '0');
    await browser.post('/', { action: 'logout' });
    assert.equal((await browser.post('/', { action: 'verify_code', code })).status, 422, 'Un code consommé ne se rejoue pas');
  });
  await t.test('mauvais compte, code expiré et cinq essais incorrects ne connectent jamais', async () => {
    const a = await freshLogin('code-owner');
    const b = await freshLogin('code-other');
    assert.equal((await b.browser.post('/', { action: 'verify_code', code: a.code })).status, 422);
    assert.equal((await a.browser.post('/', { action: 'verify_code', code: a.code })).status, 303);
    sql(`UPDATE ${database}.login_challenges SET expires=1 WHERE email='${b.email}';`);
    assert.equal((await b.browser.post('/', { action: 'verify_code', code: b.code })).status, 422);
    assert.match((await b.browser.request('/')).html, /Recevoir mon code/);
    const c = await freshLogin('code-attempts');
    const wrong = c.code === '000000' ? '111111' : '000000';
    for (let i = 0; i < 5; i++) assert.equal((await c.browser.post('/', { action: 'verify_code', code: i === 0 ? ['forgé'] : wrong })).status, 422);
    assert.equal((await c.browser.post('/', { action: 'verify_code', code: c.code })).status, 422);
    assert.equal(sql(`SELECT attempts FROM ${database}.login_challenges WHERE email='${c.email}';`).split('\n')[1], '5');
  });
  await t.test('renvoi limité, ancien code remplacé et changement de compte protégé par CSRF', async () => {
    const { browser, email, code } = await freshLogin('code-resend');
    const before = sql(`SELECT id FROM ${database}.login_challenges WHERE email='${email}';`);
    const concurrent = new Browser(origin, mailbox);
    assert.equal((await concurrent.post('/', { action: 'login', email, password })).status, 422, 'Une autre session ne contourne pas la limite d’envoi');
    assert.equal((await browser.post('/', { action: 'resend_code' })).status, 422);
    ageMail();
    assert.equal((await browser.post('/', { action: 'resend_code' })).status, 303);
    assert.notEqual(sql(`SELECT id FROM ${database}.login_challenges WHERE email='${email}';`), before);
    const second = mailbox.code(email);
    if (second !== code) assert.equal((await browser.post('/', { action: 'verify_code', code })).status, 422);
    ageMail();
    assert.equal((await browser.post('/', { action: 'resend_code' })).status, 303);
    ageMail();
    assert.equal((await browser.post('/', { action: 'resend_code' })).status, 422, 'Trois envois maximum par compte');
    assert.equal((await browser.request('/', { action: 'cancel_login' })).status, 403);
    assert.equal((await browser.post('/', { action: 'cancel_login' })).status, 303);
    assert.equal((await browser.post('/', { action: 'verify_code', code: mailbox.code(email) })).status, 422);
    assert.equal(sql(`SELECT COUNT(*) FROM ${database}.login_challenges WHERE email='${email}';`).split('\n')[1], '0');
  });
  await t.test('limite des codes partagée entre sessions, même après de nouvelles demandes', async () => {
    const { browser, email, code } = await freshLogin('code-window');
    const wrong = code === '000000' ? '111111' : '000000';
    for (let round = 0; round < 2; round++) {
      for (let i = 0; i < 5; i++) assert.equal((await browser.post('/', { action: 'verify_code', code: wrong })).status, 422);
      mailbox.allow();
      assert.equal((await browser.post('/', { action: 'login', email, password })).status, 303);
    }
    const limited = await browser.post('/', { action: 'verify_code', code: mailbox.code(email) });
    assert.equal(limited.status, 422);
    assert.match(limited.html, /Trop de tentatives/);
  });
  await t.test('désactivation, réinitialisation ou changement d’adresse révoquent un code en attente', async () => {
    for (const operation of ['disable', 'reset', 'email']) {
      const { browser, email, code } = await freshLogin('code-revoke-' + operation, 'admin');
      if (operation === 'disable') sql(`UPDATE ${database}.users SET active=0,session_version=session_version+1 WHERE email='${email}';`);
      if (operation === 'reset') docker(['exec', '-i', container, 'php', 'bin/install.php', 'reset-password'], JSON.stringify({ email, password: password + '-nouveau' }));
      if (operation === 'email') docker(['exec', '-i', container, 'php', 'bin/install.php', 'change-email'], JSON.stringify({ email, new_email: 'code-updated@example.test' }));
      assert.equal((await browser.post('/', { action: 'verify_code', code })).status, 422);
      assert.equal((await browser.request('/?page=media_api')).status, 401);
    }
  });
  await t.test('envoi impossible : refus fermé, aucune connexion et aucun code actif', async () => {
    const { browser, email } = await freshLogin('code-mail-failure');
    await browser.post('/', { action: 'cancel_login' });
    mailbox.allow();
    const original = await fs.readFile(configFile, 'utf8');
    try {
      await fs.writeFile(configFile, original.replace("'from'=>'contact@groupebaruck.com'", "'from'=>''"));
      const failed = await browser.post('/', { action: 'login', email, password });
      assert.equal(failed.status, 422);
      assert.match(failed.html, /ne peut pas être envoyé/);
      assert.equal((await browser.request('/?page=media_api')).status, 401);
      assert.equal(sql(`SELECT COUNT(*) FROM ${database}.login_challenges WHERE email='${email}';`).split('\n')[1], '0');
    } finally { await fs.writeFile(configFile, original); }
  });
  await t.test('limite globale d’envoi par IP et compteur corrompu : refus fermé', () => {
    mailbox.allow();
    const output = docker(['exec', container, 'php', '-r', 'require "src/bootstrap.php"; $_SERVER["REMOTE_ADDR"]="192.0.2.1"; $ok=0; $refused=0; for($i=0;$i<25;$i++){try{Baruck\\limitLoginMail("ip-limit-".$i);$ok++;}catch(Baruck\\ValidationError $e){$refused++;}} echo json_encode([$ok,$refused]);']);
    assert.deepEqual(JSON.parse(output), [20, 5]);
    const corrupted = docker(['exec', container, 'php', '-r', 'require "src/bootstrap.php"; $_SERVER["REMOTE_ADDR"]="192.0.2.2"; $p=Baruck\\config()["storage"]."/login-mail-limits/account-".hash("sha256","corrupt").".json";file_put_contents($p,"broken");try{Baruck\\limitLoginMail("corrupt");echo "OPEN";}catch(Throwable $e){echo "CLOSED";}']);
    assert.equal(corrupted, 'CLOSED');
    mailbox.allow();
  });
  await t.test('changement d’identifiant : mot de passe et droits conservés, conflits refusés et sessions fermées', async () => {
    const { browser, email, code } = await freshLogin('code-change-email', 'admin');
    await browser.post('/', { action: 'verify_code', code });
    const original = sql(`SELECT id,password_hash,role FROM ${database}.users WHERE email='${email}';`);
    const newEmail = 'jokrasso-client@example.test';
    docker(['exec', '-i', container, 'php', 'bin/install.php', 'change-email'], JSON.stringify({ email, new_email: newEmail }));
    assert.equal(sql(`SELECT id,password_hash,role FROM ${database}.users WHERE email='${newEmail}';`), original);
    assert.match((await browser.request('/')).html, /Recevoir mon code/);
    assert.equal((await browser.post('/', { action: 'login', email, password })).status, 422);
    assert.equal((await browser.login('/', { action: 'login', email: newEmail, password })).status, 303);
    const conflict = spawnSync('docker', ['exec', '-i', container, 'php', 'bin/install.php', 'change-email'], { input: JSON.stringify({ email: newEmail, new_email: adminEmail }), encoding: 'utf8' });
    assert.equal(conflict.status, 1);
    assert.match(conflict.stderr, /possède déjà un compte/);
    assert.equal(sql(`SELECT id,password_hash,role FROM ${database}.users WHERE email='${newEmail}';`), original);
    // Une session antérieure à l’ajout du code ne bénéficie d’aucune exception.
    docker(['exec', container, 'php', '-r', 'session_save_path("/tmp/baruck-data/sessions"); session_id($argv[1]); session_start(); unset($_SESSION["email_verified"]); session_write_close();', browser.cookie.split('=')[1]]);
    assert.equal((await browser.request('/?page=media_api')).status, 401);
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
  await t.test('groupes historiques : anciens instantanés, brouillon, restauration et validation sans perte ni remplacement forgé', async () => {
    const seed = JSON.parse(await fs.readFile(path.join(directory, 'seed.json'), 'utf8'));
    const reference = seed.articles.find(article => article.slug === 'top-modele-baruck-guinee-2026');
    const id = sql(`SELECT id FROM ${database}.articles WHERE slug='${reference.slug}';`).split('\n')[1];
    const revision = sql(`SELECT id FROM ${database}.article_revisions WHERE article_id='${id}' AND version=1;`).split('\n')[1];
    // Simule exactement les anciennes versions installées qui omettaient les groupes.
    for (const table of ['article_revisions', 'article_publications']) sql(`UPDATE ${database}.${table} SET payload=JSON_REMOVE(payload,'$.groups','$.groupsTitle','$.groupsIntro') WHERE article_id='${id}';`);
    const exported = async () => JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html).articles.find(article => article.slug === reference.slug);
    const snapshot = version => JSON.parse(docker(['exec', container, 'php', '-r', 'require "src/bootstrap.php"; echo Baruck\\query("SELECT payload FROM article_revisions WHERE article_id=? AND version=?",[$argv[1],$argv[2]])->fetchColumn();', id, String(version)]));
    assert.deepEqual((await exported()).groups, reference.groups);
    const form = { ...fields, id, version: '1', slug: reference.slug, title: reference.title, date: reference.date, category: reference.category, excerpt: reference.excerpt, body: 'Brouillon de recette privé', cover: reference.cover, cover_alt: reference.coverAlt, 'groups[0][label]': 'Groupe forgé', 'groupsTitle': 'Titre forgé' };
    assert.equal((await editor.post('/?page=edit&id=' + id, form)).status, 303);
    assert.deepEqual(snapshot(2).groups, reference.groups, 'les groupes proviennent du serveur');
    assert.equal((await exported()).body, reference.body, 'le brouillon ne remplace pas la version validée');
    assert.equal((await editor.post('/?page=history&id=' + id, { action: 'restore_revision', id, version: '2', revision })).status, 303);
    assert.deepEqual(snapshot(3).groups, reference.groups, 'restaurer une ancienne version conserve les groupes et vidéos');
    assert.equal((await admin.post('/?page=edit&id=' + id, { ...form, version: '3', status: 'ready', body: 'Version de recette validée' })).status, 303);
    const ready = await exported();
    assert.deepEqual(ready.groups, reference.groups);
    assert.equal(ready.groupsTitle, reference.groupsTitle);
    assert.equal(ready.groupsIntro, reference.groupsIntro);
    assert.equal(ready.body, 'Version de recette validée');
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.deepEqual(await exported(), ready, 'une réinstallation préserve les contenus modifiés');
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
    imageId = media.html.match(/page=image&amp;id=([a-f0-9]{32})/)?.[1];
    assert.ok(imageId);
    assert.match((await anonymous.request('/?page=image&id=' + imageId)).html, /Connectez-vous/);
    const image = await admin.request('/?page=image&id=' + imageId);
    assert.equal(image.headers.get('content-type'), 'image/png');
    assert.equal((await anonymous.request('/?page=media_api')).status, 401);
    const catalog = JSON.parse((await admin.request('/?page=media_api')).html).items;
    const imagePath = catalog.find(item => item.id === imageId)?.path;
    assert.ok(imagePath);
    uploadedPath = imagePath;
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
    unusedImageId = JSON.parse(imported.html).item.id;
    assert.equal((await admin.post('/?page=edit&id=' + articleId, { ...fields, id: articleId, version: '2', status: 'ready', cover: imagePath, cover_alt: 'Image de recette' })).status, 303);
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory, 'tests/browser-form.mjs'), origin, 'media'], { input: JSON.stringify({ cookie: editor.cookie, articleId }), encoding: 'utf8', timeout: 30000 });
      assert.equal(browser.status, 0, browser.stderr || browser.stdout);
    }
  });
  await t.test('boutique : catalogue initial, fiche, ordre, retrait et suppression', async () => {
    const seedPhoto = '/images/marque-baruck/sac-main-noir.jpg';
    assert.equal((await editor.request('/?page=boutique')).status, 403);
    const catalogue = await admin.request('/?page=boutique');
    assert.match(catalogue.html, /39 article\(s\) · 39 en boutique/);
    assert.match(catalogue.html, /Sac à main noir/);
    const draft = { action: 'save_product', id: '', version: '0', name: 'Ceinture de recette', category: 'sacs', status: 'draft', 'images[0][src]': seedPhoto, 'images[0][alt]': 'Ceinture de recette Baruck' };
    assert.equal((await editor.request('/?page=product', { ...draft, csrf: (await editor.request('/?page=edit')).csrf })).status, 403);
    assert.equal((await admin.post('/?page=product', { ...draft, 'images[0][src]': '' })).status, 422, 'un article sans photo est refusé');
    assert.equal((await admin.post('/?page=product', { ...draft, category: 'groupe' })).status, 422, 'une catégorie d’actualité n’est pas un rayon');
    assert.equal((await admin.post('/?page=product', { ...draft, 'images[0][src]': '/images/../config.php' })).status, 422);
    const created = await admin.post('/?page=product', draft);
    assert.equal(created.status, 303, created.html);
    productId = new URL(created.headers.get('location'), origin).searchParams.get('id');
    assert.equal(sql(`SELECT slug FROM ${database}.products WHERE id='${productId}';`).split('\n')[1], 'ceinture-de-recette', 'identifiant déduit du nom');
    assert.match((await admin.request('/?page=boutique')).html, /40 article\(s\) · 39 en boutique/);
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory, 'tests/browser-form.mjs'), origin, 'product'], { input: JSON.stringify({ cookie: admin.cookie, productId }), encoding: 'utf8', timeout: 30000 });
      assert.equal(browser.status, 0, browser.stderr || browser.stdout);
    }
    assert.equal((await admin.post('/?page=boutique', { action: 'move_product', id: productId, direction: 'up' })).status, 422, 'le premier article ne monte pas');
    assert.equal((await admin.post('/?page=boutique', { action: 'move_product', id: productId, direction: 'down' })).status, 303);
    assert.deepEqual(sql(`SELECT slug FROM ${database}.products ORDER BY position,id LIMIT 2;`).split('\n').slice(1), ['sac-main-noir', 'ceinture-de-recette']);
    assert.equal((await admin.post('/?page=product&id=' + productId, { action: 'switch_product', id: productId, status: 'ready' })).status, 303);
    const page = await admin.request('/?page=product&id=' + productId);
    assert.match(page.html, /Retirer de la boutique/);
    const version = page.html.match(/name="version" value="(\d+)"/)[1];
    assert.equal((await admin.post('/?page=product&id=' + productId, { ...draft, id: productId, version: '0', status: 'ready' })).status, 409);
    assert.equal((await admin.post('/?page=product&id=' + productId, { ...draft, id: productId, version, status: 'ready', 'images[1][src]': uploadedPath, 'images[1][alt]': 'Photo importée' })).status, 303);
    assert.match((await admin.request('/?page=media')).html, /utilisée dans 2 contenus</, 'les photos de la boutique protègent aussi une image');
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: imageId })).status, 422);
    const exported = JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    assert.equal(exported.products.length, 40);
    assert.equal(exported.products[1].id, 'ceinture-de-recette', 'ordre de la boutique conservé dans la publication');
    assert.deepEqual(exported.products[1].images.map((image) => image.src), [seedPhoto, uploadedPath]);
    assert.equal((await admin.post('/?page=product&id=' + productId, { action: 'delete_product', id: productId })).status, 422, 'un article en boutique ne se supprime pas');
    assert.equal((await admin.post('/?page=product&id=' + productId, { action: 'switch_product', id: productId, status: 'draft' })).status, 303);
    assert.ok(!JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html).products.some((item) => item.id === 'ceinture-de-recette'));
    assert.equal((await admin.post('/?page=product&id=' + productId, { action: 'delete_product', id: productId })).status, 303);
    assert.equal((await admin.request('/?page=product&id=' + productId)).status, 404);
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(sql(`SELECT COUNT(*) AS n FROM ${database}.products;`).split('\n')[1], '39', 'une réinstallation ne recrée pas un article supprimé');
  });
  await t.test('photos de groupes et affiches vidéo : export validé et protection de toutes les versions', async () => {
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=', 'base64');
    const upload = new FormData();
    upload.set('csrf', (await admin.request('/?page=media')).csrf);
    upload.set('alt', 'Photo réservée au groupe de recette');
    upload.set('image', new Blob([png], { type: 'image/png' }), 'groupe.png');
    const image = JSON.parse((await admin.request('/?page=media_api', upload)).html).item;
    const created = await admin.post('/?page=edit', { ...fields, slug: 'groupe-media-recette' });
    const id = new URL(created.headers.get('location'), origin).searchParams.get('id');
    const route = '/?page=edit&id=' + id;
    const form = { ...fields, slug: 'groupe-media-recette', id };
    const groups = [{ label: 'Groupe de recette', photos: [{ src: image.path, alt: image.alt, caption: 'Légende de recette' }], video: { src: '/videos/top-modele-2026/candidat-01.mp4', poster: image.path } }];
    // Fixture privée côté serveur : aucun champ HTTP ne permet encore de modifier les groupes.
    const setGroups = (version, groups) => docker(['exec', '-i', container, 'php', '-r', 'require "src/bootstrap.php"; $p=Baruck\\query("SELECT payload FROM article_revisions WHERE article_id=? AND version=?",[$argv[1],$argv[2]])->fetchColumn(); $d=json_decode($p,true); $d["groups"]=json_decode(stream_get_contents(STDIN),true); unset($d["groupsTitle"],$d["groupsIntro"]); if($d["groups"])$d["groupsTitle"]="Photos de recette"; Baruck\\query("UPDATE article_revisions SET payload=? WHERE article_id=? AND version=?",[Baruck\\json($d),$argv[1],$argv[2]]);', id, String(version)], JSON.stringify(groups));
    const exported = async () => JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    setGroups(1, groups);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: image.id })).status, 422, 'le groupe du brouillon protège sa photo');
    assert.ok(!(await exported()).media.some(item => item.path === image.path), 'le média du brouillon reste privé');
    assert.equal((await admin.post(route, { ...form, version: '1', status: 'ready' })).status, 303);
    const publication = await exported();
    assert.deepEqual(publication.articles.find(article => article.slug === form.slug).groups, groups);
    assert.ok(publication.media.some(item => item.path === image.path), 'les médias présents seulement dans les groupes sont exportés');
    assert.equal((await editor.post(route, { ...form, version: '2', status: 'draft' })).status, 303);
    setGroups(3, []);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: image.id })).status, 422, 'la version validée protège encore le média');
    assert.equal((await admin.post(route, { action: 'withdraw_publication', id, version: '3', confirm_withdraw: 'yes' })).status, 303);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: image.id })).status, 422, 'une ancienne version doit rester restaurable après le retrait');
    assert.ok(!(await exported()).media.some(item => item.path === image.path));
    assert.equal((await admin.post(route, { action: 'delete_article', id, version: '4' })).status, 303);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: image.id })).status, 303, 'la suppression devient possible après retrait de toutes les références');
  });
  await t.test('coordonnées : droits, contrôles, lignes vidées et conflit', async () => {
    assert.equal((await editor.request('/?page=coordonnees')).status, 403);
    const page = await admin.request('/?page=coordonnees');
    assert.match(page.html, /\+224 623 72 04 27/, 'les coordonnées du site servent de point de départ');
    assert.match(page.html, /https:\/\/wa\.me\/224623720427/, 'le lien obtenu est montré avant enregistrement');
    const form = {
      action: 'save_coordonnees', version: '0',
      'contacts[landline]': '+224 625 19 72 58', 'contacts[mobile]': '+224 623 54 66 57',
      'contacts[whatsappHq]': '+224 111 22 33 44', 'contacts[whatsappCeo]': '+33 7 55 42 37 54',
      'contacts[email]': 'nouvelle@example.test',
      address: 'Nouvelle adresse de recette, Conakry.', mapQuery: 'Ratoma, Conakry, Guinée',
      'hours[0][days]': 'Lundi – Vendredi', 'hours[0][hours]': '9h – 18h',
      'hours[1][days]': '', 'hours[1][hours]': '',
      'facebook[0][country]': 'Guinée', 'facebook[0][href]': 'https://www.facebook.com/BaruckCommunication',
      'facebook[1][country]': '', 'facebook[1][href]': '',
    };
    const editorCsrf = (await editor.request('/?page=edit')).csrf;
    assert.equal((await editor.request('/', { ...form, csrf: editorCsrf })).status, 403, 'un rédacteur ne modifie pas les coordonnées');
    for (const [field, value, reason] of [
      ['contacts[whatsappHq]', '623 72 04 27', 'numéro sans indicatif'],
      ['contacts[email]', 'sans-arobase', 'e-mail invalide'],
      ['facebook[0][href]', 'https://exemple.test/page', 'lien hors Facebook'],
      ['hours[0][hours]', '', 'ligne d’horaire incomplète'],
    ]) {
      assert.equal((await admin.post('/?page=coordonnees', { ...form, [field]: value })).status, 422, reason);
    }
    assert.equal((await admin.post('/?page=coordonnees', form)).status, 303);
    const saved = await admin.request('/?page=coordonnees');
    assert.match(saved.html, /\+224 111 22 33 44/);
    assert.match(saved.html, /Nouvelle adresse de recette/);
    assert.doesNotMatch(saved.html, /Dimanche/, 'la ligne vidée a bien été retirée');
    assert.equal((await admin.post('/?page=coordonnees', form)).status, 409, 'la version périmée est refusée');
    const exported = JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    assert.equal(exported.contacts.contacts.whatsappHq, '+224 111 22 33 44');
    assert.equal(exported.contacts.hours.length, 1);
    assert.equal(exported.contacts.facebookPages.length, 1);
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html).contacts.contacts.whatsappHq, '+224 111 22 33 44', 'une réinstallation ne rétablit pas les coordonnées du dépôt');
  });
  await t.test('textes de l’accueil : droits, longueurs, structure imposée et conflit', async () => {
    assert.equal((await editor.request('/?page=textes')).status, 403);
    const page = await admin.request('/?page=textes');
    assert.match(page.html, /Présentations principales/);
    assert.doesNotMatch(page.html, /Diaporama d’accueil|volets qui défilent/);
    assert.match(page.html, /Activités du Groupe/);
    assert.match(page.html, /Le Groupe Baruck en Guinée/, 'les textes du site servent de point de départ');
    // Le formulaire renvoie toutes les entrées : la structure appartient au site.
    const fields = Object.fromEntries([...page.html.matchAll(/name="((?:heroSlides|activities)\[[a-z0-9-]+\]\[(?:title|description)\])"[^>]*value="([^"]*)"/g)].map(([, name, value]) => [name, value]));
    for (const [, name, value] of page.html.matchAll(/name="((?:heroSlides|activities)\[[a-z0-9-]+\]\[description\])"[^>]*>([^<]*)<\/textarea>/g)) fields[name] = value;
    assert.equal(Object.keys(fields).length, 24, '3 volets et 9 activités, titre et texte');
    const form = { action: 'save_textes', version: '0', ...fields, 'heroSlides[guinee][title]': 'Le Groupe Baruck, Conakry' };
    const editorCsrf = (await editor.request('/?page=edit')).csrf;
    assert.equal((await editor.request('/', { ...form, csrf: editorCsrf })).status, 403);
    assert.equal((await admin.post('/?page=textes', { ...form, 'activities[cinema][description]': 'x'.repeat(131) })).status, 422, 'texte trop long refusé');
    assert.equal((await admin.post('/?page=textes', { ...form, 'heroSlides[guinee][title]': 'a'.repeat(61) })).status, 422, 'titre trop long refusé');
    assert.equal((await admin.post('/?page=textes', { ...form, 'activities[cinema][title]': '' })).status, 422, 'titre vide refusé');
    const partial = { ...form };
    delete partial['activities[cinema][title]'];
    assert.equal((await admin.post('/?page=textes', partial)).status, 422, 'entrée manquante refusée');
    assert.equal((await admin.post('/?page=textes', { ...form, 'activities[invente][title]': 'Faux', 'activities[invente][description]': 'Faux texte' })).status, 303);
    const saved = await admin.request('/?page=textes');
    assert.match(saved.html, /Le Groupe Baruck, Conakry/);
    assert.doesNotMatch(saved.html, /invente|Faux texte/, 'une entrée inventée n’entre pas dans la structure');
    assert.equal((await admin.post('/?page=textes', form)).status, 409, 'la version périmée est refusée');
    const exported = JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    assert.equal(exported.texts.heroSlides.guinee.title, 'Le Groupe Baruck, Conakry');
    assert.equal(Object.keys(exported.texts.activities).length, 9);
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html).texts.heroSlides.guinee.title, 'Le Groupe Baruck, Conakry', 'une réinstallation ne rétablit pas les textes du dépôt');
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
  await t.test('publication automatique : copie fixe, droits révoqués, échec et reprise du contenu public', async () => {
    const key = crypto.randomBytes(32).toString('hex');
    const worker = async (input, token = key, method = 'POST') => {
      const response = await fetch(origin + '/publication.php', { method, headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' }, body: method === 'POST' ? JSON.stringify(input) : undefined });
      return { status: response.status, headers: response.headers, body: await response.text() };
    };
    const ageRequest = () => sql(`UPDATE ${database}.settings SET payload=JSON_SET(payload,'$.job.requested_at','2026-01-01T00:00:00Z') WHERE name='publication';`);
    assert.match((await admin.request('/?page=publication')).html, /installation locale ne publie pas/);
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 422);
    assert.equal((await worker({ action: 'status' })).status, 401, 'aucun accès robot sans configuration');
    const originalConfig = await fs.readFile(configFile, 'utf8');
    const githubToken = 'local_fixture_publication_token';
    docker(['exec', '-i', container, 'php', '-r', 'file_put_contents("/tmp/dispatch-router.php",stream_get_contents(STDIN));'], `<?php
      if (($_SERVER['HTTP_AUTHORIZATION'] ?? '') !== 'Bearer ${githubToken}') { http_response_code(401); exit; }
      $input=json_decode(file_get_contents('php://input'),true);
      if ($input !== ['ref'=>'main','inputs'=>['publication'=>true]]) { http_response_code(422); exit; }
      http_response_code(is_file('/tmp/dispatch-fail') ? 503 : 204);
    `);
    docker(['exec', '-d', container, 'php', '-S', '127.0.0.1:8095', '/tmp/dispatch-router.php']);
    await fs.writeFile(configFile, originalConfig.replace(/\];$/, `,'publication_key'=>'${key}','publication_github_token'=>'${githubToken}','publication_dispatch_url'=>'http://127.0.0.1:8095/dispatch'];`));
    assert.ok((await fs.readFile(configFile, 'utf8')).includes(`'publication_key'=>'${key}'`));
    assert.equal((await worker({ action: 'status' }, 'incorrect')).status, 401);
    assert.equal((await worker({}, key, 'GET')).status, 405);
    assert.equal((await worker({ action: 'status', padding: 'x'.repeat(1025) })).status, 422);
    assert.equal((await anonymous.post('/', { action: 'publish' })).status, 422);
    assert.equal((await editor.request('/?page=edit', { action: 'publish', role: 'admin', csrf: (await editor.request('/?page=edit')).csrf })).status, 403);
    assert.equal((await admin.request('/?page=publication', { action: 'publish' })).status, 403);
    assert.equal((await admin.post('/?page=publication', { action: 'publish' }, { Origin: 'https://hostile.example' })).status, 403);
    assert.match((await admin.request('/?page=publication')).html, /Publier sur le site/);
    const created = await admin.post('/?page=edit', { ...fields, slug: 'publication-automatique', title: 'Avant la demande', status: 'ready' });
    const id = new URL(created.headers.get('location'), origin).searchParams.get('id');
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 303);
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 409, 'un double clic ne crée pas deux envois');
    assert.match((await admin.request('/?page=publication')).html, /En attente de mise en ligne/);
    for (const action of ['inspect', 'repair_riviera']) assert.equal((await worker({ action })).status, 422, 'les opérations temporaires de maintenance ne sont plus disponibles');
    const attempt = { action: 'complete', id: 'a'.repeat(32), sha256: 'b'.repeat(64), run: '100' };
    assert.equal((await worker(attempt)).status, 409, 'aucune confirmation avant prise en charge');
    assert.equal((await admin.post('/?page=edit&id=' + id, { ...fields, id, version: '1', slug: 'publication-automatique', title: 'Après la demande', status: 'ready' })).status, 303);
    const claimed = await worker({ action: 'claim', run: '100' });
    assert.equal(claimed.status, 200, claimed.body);
    assert.equal(claimed.headers.get('x-baruck-claimed'), 'yes');
    assert.equal(JSON.parse(claimed.body).articles.find(item => item.slug === 'publication-automatique').title, 'Avant la demande', 'l’envoi reste une copie fixe');
    assert.ok(!claimed.body.includes('brouillon-prive'));
    for (const secretValue of [key, password, secret.password, adminEmail]) assert.ok(!claimed.body.includes(secretValue));
    assert.equal(crypto.createHash('sha256').update(claimed.body).digest('hex'), claimed.headers.get('x-baruck-sha256'));
    const job = { id: claimed.headers.get('x-baruck-publication'), sha256: claimed.headers.get('x-baruck-sha256'), run: '100' };
    assert.equal((await worker({ action: 'claim', run: '101' })).status, 409, 'un autre robot ne prend pas un envoi en cours');
    assert.equal((await worker({ ...job, action: 'authorize', sha256: '0'.repeat(64) })).status, 409);
    assert.equal((await worker({ ...job, action: 'authorize' })).status, 200);
    assert.equal((await worker({ ...job, action: 'complete' })).status, 200);
    assert.match((await admin.request('/?page=publication')).html, /Dernière mise en ligne confirmée/);
    assert.equal((await worker({ ...job, action: 'complete' })).status, 409, 'un ancien résultat ne remplace pas un nouveau');
    const current = await worker({ action: 'claim', run: '102', bootstrap: true });
    assert.equal(current.headers.get('x-baruck-claimed'), 'no');
    assert.equal(current.body, claimed.body, 'une mise à jour du code conserve les derniers contenus publiés');
    ageRequest();
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 303);
    const failed = await worker({ action: 'claim', run: '103' });
    const failedJob = { id: failed.headers.get('x-baruck-publication'), sha256: failed.headers.get('x-baruck-sha256'), run: '103' };
    assert.equal((await worker({ ...failedJob, action: 'fail' })).status, 200);
    assert.match((await admin.request('/?page=publication')).html, /Mise en ligne échouée/);
    assert.equal((await worker({ action: 'claim', run: '104' })).body, claimed.body, 'un échec conserve la dernière copie publique');
    ageRequest();
    docker(['exec', container, 'touch', '/tmp/dispatch-fail']);
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 422, 'le refus du service ne prétend pas avoir lancé la publication');
    assert.deepEqual(JSON.parse((await worker({ action: 'status' })).body), { pending: false });
    docker(['exec', container, 'rm', '/tmp/dispatch-fail']);
    const publisher = new Browser(origin, mailbox);
    const publisherEmail = 'publication@example.test';
    assert.equal((await admin.post('/?page=users', { action: 'create_user', name: 'Compte publication', email: publisherEmail, password, role: 'admin' })).status, 303);
    await publisher.login('/', { action: 'login', email: publisherEmail, password });
    ageRequest();
    assert.equal((await publisher.post('/?page=publication', { action: 'publish' })).status, 303);
    sql(`UPDATE ${database}.users SET active=0,session_version=session_version+1 WHERE email='${publisherEmail}';`);
    assert.deepEqual(JSON.parse((await worker({ action: 'status' })).body), { pending: false });
    assert.match((await publisher.request('/?page=publication')).html, /Connectez-vous/);
    assert.equal((await worker({ action: 'claim', run: '105' })).body, claimed.body, 'le compte désactivé ne publie pas ses nouvelles données');
    sql(`UPDATE ${database}.users SET active=1 WHERE email='${publisherEmail}';`);
    await publisher.login('/', { action: 'login', email: publisherEmail, password });
    ageRequest();
    assert.equal((await publisher.post('/?page=publication', { action: 'publish' })).status, 303);
    const revoked = await worker({ action: 'claim', run: '106' });
    sql(`UPDATE ${database}.users SET role='editor' WHERE email='${publisherEmail}';`);
    assert.equal((await worker({ action: 'authorize', id: revoked.headers.get('x-baruck-publication'), sha256: revoked.headers.get('x-baruck-sha256'), run: '106' })).status, 409, 'droits recontrôlés juste avant le transfert');
    assert.equal((await publisher.request('/?page=publication')).status, 403);
    sql(`UPDATE ${database}.users SET role='admin' WHERE email='${publisherEmail}';`);
    await publisher.post('/', { action: 'logout' });
    await publisher.login('/', { action: 'login', email: publisherEmail, password });
    ageRequest();
    assert.equal((await publisher.post('/?page=publication', { action: 'publish' })).status, 303);
    sql(`UPDATE ${database}.users SET session_version=session_version+1 WHERE email='${publisherEmail}';`);
    assert.deepEqual(JSON.parse((await worker({ action: 'status' })).body), { pending: false }, 'une demande liée à une ancienne session est refusée');
    ageRequest();
    assert.equal((await admin.post('/?page=publication', { action: 'publish' })).status, 303);
    await worker({ action: 'claim', run: '107' });
    sql(`UPDATE ${database}.settings SET payload=JSON_SET(payload,'$.job.started_at','2026-01-01T00:00:00Z') WHERE name='publication';`);
    assert.deepEqual(JSON.parse((await worker({ action: 'status' })).body), { pending: false }, 'un envoi abandonné cesse de bloquer la publication');
    assert.match((await admin.request('/?page=publication')).html, /interrompue/);
  });
  await t.test('mesure d’audience sans cookie : collecte, statistiques, conseils et export CSV', async () => {
    const phone = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1';
    const collect = (body, headers = {}) => fetch(origin + '/collect.php', { method: 'POST', body: JSON.stringify(body), headers: { Origin: 'https://groupebaruck.com', 'User-Agent': phone, ...headers } });
    const preflight = await fetch(origin + '/collect.php', { method: 'OPTIONS', headers: { Origin: 'https://www.groupebaruck.com' } });
    assert.equal(preflight.status, 204);
    assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://www.groupebaruck.com');
    assert.equal((await collect({ p: '/', w: 390 }, { Origin: 'https://hostile.example' })).status, 403);
    assert.equal((await fetch(origin + '/collect.php', { method: 'POST', body: '{}' })).status, 403);
    assert.equal((await collect({ p: '/', w: 1200 }, { 'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1)' })).status, 204);
    assert.equal((await collect({ p: '/../config.php', w: 390 })).status, 204);
    const count = () => sql(`SELECT COUNT(*) AS n FROM ${database}.page_views;`).split('\n')[1];
    assert.equal(count(), '0', 'robots et chemins hors site ignorés');
    // Un site neuf n'a aucune visite : la page ne doit pas tomber sur des séries vides,
    // et une panne de rendu ne doit jamais publier les chemins des fichiers du serveur.
    for (const query of ['', '&days=7', '&days=365']) {
      const empty = await admin.request('/?page=stats' + query);
      assert.equal(empty.status, 200, 'statistiques lisibles sans aucune visite' + query);
      assert.match(empty.html, /Mesure d’audience non active/);
      assert.doesNotMatch(empty.html, /headers already sent|\/app\/|Warning<\/b>|indisponible/, 'ni avertissement PHP ni chemin serveur dans la page');
    }
    for (const [p, r, agent] of [['/', 'https://l.facebook.com/l.php?u=1', phone], ['/actualites/recette-mysql/', 'https://groupebaruck.com/', phone], ['/actualites/recette-mysql', '', 'Mozilla/5.0 (X11; Linux x86_64) Firefox/130.0']]) {
      assert.equal((await collect({ p, r, w: agent === phone ? 390 : 1440 }, { 'User-Agent': agent })).status, 204);
    }
    assert.equal(sql(`SELECT COUNT(*) AS a, COUNT(DISTINCT visitor) AS b, SUM(referrer='interne') AS c, SUM(referrer='facebook.com') AS d, SUM(device='mobile') AS e, SUM(path='/actualites/recette-mysql/') AS f FROM ${database}.page_views;`).split('\n')[1], '3\t2\t1\t1\t2\t2');
    assert.ok(!sql(`SELECT * FROM ${database}.page_views;`).includes('Firefox'), 'aucun navigateur ni adresse conservés en clair');
    // Un en-tête Origin se forge hors navigateur : la provenance reçue n’entre jamais
    // telle quelle en base, sinon l’export CSV porterait une formule active.
    assert.equal((await collect({ p: '/contact/', r: 'http://=cmd|calc.evil.com/', w: 390 })).status, 204);
    assert.equal(sql(`SELECT COUNT(*) AS n FROM ${database}.page_views WHERE referrer='autre';`).split('\n')[1], '1');
    assert.equal(sql(`SELECT COUNT(*) AS n FROM ${database}.page_views WHERE referrer LIKE '=%';`).split('\n')[1], '0', 'aucune provenance forgée enregistrée');
    const stats = await admin.request('/?page=stats&days=7');
    assert.equal(stats.status, 200);
    for (const expected of [/Recette MySQL/, /Facebook/, /Mobile/, /Ce que disent les chiffres/, /Page la plus vue/, /Activité de l’équipe/]) assert.match(stats.html, expected);
    assert.doesNotMatch(stats.html, /style="/, 'aucun style en ligne : la CSP les refuse');
    const editorStats = await editor.request('/?page=stats');
    assert.match(editorStats.html, /Visiteurs · 30 jours/);
    assert.doesNotMatch(editorStats.html, /Activité de l’équipe/);
    const csv = await admin.post('/?page=stats', { action: 'export_stats', days: '7' });
    assert.equal(csv.status, 200);
    assert.match(csv.headers.get('content-type'), /text\/csv/);
    assert.match(csv.html, /pages;"Recette MySQL \(\/actualites\/recette-mysql\/\)";2;2/);
    assert.match(csv.html, /sources;"?Provenance inconnue/);
    assert.doesNotMatch(csv.html, /;=/, 'aucune cellule interprétée comme une formule');
    assert.match((await admin.request('/?page=articles')).html, /Vues · 30 j/);
    const dashboard = await admin.request('/');
    for (const expected of [/À faire/, /Visiteurs par jour/, /brouillons? attend(?:ent)? une validation/, /Dernières modifications/]) assert.match(dashboard.html, expected);
  });
  await t.test('suppression confirmée : brouillon jamais publié et image inutilisée, refus sinon', async () => {
    const draftId = (await admin.request('/?page=articles&q=Brouillon')).html.match(/page=edit&amp;id=([a-f0-9]{32})/)?.[1];
    assert.ok(draftId);
    const editPage = await admin.request('/?page=edit&id=' + draftId);
    assert.match(editPage.html, /data-confirm="/);
    assert.match(editPage.html, /Supprimer l’actualité/);
    assert.match(editPage.html, /id="confirm-dialog"/);
    const version = editPage.html.match(/name="version" value="(\d+)"/)[1];
    assert.equal((await editor.post('/?page=edit&id=' + draftId, { action: 'delete_article', id: draftId, version })).status, 403);
    assert.equal((await admin.post('/?page=edit&id=' + articleId, { action: 'delete_article', id: articleId, version: '3' })).status, 422, 'un article retenu pour publication ne se supprime pas');
    assert.equal((await admin.post('/?page=edit&id=' + draftId, { action: 'delete_article', id: draftId, version: '999' })).status, 409);
    assert.equal((await admin.post('/?page=edit&id=' + draftId, { action: 'delete_article', id: draftId, version })).status, 303);
    assert.equal((await admin.request('/?page=edit&id=' + draftId)).status, 404);
    assert.equal(sql(`SELECT COUNT(*) AS n FROM ${database}.article_revisions WHERE article_id='${draftId}';`).split('\n')[1], '0');
    const media = await admin.request('/?page=media');
    assert.match(media.html, /id="upload-dialog"/);
    assert.match(media.html, /utilisée dans 1 contenu</);
    assert.match(media.html, /non utilisée/);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: imageId })).status, 422, 'une image utilisée reste en place');
    assert.equal((await editor.post('/?page=media', { action: 'delete_media', id: unusedImageId })).status, 403);
    assert.equal((await admin.post('/?page=media', { action: 'delete_media', id: unusedImageId })).status, 303);
    assert.equal((await admin.request('/?page=image&id=' + unusedImageId)).status, 404);
    // Invariant : autant de fichiers que d’images enregistrées, quel que soit le nombre d’imports de la recette.
    assert.equal(docker(['exec', container, 'sh', '-c', 'ls /tmp/baruck-data/media | wc -l']), sql(`SELECT COUNT(*) AS n FROM ${database}.media;`).split('\n')[1]);
    const users = await admin.request('/?page=users');
    assert.match(users.html, /id="user-dialog"/);
    assert.match(users.html, /data-confirm="/);
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
    const logged = await editor.login('/?page=login', { action: 'login', email: editorEmail, password });
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
    const otherIdentity = await editor.login('/?page=login', { action: 'login', email: adminEmail, password });
    assert.equal(otherIdentity.headers.get('location'), '/?page=dashboard');
    assert.ok(!(await editor.request(recoverRoute)).html.includes('Ma saisie à récupérer'));
    await editor.post('/', { action: 'logout' });
    await editor.login('/', { action: 'login', email: editorEmail, password });
  });
  await t.test('désactivation et changement de mot de passe invalident les sessions', async () => {
    const editorId = sql(`SELECT id FROM ${database}.users WHERE email='${editorEmail}';`).split('\n')[1];
    assert.ok(editorId);
    assert.equal((await admin.post('/?page=users', { action: 'toggle_user', id: editorId })).status, 303);
    assert.match((await editor.request('/?page=articles')).html, /Connectez-vous/);
    const other = new Browser(origin, mailbox);
    assert.equal((await other.login('/', { action: 'login', email: adminEmail, password })).status, 303);
    assert.equal((await admin.post('/?page=account', { action: 'change_password', current_password: password, password: password + '2' })).status, 303);
    assert.match((await other.request('/')).html, /Connectez-vous/);
  });
  await t.test('limitation des tentatives, même sur un compte inexistant', async () => {
    for (let i = 0; i < 9; i++) await anonymous.login('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    const legitimate = new Browser(origin, mailbox);
    assert.equal((await legitimate.login('/', { action: 'login', email: adminEmail, password: password + '2' })).status, 303);
    await anonymous.login('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    const response = await anonymous.login('/', { action: 'login', email: 'absent@example.test', password: 'incorrect' });
    assert.equal(response.status, 422);
    assert.match(response.html, /Trop de tentatives/);
  });
  await t.test('accès direct local : nouvelle session, CSRF, droits révoqués et désactivation du mode', async () => {
    const original = await fs.readFile(configFile, 'utf8');
    // Le scénario de publication précédent a laissé des clés fictives dans sa configuration.
    const localOnly = original.replace(/,'publication_(?:key|github_token|dispatch_url)'=>'[^']*'/g, '');
    const id = sql(`SELECT id FROM ${database}.users WHERE email='${adminEmail}';`).split('\n')[1];
    const peer = docker(['inspect', '-f', '{{range .NetworkSettings.Networks}}{{.Gateway}}{{end}}', container]);
    const direct = new Browser(origin, mailbox);
    assert.match((await direct.request('/')).html, /Recevoir mon code/);
    try {
      const directConfig = localOnly.replace("'environment'=>'local'", `'local_direct_user_id'=>'${id}','local_direct_peer'=>'${peer}','environment'=>'local'`);
      await fs.writeFile(configFile, directConfig);
      assert.match((await direct.request('/')).html, /<h1[^>]*>Vue d’ensemble/);
      assert.equal((await direct.request('/?page=media_api')).status, 200);
      assert.equal((await direct.request('/?page=users')).status, 200);
      assert.equal((await direct.post('/?page=users', { action: 'create_user', email: 'direct-local@example.test', password, name: 'Compte de recette local', role: 'editor' })).status, 303, 'Les écritures locales autorisées fonctionnent avec un jeton CSRF valide');
      assert.equal((await direct.request('/', { action: 'logout' })).status, 403, 'La protection CSRF reste obligatoire');
      assert.equal((await direct.post('/', { action: 'logout' }, { Origin: 'https://hostile.example' })).status, 403);
      for (const header of ['X-Forwarded-For', 'X-Forwarded-Host', 'X-Forwarded-Proto', 'Forwarded']) {
        assert.match((await direct.request('/', undefined, { [header]: '127.0.0.1' })).html, /Recevoir mon code/);
      }
      await fs.writeFile(configFile, directConfig.replace("'environment'=>'local'", "'publication_key'=>'configured','environment'=>'local'"));
      assert.equal((await direct.request('/?page=media_api')).status, 401, 'Le mode est refusé si une publication distante est configurée');
      await fs.writeFile(configFile, directConfig);
      sql(`UPDATE ${database}.users SET active=0 WHERE id='${id}';`);
      assert.equal((await direct.request('/?page=media_api')).status, 401);
      sql(`UPDATE ${database}.users SET active=1,role='editor' WHERE id='${id}';`);
      assert.equal((await direct.request('/?page=media_api')).status, 401);
    } finally {
      sql(`UPDATE ${database}.users SET active=1,role='admin' WHERE id='${id}';`);
      await fs.writeFile(configFile, original);
    }
    assert.equal((await direct.request('/?page=media_api')).status, 401, 'Aucun droit de contournement ne persiste dans le cookie');
    assert.match((await direct.request('/')).html, /Recevoir mon code/);
  });
});
