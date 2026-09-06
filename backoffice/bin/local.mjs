import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const directory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const local = path.join(directory, '.local');
await fs.mkdir(local, { recursive: true, mode: 0o700 });
const docker = (...args) => {
  const result = spawnSync('docker', args, { encoding: 'utf8', maxBuffer: 8 * 1024 * 1024 });
  if (result.status !== 0) throw new Error(result.stderr || result.error?.message || 'Docker indisponible.');
  return result.stdout.trim();
};
const exists = (type, name) => spawnSync('docker', [type, 'inspect', name], { stdio: 'ignore' }).status === 0;
let secrets;
try { secrets = JSON.parse(await fs.readFile(path.join(local, 'secrets.json'), 'utf8')); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  secrets = { root: crypto.randomBytes(24).toString('hex'), password: crypto.randomBytes(24).toString('hex') };
  await fs.writeFile(path.join(local, 'secrets.json'), JSON.stringify(secrets), { mode: 0o600 });
}
const envFile = path.join(local, 'mysql.env');
await fs.writeFile(envFile, `MYSQL_ROOT_PASSWORD=${secrets.root}\nMYSQL_DATABASE=baruck\nMYSQL_USER=baruck\nMYSQL_PASSWORD=${secrets.password}\n`, { mode: 0o600 });
const config = path.join(local, 'config.php');
await fs.writeFile(config, `<?php return ['environment'=>'local','origin'=>'http://127.0.0.1:8091','site_url'=>'https://gaslandie.github.io/groupe-baruck/','storage'=>'/data','database'=>['dsn'=>'mysql:host=baruck-admin-mysql;dbname=baruck;charset=utf8mb4','user'=>'baruck','password'=>'${secrets.password}']];\n`, { mode: 0o600 });
if (!exists('network', 'baruck-admin')) docker('network', 'create', 'baruck-admin');
if (!exists('container', 'baruck-admin-mysql')) {
  console.log('Démarrage de MySQL dans un environnement réservé à Baruck…');
  docker('run', '-d', '--name', 'baruck-admin-mysql', '--network', 'baruck-admin', '--env-file', envFile, '-v', 'baruck-admin-mysql:/var/lib/mysql', 'mysql:8.0');
} else docker('start', 'baruck-admin-mysql');
console.log('Vérification de MySQL…');
let ready = false;
for (let i = 0; i < 90; i++) {
  if (spawnSync('docker', ['exec', 'baruck-admin-mysql', 'sh', '-c', 'MYSQL_PWD="$MYSQL_PASSWORD" mysql -h127.0.0.1 -u"$MYSQL_USER" "$MYSQL_DATABASE" -e "SELECT 1"'], { stdio: 'ignore' }).status === 0) { ready = true; break; }
  await new Promise((resolve) => setTimeout(resolve, 1000));
}
if (!ready) throw new Error('MySQL ne répond pas encore. Relancez la commande.');
if (!exists('container', 'baruck-admin-web')) {
  docker('run', '-d', '--name', 'baruck-admin-web', '--network', 'baruck-admin', '-p', '127.0.0.1:8091:8080', '-e', 'BARUCK_CONFIG=/config.php', '-v', `${directory}:/app:ro`, '-v', `${config}:/config.php:ro`, '-v', 'baruck-admin-storage:/data', 'baruck-backoffice-php:local');
} else docker('start', 'baruck-admin-web');
console.log(docker('exec', 'baruck-admin-web', 'php', 'bin/install.php', 'init'));
console.log('Back-office local : http://127.0.0.1:8091/ — créez votre compte à la première ouverture.');
