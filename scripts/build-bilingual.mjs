import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';

const root = process.cwd();
const base = process.env.NEXT_PUBLIC_BASE_PATH ?? '';
if (base && !/^\/[a-zA-Z0-9/_-]+$/.test(base)) throw new Error('Chemin public invalide.');
const site = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://gaslandie.github.io/groupe-baruck/').replace(/\/?$/, '/');
const temporary = await fs.mkdtemp(path.join(os.tmpdir(), 'baruck-bilingual-'));
async function build(language) {
  const child = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'build', ...process.argv.slice(2)], {
    stdio: 'inherit', env: { ...process.env, NEXT_PUBLIC_SITE_LANGUAGE: language,
      NEXT_PUBLIC_SITE_BASE_PATH: base, NEXT_PUBLIC_BASE_PATH: base + (language === 'en' ? '/en' : ''),
      NEXT_PUBLIC_SITE_URL: site + (language === 'en' ? 'en/' : '') },
  });
  const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve); });
  if (code !== 0) throw new Error(`Construction ${language} interrompue.`);
}
try {
  await build('fr');
  await fs.cp(path.join(root, 'out'), path.join(temporary, 'fr'), { recursive: true });
  await fs.rm(path.join(root, 'out'), { recursive: true, force: true });
  await build('en');
  // Les anciennes adresses .html sont des fichiers publics de redirection.
  // Leurs chemins relatifs restent valables dans chaque langue.
  for (const name of await fs.readdir(path.join(root, 'public'), { recursive: true })) {
    if (!name.endsWith('.html')) continue;
    const file = path.join(root, 'out', name);
    const html = await fs.readFile(file, 'utf8');
    await fs.writeFile(file, html.replace('lang="fr"', 'lang="en"')
      .replace('Redirection — Groupe Baruck', 'Redirect — Groupe Baruck')
      .replace('Cette page a changé d’adresse :', 'This page has moved:')
      .replace('>continuer<', '>continue<'));
  }
  await fs.cp(path.join(root, 'out'), path.join(temporary, 'en'), { recursive: true });
  await fs.rm(path.join(root, 'out'), { recursive: true, force: true });
  await fs.cp(path.join(temporary, 'fr'), path.join(root, 'out'), { recursive: true });
  await fs.cp(path.join(temporary, 'en'), path.join(root, 'out/en'), { recursive: true });
  console.log('Versions française et anglaise construites dans out/ et out/en/.');
} catch (error) {
  // Aucun export partiel ne doit être envoyé par le déploiement.
  await fs.rm(path.join(root, 'out'), { recursive: true, force: true });
  throw error;
} finally {
  await fs.rm(temporary, { recursive: true, force: true });
}
