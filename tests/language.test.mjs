import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { test } from 'node:test';

function check(language, base, assertions) {
  const result = spawnSync(process.execPath, ['--input-type=module', '-e', `
    import assert from 'node:assert/strict';
    import { translate, translateContent, translateMarkdown, otherLanguagePath } from './src/lib/language.ts';
    ${assertions}
  `], { encoding: 'utf8', env: { ...process.env, NEXT_PUBLIC_SITE_LANGUAGE: language, NEXT_PUBLIC_SITE_BASE_PATH: base } });
  assert.equal(result.status, 0, result.stderr);
}

test('le français conserve exactement les textes et les données', () => {
  check('fr', '', `
    assert.equal(translate('  Actualités  '), '  Actualités  ');
    const content = { title: 'Actualités', src: '/images/test.webp', date: '2026-09-29' };
    assert.deepEqual(translateContent(content), content);
    assert.equal(otherLanguagePath('/actualites/test/'), '/en/actualites/test/');
  `);
});

test('l’anglais traduit les textes sans changer les identifiants, dates et liens', () => {
  check('en', '/groupe-baruck', `
    assert.equal(translate('Actualités'), 'News');
    assert.equal(translate('  Actualités  '), '  News  ');
    const content = { title: 'Actualités', id: 'Actualités', slug: 'news', category: 'groupe', date: '2026-09-29', src: '/images/test.webp', href: '/actualites/' };
    assert.deepEqual(translateContent(content), { ...content, title: 'News' });
    assert.equal(translate('Nouveau texte sans traduction'), 'Nouveau texte sans traduction');
    assert.equal(otherLanguagePath('/actualites/test/'), '/groupe-baruck/actualites/test/');
    assert.equal(otherLanguagePath('//hostile.example'), '/groupe-baruck/');
    const markdown = '## Les premières étapes\\n\\n[Découvrir l’orphelinat](/espoir-de-vie/#orphelinat)';
    assert.equal(translateMarkdown(markdown), '## The first milestones\\n\\n[Discover the orphanage](/espoir-de-vie/#orphelinat)');
    assert.equal(translateMarkdown('<script>alert(1)</script>'), '<script>alert(1)</script>');
  `);
});
