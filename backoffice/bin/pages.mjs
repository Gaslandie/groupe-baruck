import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { imageSize } from 'image-size';

export const pageSource = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../content/pages.json', import.meta.url)), 'utf8'));
const originalTexts = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../content/textes.json', import.meta.url)), 'utf8'));
const english = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../src/data/en.json', import.meta.url)), 'utf8'));
let linkTargets;

/** Routes et ancres déjà définies dans le code, jamais des chemins fournis par un formulaire. */
export function pageLinkTargets() {
  if (linkTargets) return linkTargets;
  const targets = new Set(Object.values(pageSource).map(page => page.route));
  const folders = { home:'home', groupe:'about', jeca:'jeca', 'espoir-de-vie':'espoir-de-vie', 'studio-photo':'services', 'hotesses-evenementielles':'services' };
  for (const [id, folder] of Object.entries(folders)) {
    const directory = fileURLToPath(new URL('../../src/components/' + folder, import.meta.url));
    for (const file of fs.readdirSync(directory, {recursive:true}).filter(file => file.endsWith('.tsx') && (id === 'studio-photo' ? !file.startsWith('Hostess') : id !== 'hotesses-evenementielles' || !file.startsWith('Studio')))) {
      const source = fs.readFileSync(path.join(directory,file),'utf8');
      for (const [, anchor] of source.matchAll(/\bid="([a-z0-9-]+)"/g)) targets.add(pageSource[id].route + '#' + anchor);
    }
  }
  for (const key of Object.keys(originalTexts.activities)) targets.add('/#' + key);
  for (const id of ['activite-guinee','activite-studio','activite-hotesses']) targets.add('/#' + id);
  const visit = (field,value,route) => {
    if (field.kind === 'list') value.forEach(item => visit(field.item,item,route));
    else if (field.kind === 'object') Object.entries(field.fields).forEach(([key,child]) => visit(child,value[key],route));
    else if (field.kind === 'link' && typeof value === 'string' && value.includes('#')) targets.add(value.startsWith('#') ? route + value : value);
  };
  for (const page of Object.values(pageSource)) for (const [key,field] of Object.entries(page.fields ?? {})) visit(field,page.values[key],page.route);
  return linkTargets = [...targets].sort();
}

/** Un même contrat pour les formulaires PHP et le contrôle de publication Node. */
export function pageModels() {
  const models = {};
  for (const [id, source] of Object.entries(pageSource)) {
    models[id] = {
      label: source.label, route: source.route,
      sections: [{ label: 'Titre et description de la page', help: 'Ces textes présentent la page dans l’onglet du navigateur et les moteurs de recherche.', fields: ['meta.title', 'meta.description'] }],
      fields: {
        'meta.title': { label: 'Titre de la page', kind: 'text', max: 240, initial: source.values['meta.title'] },
        'meta.description': { label: 'Description de la page', kind: 'textarea', max: 1000, initial: source.values['meta.description'] },
      },
    };
  }
  for (const [group, entries] of Object.entries(originalTexts)) {
    const [titleMax, textMax] = group === 'heroSlides' ? [60, 260] : [40, 130];
    for (const [id, entry] of Object.entries(entries)) {
      const fields = [];
      for (const [name, max] of [['title', titleMax], ['description', textMax]]) {
        const key = `${group}.${id}.${name}`;
        const fr = entry[name];
        models.home.fields[key] = { label: name === 'title' ? 'Titre' : 'Texte', kind: name === 'title' ? 'text' : 'textarea', max, initial: { fr, en: english[fr.replace(/\s+/g, ' ').trim()] ?? fr } };
        fields.push(key);
      }
      models.home.sections.push({ label: entry.title, help: group === 'heroSlides' ? 'Présentation principale de l’accueil. Le texte du Groupe est aussi repris sur sa page.' : 'Carte d’activité sur l’accueil.', fields });
    }
  }
  for (const [id, source] of Object.entries(pageSource)) {
    for (const [key, field] of Object.entries(source.fields ?? {})) models[id].fields[key] = { ...structuredClone(field), initial: source.values[key] };
    models[id].sections.push(...(source.sections ?? []));
    models[id].sections.forEach((section, index) => { section.id ??= 'section-' + index; });
    const owner = field => {
      field.page = id;
      if (field.kind === 'list') owner(field.item);
      if (field.kind === 'object') Object.values(field.fields).forEach(owner);
    };
    Object.values(models[id].fields).forEach(owner);
  }
  return models;
}

export function validatePageValues(model, input, ready = true, options = {}) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== Object.keys(model.fields).length
    || Object.keys(input).some(key => !Object.hasOwn(model.fields, key))) throw new Error('Champs de page inconnus ou incomplets.');
  const values = {};
  for (const [key, field] of Object.entries(model.fields)) {
    values[key] = validatePageField(field, input[key], ready, options);
  }
  return values;
}

