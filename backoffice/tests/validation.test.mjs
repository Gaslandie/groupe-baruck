import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('validation PHP des mots de passe, liens et saisies récupérables', () => {
  const result = spawnSync('php', ['backoffice/tests/validation.php'], { encoding: 'utf8' });
  assert.equal(result.status, 0, result.stderr || result.stdout || 'PHP CLI est nécessaire à cette recette.');
  assert.match(result.stdout, /contrôles de validation réussis/);
});
