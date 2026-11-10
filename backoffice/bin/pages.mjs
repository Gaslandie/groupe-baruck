import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

export const pageSource = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../content/pages.json', import.meta.url)), 'utf8'));
const originalTexts = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../content/textes.json', import.meta.url)), 'utf8'));
const english = JSON.parse(fs.readFileSync(fileURLToPath(new URL('../../src/data/en.json', import.meta.url)), 'utf8'));

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
  return models;
}

export function validatePageValues(model, input, ready = true) {
  if (!input || typeof input !== 'object' || Array.isArray(input)
    || Object.keys(input).length !== Object.keys(model.fields).length
    || Object.keys(input).some(key => !Object.hasOwn(model.fields, key))) throw new Error('Champs de page inconnus ou incomplets.');
  const values = {};
  for (const [key, field] of Object.entries(model.fields)) {
    const pair = input[key];
    if (!pair || typeof pair !== 'object' || Array.isArray(pair) || Object.keys(pair).sort().join(',') !== 'en,fr') throw new Error('Versions française et anglaise attendues.');
    values[key] = {};
    for (const language of ['fr', 'en']) {
      const value = pair[language];
      if (typeof value !== 'string' || value.includes('\0') || Buffer.from(value, 'utf8').toString('utf8') !== value
        || Array.from(value.trim()).length > field.max || (ready && !value.trim())
        || /<\/?[a-z][^>]*>/iu.test(value) || (field.kind === 'text' && /[\r\n]/.test(value))) throw new Error(`Vérifiez « ${field.label} » (${language.toUpperCase()}).`);
      values[key][language] = value.trim();
    }
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
