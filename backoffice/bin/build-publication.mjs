import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { spawn } from 'node:child_process';
import { importExport } from './import-export.mjs';

if (!process.argv[2]) throw new Error('Utilisation : npm run backoffice:publish-build -- /chemin/publication.json');
const destination = path.join(os.tmpdir(), 'baruck-publication-' + crypto.randomBytes(8).toString('hex'));
// Coordonnées et textes partent dans le bundle du navigateur : ils ne peuvent
// pas être lus depuis le dossier temporaire. Ils sont déposés le temps du build
// dans un emplacement ignoré par Git, que next.config.ts préfère au dépôt.
const bundledContent = ['coordonnees.json', 'textes.json'];
const publishedDirectory = path.resolve('.backoffice-content');
try {
  const result = await importExport(path.resolve(process.argv[2]), destination);
  for (const name of bundledContent) {
    const exported = path.join(destination, 'content', name);
    if (!(await fs.stat(exported).then(() => true, () => false))) continue;
    await fs.mkdir(publishedDirectory, { recursive: true });
    await fs.copyFile(exported, path.join(publishedDirectory, name));
  }
  console.log(`Construction de ${result.articles} actualités validées et ${result.products} articles de boutique…`);
  // Le chargeur habituel valide aussi les liens, dates, catégories, images et
  // le rendu Markdown. Un export invalide fait échouer le build.
  const child = spawn('npm', ['run', 'build', '--', ...process.argv.slice(3)], { stdio: 'inherit', env: { ...process.env, BARUCK_EDITORIAL_ROOT: destination } });
  const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve); });
  if (code !== 0) throw new Error('Publication non construite : corrigez les erreurs signalées.');
  // Les images privées validées ne sont copiées que dans l’export public final.
  await fs.cp(path.join(destination, 'public/images/actualites/uploads'), path.resolve('out/images/actualites/uploads'), { recursive: true });
  console.log('Publication construite dans out/. Elle attend son déploiement sur le site.');
} finally {
  await fs.rm(destination, { recursive: true, force: true });
  for (const name of bundledContent) await fs.rm(path.join(publishedDirectory, name), { force: true });
  await fs.rmdir(publishedDirectory).catch(() => {});
}
