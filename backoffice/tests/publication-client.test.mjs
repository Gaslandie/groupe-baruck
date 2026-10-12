import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { publicationClient, readResponse, workerUrl } from '../bin/publication-client.mjs';

test('le robot refuse un hôte détourné et une réponse trop grande', async () => {
  for (const url of ['https://hostile.example/publication.php', 'https://admin.groupebaruck.com/publication.php?secret=x', 'https://user:secret@admin.groupebaruck.com/publication.php', 'http://admin.groupebaruck.com/publication.php']) {
    assert.throws(() => workerUrl(url));
  }
  await assert.rejects(readResponse(new Response('x'.repeat(20)), 10), /volumineuse/);
  await assert.rejects(readResponse(new Response('small', { headers: { 'Content-Length': '100' } }), 10), /volumineuse/);
});

test('le robot vérifie la copie et la confirmation publique sans exposer la clé', async t => {
  const key = crypto.randomBytes(32).toString('hex');
  const id = crypto.randomBytes(16).toString('hex');
  const snapshot = JSON.stringify({ format: 'baruck-editorial-v1', articles: [], products: [], media: [] });
  const digest = crypto.createHash('sha256').update(snapshot).digest('hex');
  const folder = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-client-test-'));
  const previous = { ...process.env };
  let marker = { id: '0'.repeat(32), sha256: digest };
  let wrongDigest = false;
  let revoked = false;
  let completion;
  const server = http.createServer(async (request, response) => {
    if (request.url.startsWith('/publication-check.json')) {
      assert.equal(request.headers.authorization, undefined, 'la clé privée ne part jamais sur le site public');
      response.end(JSON.stringify(marker));
      return;
    }
    assert.equal(request.url, '/publication.php');
    assert.equal(request.headers.authorization, 'Bearer ' + key);
    let body = '';
    for await (const bytes of request) body += bytes;
    const input = JSON.parse(body);
    if (input.action === 'claim') {
      response.setHeader('X-Baruck-Publication', id);
      response.setHeader('X-Baruck-Sha256', wrongDigest ? '0'.repeat(64) : digest);
      response.setHeader('X-Baruck-Claimed', 'yes');
      response.end(snapshot);
    } else if (input.action === 'status') response.end('{"pending":true}');
    else {
      if (input.action === 'authorize' && revoked) response.statusCode = 409;
      if (input.action === 'complete') completion = input;
      response.end('{"ok":true}');
    }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const origin = `http://127.0.0.1:${server.address().port}`;
  Object.assign(process.env, { BARUCK_PUBLICATION_KEY: key, BARUCK_PUBLICATION_URL: origin + '/publication.php', BARUCK_SITE_URL: origin,
    BARUCK_PUBLICATION_DIR: folder, GITHUB_RUN_ID: '123', GITHUB_EVENT_NAME: 'schedule', GITHUB_OUTPUT: path.join(folder, 'outputs') });
  t.after(async () => {
    for (const name of Object.keys(process.env)) if (!(name in previous)) delete process.env[name];
    Object.assign(process.env, previous);
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
    await fs.rm(folder, { recursive: true, force: true });
  });
  await publicationClient('probe');
  assert.match(await fs.readFile(process.env.GITHUB_OUTPUT, 'utf8'), /pending=true/);
  wrongDigest = true;
  await assert.rejects(publicationClient('fetch'), /endommagés/);
  await assert.rejects(fs.stat(path.join(folder, 'baruck-publication.json')), { code: 'ENOENT' });
  wrongDigest = false;
  await publicationClient('fetch');
  assert.equal(await fs.readFile(path.join(folder, 'baruck-publication.json'), 'utf8'), snapshot);
  assert.equal((await fs.stat(path.join(folder, 'baruck-publication.json'))).mode & 0o777, 0o600);
  const state = await fs.readFile(path.join(folder, 'baruck-publication-state.json'), 'utf8');
  assert.ok(!state.includes(key));
  await assert.rejects(publicationClient('verify'), /autre publication/);
  marker = { id, sha256: digest };
  await publicationClient('verify');
  revoked = true;
  await assert.rejects(publicationClient('authorize'), /409/);
  revoked = false;
  await publicationClient('authorize');
  await publicationClient('complete');
  assert.deepEqual(completion, { action: 'complete', id, sha256: digest, run: '123' });
});
