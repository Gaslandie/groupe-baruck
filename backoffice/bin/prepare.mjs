import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import postcss from 'postcss';
import tailwind from '@tailwindcss/postcss';

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const root = path.resolve(directory, '..');
const folder = path.join(root, 'content/actualites');
const files = (await fs.readdir(folder)).filter((name) => name.endsWith('.md')).sort();
const articles = await Promise.all(files.map(async (name) => {
  const { data, content } = matter(await fs.readFile(path.join(folder, name), 'utf8'));
  return { ...data, slug: name.slice(0, -3), body: content.trim(), date: data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date, gallery: data.gallery ?? [] };
}));
// Les rayons restent une nomenclature du site : l'administration les lit, ne les invente pas.
const source = await fs.readFile(path.join(root, 'src/data/marque-baruck.ts'), 'utf8');
const literal = source.match(/export const brandCategories = \{([^}]*)\} as const;/);
if (!literal) throw new Error('Rayons de la boutique introuvables dans src/data/marque-baruck.ts.');
const brandCategories = Object.fromEntries([...literal[1].matchAll(/^\s*([a-z]+):\s*"([^"]+)",$/gm)].map(([, key, label]) => [key, label]));
if (Object.keys(brandCategories).length === 0) throw new Error('Aucun rayon de boutique reconnu.');
const { products } = JSON.parse(await fs.readFile(path.join(root, 'content/boutique.json'), 'utf8'));
const coordonnees = JSON.parse(await fs.readFile(path.join(root, 'content/coordonnees.json'), 'utf8'));
const textes = JSON.parse(await fs.readFile(path.join(root, 'content/textes.json'), 'utf8'));
for (const product of products) {
  if (!brandCategories[product.category]) throw new Error(`Rayon inconnu pour l'article « ${product.name} » : ${product.category}.`);
}
const images = await fs.readdir(path.join(root, 'public/images'), { recursive: true });
for (const name of images.filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name))) {
  const destination = path.join(directory, 'seed-media', name);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(path.join(root, 'public/images', name), destination);
}
await fs.writeFile(path.join(directory, 'seed.json'), JSON.stringify({ articles, products, brandCategories, coordonnees, textes, existingImages: images.filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name)).map((name) => '/images/' + name).sort() }, null, 2) + '\n');
const result = await postcss([tailwind({ base: root })]).process('@import "../../src/app/globals.css";\n@source "../src";\n@source "./media-picker.js";\n@source "./admin.js";\n@font-face { font-family: Lato; src: url("/lato-400.woff2") format("woff2"); font-display: swap; font-weight: 400; }\n@font-face { font-family: Lato; src: url("/lato-700.woff2") format("woff2"); font-display: swap; font-weight: 700; }\n@font-face { font-family: Montserrat; src: url("/montserrat.woff2") format("woff2"); font-display: swap; font-weight: 300 800; }\n@font-face { font-family: Montserrat; src: url("/montserrat-italic.woff2") format("woff2"); font-display: swap; font-weight: 300 800; font-style: italic; }\n:root { --font-lato: Lato; --font-montserrat: Montserrat; }', { from: path.join(directory, 'public/source.css'), to: path.join(directory, 'public/admin.css') });
await fs.writeFile(path.join(directory, 'public/admin.css'), result.css);
// Les mêmes polices que le site (Lato pour le texte, Montserrat pour les titres), copiées depuis `src/app/fonts/`.
const fonts = [
  ['lato-latin-400.woff2', 'lato-400.woff2'],
  ['lato-latin-700.woff2', 'lato-700.woff2'],
  ['montserrat-latin.woff2', 'montserrat.woff2'],
  ['montserrat-latin-italic.woff2', 'montserrat-italic.woff2'],
];
for (const [source, target] of fonts) {
  await fs.copyFile(path.join(root, 'src/app/fonts', source), path.join(directory, 'public', target));
}
console.log(`Administration préparée : ${articles.length} actualités, ${products.length} articles de boutique, styles et police locale.`);
