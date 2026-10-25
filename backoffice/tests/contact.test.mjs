import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import { spawn } from 'node:child_process';
import { once } from 'node:events';

// Vrai endpoint HTTP et vrai mail() PHP, avec un transport local sans envoi réel.
test('envoi interne : destinataire imposé, validation, transport et limites', async t => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-contact-'));
  const storage = path.join(folder, 'storage');
  const capture = path.join(folder, 'mail');
  const failure = path.join(folder, 'failure');
  const mailer = path.join(folder, 'sendmail');
  const config = path.join(folder, 'config.php');
  await fs.writeFile(mailer, `#!/bin/sh\ncat >> '${capture}'\n[ ! -f '${failure}' ]\n`, { mode: 0o700 });
  const writeConfig = (from = 'contact@groupebaruck.com', environment = 'local', trusted = false) => fs.writeFile(config, `<?php return ['environment'=>'${environment}','trusted_proxy'=>${trusted ? 'true' : 'false'},'origin'=>'${environment === 'local' ? 'http://127.0.0.1:8091' : 'https://admin.groupebaruck.com'}','site_url'=>'https://groupebaruck.com','storage'=>'${storage}','contact_mail'=>['from'=>'${from}','to'=>'jokrasso2@gmail.com']];`, { mode: 0o600 });
  await writeConfig();
  const reservation = net.createServer();
  reservation.listen(0, '127.0.0.1');
  await once(reservation, 'listening');
  const port = reservation.address().port;
  await new Promise(resolve => reservation.close(resolve));
  const child = spawn('php', ['-d', `sendmail_path=${mailer} -t -i`, '-S', `127.0.0.1:${port}`, '-t', 'backoffice/public'], { env: { ...process.env, BARUCK_CONFIG: config }, stdio: ['ignore', 'ignore', 'pipe'] });
  let errors = '';
  child.stderr.on('data', bytes => { errors += bytes; });
  t.after(async () => {
    child.kill();
    await once(child, 'exit');
    await fs.rm(folder, { recursive: true, force: true });
  });
  const url = `http://127.0.0.1:${port}/contact.php`;
  const data = { name: 'Équipe de test', email: 'visiteur@example.com', phone: '+224 600 000 000', objet: 'Autre demande', message: 'Bonjour, je souhaite des renseignements sur vos activités.', botcheck: false };
  const request = (body = data, headers = {}, method = 'POST') => fetch(url, { method, headers: { Origin: 'https://groupebaruck.com', 'Content-Type': 'application/json', ...headers }, ...(method === 'POST' ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}) });
  for (let count = 0; count < 100; count++) {
    try { await request(data, {}, 'OPTIONS'); break; }
    catch { if (count === 99) throw new Error(errors); await new Promise(resolve => setTimeout(resolve, 25)); }
  }
  const reset = () => fs.rm(path.join(storage, 'contact'), { recursive: true, force: true });
  await t.test('prévol autorisé, sans cookie ni cache', async () => {
    const r = await request(data, {}, 'OPTIONS');
    assert.equal(r.status, 204);
    assert.equal(r.headers.get('access-control-allow-origin'), 'https://groupebaruck.com');
    assert.equal(r.headers.get('cache-control'), 'no-store');
    assert.equal(r.headers.get('set-cookie'), null);
  });
  await t.test('origine absente ou étrangère et méthode GET refusées', async () => {
    for (const Origin of ['', 'null', 'https://hostile.example', 'https://groupebaruck.com.hostile.example']) {
      const r = await request(data, { Origin });
      assert.equal(r.status, 403);
      assert.equal(r.headers.get('access-control-allow-origin'), null);
    }
    assert.equal((await request(data, {}, 'GET')).status, 405);
  });
  await t.test('formulaire HTML, JSON malformé et requête volumineuse refusés', async () => {
    assert.equal((await request('name=test', { 'Content-Type': 'application/x-www-form-urlencoded' })).status, 415);
    for (const body of ['{', '[]', 'null', '{"name":'.repeat(20)]) assert.equal((await request(body)).status, 422);
    assert.equal((await request('x'.repeat(24001))).status, 413);
  });
  await t.test('injections dans les en-têtes et champs falsifiés refusés sans envoi', async () => {
    for (const body of [
      { ...data, email: 'a@example.com\r\nBcc: autre@example.com' },
      { ...data, name: 'Nom\r\nBcc: autre@example.com' },
      { ...data, email: 'a@example.com,b@example.com' },
      { ...data, email: 'adresse invalide' },
      { ...data, name: ['nom'] }, { ...data, name: ' ' },
      { ...data, message: 'trop court' }, { ...data, message: 'é'.repeat(5001) },
      { ...data, objet: 'Objet inventé' }, { ...data, phone: '\0' },
      { ...data, to: 'autre@example.com' }, { ...data, from: 'autre@example.com' },
      { ...data, botcheck: true }, { ...data, botcheck: 'false' },
    ]) assert.equal((await request(body)).status, 422, JSON.stringify(body).slice(0,100));
    await assert.rejects(fs.stat(capture), { code: 'ENOENT' });
  });
  await t.test('mail accepté : destinataire fixe, expéditeur local et réponse au visiteur', async () => {
    const r = await request();
    assert.equal(r.status, 200);
    assert.deepEqual(await r.json(), { success: true });
    const mail = await fs.readFile(capture, 'utf8');
    assert.match(mail, /To: jokrasso2@gmail.com/i);
    assert.match(mail, /From: Groupe Baruck <contact@groupebaruck.com>/);
    assert.match(mail, /Reply-To: visiteur@example.com/);
    assert.match(mail, /Content-Transfer-Encoding: quoted-printable/);
    const limits = await fs.readFile(path.join(storage, 'contact/limits.json'), 'utf8');
    assert.ok(!limits.includes('127.0.0.1') && !limits.includes(data.email) && !limits.includes(data.message));
    assert.equal((await fs.stat(path.join(storage, 'contact/limits.json'))).mode & 0o777, 0o600);
  });
  await t.test('sujets anglais et caractères accentués acceptés', async () => {
    assert.equal((await request({ ...data, objet: 'Partnership or collaboration' })).status, 200);
    assert.equal((await request({ ...data, objet: 'Event hostesses' })).status, 200);
  });
  await t.test('sixième envoi refusé, même avec une adresse réseau annoncée différente', async () => {
    await reset();
    for (let i = 0; i < 5; i++) assert.equal((await request()).status, 200);
    const r = await request(data, { 'X-Forwarded-For': '8.8.8.8' });
    assert.equal(r.status, 429);
    assert.equal(r.headers.get('retry-after'), '3600');
  });
  await t.test('limite globale, expiration et stockage corrompu', async () => {
    const file = path.join(storage, 'contact/limits.json');
    await fs.writeFile(file, JSON.stringify(Array.from({ length: 100 }, (_, i) => ({ ip: 'other-' + i, time: Math.floor(Date.now()/1000) }))));
    assert.equal((await request()).status, 429);
    await fs.writeFile(file, JSON.stringify([{ ip: 'old', time: 1 }]));
    assert.equal((await request()).status, 200);
    await fs.writeFile(file, 'broken');
    assert.equal((await request()).status, 503);
    await reset();
  });
  await t.test('refus du transport : aucune fausse confirmation, nouvelle tentative possible', async () => {
    await fs.writeFile(failure, 'fail');
    const r = await request();
    assert.equal(r.status, 503);
    assert.deepEqual(await r.json(), { success: false });
    await fs.rm(failure);
    assert.equal((await request()).status, 200);
  });
  await t.test('HTTPS obligatoire en production, aucun proxy accepté sans configuration', async () => {
    await writeConfig('contact@groupebaruck.com', 'production');
    assert.equal((await request()).status, 403);
    assert.equal((await request(data, { 'X-Forwarded-Proto': 'https' })).status, 403);
    await writeConfig('contact@groupebaruck.com', 'production', true);
    assert.equal((await request(data, { 'X-Forwarded-Proto': 'https' })).status, 200);
    await writeConfig();
  });
  await t.test('les tentatives simultanées partagent le même verrou', async () => {
    await reset();
    const script = `require 'backoffice/src/bootstrap.php'; require 'backoffice/src/contact.php'; try { Baruck\\contactLimit('127.0.0.1',time()); echo 'ok'; } catch (Baruck\\ContactError $e) { echo $e->getCode(); }`;
    const results = await Promise.all(Array.from({ length: 10 }, () => new Promise((resolve, reject) => {
      const process = spawn('php', ['-r', script], { env: { BARUCK_CONFIG: config }, stdio: ['ignore', 'pipe', 'pipe'] });
      let out = ''; let error = '';
      process.stdout.on('data', x => { out += x; });
      process.stderr.on('data', x => { error += x; });
      process.on('error', reject);
      process.on('exit', code => code === 0 ? resolve(out) : reject(new Error(error)));
    })));
    assert.equal(results.filter(x => x === 'ok').length, 5);
    assert.equal(results.filter(x => x === '429').length, 5);
    await reset();
  });
  await t.test('expéditeur absent ou hors du domaine : envoi désactivé', async () => {
    for (const from of ['', 'autre@example.com']) {
      await writeConfig(from);
      assert.equal((await request()).status, 503);
    }
    await writeConfig();
  });
});
