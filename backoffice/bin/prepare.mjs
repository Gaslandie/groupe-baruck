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
const images = await fs.readdir(path.join(root, 'public/images'), { recursive: true });
await fs.writeFile(path.join(directory, 'seed.json'), JSON.stringify({ articles, existingImages: images.filter((name) => /\.(?:jpe?g|png|webp)$/i.test(name)).map((name) => '/images/' + name).sort() }, null, 2) + '\n');
const result = await postcss([tailwind({ base: root })]).process('@import "../../src/app/globals.css";\n@source "../src/views";\n@font-face { font-family: Inter; src: url("/inter.woff2") format("woff2"); font-display: swap; font-weight: 100 900; }\n:root { --font-inter: Inter; }', { from: path.join(directory, 'public/source.css'), to: path.join(directory, 'public/admin.css') });
await fs.writeFile(path.join(directory, 'public/admin.css'), result.css);
await fs.copyFile(path.join(root, 'src/app/fonts/inter-latin.woff2'), path.join(directory, 'public/inter.woff2'));
console.log(`Administration préparée : ${articles.length} actualités, styles et police locale.`);
