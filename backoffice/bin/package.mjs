import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const destination = path.join(root, 'dist');
await fs.mkdir(destination, { recursive: true });
const temporary = await fs.mkdtemp('/tmp/baruck-admin-package-');
const app = path.join(temporary, 'backoffice');
await fs.mkdir(app);
for (const name of ['src', 'public', 'schema.sql', 'seed.json', 'config.example.php', '.htaccess', 'INSTALLATION.md']) {
  await fs.cp(path.join(root, name), path.join(app, name), { recursive: true });
}
await fs.mkdir(path.join(app, 'bin'));
await fs.copyFile(path.join(root, 'bin/install.php'), path.join(app, 'bin/install.php'));
const archive = path.join(destination, 'baruck-backoffice-bluehost.tar.gz');
const result = spawnSync('tar', ['-czf', archive, '-C', temporary, 'backoffice'], { encoding: 'utf8' });
if (result.status !== 0) throw new Error(result.stderr);
await fs.rm(temporary, { recursive: true, force: true });
console.log(`Paquet sans identifiants ni données privées : ${archive}`);
