import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { importExport } from '../bin/import-export.mjs';

const article = { slug: 'actualite-test', title: 'Titre : "test"', date: '2026-09-06', category: 'groupe', excerpt: 'Résumé de recette', body: 'Contenu de recette.', gallery: [] };
const product = { id: 'article-test', name: 'Article de recette', category: 'sacs', images: [{ src: '/images/marque-baruck/sac-main-noir.jpg', alt: 'Sac de recette' }] };
const contacts = {
  contacts: { landline: '+224 625 19 72 58', mobile: '+224 623 54 66 57', whatsappHq: '+224 623 72 04 27', whatsappCeo: '+33 7 55 42 37 54', email: 'recette@example.test' },
  address: 'Kobayah, Conakry.',
  hours: [{ days: 'Lundi – Samedi', hours: '8h – 17h' }],
  facebookPages: [{ country: 'Guinée', href: 'https://www.facebook.com/BaruckCommunication' }],
  mapQuery: 'Kobayah, Conakry, Guinée',
};
// Structure reprise du dépôt : la publication ne peut ni ajouter ni retirer un bloc.
const reference = JSON.parse(readFileSync(new URL('../../content/textes.json', import.meta.url), 'utf8'));
const texts = Object.fromEntries(Object.entries(reference).map(([group, entries]) => [
  group,
  Object.fromEntries(Object.keys(entries).map((key) => [key, { title: `Titre ${key}`, description: `Texte de recette ${key}.` }])),
]));
async function fixture(t, change) {
  const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-export-test-'));
  t.after(() => fs.rm(dir, { recursive: true, force: true }));
  const input = { format: 'baruck-editorial-v1', articles: [structuredClone(article)], products: [structuredClone(product)], contacts: structuredClone(contacts), texts: structuredClone(texts), media: [] };
  change?.(input);
  const file = path.join(dir, 'export.json');
  await fs.writeFile(file, JSON.stringify(input));
  return { file, out: path.join(dir, 'result') };
}
test('convertit les contenus validés sans interpolation du frontmatter', async (t) => {
  const { file, out } = await fixture(t);
  assert.deepEqual(await importExport(file, out), { articles: 1, images: 0, products: 1, contacts: true, texts: true });
  const content = await fs.readFile(path.join(out, 'content/actualites/actualite-test.md'), 'utf8');
  assert.match(content, /draft: false/);
  assert.match(content, /title: "Titre : \\"test\\""/);
  const catalogue = JSON.parse(await fs.readFile(path.join(out, 'content/boutique.json'), 'utf8'));
  assert.deepEqual(catalogue, { products: [product] });
  const coordonnees = JSON.parse(await fs.readFile(path.join(out, 'content/coordonnees.json'), 'utf8'));
  assert.deepEqual(coordonnees, contacts);
});
test('laisse les coordonnées du dépôt quand la publication n’en porte aucune', async (t) => {
  const { file, out } = await fixture(t, (input) => { delete input.contacts; });
  assert.deepEqual(await importExport(file, out), { articles: 1, images: 0, products: 1, contacts: false, texts: true });
  await assert.rejects(fs.stat(path.join(out, 'content/coordonnees.json')), { code: 'ENOENT' });
});
test('reprend les textes de l’accueil et laisse ceux du dépôt sans publication', async (t) => {
  const { file, out } = await fixture(t);
  await importExport(file, out);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(out, 'content/textes.json'), 'utf8')), texts);
  const bare = await fixture(t, (input) => { delete input.texts; });
  assert.deepEqual(await importExport(bare.file, bare.out), { articles: 1, images: 0, products: 1, contacts: true, texts: false });
  await assert.rejects(fs.stat(path.join(bare.out, 'content/textes.json')), { code: 'ENOENT' });
});
test('refuse des textes incomplets ou non textuels', async (t) => {
  const changes = [
    (input) => { delete input.texts.activities.cinema; },
    (input) => { delete input.texts.heroSlides; },
    (input) => { input.texts.activities.cinema.title = ''; },
    (input) => { input.texts.activities.cinema.description = { html: 'x' }; },
  ];
  for (const change of changes) {
    const { file, out } = await fixture(t, change);
    await assert.rejects(importExport(file, out));
    await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  }
});
test('refuse des coordonnées incomplètes ou des liens détournés', async (t) => {
  const changes = [
    (input) => { input.contacts.contacts.whatsappHq = '623 72 04 27'; },
    (input) => { input.contacts.contacts.email = 'sans-arobase'; },
    (input) => { delete input.contacts.contacts.mobile; },
    (input) => { input.contacts.facebookPages[0].href = 'https://exemple.test/page'; },
    (input) => { input.contacts.facebookPages[0].href = 'javascript:alert(1)'; },
    (input) => { input.contacts.address = ''; },
    (input) => { input.contacts.hours = Array.from({ length: 8 }, () => ({ days: 'Lundi', hours: '8h' })); },
  ];
  for (const change of changes) {
    const { file, out } = await fixture(t, change);
    await assert.rejects(importExport(file, out));
    await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  }
});
test('laisse la boutique du dépôt quand la publication n’en porte aucune', async (t) => {
  const { file, out } = await fixture(t, (input) => { delete input.products; });
  assert.deepEqual(await importExport(file, out), { articles: 1, images: 0, products: 0, contacts: true, texts: true });
  await assert.rejects(fs.stat(path.join(out, 'content/boutique.json')), { code: 'ENOENT' });
});
test('refuse un catalogue dupliqué, sans photo ou mal identifié', async (t) => {
  const changes = [
    (input) => input.products.push(structuredClone(product)),
    (input) => { input.products[0].images = []; },
    (input) => { input.products[0].id = '../secret'; },
    (input) => { input.products[0].images = Array.from({ length: 7 }, () => structuredClone(product.images[0])); },
    (input) => { input.products[0].name = ''; },
  ];
  for (const change of changes) {
    const { file, out } = await fixture(t, change);
    await assert.rejects(importExport(file, out));
    await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  }
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
