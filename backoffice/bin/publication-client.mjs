import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { pathToFileURL } from 'node:url';

const maximum = 48 * 1024 * 1024;

export async function readResponse(response, limit = maximum) {
  if (Number(response.headers.get('content-length') ?? 0) > limit) throw new Error('Réponse de publication trop volumineuse.');
  const chunks = [];
  let size = 0;
  for await (const chunk of response.body) {
    size += chunk.length;
    if (size > limit) throw new Error('Réponse de publication trop volumineuse.');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export function workerUrl(value) {
  const url = new URL(value);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/publication.php'
    || !(url.origin === 'https://admin.groupebaruck.com' || (url.protocol === 'http:' && url.hostname === '127.0.0.1'))) throw new Error('Adresse du back-office non autorisée.');
  return url;
}

export async function publicationClient(command) {
  const url = workerUrl(process.env.BARUCK_PUBLICATION_URL ?? 'https://admin.groupebaruck.com/publication.php');
  const key = process.env.BARUCK_PUBLICATION_KEY;
  if (!/^[a-f0-9]{64}$/.test(key ?? '')) throw new Error('Clé privée de publication absente ou invalide.');
  const directory = process.env.BARUCK_PUBLICATION_DIR ?? process.env.RUNNER_TEMP;
  if (!directory) throw new Error('Dossier privé de publication absent.');
  const snapshotFile = path.join(directory, 'baruck-publication.json');
  const stateFile = path.join(directory, 'baruck-publication-state.json');
  const run = process.env.GITHUB_RUN_ID;
  if (!/^[0-9]+$/.test(run ?? '')) throw new Error('Identifiant de mise en ligne invalide.');
  async function output(name, value) {
    if (process.env.GITHUB_OUTPUT) await fs.appendFile(process.env.GITHUB_OUTPUT, `${name}=${value}\n`);
  }
  async function request(body) {
    const response = await fetch(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(60000),
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error(`Le back-office refuse la publication (HTTP ${response.status}).`);
    return response;
  }
  if (command === 'probe') {
    const result = JSON.parse((await readResponse(await request({ action: 'status' }), 1024)).toString());
    if (typeof result.pending !== 'boolean') throw new Error('État de publication invalide.');
    await output('pending', result.pending);
    return;
  }
  if (command === 'fetch') {
    const response = await request({ action: 'claim', run, bootstrap: process.env.BARUCK_PUBLICATION_ONLY !== 'true' });
    const id = response.headers.get('x-baruck-publication') ?? '';
    const sha256 = response.headers.get('x-baruck-sha256');
    const claimed = response.headers.get('x-baruck-claimed') === 'yes';
    if (!/^[a-f0-9]{32}$/.test(id) || !/^[a-f0-9]{64}$/.test(sha256 ?? '')) throw new Error('Identité de publication invalide.');
    // Conserver l'identité dès la prise en charge, même si le téléchargement échoue.
    await fs.writeFile(stateFile, JSON.stringify({ id, sha256, claimed, run }), { mode: 0o600 });
    const bytes = await readResponse(response);
    if (crypto.createHash('sha256').update(bytes).digest('hex') !== sha256) throw new Error('Contenus de publication endommagés.');
    const data = JSON.parse(bytes);
    if (data.format !== 'baruck-editorial-v1' || !Array.isArray(data.articles) || !Array.isArray(data.media)) throw new Error('Format de publication invalide.');
    await fs.writeFile(snapshotFile, bytes, { mode: 0o600 });
    await output('claimed', claimed);
    return;
  }
  let state;
  try { state = JSON.parse(await fs.readFile(stateFile, 'utf8')); }
  catch (error) { if (command === 'fail' && error.code === 'ENOENT') return; throw error; }
  if (command === 'marker') {
    await fs.writeFile(path.resolve('dist/site/publication-check.json'), JSON.stringify({ id: state.id, sha256: state.sha256, deployedAt: new Date().toISOString() }) + '\n');
    return;
  }
  if (command === 'verify') {
    const site = new URL('/publication-check.json', process.env.BARUCK_SITE_URL ?? 'https://groupebaruck.com');
    if (site.origin !== 'https://groupebaruck.com' && !(site.protocol === 'http:' && site.hostname === '127.0.0.1')) throw new Error('Adresse du site non autorisée.');
    site.searchParams.set('run', run);
    const response = await fetch(site, { redirect: 'error', signal: AbortSignal.timeout(30000), headers: { 'Cache-Control': 'no-cache' } });
    if (!response.ok) throw new Error('Le site ne confirme pas la publication.');
    const marker = JSON.parse((await readResponse(response, 1024)).toString());
    if (marker.id !== state.id || marker.sha256 !== state.sha256) throw new Error('Le site sert encore une autre publication.');
    return;
  }
  if (!['authorize', 'complete', 'fail'].includes(command)) throw new Error('Commande de publication inconnue.');
  if (!state.claimed) return;
  await readResponse(await request({ action: command, id: state.id, sha256: state.sha256, run }), 1024);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try { await publicationClient(process.argv[2]); }
  catch (error) { console.error(error.message); process.exitCode = 1; }
}
