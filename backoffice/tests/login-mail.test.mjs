import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

test('codes de connexion : transport mail réel capturé sans aucun envoi externe', async t => {
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-login-mail-'));
  t.after(() => fs.rm(folder, { recursive: true, force: true }));
  const config = path.join(folder, 'config.php');
  const capture = path.join(folder, 'message');
  const failure = path.join(folder, 'failure');
  const mailer = path.join(folder, 'sendmail');
  await fs.writeFile(mailer, `#!/bin/sh\ncat > '${capture}'\n[ ! -f '${failure}' ]\n`, { mode: 0o700 });
  const configure = (mail = "'transport'=>'mail'", from = 'contact@groupebaruck.com', environment = 'production') => fs.writeFile(config,
    `<?php return ['environment'=>'${environment}','origin'=>'${environment === 'production' ? 'https://admin.groupebaruck.com' : 'http://127.0.0.1:8091'}','storage'=>'${folder}/storage','contact_mail'=>['from'=>'${from}','to'=>'adresse-contact@example.test'],'login_mail'=>[${mail}]];`, { mode: 0o600 });
  const send = (email = 'compte@example.test') => spawnSync('php', ['-d', `sendmail_path=${mailer} -t -i`, '-r',
    'require "backoffice/src/bootstrap.php"; try { Baruck\\sendLoginCode(json_decode(stream_get_contents(STDIN),true)["email"],"012345"); echo "ACCEPTE"; } catch (Throwable $e) { echo get_class($e); exit(1); }'],
  { input: JSON.stringify({ email }), encoding: 'utf8', env: { ...process.env, BARUCK_CONFIG: config } });
  await t.test('destinataire du compte, expéditeur du domaine et code conservant son zéro initial', async () => {
    await configure();
    assert.equal(send().status, 0);
    const message = await fs.readFile(capture, 'utf8');
    assert.match(message, /To: compte@example.test/);
    assert.ok(!message.includes('adresse-contact@example.test'));
    assert.match(message, /From: Groupe Baruck <contact@groupebaruck.com>/);
    assert.match(message, /012345/);
    assert.match(message, /Content-Transfer-Encoding: quoted-printable/);
  });
  await t.test('production : les adresses de recette et du client restent des destinataires distincts', async () => {
    await configure();
    for (const email of ['gassaza60@gmail.com', 'jokrasso2@gmail.com']) {
      assert.equal(send(email).status, 0);
      const message = await fs.readFile(capture, 'utf8');
      assert.ok(message.includes('To: ' + email));
      assert.equal((message.match(/^To:/gm) ?? []).length, 1);
      assert.doesNotMatch(message, /^(?:Cc|Bcc):/im);
      assert.ok(!message.includes(email === 'jokrasso2@gmail.com' ? 'gassaza60@gmail.com' : 'jokrasso2@gmail.com'));
    }
  });
  await t.test('refus du transport et injections d’en-têtes ne donnent jamais un succès', async () => {
    await fs.writeFile(failure, 'refus');
    const refused = send();
    assert.equal(refused.status, 1);
    assert.equal(refused.stdout, 'Baruck\\ValidationError');
    assert.ok(!refused.stderr.includes('012345'));
    await fs.rm(failure);
    await fs.rm(capture);
    for (const email of ['a@example.test\r\nBcc: b@example.test', 'a@example.test,b@example.test', 'adresse-invalide']) assert.equal(send(email).status, 1);
    await assert.rejects(fs.stat(capture), { code: 'ENOENT' });
    for (const from of ['', 'tiers@example.test', 'contact@groupebaruck.com\r\nBcc: x@example.test']) {
      // Les chaînes de configuration de recette ne contiennent aucune apostrophe.
      await configure("'transport'=>'mail'", from);
      assert.equal(send().status, 1);
    }
  });
  await t.test('aucune boîte de prévisualisation ni transport inconnu en production', async () => {
    await configure("'transport'=>'file'");
    assert.equal(send().status, 1);
    await assert.rejects(fs.stat(path.join(folder, 'storage/login-outbox')), { code: 'ENOENT' });
    await configure("'transport'=>'inconnu'");
    assert.equal(send().status, 1);
    await assert.rejects(fs.stat(capture), { code: 'ENOENT' });
  });
});
