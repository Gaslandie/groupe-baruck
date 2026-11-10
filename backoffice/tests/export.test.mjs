import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { importExport } from '../bin/import-export.mjs';
import matter from 'gray-matter';
import { pageModels, pageSource, pageTexts, validatePageValues } from '../bin/pages.mjs';

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
test('pages bilingues : modèles du site, publication et source unique de l’accueil', async (t) => {
  const models = pageModels();
  assert.equal(Object.keys(models).length, 12);
  const values = Object.fromEntries(Object.entries(models.home.fields).map(([key, field]) => [key, structuredClone(field.initial)]));
  assert.deepEqual(validatePageValues(models.home, values), values);
  values['meta.title'] = { fr: 'Accueil validé', en: 'Approved home' };
  values['heroSlides.guinee.title'] = { fr: 'Titre français validé', en: 'Approved English title' };
  const { file, out } = await fixture(t, input => { input.pages = { home: values }; });
  await importExport(file, out);
  const result = JSON.parse(await fs.readFile(path.join(out, 'content/pages.json'), 'utf8'));
  assert.deepEqual(result.home.values, values);
  assert.equal(result.home.route, pageSource.home.route, 'les routes restent gérées dans le code');
  assert.deepEqual(result.contact, pageSource.contact, 'les pages absentes gardent les contenus du dépôt');
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(out, 'content/textes.json'), 'utf8')), pageTexts(values), 'les anciens champs dérivent du même contenu validé');
});
test('pages : compatibilité des anciens exports, anglais complet et champs autorisés seulement', async (t) => {
  const bare = await fixture(t);
  await importExport(bare.file, bare.out);
  await assert.rejects(fs.stat(path.join(bare.out, 'content/pages.json')), { code: 'ENOENT' });
  const values = Object.fromEntries(Object.entries(pageModels().contact.fields).map(([key, field]) => [key, structuredClone(field.initial)]));
  const changes = [
    input => { input.pages = []; },
    input => { input.pages = { inconnue: values }; },
    input => { delete input.pages.contact['meta.title']; },
    input => { input.pages.contact.route = { fr: '/intrus/', en: '/intrus/' }; },
    input => { input.pages.contact['meta.title'].de = 'Forgé'; },
    ...['', 'x'.repeat(241), '<img src=x onerror=alert(1)>', 'Titre\nforgé', '\uD800', ['Forgé']].map(value => input => { input.pages.contact['meta.title'].en = value; }),
  ];
  for (const change of changes) {
    const { file, out } = await fixture(t, input => { input.pages = { contact: structuredClone(values) }; change(input); });
    await assert.rejects(importExport(file, out));
    await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  }
  values['meta.title'].en = '';
  assert.doesNotThrow(() => validatePageValues(pageModels().contact, values, false), 'saisie incomplète permise seulement en brouillon');
});
test('pages structurées : listes, dates, liens, images et contrat de l’étape 3', async (t) => {
  const model = pageModels().groupe;
  const values = Object.fromEntries(Object.entries(model.fields).map(([key,field])=>[key,structuredClone(field.initial)]));
  for (const list of ['data.milestones','AboutEvents.list']) for (const entry of values[list]) {
    if (entry.href.startsWith('/actualites/')) entry.href='/actualites/actualite-test/';
  }
  const valid = await fixture(t,input=>{input.pageSchema=3;input.pages={groupe:structuredClone(values)};});
  await importExport(valid.file,valid.out);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(valid.out,'content/pages.json'),'utf8')).groupe.values,values);
  const withdrawn = await fixture(t,input=>{input.pageSchema=3;input.pages={groupe:Object.fromEntries(Object.entries(model.fields).map(([key,field])=>[key,structuredClone(field.initial)]))};});
  await importExport(withdrawn.file,withdrawn.out);
  assert.ok(!((await fs.readdir(path.join(withdrawn.out,'content/actualites'))).includes('top-modele-baruck-guinee-2026.md')), 'les références historiques ne remettent pas en ligne une actualité retirée');
  const changes = [
    input => { delete input.pages.groupe['media.presidentPortrait']; },
    input => { input.pageSchema=999; },
    input => { input.pages.groupe['data.presenceCountries'][0].links[0].href='/page-inconnue/'; },
    input => { input.pages.groupe['data.presenceCountries'][0].links[0].href='/actualites/article-inexistant/'; },
    input => { input.pages.groupe['data.presenceCountries'][0].links[0].href='//hostile.example/'; },
    input => { input.pages.groupe['data.presenceCountries'][0].links[0].href='/groupe/#ancre-inconnue'; },
    input => { input.pages.groupe['data.milestones'][0].dateTime='2026-02-30'; },
    input => { input.pages.groupe['data.presenceCountries']=Array.from({length:21},()=>values['data.presenceCountries'][0]); },
    input => { input.pages.groupe['media.presidentPortrait'].alt.en=''; },
    input => { input.pages.groupe['media.presidentPortrait'].src='/images/../config.php'; },
    input => { input.pages.groupe['media.presidentPortrait'].src=`/images/actualites/uploads/${'f'.repeat(32)}.jpg`; },
    input => { input.pages.groupe['data.ambassadorPhotos'].push(input.pages.groupe['data.ambassadorPhotos'][0]); },
    input => { input.pages.groupe['data.presenceCountries'][0].links[0].invente='Intrus'; },
  ];
  for(const change of changes){
    const {file,out}=await fixture(t,input=>{input.pageSchema=3;input.pages={groupe:structuredClone(values)};change(input)});
    await assert.rejects(importExport(file,out));
    await assert.rejects(fs.stat(out),{code:'ENOENT'});
  }
  const legacy=await fixture(t,input=>{input.pages={groupe:{'meta.title':values['meta.title'],'meta.description':values['meta.description']}}});
  await importExport(legacy.file,legacy.out);
  const upgraded=JSON.parse(await fs.readFile(path.join(legacy.out,'content/pages.json'),'utf8')).groupe.values;
  assert.deepEqual(upgraded['meta.title'],values['meta.title']);
  assert.deepEqual(upgraded['data.presenceCountries'],values['data.presenceCountries']);
  values['data.presenceCountries']=[];
  assert.deepEqual(validatePageValues(model,values,true,{articleSlugs:['actualite-test']})['data.presenceCountries'],[],'une liste vide reste vide');
});
test('JECA et Espoir de Vie : listes bilingues, clés stables et exports des étapes précédentes', async t => {
  const defaults = id => Object.fromEntries(Object.entries(pageModels()[id].fields).map(([key,field])=>[key,structuredClone(field.initial)]));
  const pages = {jeca:defaults('jeca'),'espoir-de-vie':defaults('espoir-de-vie')};
  const extra='item-00000000-0000-4000-8000-000000000001';
  pages['espoir-de-vie']['data.additionalPhotos']=[{key:extra,image:structuredClone(pages['espoir-de-vie']['photo.divoKitsScolaires'])}];
  pages['espoir-de-vie']['data.actions'][0].photo=extra;
  const editions = pages.jeca['data.editions'];
  editions.reverse(); editions[0].photos.reverse(); editions[0].title={fr:'Édition validée de recette',en:'Approved test edition'};
  const galleries = pages['espoir-de-vie']['data.galleries'];
  galleries.reverse(); galleries[0].photos.reverse();
  const valid = await fixture(t,input=>{input.pageSchema=4;input.pages=structuredClone(pages)});
  await importExport(valid.file,valid.out);
  const result=JSON.parse(await fs.readFile(path.join(valid.out,'content/pages.json'),'utf8'));
  assert.deepEqual(result.jeca.values,pages.jeca);
  assert.deepEqual(result['espoir-de-vie'].values,pages['espoir-de-vie']);
  const changes = [
    p=>{delete p.jeca['data.editions']},
    p=>{p.jeca['data.editions'][0].title.en=''},
    p=>{p.jeca['data.editions'][0].date.endIso='2020-01-01'},
    p=>{p.jeca['data.editions'][0].key='vision'},
    p=>{p.jeca['data.editions'][1].key=p.jeca['data.editions'][0].key},
    p=>{p.jeca['data.editions'][0].photos.push(p.jeca['data.editions'][0].photos[0])},
    p=>{p.jeca['data.speech'].src='/videos/invente.mp4'},
    p=>{p['espoir-de-vie']['data.videos'][0].key='mission'},
    p=>{p['espoir-de-vie']['data.actions'][0].photo='invente'},
    p=>{p['espoir-de-vie']['data.additionalPhotos']=[]},
    p=>{p['espoir-de-vie']['data.additionalPhotos']='invente'},
    p=>{p['espoir-de-vie']['data.additionalPhotos'][0].image.src='/images/invente.jpg'},
    p=>{p['espoir-de-vie']['data.additionalPhotos'][0].image.alt.en=''},
    p=>{p['espoir-de-vie']['data.actions'][0].date.label.en=''},
    p=>{p['espoir-de-vie']['data.timeline'][0].date.iso=''},
    p=>{p['espoir-de-vie']['data.galleries'][0].photos[0].alt.en=''},
    p=>{p['espoir-de-vie']['data.galleries'][1].key=p['espoir-de-vie']['data.galleries'][0].key},
  ];
  for(const change of changes){
    const broken=structuredClone(pages);change(broken);
    const fixtureData=await fixture(t,input=>{input.pageSchema=4;input.pages=broken});
    await assert.rejects(importExport(fixtureData.file,fixtureData.out));
    await assert.rejects(fs.stat(fixtureData.out),{code:'ENOENT'});
  }
  for(const version of [undefined,3]){
    const old=await fixture(t,input=>{if(version)input.pageSchema=version;input.pages={jeca:{'meta.title':pages.jeca['meta.title'],'meta.description':pages.jeca['meta.description']}}});
    await importExport(old.file,old.out);
    assert.deepEqual(JSON.parse(await fs.readFile(path.join(old.out,'content/pages.json'),'utf8')).jeca.values['data.editions'],pageSource.jeca.values['data.editions']);
  }
  const empty=defaults('jeca');empty['data.editions']=[];
  assert.deepEqual(validatePageValues(pageModels().jeca,empty)['data.editions'],[]);
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
test('un catalogue explicitement vide retire tous les articles du site', async (t) => {
  const { file, out } = await fixture(t, (input) => { input.products = []; });
  await importExport(file, out);
  assert.deepEqual(JSON.parse(await fs.readFile(path.join(out, 'content/boutique.json'), 'utf8')), { products: [] });
});
test('conserve la précision des dates et refuse une valeur inventée', async (t) => {
  const { file, out } = await fixture(t, input => { input.articles[0].datePrecision = 'year'; });
  await importExport(file, out);
  assert.match(await fs.readFile(path.join(out, 'content/actualites/actualite-test.md'), 'utf8'), /datePrecision: "year"/);
  const invalid = await fixture(t, input => { input.articles[0].datePrecision = 'invented'; });
  await assert.rejects(importExport(invalid.file, invalid.out));
});
test('conserve les cinq galeries par groupes, légendes et vidéos des publications nouvelles ou anciennes', async (t) => {
  const files = await fs.readdir('content/actualites');
  let checked = 0;
  for (const name of files) {
    const { data, content: body } = matter(await fs.readFile(path.join('content/actualites', name), 'utf8'));
    if (!data.groups) continue;
    checked++;
    for (const legacy of [false, true]) {
      const value = { ...data, slug: name.slice(0, -3), date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date, body, title: 'Titre modifié dans le back-office' };
      if (legacy) for (const key of ['groups', 'groupsTitle', 'groupsIntro']) delete value[key];
      const { file, out } = await fixture(t, input => { input.articles = [value]; });
      await importExport(file, out);
      const result = matter(await fs.readFile(path.join(out, 'content/actualites', name), 'utf8'));
      assert.deepEqual(result.data.groups, data.groups, name + (legacy ? ' ancien export' : ' nouvel export'));
      assert.equal(result.data.groupsTitle, data.groupsTitle);
      assert.equal(result.data.groupsIntro || '', data.groupsIntro || '');
      assert.equal(result.data.title, value.title, 'le repli ne remplace pas les textes modifiés');
      assert.equal(result.content.trim(), body.trim());
    }
  }
  assert.equal(checked, 5);
});
test('un retrait explicite des groupes ne reprend jamais ceux du dépôt', async (t) => {
  const { file, out } = await fixture(t, input => { input.articles[0] = { ...article, slug: 'top-modele-baruck-guinee-2026', groups: [] }; });
  await importExport(file, out);
  const result = matter(await fs.readFile(path.join(out, 'content/actualites/top-modele-baruck-guinee-2026.md'), 'utf8')).data;
  assert.deepEqual(result.groups, []);
  assert.equal(result.groupsTitle, undefined);
});
test('refuse les groupes incomplets, les chemins sortants et les médias privés absents', async (t) => {
  const valid = { label: 'Groupe de recette', photos: [{ src: product.images[0].src, alt: 'Photo de recette' }] };
  const changes = [
    value => { value.groups = null; },
    value => { value.groups = [null]; },
    value => { value.groups[0].label = ''; },
    value => { value.groups[0].photos = []; },
    value => { value.groups[0].photos[0].alt = ''; },
    value => { value.groups[0].photos[0].src = '/images/../config.php'; },
    value => { value.groups[0].photos[0].src = `/images/actualites/uploads/${'a'.repeat(32)}.jpg`; },
    value => { delete value.groupsTitle; },
    value => { value.groups[0].video = { src: '/videos/../config.php.mp4', poster: product.images[0].src }; },
    value => { value.groups[0].video = { src: 'https://hostile.example/video.mp4', poster: product.images[0].src }; },
    value => { value.groups[0].video = { src: '/videos/top-modele-2026/candidat-01.mp4', poster: '/images/../config.php' }; },
    value => { value.groups = Array.from({ length: 31 }, () => valid); },
    value => { value.groups[0].photos = Array.from({ length: 31 }, () => valid.photos[0]); },
  ];
  for (const change of changes) {
    const { file, out } = await fixture(t, input => {
      input.articles[0].groupsTitle = 'Galerie de recette';
      input.articles[0].groups = [structuredClone(valid)];
      change(input.articles[0]);
    });
    await assert.rejects(importExport(file, out));
    await assert.rejects(fs.stat(out), { code: 'ENOENT' });
  }
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
