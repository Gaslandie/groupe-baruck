/**
 * Lien public temporaire vers le back-office local, le temps d'un essai client.
 *
 * Un tunnel Cloudflare termine TLS et relaie vers un conteneur PHP dédié, sur la
 * base et le stockage de l'installation locale : le client voit le vrai contenu.
 * Le conteneur n'ouvre aucun port sur la machine — le tunnel est le seul chemin,
 * ce qui est la condition pour que « trusted_proxy » reste sûr.
 *
 * L'adresse change à chaque démarrage et disparaît à l'arrêt. Ce n'est pas un
 * hébergement : la mise en ligne durable reste la procédure Bluehost.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = path.join(directory, '.local');
const configFile = path.join(local, 'demo-config.php');
const web = 'baruck-demo-web';
const tunnel = 'baruck-demo-tunnel';
const network = 'baruck-admin';
const siteUrl = process.env.BARUCK_DEMO_SITE_URL ?? 'https://gaslandie.github.io/groupe-baruck/';

const run = (...args) => spawnSync('docker', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
const docker = (...args) => {
  const result = run(...args);
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'Docker indisponible.');
  return result.stdout.trim();
};
const exists = (name) => spawnSync('docker', ['container', 'inspect', name], { stdio: 'ignore' }).status === 0;
const remove = (name) => { if (exists(name)) run('rm', '-f', name); };
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

if (process.argv.includes('--stop')) {
  remove(tunnel);
  remove(web);
  await fs.rm(configFile, { force: true });
  console.log('Lien public fermé. Le back-office local reste sur http://127.0.0.1:8091/.');
  process.exit(0);
}

if (!exists('baruck-admin-mysql')) throw new Error('Base locale absente. Lancez d’abord « npm run backoffice:local ».');
const secrets = JSON.parse(await fs.readFile(path.join(local, 'secrets.json'), 'utf8'));
docker('start', 'baruck-admin-mysql');

remove(tunnel);
remove(web);
// Configuration volontairement inutilisable tant que l'adresse du tunnel est inconnue :
// le back-office répond « indisponible » plutôt que de servir une origine fausse.
await fs.writeFile(configFile, '<?php return [];\n', { mode: 0o600 });
docker('run', '-d', '--name', web, '--network', network, '-e', 'BARUCK_CONFIG=/config.php',
  '-v', `${directory}:/app:ro`, '-v', `${configFile}:/config.php:ro`, '-v', 'baruck-admin-storage:/data',
  'baruck-backoffice-php:local');

console.log('Ouverture du tunnel…');
docker('run', '-d', '--name', tunnel, '--network', network, 'cloudflare/cloudflared:latest',
  'tunnel', '--no-autoupdate', '--url', `http://${web}:8080`);

let origin = '';
for (let attempt = 0; attempt < 60 && !origin; attempt++) {
  await wait(1000);
  const logs = run('logs', tunnel);
  origin = (logs.stdout + logs.stderr).match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/)?.[0] ?? '';
}
if (!origin) {
  remove(tunnel); remove(web);
  throw new Error('Le tunnel n’a pas fourni d’adresse. Vérifiez la connexion réseau et réessayez.');
}

await fs.writeFile(configFile, `<?php return ['environment'=>'production','origin'=>'${origin}','trusted_proxy'=>true,'site_url'=>'${siteUrl}','storage'=>'/data','database'=>['dsn'=>'mysql:host=baruck-admin-mysql;dbname=baruck;charset=utf8mb4','user'=>'baruck','password'=>'${secrets.password}']];\n`, { mode: 0o600 });

let ready = false;
for (let attempt = 0; attempt < 30 && !ready; attempt++) {
  await wait(2000);
  const probe = spawnSync('curl', ['-sS', '-o', '/dev/null', '-w', '%{http_code}', origin + '/'], { encoding: 'utf8' });
  ready = probe.stdout === '200';
}

console.log(`\nLien du back-office : ${origin}/`);
console.log(ready ? 'Page de connexion vérifiée : elle répond.' : 'Le tunnel est ouvert ; la page met encore quelques secondes à répondre.');
console.log('\nLe lien vit tant que cette machine et ces conteneurs tournent, et change à chaque démarrage.');
console.log('Pour le fermer : npm run backoffice:demo:stop');
