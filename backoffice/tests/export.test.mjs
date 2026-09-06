import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { importExport } from '../bin/import-export.mjs';

const article = { slug: 'actualite-test', title: 'Titre : "test"', date: '2026-09-06', category: 'groupe', excerpt: 'Résumé de recette', body: 'Contenu de recette.', gallery: [] };
async function fixture(t, change) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-export-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const input = { format: 'baruck-editorial-v1', articles: [structuredClone(article)], media: [] };
  change?.(input);
  const file = path.join(dir, 'export.json');
  await fs.writeFile(file, JSON.stringify(input));
  return { file, out: path.join(dir, 'result') };
}
test('convertit les contenus validés sans interpolation du frontmatter', async (t) => {
  const { file, out } = await fixture(t);
  assert.deepEqual(await importExport(file, out), { articles: 1, images: 0 });
  const content = await fs.readFile(path.join(out, 'content/actualites/actualite-test.md'), 'utf8');
  assert.match(content, /draft: false/);
  assert.match(content, /title: "Titre : \\"test\\""/);
});
test('refuse les chemins sortants et supprime seulement son export incomplet', async (t) => {
  const { file, out } = await fixture(t, (input) => { input.articles[0].slug = '../../secret'; });
  await assert.rejects(importExport(file, out), /Adresse/);
  await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  assert.ok(await fs.stat(file));
});
test('ne remplace jamais un dossier existant', async (t) => {
  const { file, out } = await fixture(t);
  await fs.mkdir(out); await fs.writeFile(path.join(out, 'precieux'), 'intact');
  await assert.rejects(importExport(file, out), { code: 'EEXIST' });
  assert.equal(await fs.readFile(path.join(out, 'precieux'), 'utf8'), 'intact');
});
test('refuse les doublons et les corps non textuels', async (t) => {
  for (const change of [(input) => input.articles.push(input.articles[0]), (input) => { input.articles[0].body = { html: 'x' }; }]) {
    const { file, out } = await fixture(t, change);
    await assert.rejects(importExport(file, out));
  }
});
test('vérifie le contenu et le hash des médias avant écriture', async (t) => {
  const bytes = Buffer.from('ceci nest pas une image');
  const { file, out } = await fixture(t, (input) => input.media.push({ path: `/images/actualites/uploads/${'a'.repeat(32)}.jpg`, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), data: bytes.toString('base64') }));
  await assert.rejects(importExport(file, out));
  const other = await fixture(t, (input) => input.media.push({ path: '/images/../../index.php', data: bytes.toString('base64'), sha256: 'a'.repeat(64) }));
  await assert.rejects(importExport(other.file, other.out), /Média/);
});
