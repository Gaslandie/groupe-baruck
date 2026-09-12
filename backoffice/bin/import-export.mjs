import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import os from 'node:os';
import { pathToFileURL } from 'node:url';
import { imageSize } from 'image-size';

export async function importExport(file, destination) {
  const info = await fs.stat(file);
  if (info.size > 48 * 1024 * 1024) throw new Error('Export trop volumineux (48 Mo maximum).');
  const source = JSON.parse(await fs.readFile(file, 'utf8'));
  const catalogue = source.products ?? [];
  if (source.format !== 'baruck-editorial-v1' || !Array.isArray(source.articles) || !Array.isArray(source.media) || !Array.isArray(catalogue) || source.articles.length > 2000 || source.media.length > 2000 || catalogue.length > 2000) throw new Error('Format d’export invalide.');
  // Ne jamais fusionner une publication avec la précédente : les retraits
  // d’articles doivent être effectifs. Ne jamais effacer un dossier existant.
  await fs.mkdir(destination);
  try {
    await fs.mkdir(path.join(destination, 'content/actualites'), { recursive: true });
    await fs.mkdir(path.join(destination, 'public/images/actualites/uploads'), { recursive: true });
    const images = new Set();
    for (const item of source.media) {
      if (!item || !/^\/images\/actualites\/uploads\/[a-f0-9]{32}\.(jpg|png|webp)$/.test(item.path) || images.has(item.path) || typeof item.data !== 'string' || !/^[a-f0-9]{64}$/.test(item.sha256)) throw new Error('Média exporté invalide ou dupliqué.');
      const bytes = Buffer.from(item.data, 'base64');
      if (bytes.length > 8 * 1024 * 1024 || bytes.toString('base64') !== item.data || crypto.createHash('sha256').update(bytes).digest('hex') !== item.sha256) throw new Error('Intégrité du média invalide.');
      const image = imageSize(bytes);
      const expected = item.path.endsWith('.jpg') ? 'jpg' : item.path.endsWith('.png') ? 'png' : 'webp';
      if (image.type !== expected || !image.width || !image.height || image.width * image.height > 40000000) throw new Error('Image exportée invalide.');
      images.add(item.path);
      await fs.writeFile(path.join(destination, 'public', item.path.slice(1)), bytes);
    }
    const slugs = new Set();
    const string = (value, name, max, optional = false) => {
      if (optional && (value === undefined || value === null || value === '')) return '';
      if (typeof value !== 'string' || value.includes('\0') || !value.trim() || Buffer.byteLength(value) > max) throw new Error(`Champ invalide : ${name}.`);
      return value.trim();
    };
    for (const article of source.articles) {
      if (!article || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug) || article.slug.length > 180 || article.slug === 'a-venir' || slugs.has(article.slug)) throw new Error('Adresse d’article invalide ou dupliquée.');
      slugs.add(article.slug);
      const gallery = article.gallery ?? [];
      if (!Array.isArray(gallery) || gallery.length > 30) throw new Error('Galerie invalide.');
      const clean = {
        draft: false,
        title: string(article.title, 'title', 240),
        date: string(article.date, 'date', 10),
        category: string(article.category, 'category', 32),
        excerpt: string(article.excerpt, 'excerpt', 2000),
        cover: string(article.cover, 'cover', 255, true),
        coverAlt: string(article.coverAlt, 'coverAlt', 500, true),
        gallery: gallery.map((image) => ({ src: string(image?.src, 'src', 255), alt: string(image?.alt, 'alt', 500), caption: string(image?.caption, 'caption', 500, true) })),
      };
      // JSON est un sous-ensemble de YAML : valeurs systématiquement citées,
      // aucune interpolation de YAML/frontmatter fourni par un utilisateur.
      const yaml = Object.entries(clean).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n');
      await fs.writeFile(path.join(destination, 'content/actualites', article.slug + '.md'), `---\n${yaml}\n---\n\n${string(article.body, 'body', 200000)}\n`);
    }
    // Une publication sans catalogue laisse la boutique du dépôt en place.
    const identifiers = new Set();
    const products = catalogue.map((product) => {
      if (!product || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(product.id) || product.id.length > 120 || identifiers.has(product.id)) throw new Error('Identifiant d’article de boutique invalide ou dupliqué.');
      identifiers.add(product.id);
      if (!Array.isArray(product.images) || product.images.length === 0 || product.images.length > 6) throw new Error(`L’article de boutique « ${product.id} » doit porter de 1 à 6 photos.`);
      return {
        id: product.id,
        name: string(product.name, 'name', 160),
        category: string(product.category, 'category', 32),
        images: product.images.map((image) => ({ src: string(image?.src, 'src', 255), alt: string(image?.alt, 'alt', 500) })),
      };
    });
    if (products.length) await fs.writeFile(path.join(destination, 'content/boutique.json'), JSON.stringify({ products }, null, 2) + '\n');
    // Une publication sans coordonnées laisse celles du dépôt en place.
    const contacts = source.contacts;
    if (contacts) {
      if (typeof contacts !== 'object' || Array.isArray(contacts)) throw new Error('Coordonnées exportées invalides.');
      const lines = {};
      for (const key of ['landline', 'mobile', 'whatsappHq', 'whatsappCeo', 'email']) {
        lines[key] = string(contacts.contacts?.[key], `contacts.${key}`, 40);
      }
      for (const key of ['landline', 'mobile', 'whatsappHq', 'whatsappCeo']) {
        if (!/^\+[0-9][0-9 ]{7,23}$/.test(lines[key])) throw new Error(`Numéro invalide : ${key}.`);
      }
      if (!/^[^\s@]+@[^\s@.]+\.[^\s@]+$/.test(lines.email)) throw new Error('Adresse e-mail invalide.');
      const hours = contacts.hours ?? [];
      const pages = contacts.facebookPages ?? [];
      if (!Array.isArray(hours) || hours.length > 7 || !Array.isArray(pages) || pages.length > 10) throw new Error('Horaires ou pages Facebook invalides.');
      const clean = {
        contacts: lines,
        address: string(contacts.address, 'address', 300),
        hours: hours.map((row) => ({ days: string(row?.days, 'days', 60), hours: string(row?.hours, 'hours', 60) })),
        facebookPages: pages.map((row) => {
          const href = string(row?.href, 'href', 300);
          // Une page « Facebook » doit rester sur facebook.com : pas de lien libre.
          let host;
          try { const url = new URL(href); host = url.protocol === 'https:' ? url.hostname : ''; } catch { host = ''; }
          if (host !== 'facebook.com' && !host.endsWith('.facebook.com')) throw new Error(`Lien Facebook invalide : ${href}.`);
          return { country: string(row?.country, 'country', 60), href };
        }),
        mapQuery: string(contacts.mapQuery, 'mapQuery', 200),
      };
      await fs.writeFile(path.join(destination, 'content/coordonnees.json'), JSON.stringify(clean, null, 2) + '\n');
    }
    return { articles: slugs.size, images: images.size, products: products.length, contacts: Boolean(contacts) };
  } catch (error) {
    await fs.rm(destination, { recursive: true, force: true });
    throw error;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('Utilisation : node backoffice/bin/import-export.mjs publication.json [dossier-inexistant]');
  const destination = path.resolve(process.argv[3] ?? path.join(os.tmpdir(), 'baruck-publication-' + crypto.randomBytes(8).toString('hex')));
  const result = await importExport(path.resolve(process.argv[2]), destination);
  console.log(JSON.stringify({ destination, ...result }));
}
