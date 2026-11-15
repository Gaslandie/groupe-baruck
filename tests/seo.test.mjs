import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { after, test } from "node:test";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { englishProjection } from "../src/lib/editorial-translations.ts";
import { seoConfiguration } from "../src/lib/seo.ts";

const project = fileURLToPath(new URL("../", import.meta.url));
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "baruck-seo-test-"));
const articles = path.join(fixture, "content/actualites");
fs.mkdirSync(articles, { recursive: true });
after(() => fs.rmSync(fixture, { recursive: true, force: true }));
const source = { title: "Une prestation de test", excerpt: "Un résumé de test", date: "2026-09-06", category: "groupe" };
const body = "Texte inédit de test.";
const en = { ...englishProjection({ ...source, body }, "article"), title: "A test service", excerpt: "A test summary", body: "New test content." };
fs.writeFileSync(path.join(articles, "fr-only.md"), matter.stringify(body, source));
fs.writeFileSync(path.join(articles, "translated.md"), matter.stringify(body, { ...source, translations: { en } }));
fs.writeFileSync(path.join(articles, "draft.md"), matter.stringify(body, { ...source, draft: true }));
// Un corps traduit ne suffit pas si le titre et le résumé sont encore en français.
fs.writeFileSync(path.join(articles, "partial.md"), matter.stringify("## Les premières étapes", source));

function readMetadata(mode, language) {
  const url = `https://groupebaruck.com/${language === "en" ? "en/" : ""}`;
  const result = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e", `
    import { registerHooks } from 'node:module';
    import { pathToFileURL } from 'node:url';
    registerHooks({resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('@/')) specifier = pathToFileURL(process.cwd() + '/src/' + specifier.slice(2) + '.ts').href;
      else if (specifier.startsWith('@content/')) specifier = pathToFileURL(process.cwd() + '/content/' + specifier.slice(9)).href;
      else if (context.parentURL?.endsWith('.ts') && specifier.startsWith('.') && !/\\.[a-z]+$/.test(specifier)) specifier += '.ts';
      return nextResolve(specifier, context);
    }});
    const { default: sitemap } = await import('./src/app/sitemap.ts');
    const { default: robots } = await import('./src/app/robots.ts');
    const { pageAlternates } = await import('./src/lib/metadata.ts');
    const { getAllArticles } = await import('./src/lib/actualites.ts');
    console.log(JSON.stringify({
      sitemap: sitemap(), robots: robots(),
      pair: pageAlternates(${JSON.stringify(url + "studio-photo/")}),
      single: pageAlternates('https://groupebaruck.com/actualites/fr-only/', false),
      articles: getAllArticles().map(({slug, hasEnglishTranslation, translationPending}) => ({slug, hasEnglishTranslation, translationPending}))
    }));
  `], { cwd: project, encoding: "utf8", env: {
    ...process.env, NODE_ENV: "production", BARUCK_EDITORIAL_ROOT: fixture,
    BARUCK_SEO_MODE: mode, NEXT_PUBLIC_SITE_URL: url, NEXT_PUBLIC_SITE_LANGUAGE: language,
  } });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

test("l’indexation exige un mode explicite et le domaine client exact", () => {
  assert.equal(seoConfiguration("preview", "https://gaslandie.github.io/groupe-baruck/").indexable, false);
  for (const url of ["https://groupebaruck.com/", "https://groupebaruck.com/en/"]) {
    assert.equal(seoConfiguration("production", url).indexable, true);
  }
  for (const url of ["https://gaslandie.github.io/groupe-baruck/", "http://groupebaruck.com/", "https://www.groupebaruck.com/", "https://groupebaruck.com.evil.test/", "https://groupebaruck.com/preview/", "https://groupebaruck.com/?preview=1", "https://user:pass@groupebaruck.com/"]) {
    assert.throws(() => seoConfiguration("production", url), /Seul/);
  }
  assert.throws(() => seoConfiguration("prod"), /production ou preview/);
  const result = spawnSync(process.execPath, ["--input-type=module", "-e", "delete process.env.BARUCK_SEO_MODE; const {seoConfiguration}=await import('./src/lib/seo.ts'); if(seoConfiguration().indexable) process.exit(1)"], { cwd: project });
  assert.equal(result.status, 0);
});

for (const language of ["fr", "en"]) {
  test(`preview ${language} : exploration permise, aucun sitemap annoncé ni URL proposée`, () => {
    const result = readMetadata("preview", language);
    assert.deepEqual(result.robots, { rules: { userAgent: "*", allow: "/" } });
    assert.deepEqual(result.sitemap, []);
  });

  test(`production ${language} : seules les traductions disponibles sont proposées`, () => {
    const result = readMetadata("production", language);
    const urls = result.sitemap.map(entry => entry.url);
    assert.equal(urls.length, new Set(urls).size);
    assert.ok(urls.includes(`https://groupebaruck.com/${language === "en" ? "en/" : ""}studio-photo/`));
    assert.ok(urls.includes("https://groupebaruck.com/en/actualites/translated/"));
    assert.equal(urls.includes("https://groupebaruck.com/actualites/fr-only/"), language === "fr");
    assert.ok(!urls.some(url => /projets-realisations|draft|a-venir|#|\/en\/actualites\/(fr-only|partial)\//.test(url)));
    assert.ok(result.sitemap.every(entry => !("lastModified" in entry)));
    for (const entry of result.sitemap.filter(entry => entry.url.endsWith("/translated/"))) {
      assert.deepEqual(entry.alternates.languages, { fr: "https://groupebaruck.com/actualites/translated/", en: "https://groupebaruck.com/en/actualites/translated/" });
    }
    const frOnly = result.sitemap.find(entry => entry.url.endsWith("/fr-only/"));
    if (frOnly) assert.equal(frOnly.alternates, undefined);
    assert.deepEqual(result.single, { canonical: "https://groupebaruck.com/actualites/fr-only/", types: result.single.types });
    assert.deepEqual(result.pair.languages, { fr: "https://groupebaruck.com/studio-photo/", en: "https://groupebaruck.com/en/studio-photo/", "x-default": "https://groupebaruck.com/studio-photo/" });
    assert.equal(result.robots.sitemap, `https://groupebaruck.com/${language === "en" ? "en/" : ""}sitemap.xml`);
    for (const article of result.articles) {
      assert.equal(article.hasEnglishTranslation, article.slug === "translated");
      assert.equal(article.translationPending, language === "en" && article.slug !== "translated" ? true : undefined);
    }
  });
}
