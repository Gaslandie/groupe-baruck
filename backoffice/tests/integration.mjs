import {readFileSync} from 'node:fs';
import {englishProjection} from '../../src/lib/editorial-translations.ts';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { pageModels } from '../bin/pages.mjs';
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
    if (this.editorialFields) fields=this.editorialFields(fields);
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
  // Les anciennes recettes utilisent désormais des traductions de test explicites.
  // Les essais d'anglais invalide fournissent english_json et contournent ce confort.
  const editorialFields = fields => {
    fields={...fields};
    if (['switch_product','delete_product'].includes(fields.action) && fields.version===undefined && /^[a-f0-9]{32}$/.test(fields.id||'')) fields.version=sql(`SELECT version FROM ${database}.products WHERE id='${fields.id}'`).split('\n')[1] || '0';
    if(fields.action==='switch_product' && fields.status==='ready' && fields.english_reviewed===undefined)fields.english_reviewed='yes';
    if(!['save_article','save_product'].includes(fields.action) || Object.keys(fields).some(key=>key==='english_json'||key==='english'||key.startsWith('english[')))return fields;
    const images=field=>{
      const result=[];
      for(const [key,value]of Object.entries(fields)){const match=key.match(new RegExp('^'+field+'\\[(\\d+)\\]\\[([^\\]]+)\\]$'));if(match){result[Number(match[1])]??={};result[Number(match[1])][match[2]]=value;}}
      return result.filter(item=>item.src);
    };
    const translate=value=>value ? 'English test text' : '';
    let english;
    if(fields.action==='save_product')english={name:translate(fields.name),images:images('images').map(p=>({alt:translate(p.alt)}))};
    else{
      let saved;
      if(/^[a-f0-9]{32}$/.test(fields.id||'')){
        const hex=sql(`SELECT HEX(r.payload) FROM ${database}.articles a JOIN ${database}.article_revisions r ON r.article_id=a.id AND r.version=a.version WHERE a.id='${fields.id}'`).split('\n')[1];
        if(hex)saved=JSON.parse(Buffer.from(hex,'hex').toString('utf8'));
      }
      const reference=JSON.parse(readFileSync(path.join(directory,'seed.json'),'utf8')).articles.find(a=>a.slug===fields.slug)||{};
      saved??=reference;
      if(!Object.hasOwn(saved,'groups'))saved={...saved,groups:reference.groups||[],groupsTitle:reference.groupsTitle,groupsIntro:reference.groupsIntro};
      english={title:translate(fields.title),excerpt:translate(fields.excerpt),body:translate(fields.body),coverAlt:translate(fields.cover_alt),gallery:images('gallery').map(p=>({alt:translate(p.alt),caption:translate(p.caption)})),groupsTitle:translate(saved.groupsTitle),groupsIntro:translate(saved.groupsIntro),groups:(saved.groups||[]).map(g=>({label:translate(g.label),note:translate(g.note),photos:g.photos.map(p=>({alt:translate(p.alt),caption:translate(p.caption)}))}))};
    }
    fields.english_json=JSON.stringify(english);
    if(fields.status==='ready')fields.english_reviewed='yes';
    return fields;
  };
  admin.editorialFields=editorialFields;editor.editorialFields=editorialFields;

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
  await t.test('adresse de recette puis adresse client : le serveur choisit le destinataire et révoque l’ancien accès', async () => {
    const { browser, email } = await freshLogin('client-recipient', 'admin');
    let previous = email;
    for (const target of ['gassaza60@gmail.com', 'jokrasso2@gmail.com']) {
      docker(['exec', '-i', container, 'php', 'bin/install.php', 'change-email'], JSON.stringify({ email: previous, new_email: target }));
      assert.equal((await browser.request('/?page=media_api')).status, 401, 'ancienne session révoquée');
      assert.equal((await browser.post('/', { action: 'login', email: previous, password })).status, 422);
      mailbox.allow();
      const otherAddress = target === 'gassaza60@gmail.com' ? 'jokrasso2@gmail.com' : 'gassaza60@gmail.com';
      assert.equal((await browser.post('/', { action: 'login', email: target, password, to: otherAddress })).status, 303);
      assert.equal((await browser.request('/?page=media_api')).status, 401, 'le mot de passe seul ne suffit toujours pas');
      const pending = await browser.request('/?page=verify');
      assert.ok(pending.html.includes(target.slice(0, 2) + '***@gmail.com'));
      const code = mailbox.code(target); // Transport fichier privé : aucun email réel.
      assert.ok(!pending.html.includes(code));
      assert.equal((await browser.post('/', { action: 'verify_code', code, email: otherAddress })).status, 303);
      assert.equal((await browser.request('/?page=media_api')).status, 200);
      previous = target;
    }
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
  const pageValues = id => Object.fromEntries(Object.entries(pageModels()[id].fields).map(([key, field]) => [key, structuredClone(field.initial)]));
  const pageForm = (id, version, values) => {
    const fields = {};
    const flatten = (name, value) => {
      if (Array.isArray(value) && !value.length) fields[name + '[__empty]'] = '1';
      else if (value && typeof value === 'object') for (const [key, child] of Object.entries(value)) flatten(`${name}[${key}]`, child);
      else fields[name] = String(value);
    };
    for (const [key, value] of Object.entries(values)) flatten(`fields[${key}]`, value);
    return Object.keys(fields).length > 800 ? {action:'save_page',id,version:String(version),page_fields_json:JSON.stringify(values)} : { action: 'save_page', id, version: String(version), ...fields };
  };
  const pageExport = async () => JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
  const pageRecord = id => JSON.parse(Buffer.from(sql(`SELECT HEX(payload) FROM ${database}.settings WHERE name='page:${id}'`).split('\n')[1], 'hex').toString('utf8'));
  await t.test('Pages : douze formulaires bilingues, droits serveur et anciens liens', async () => {
    assert.match((await anonymous.request('/?page=pages')).html, /Connectez-vous/);
    for (const page of ['pages', 'page_edit&id=home', 'textes']) assert.equal((await editor.request('/?page=' + page)).status, 403);
    const csrf = (await editor.request('/')).csrf;
    for (const action of ['save_page', 'validate_page', 'restore_page', 'save_textes']) assert.equal((await editor.request('/', { action, id: 'home', version: '0', csrf, english_reviewed: 'yes' })).status, 403);
    assert.equal((await admin.request('/?page=textes')).headers.get('location'), '/?page=page_edit&id=home');
    assert.equal((await admin.post('/', { action: 'save_textes', version: '0' })).status, 422, 'ancienne écriture ne contourne pas la validation bilingue');
    const listing = await admin.request('/?page=pages');
    assert.equal(listing.status, 200);
    assert.equal((listing.html.match(/Modifier cette page/g) || []).length, 12);
    for (const id of Object.keys(pageModels())) {
      const form = await admin.request('/?page=page_edit&id=' + id);
      assert.equal(form.status, 200, id);
      assert.match(form.html, /name="version" value="0"/);
      assert.equal((form.html.match(/name="fields\[/g) || []).length, 4, id);
      assert.match(form.html, /lang="fr"/); assert.match(form.html, /lang="en"/);
    }
    assert.equal(sql(`SELECT COUNT(*) FROM ${database}.settings WHERE name LIKE 'page:%'`).split('\n')[1], '0', 'consulter ne crée aucune ligne');
    assert.equal((await admin.request('/?page=page_edit&id=inconnue')).status, 404);
    assert.equal((await admin.post('/', { action: 'validate_page', id: 'inconnue', version: '0', english_reviewed: 'yes' })).status, 422);
  });
  await t.test('Pages : anciennes saisies conservées, brouillon privé et anglais obligatoire', async () => {
    const legacy = JSON.parse(await fs.readFile('content/textes.json', 'utf8'));
    legacy.heroSlides.guinee.title = 'Ancien titre personnalisé';
    const payload = Buffer.from(JSON.stringify(legacy)).toString('hex');
    sql(`INSERT INTO ${database}.settings (name,payload,version,updated_at,updated_by) SELECT 'textes',CONVERT(0x${payload} USING utf8mb4),1,UTC_TIMESTAMP(),id FROM ${database}.users WHERE email='${adminEmail}';`);
    const initial = await admin.request('/?page=page_edit&id=home&section=section-1');
    assert.match(initial.html, /Ancien titre personnalisé/);
    assert.match(initial.html, /name="fields\[heroSlides.guinee.title\]\[en\]"[^>]*value=""/, 'aucune traduction inventée pour une ancienne saisie personnalisée');
    const exported = await pageExport();
    assert.deepEqual(exported.pages, {});
    assert.equal(exported.texts.heroSlides.guinee.title, legacy.heroSlides.guinee.title);
    const values = pageValues('home');
    values['heroSlides.guinee.title'] = { fr: 'Le Groupe Baruck, Conakry', en: '' };
    const saved = await admin.post('/?page=page_edit&id=home', pageForm('home', 0, values));
    assert.equal(saved.status, 303, saved.html);
    assert.equal(pageRecord('home').draft['heroSlides.guinee.title'].fr, 'Le Groupe Baruck, Conakry');
    assert.equal(pageRecord('home').draft['heroSlides.guinee.title'].en, '');
    assert.equal(pageRecord('home').validated['heroSlides.guinee.title'].fr, legacy.heroSlides.guinee.title);
    assert.equal((await pageExport()).texts.heroSlides.guinee.title, legacy.heroSlides.guinee.title, 'brouillon ne remplace pas l’ancien texte');
    assert.deepEqual((await pageExport()).pages, {});
    assert.equal((await admin.post('/?page=page_edit&id=home', { ...pageForm('home', 1, pageValues('home')), action: 'validate_page', english_reviewed: 'yes' })).status, 422, 'les valeurs envoyées à valider ne remplacent pas le brouillon enregistré');
    assert.equal((await admin.post('/?page=page_edit&id=home', { action: 'validate_page', id: 'home', version: '1' })).status, 422);
    values['heroSlides.guinee.title'].en = 'Baruck Group, Conakry';
    assert.equal((await admin.post('/?page=page_edit&id=home', pageForm('home', 1, values))).status, 303);
    assert.equal((await admin.post('/?page=page_edit&id=home', { action: 'validate_page', id: 'home', version: '2', english_reviewed: 'yes' })).status, 303);
    assert.equal(pageRecord('home').reviewed, true);
    const approved = await pageExport();
    assert.equal(approved.texts.translations.en.heroSlides.guinee.title, values['heroSlides.guinee.title'].en);
    assert.deepEqual(approved.pages.home, values);
    values['heroSlides.guinee.title'].fr = 'MODIFICATION PRIVEE NON PUBLIEE';
    assert.equal((await admin.post('/?page=page_edit&id=home', pageForm('home', 3, values))).status, 303);
    assert.equal(pageRecord('home').reviewed, false, 'changer le français remet la relecture à zéro');
    assert.deepEqual((await pageExport()).pages.home, approved.pages.home, 'la dernière validation reste la seule version publique');
    const conflict = await admin.post('/?page=page_edit&id=home&section=section-1', pageForm('home', 3, { ...values, 'heroSlides.guinee.title': { fr: 'SAISIE DU SECOND ONGLET', en: 'Second tab' } }));
    assert.equal(conflict.status, 409);
    assert.match(conflict.html, /SAISIE DU SECOND ONGLET/);
    assert.match(conflict.html, /name="version" value="3"/);
    assert.match(conflict.html, /data-page-validate disabled/);
    assert.equal((await admin.post('/?page=page_edit&id=home', { action: 'restore_page', id: 'home', version: '3' })).status, 409);
    docker(['exec', container, 'php', 'bin/install.php', 'init']);
    assert.equal(pageRecord('home').draft['heroSlides.guinee.title'].fr, 'MODIFICATION PRIVEE NON PUBLIEE', 'réinstallation additive, brouillon conservé');
    assert.deepEqual((await pageExport()).pages.home, approved.pages.home);
    assert.equal((await admin.post('/?page=page_edit&id=home', { action: 'restore_page', id: 'home', version: '4' })).status, 303);
    assert.deepEqual(pageRecord('home').draft, approved.pages.home);
  });
  await t.test('Pages : versions séparées par page et entrées forgées refusées', async () => {
    const values = pageValues('contact');
    const route = '/?page=page_edit&id=contact';
    const form = pageForm('contact', 0, values);
    const cases = [
      { ...form, version: '-1' },
      { ...form, status: 'ready' },
      { ...form, 'fields[route][fr]': '/intrus/', 'fields[route][en]': '/intrus/' },
      { ...form, 'fields[meta.title][en]': '<script>alert(1)</script>' },
      { ...form, 'fields[meta.title][en]': 'x'.repeat(241) },
      { ...form, 'fields[meta.title][en]': 'Titre\nforgé' },
      { ...form, 'fields[meta.title][de]': 'Intrus' },
    ];
    const missing = { ...form }; delete missing['fields[meta.title][fr]']; cases.push(missing);
    for (const bad of cases) assert.equal((await admin.post(route, bad)).status, 422);
    assert.deepEqual((await pageExport()).pages.contact, undefined);
    values['meta.title'] = { fr: 'Contact de recette', en: 'Test contact' };
    values['meta.description'] = { fr: 'Description française de recette.', en: 'English test description.' };
    assert.equal((await admin.post(route, pageForm('contact', 0, values))).status, 303);
    assert.equal((await admin.post(route, { action: 'validate_page', id: 'contact', version: '1', english_reviewed: 'yes' })).status, 303);
    assert.deepEqual((await pageExport()).pages.contact, values);
    // Le prochain export sert aussi à vérifier l’absence réelle du brouillon dans les builds.
    const pending = pageValues('home'); pending['meta.title'].fr = 'MODIFICATION PRIVEE NON PUBLIEE';
    assert.equal((await admin.post('/?page=page_edit&id=home', pageForm('home', 5, pending))).status, 303);
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory, 'tests/browser-form.mjs'), origin, 'pages'], { input: JSON.stringify({ cookie: admin.cookie }), encoding: 'utf8', timeout: 30000 });
      assert.equal(browser.status, 0, browser.stderr || browser.stdout);
    }
  });
  await t.test('Pages : enregistrer, recharger et valider chacune des autres pages', async () => {
    for (const [id, model] of Object.entries(pageModels())) {
      if (['home', 'contact'].includes(id)) continue;
      const route = '/?page=page_edit&id=' + id;
      const current = await admin.request(route);
      const version = Number(current.html.match(/name="version" value="(\d+)"/)[1]);
      const values = pageValues(id);
      values['meta.title'] = { fr: 'Titre validé : ' + model.label, en: 'Approved title: ' + id };
      assert.equal((await admin.post(route, pageForm(id, version, values))).status, 303, id);
      const reloaded = await admin.request(route);
      assert.match(reloaded.html, /Titre validé : /, id);
      assert.equal((await pageExport()).pages[id], undefined, 'le premier brouillon reste privé : ' + id);
      assert.equal((await admin.post(route, { action: 'validate_page', id, version: String(version + 1), english_reviewed: 'yes' })).status, 303, id);
      assert.deepEqual((await pageExport()).pages[id], values, id);
    }
  });
  await t.test('Pages : reprendre les instantanés de l’étape 2 sans les écraser', async () => {
    const current = pageRecord('groupe');
    const version = Number(sql(`SELECT version FROM ${database}.settings WHERE name='page:groupe'`).split('\n')[1]);
    const old = { draft: { 'meta.title': current.draft['meta.title'], 'meta.description': current.draft['meta.description'] }, validated: { 'meta.title': current.validated['meta.title'], 'meta.description': current.validated['meta.description'] }, reviewed: true, validated_at: current.validated_at };
    const write = (payload, value) => sql(`UPDATE ${database}.settings SET payload=CONVERT(0x${Buffer.from(JSON.stringify(payload)).toString('hex')} USING utf8mb4),version=${value} WHERE name='page:groupe'`);
    write(old, 700);
    try {
      const page = await admin.request('/?page=page_edit&id=groupe&section=portraits');
      assert.equal(page.status, 200);
      assert.match(page.html, /name="version" value="700"/);
      assert.deepEqual(pageRecord('groupe'), old, 'la consultation ne réécrit pas la base');
      docker(['exec', container, 'php', 'bin/install.php', 'init']);
      assert.deepEqual(pageRecord('groupe'), old, 'une réinstallation laisse intact l’ancien instantané');
      const exported = (await pageExport()).pages.groupe;
      assert.deepEqual(exported['meta.title'], old.validated['meta.title']);
      assert.equal(exported['media.presidentPortrait'].src, pageValues('groupe')['media.presidentPortrait'].src, 'les nouvelles pièces reprennent les contenus déjà publics');
    } finally { write(current, version); }
  });
  await t.test('Pages : sections, listes, photos privées, validation et suppression protégée', async () => {
    const route = section => '/?page=page_edit&id=groupe&section=' + section;
    const version = () => Number(sql(`SELECT version FROM ${database}.settings WHERE name='page:groupe'`).split('\n')[1]);
    const saveSection = async (section, change = {}, forged = {}) => {
      const keys = pageModels().groupe.sections.find(item => item.id === section).fields;
      const values = Object.fromEntries(keys.map(key => [key, pageRecord('groupe').draft[key]]));
      const result = await admin.post(route(section), { ...pageForm('groupe', version(), { ...values, ...change }), section, ...forged });
      return result;
    };
    assert.equal((await admin.request(route('inconnue'))).status, 404);
    assert.equal((await saveSection('nom-dirigeant', {}, { 'fields[meta.title][fr]': 'Intrus', 'fields[meta.title][en]': 'Intruder' })).status, 422, 'un formulaire de section ne touche pas une autre section');
    assert.equal((await saveSection('nom-dirigeant', { 'president.givenNames': {fr:'Prénoms validés de recette',en:'Approved test given names'} })).status, 303);
    const beforePhoto = pageRecord('groupe').draft['media.presidentPortrait'];
    const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=', 'base64');
    const upload = new FormData(); upload.set('image',new Blob([png],{type:'image/png'}),'page.png'); upload.set('alt','Photo de page de recette'); upload.set('csrf',(await admin.request('/')).csrf);
    const image = JSON.parse((await admin.request('/?page=media_api',upload)).html).item;
    const photo = {src:image.path,alt:{fr:'Photo de page de recette',en:''},width:9999,height:9999};
    assert.equal((await saveSection('portraits', {'media.presidentPortrait':photo})).status,303);
    assert.equal(pageRecord('groupe').draft['media.presidentPortrait'].width,1,'la dimension est déduite du fichier, pas du navigateur');
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,422,'le brouillon protège son image');
    assert.ok(!(await pageExport()).media.some(item=>item.path===image.path),'la photo privée reste absente de l’export');
    assert.equal((await admin.post(route('portraits'),{action:'validate_page',id:'groupe',version:String(version()),english_reviewed:'yes'})).status,422,'description anglaise obligatoire pour la photo');
    photo.alt.en='Test page photograph';
    assert.equal((await saveSection('portraits', {'media.presidentPortrait':photo})).status,303);
    const countries = pageRecord('groupe').draft['data.presenceCountries'];
    const changed = [countries[1], countries[0], {...countries[2],name:{fr:'Pays de recette',en:'Test country'},links:[]}];
    const invalid = structuredClone(changed); invalid[0].links[0].href='javascript:alert(1)';
    const refused = await saveSection('AboutPresence', {'data.presenceCountries':invalid});
    assert.equal(refused.status,422); assert.doesNotMatch(refused.html,/Warning|\/app\//);
    assert.equal((await saveSection('AboutPresence', {'data.presenceCountries':changed})).status,303);
    assert.deepEqual(pageRecord('groupe').draft['data.presenceCountries'],changed,'ajout, retrait, ordre et liste de liens vide conservés');
    assert.equal(pageRecord('groupe').draft['president.givenNames'].fr,'Prénoms validés de recette','enregistrer une autre section conserve la saisie précédente');
    assert.equal((await admin.post(route('AboutPresence'),{action:'validate_page',id:'groupe',version:String(version()),english_reviewed:'yes'})).status,303);
    const ready = await pageExport();
    assert.equal(ready.pages.groupe['media.presidentPortrait'].src,image.path);
    assert.ok(ready.media.some(item=>item.path===image.path),'les images des pages validées sont exportées');
    assert.equal((await saveSection('portraits',{'media.presidentPortrait':beforePhoto})).status,303);
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,422,'la dernière version validée protège encore son image');
    assert.equal((await admin.post(route('portraits'),{action:'validate_page',id:'groupe',version:String(version()),english_reviewed:'yes'})).status,303);
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,303,'suppression possible seulement quand les deux versions ont libéré l’image');
    if (process.env.BARUCK_TEST_CHROME) {
      const browser = spawnSync(process.execPath, [path.join(directory,'tests/browser-form.mjs'),origin,'page-lists'],{input:JSON.stringify({cookie:admin.cookie}),encoding:'utf8',timeout:30000});
      assert.equal(browser.status,0,browser.stderr||browser.stdout);
    }
  });
  await t.test('JECA et Espoir de Vie : ordre, grands formulaires, validation et brouillons privés', async () => {
    const version=id=>Number(sql(`SELECT version FROM ${database}.settings WHERE name='page:${id}'`).split('\n')[1]);
    const save=async(id,section,values,extra={})=>admin.post('/?page=page_edit&id='+id+'&section='+section,{action:'save_page',id,section,version:String(version(id)),page_fields_json:JSON.stringify(values),...extra});
    const ready=async id=>admin.post('/',{action:'validate_page',id,version:String(version(id)),english_reviewed:'yes'});
    const original=pageRecord('jeca').validated;
    const editions=structuredClone(original['data.editions']).reverse();
    editions[0].photos.reverse();
    editions[0].title={fr:'Édition validée de recette',en:'Approved test edition'};
    assert.equal((await save('jeca','editions',{'data.editions':editions})).status,303);
    assert.deepEqual(pageRecord('jeca').draft['data.editions'],editions);
    assert.deepEqual((await pageExport()).pages.jeca['data.editions'],original['data.editions']);
    assert.equal((await ready('jeca')).status,303);
    assert.deepEqual((await pageExport()).pages.jeca['data.editions'],editions);
    const stale=version('jeca')-1;
    assert.equal((await save('jeca','editions',{'data.editions':editions},{version:String(stale)})).status,409);
    const invalid=structuredClone(editions);invalid[1].key=invalid[0].key;
    assert.equal((await save('jeca','editions',{'data.editions':invalid})).status,422);
    assert.equal((await save('jeca','editions',{}, {page_fields_json:'{'})).status,422);
    assert.equal((await editor.post('/',{action:'save_page',id:'jeca',version:String(version('jeca')),page_fields_json:'{}'})).status,403);
    editions[0].title={fr:'EDITION PRIVEE NON PUBLIEE',en:''};
    assert.equal((await save('jeca','editions',{'data.editions':editions})).status,303);
    assert.equal((await ready('jeca')).status,422);
    assert.equal((await pageExport()).pages.jeca['data.editions'][0].title.en,'Approved test edition');
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l+0AAAAASUVORK5CYII=','base64');
    const upload=new FormData();upload.set('csrf',(await admin.request('/')).csrf);upload.set('image',new Blob([png],{type:'image/png'}),'action.png');upload.set('alt','Nouvelle photo partagée');
    const image=JSON.parse((await admin.request('/?page=media_api',upload)).html).item;
    const photoKey='item-00000000-0000-4000-8000-000000000001';
    const additional=[{key:photoKey,image:{src:image.path,alt:{fr:'Nouvelle photo de recette',en:''},width:999,height:999}}];
    assert.equal((await save('espoir-de-vie','nouvelles-photos',{'data.additionalPhotos':additional})).status,303);
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,422);
    assert.ok(!(await pageExport()).media.some(item=>item.path===image.path),'la nouvelle photo incomplète reste privée');
    const actions=structuredClone(pageRecord('espoir-de-vie').draft['data.actions']);actions[0].photo=photoKey;actions[1].photo=photoKey;
    assert.equal((await save('espoir-de-vie','actions',{'data.actions':actions})).status,303,'une action peut choisir une nouvelle photo partagée');
    assert.equal((await ready('espoir-de-vie')).status,422,'la description anglaise est exigée sur la source partagée');
    additional[0].image.alt.en='New test shared image';
    assert.equal((await save('espoir-de-vie','nouvelles-photos',{'data.additionalPhotos':additional})).status,303);
    assert.equal((await ready('espoir-de-vie')).status,303);
    assert.ok((await pageExport()).media.some(item=>item.path===image.path));
    assert.equal((await save('espoir-de-vie','nouvelles-photos',{'data.additionalPhotos':[]})).status,303);
    assert.equal((await ready('espoir-de-vie')).status,422,'une référence manquante empêche la validation');
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,422,'l’image validée est toujours protégée');
    assert.equal((await admin.post('/',{action:'restore_page',id:'espoir-de-vie',version:String(version('espoir-de-vie'))})).status,303);
    const galleries=structuredClone(pageRecord('espoir-de-vie').draft['data.galleries']).reverse();
    galleries[0].photos.reverse();galleries[0].title={fr:'Galerie validée de recette',en:'Approved test gallery'};
    assert.equal((await save('espoir-de-vie','galeries',{'data.galleries':galleries})).status,303);
    assert.equal((await ready('espoir-de-vie')).status,303);
    assert.deepEqual((await pageExport()).pages['espoir-de-vie']['data.galleries'],galleries);
    if(process.env.BARUCK_TEST_CHROME){
      const browser=spawnSync(process.execPath,[path.join(directory,'tests/browser-form.mjs'),origin,'page-galleries'],{input:JSON.stringify({cookie:admin.cookie}),encoding:'utf8',timeout:60000});
      assert.equal(browser.status,0,browser.stderr||browser.stdout);
      assert.doesNotMatch(JSON.stringify((await pageExport()).pages['espoir-de-vie']),/DERNIERE PHOTO PRIVEE/);
    }
    assert.equal((await pageExport()).pageSchema,5);
  });
  await t.test('Étape 5 : huit contenus, traductions, listes et formulaires réels', async () => {
    const ids=['studio-photo','hotesses-evenementielles','marque-baruck','actualites','mediatheque','contact','projets-realisations','mentions-legales'];
    const sections=[];
    for(const id of ids){
      const model=pageModels()[id], state=pageRecord(id);
      const key=Object.keys(model.fields).find(key=>model.fields[key].since===5 && ['text','textarea'].includes(model.fields[key].kind));
      const section=model.sections.find(section=>section.fields.includes(key));
      sections.push({id,key,section:section.id});
      const route='/?page=page_edit&id='+id+'&section='+section.id;
      assert.equal((await editor.request(route)).status,403,id+' : rédacteur refusé');
      assert.equal((await editor.post('/',{action:'save_page',id,version:'0',section:section.id,page_fields_json:JSON.stringify({[key]:{fr:'Intrus',en:'Intruder'}})})).status,403);
      let version=Number((await admin.request(route)).html.match(/name="version" value="(\d+)"/)[1]);
      const values=structuredClone(state.draft);
      values[key]={fr:'CONTENU VALIDE '+id,en:''};
      assert.equal((await admin.post(route,pageForm(id,version,values))).status,303,id);
      version++;
      assert.notEqual((await pageExport()).pages[id][key].fr,values[key].fr,'brouillon privé');
      assert.equal((await admin.post(route,{action:'validate_page',id,version:String(version),english_reviewed:'yes'})).status,422,'anglais manquant refusé');
      values[key].en='APPROVED CONTENT '+id;
      if(id==='studio-photo')values['data.studioGallery'].reverse();
      if(id==='hotesses-evenementielles')values['data.hostessOffers'].reverse();
      assert.equal((await admin.post(route,pageForm(id,version,values))).status,303,id);
      version++;
      assert.equal((await admin.post(route,{action:'validate_page',id,version:String(version),english_reviewed:'yes'})).status,303,id);
      assert.deepEqual((await pageExport()).pages[id],values,id+' : seul le contenu validé sort');
      version++;
      assert.equal((await admin.post(route,{action:'save_page',id,version:String(version-1),section:section.id,page_fields_json:JSON.stringify({[key]:{fr:'Conflit',en:'Conflict'}})})).status,409,id+' : ancien onglet refusé');
    }
    if(process.env.BARUCK_TEST_CHROME){
      const studioSection=pageModels()['studio-photo'].sections.find(s=>s.fields.includes('data.studioPriceGroups')).id;
      const browser=spawnSync(process.execPath,[path.join(directory,'tests/browser-form.mjs'),origin,'remaining-pages'],{input:JSON.stringify({cookie:admin.cookie,sections,studioSection}),encoding:'utf8',timeout:60000});
      assert.equal(browser.status,0,browser.stderr||browser.stdout);
      assert.doesNotMatch(JSON.stringify(await pageExport()),/SAISIE NAVIGATEUR PRIVEE/);
    }
  });
  await t.test('Éditorial bilingue : anglais obligatoire, versions retenues, restauration et aperçu', async () => {
    const original={...fields,slug:'article-bilingue-recette',title:'Titre français validé',excerpt:'Résumé français validé',body:'Corps français validé'};
    const english={...englishProjection({...original,gallery:[],groups:[]},'article'),title:'Approved English title',excerpt:'Approved English summary',body:'## English heading\n\n**Approved English body**.'};
    const form={...original,english_json:JSON.stringify(english)};
    const created=await admin.post('/?page=edit',form);assert.equal(created.status,303,created.html);
    const articleId=new URL(created.headers.get('location'),origin).searchParams.get('id'),route='/?page=edit&id='+articleId;
    const published=async()=>JSON.parse((await admin.post('/?page=publication',{action:'export'})).html);
    const validate={...form,id:articleId,version:'1',status:'ready'};
    assert.equal((await admin.post(route,validate)).status,422,'relecture exigée');
    assert.equal((await admin.post(route,{...validate,english_reviewed:'yes',english_json:JSON.stringify({...english,title:''})})).status,422,'anglais incomplet refusé');
    assert.equal((await admin.post(route,{...validate,english_reviewed:'yes',english_json:JSON.stringify({...english,body:'[Click](javascript:alert(1))'})})).status,422,'lien actif anglais refusé');
    assert.equal((await editor.post(route,{...validate,english_reviewed:'yes'})).status,403);
    assert.equal((await admin.post(route,{...validate,english_reviewed:'yes'})).status,303);
    assert.equal((await published()).articles.find(a=>a.slug===original.slug).translations.en.title,english.title);
    const revision=sql(`SELECT id FROM ${database}.article_revisions WHERE article_id='${articleId}' AND version=1`).split('\n')[1];
    assert.equal((await admin.post(route,{...form,id:articleId,version:'2',title:'BROUILLON FR PRIVE',english_json:JSON.stringify({...english,title:'PRIVATE ENGLISH DRAFT'})})).status,303);
    assert.equal((await published()).articles.find(a=>a.slug===original.slug).title,original.title);
    assert.equal((await admin.post('/?page=history&id='+articleId,{action:'restore_revision',id:articleId,version:'3',revision})).status,303);
    assert.equal(JSON.parse(Buffer.from(sql(`SELECT HEX(payload) FROM ${database}.article_revisions WHERE article_id='${articleId}' AND version=4`).split('\n')[1],'hex')).translations.en.title,english.title);
    const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9sAAAAASUVORK5CYII=','base64');
    const upload=new FormData();upload.set('csrf',(await admin.request('/')).csrf);upload.set('image',new Blob([png],{type:'image/png'}),'bilingual.png');upload.set('alt','Photo produit bilingue');
    const image=JSON.parse((await admin.request('/?page=media_api',upload)).html).item;
    const product={action:'save_product',id:'',version:'0',name:'Produit bilingue validé',category:'sacs',status:'draft','images[0][src]':image.path,'images[0][alt]':'Photo du produit',english_json:JSON.stringify({name:'Approved bilingual product',images:[{alt:'Approved product photo'}]})};
    const productCreated=await admin.post('/?page=product',product);assert.equal(productCreated.status,303,productCreated.html);
    const productId=new URL(productCreated.headers.get('location'),origin).searchParams.get('id'),productRoute='/?page=product&id='+productId;
    assert.equal((await admin.post(productRoute,{...product,id:productId,version:'1',status:'ready'})).status,422);
    assert.equal((await admin.post(productRoute,{...product,id:productId,version:'1',status:'ready',english_reviewed:'yes'})).status,303);
    const retained=(await published()).products.find(p=>p.name===product.name);assert.equal(retained.translations.en.name,'Approved bilingual product');
    const seedImage=JSON.parse(readFileSync(path.join(directory,'seed.json'),'utf8')).products[0].images[0].src;
    assert.equal((await admin.post(productRoute,{...product,id:productId,version:'2',name:'BROUILLON PRODUIT PRIVE','images[0][src]':seedImage})).status,303);
    assert.deepEqual((await published()).products.find(p=>p.id===retained.id),retained,'le brouillon produit ne remplace pas la validation');
    assert.equal((await admin.post('/?page=media',{action:'delete_media',id:image.id})).status,422,'la photo de la version validée reste protégée');
    docker(['exec',container,'php','bin/install.php','init']);
    assert.deepEqual((await published()).products.find(p=>p.id===retained.id),retained,'réinstallation sans écrasement ni recréation de validation');
    if(process.env.BARUCK_TEST_CHROME){
      const browser=spawnSync(process.execPath,[path.join(directory,'tests/browser-form.mjs'),origin,'editorial'],{input:JSON.stringify({cookie:admin.cookie,articleId,productId}),encoding:'utf8',timeout:60000});
      assert.equal(browser.status,0,browser.stderr||browser.stdout);
    }
    assert.doesNotMatch(JSON.stringify(await published()),/BROUILLON NAVIGATEUR|PRIVATE ENGLISH DRAFT|BROUILLON PRODUIT PRIVE/);
  });
  await t.test('export : droits révoqués relus et image indisponible refusée sans fichier partiel', async () => {
    const output = docker(['exec', container, 'php', '-r', 'require "src/bootstrap.php"; $id=Baruck\\createUser(["email"=>"export-revoked@example.test","password"=>"Recette export 2026!","name"=>"Export révoqué","role"=>"admin"]); $user=Baruck\\query("SELECT * FROM users WHERE id=?",[$id])->fetch(); Baruck\\query("UPDATE users SET role=? WHERE id=?",["editor",$id]); Baruck\\exportContent($user); echo "EXPORT_INTERDIT";']);
    assert.match(output, /Vos accès ont changé/);
    assert.doesNotMatch(output, /EXPORT_INTERDIT|baruck-editorial-v1/);
    const good = JSON.parse((await admin.post('/?page=publication', { action: 'export' })).html);
    const filename = path.basename(good.products.find(item => item.name === 'Produit bilingue validé').images[0].src);
    const move = (restore) => docker(['exec', container, 'php', '-r', 'require "src/bootstrap.php"; $f=Baruck\\config()["storage"]."/media/".$argv[1]; if(!rename($argv[2]==="restore"?$f.".test-missing":$f,$argv[2]==="restore"?$f:$f.".test-missing"))exit(1);', filename, restore ? 'restore' : 'hide']);
    move(false);
    try {
      const refused = await admin.post('/?page=publication', { action: 'export' });
      assert.equal(refused.status, 422);
      assert.match(refused.html, /image validée est indisponible/);
      assert.doesNotMatch(refused.html, /baruck-editorial-v1/);
    } finally { move(true); }
  });
  await t.test('export exclut brouillons, utilisateurs, secrets et médias non utilisés', async () => {
    assert.equal((await admin.post('/?page=edit', { ...fields, slug: 'brouillon-prive', title: 'Brouillon privé' })).status, 303);
    const response = await admin.post('/?page=publication', { action: 'export' });
    assert.equal(response.status, 200, response.html);
    const exported = JSON.parse(response.html);
    assert.ok(exported.articles.some((item) => item.slug === 'recette-mysql'));
    assert.ok(!exported.articles.some((item) => item.slug === 'brouillon-prive'));
    assert.equal(exported.media.length, 3);
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
    const snapshot = JSON.parse(claimed.body);
    assert.equal(Object.keys(snapshot.pages).length, 12, 'toutes les pages validées suivent le même envoi');
    assert.equal(snapshot.articles.find(item => item.slug === 'article-bilingue-recette').translations.en.title, 'Approved English title');
    assert.equal(snapshot.products.find(item => item.name === 'Produit bilingue validé').translations.en.name, 'Approved bilingual product');
    assert.doesNotMatch(claimed.body, /PRIVATE ENGLISH DRAFT|BROUILLON PRODUIT PRIVE|SAISIE NAVIGATEUR PRIVEE/);
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