export function validatePageField(field, input, ready = true, options = {}) {
  const fail = () => { throw new Error(`Vérifiez « ${field.label} ».`); };
  const object = value => value && typeof value === 'object' && !Array.isArray(value);
  if (field.kind === 'list') {
    if (!Array.isArray(input) || input.length > field.max) fail();
    const values = input.map(value => validatePageField(field.item, value, ready, options));
    if (field.item.kind === 'image' && new Set(values.map(value => value.src).filter(Boolean)).size !== values.filter(value => value.src).length) fail();
    return values;
  }
  if (field.kind === 'object') {
    if (!object(input) || Object.keys(input).length !== Object.keys(field.fields).length || Object.keys(input).some(key => !Object.hasOwn(field.fields, key))) fail();
    return Object.fromEntries(Object.entries(field.fields).map(([key, child]) => [key, validatePageField(child, input[key], ready, options)]));
  }
  if (field.kind === 'image') {
    if (!object(input) || Object.keys(input).sort().join(',') !== 'alt,height,src,width') fail();
    const alt = validatePageField({kind:'text',label:field.label,max:500}, input.alt, ready && !field.decorative, options);
    if (input.src === '' && !ready) return {src:'',alt,width:1,height:1};
    if (typeof input.src !== 'string' || !/^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(?:jpe?g|png|webp)$/.test(input.src)) fail();
    const root = input.src.startsWith('/images/actualites/uploads/') ? options.mediaRoot : path.resolve('public');
    if (!root) fail();
    const file = fs.realpathSync(path.join(root, input.src.slice(1)));
    if (!file.startsWith(fs.realpathSync(root) + path.sep) || !fs.statSync(file).isFile()) fail();
    const size = imageSize(fs.readFileSync(file));
    if (!['jpg','png','webp'].includes(size.type) || !size.width || !size.height || size.width * size.height > 40000000) fail();
    return {src:input.src,alt,width:size.width,height:size.height};
  }
  if (!['text','textarea'].includes(field.kind)) {
    if (typeof input !== 'string' || input.includes('\0') || input.length > field.max) fail();
    const value = input.trim();
    if (!value && !ready) return '';
    if (field.kind === 'link') {
      const internal = /^(?:\/(?:[a-z0-9-]+\/)*|\/(?:[a-z0-9-]+\/)*#[a-z0-9-]+|#[a-z0-9-]+)$/.test(value);
      const scope = field.scope ?? 'local';
      if (scope === 'external') {
        const url = new URL(value);
        if (url.protocol !== 'https:' || url.username || url.password || /[\\\s\x00-\x1f]/.test(value)) fail();
      } else if (!internal || (scope === 'anchor' ? !value.startsWith('#') : scope === 'internal' && value.startsWith('#'))) fail();
      if (scope !== 'external') {
        const target = value.startsWith('#') ? pageSource[field.page].route + value : value;
        const article = target.match(/^\/actualites\/([a-z0-9-]+)\/$/);
        if (article ? !(options.articleSlugs ?? fs.readdirSync('content/actualites').map(file=>file.replace(/\.md$/,''))).includes(article[1]) : !pageLinkTargets().includes(target)) fail();
      }
    } else if (field.kind === 'background') {
      if (value !== field.original) validatePageField({kind:'image',label:field.label}, {src:value,alt:{fr:'Image',en:'Image'},width:1,height:1}, ready, options);
    } else if (field.kind === 'date') {
      if (!/^\d{4}(?:-\d{2}-\d{2})?$/.test(value) || (value.length > 4 && new Date(value+'T00:00:00Z').toISOString().slice(0,10) !== value)) fail();
    } else if (field.kind === 'video') {
      if (!field.options.includes(value) || !fs.realpathSync(path.resolve('public', value.slice(1))).startsWith(fs.realpathSync('public/videos') + path.sep)) fail();
    } else if (field.kind === 'slug') { if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value)) fail(); }
    else fail();
    return value;
  }
    const pair = input;
    if (!pair || typeof pair !== 'object' || Array.isArray(pair) || Object.keys(pair).sort().join(',') !== 'en,fr') throw new Error('Versions française et anglaise attendues.');
    const values = {};
    for (const language of ['fr', 'en']) {
      const value = pair[language];
      if (typeof value !== 'string' || value.includes('\0') || Buffer.from(value, 'utf8').toString('utf8') !== value
        || Array.from(value.trim()).length > field.max || (ready && !value.trim())
        || /<\/?[a-z][^>]*>/iu.test(value) || (field.kind === 'text' && /[\r\n]/.test(value))) throw new Error(`Vérifiez « ${field.label} » (${language.toUpperCase()}).`);
      values[language] = value.trim();
    }
  return values;
}

export function pageTexts(values) {
  const result = { fr: {}, en: {} };
  for (const language of ['fr', 'en']) {
    for (const [group, entries] of Object.entries(originalTexts)) {
      result[language][group] = {};
      for (const id of Object.keys(entries)) result[language][group][id] = {
        title: values[`${group}.${id}.title`][language],
        description: values[`${group}.${id}.description`][language],
      };
    }
  }
  return { ...result.fr, translations: { en: result.en } };
}
