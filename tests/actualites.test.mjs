import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import os from "node:os";
import path from "node:path";
import { after, beforeEach, test } from "node:test";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const project = fileURLToPath(new URL("../", import.meta.url));
const fixture = fs.mkdtempSync(path.join(os.tmpdir(), "baruck-content-test-"));
const articles = path.join(fixture, "content/actualites");
fs.mkdirSync(articles, { recursive: true });
fs.cpSync(path.join(project, "public/images"), path.join(fixture, "public/images"), { recursive: true });
fs.mkdirSync(path.join(fixture, "public/images/actualites"), { recursive: true });
fs.writeFileSync(path.join(fixture, "public/images/actualites/test.png"), Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aB9sAAAAASUVORK5CYII=", "base64",
));

// Node 24 lit TypeScript nativement ; seule la résolution de l’alias Next est ajoutée.
registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});
const originalDirectory = process.cwd();
process.chdir(fixture);
const { getAllArticles, getArticle, resolveImage } = await import("../src/lib/actualites.ts");
after(() => {
  process.chdir(originalDirectory);
  fs.rmSync(fixture, { recursive: true, force: true });
});
beforeEach(() => {
  for (const name of fs.readdirSync(articles)) fs.unlinkSync(path.join(articles, name));
  process.env.NODE_ENV = "production";
  delete process.env.NEXT_PUBLIC_BASE_PATH;
});
const base = { title: "Article de test", date: "2026-09-06", category: "groupe", excerpt: "Résumé de test" };
function write(data = {}, body = "Texte de test.", filename = "article-test.md") {
  const fields = JSON.parse(JSON.stringify({ ...base, ...data }));
  fs.writeFileSync(path.join(articles, filename), matter.stringify(body, fields));
}

test("les articles du dépôt sont lisibles avec et sans préfixe d’hébergement", () => {
  let publishedCount = 0;
  for (const filename of fs.readdirSync(path.join(project, "content/actualites"))) {
    if (!filename.endsWith(".md")) continue;
    fs.copyFileSync(path.join(project, "content/actualites", filename), path.join(articles, filename));
    const { data } = matter(fs.readFileSync(path.join(articles, filename), "utf8"));
    if (data.draft !== true) publishedCount += 1;
  }
  for (const prefix of ["", "/groupe-baruck"]) {
    process.env.NEXT_PUBLIC_BASE_PATH = prefix;
    const result = getAllArticles();
    assert.equal(result.length, publishedCount);
    for (const article of result) {
      const source = matter(fs.readFileSync(path.join(articles, `${article.slug}.md`), "utf8"));
      assert.equal(article.title, source.data.title);
      assert.equal(article.excerpt, source.data.excerpt);
      assert.equal(article.draft, false);
    }
  }
});
test("les brouillons, même incomplets, restent hors production", () => {
  write({ draft: true });
  fs.writeFileSync(path.join(articles, "incomplet.md"), "---\ndraft: true\ncover: /images/absent.jpg\n---\n");
  assert.deepEqual(getAllArticles(), []);
  assert.equal(getArticle("incomplet"), undefined);
});
test("un brouillon complet reste consultable en développement", () => {
  write({ draft: true });
  process.env.NODE_ENV = "development";
  assert.equal(getArticle("article-test").draft, true);
});
test("publier puis repasser en brouillon contrôle la présence dans le site", () => {
  write({ draft: false });
  assert.equal(getAllArticles().length, 1);
  write({ draft: true });
  assert.equal(getAllArticles().length, 0);
});
test("un statut mal typé ne passe pas pour un brouillon", () => {
  write({ draft: "true" });
  assert.throws(getAllArticles, /draft.*booléen/);
});
test("les champs optionnels vidés par le CMS sont acceptés", () => {
  for (const empty of [undefined, "", null, "   "]) {
    write({ cover: empty, coverAlt: empty, gallery: null });
    assert.equal(getAllArticles()[0].cover, undefined);
    assert.deepEqual(getAllArticles()[0].gallery, []);
    write({ gallery: [{ src: "/images/actualites/test.png", alt: "Image de test", caption: empty }] });
    assert.equal(getAllArticles()[0].gallery[0].caption, undefined);
  }
});
test("les couvertures et galeries exigent une description et une image existante", () => {
  write({ cover: "/images/actualites/test.png", coverAlt: "" });
  assert.throws(getAllArticles, /coverAlt/);
  write({ gallery: [{ src: "/images/actualites/test.png", alt: "" }] });
  assert.throws(getAllArticles, /gallery\[0\].alt/);
  write({ cover: "/images/absent.jpg", coverAlt: "Image absente" });
  assert.throws(getAllArticles, /n’existe pas/);
});
test("les catégories héritées, dates impossibles et contenus vides sont refusés", () => {
  for (const category of ["constructor", "toString", "autre"]) {
    write({ category });
    assert.throws(getAllArticles, /catégorie/);
  }
  for (const date of ["2026-02-30", "2025-02-29", "2026-13-01", "06/09/2026"]) {
    write({ date });
    assert.throws(getAllArticles, /date/);
  }
  fs.writeFileSync(path.join(articles, "article-test.md"), "---\ntitle: Test\ndate: 2026-02-30\ncategory: groupe\nexcerpt: Test\n---\nTexte");
  assert.throws(getAllArticles, /date/);
  write({ date: "2024-02-29" });
  assert.equal(getAllArticles()[0].date, "2024-02-29");
  write({}, "");
  assert.throws(getAllArticles, /body/);
});
test("les slugs invalides et le slug réservé ne peuvent être publiés", () => {
  for (const filename of ["titre accentué.md", "a-venir.md"]) {
    write({}, "Texte", filename);
    assert.throws(getAllArticles, /slug/);
    fs.unlinkSync(path.join(articles, filename));
  }
  assert.throws(() => getArticle("../secret"), /invalide/);
});
test("les dates YAML non citées restent lisibles avec des fins de ligne Windows", () => {
  const source = "---\ntitle: Test\ndate: 2026-09-06\ncategory: groupe\nexcerpt: Test\n---\nTexte";
  fs.writeFileSync(path.join(articles, "article-test.md"), source.replaceAll("\n", "\r\n"));
  assert.equal(getAllArticles()[0].date, "2026-09-06");
});
test("les images Markdown ont leur basePath, dimensions et chargement différé", () => {
  process.env.NEXT_PUBLIC_BASE_PATH = "/groupe-baruck";
  write({}, '![Image de test](/images/actualites/test.png "Légende")\n\n[JECA](/jeca/#edition-3)');
  const { html } = getAllArticles()[0];
  assert.match(html, /src="\/groupe-baruck\/images\/actualites\/test.png"/);
  assert.match(html, /width="1" height="1" loading="lazy"/);
  assert.match(html, /href="\/groupe-baruck\/jeca\/#edition-3"/);
  assert.match(html, /title="Légende"/);
});
test("les liens autorisés et les exemples de code sont préservés", () => {
  process.env.NEXT_PUBLIC_BASE_PATH = "/groupe-baruck";
  write({}, '[Site](https://example.com/) [Courriel](mailto:test@example.com) [Appeler](tel:+224000000000) [Ancre](#suite)\n\n`href="/jeca/"`');
  const { html } = getAllArticles()[0];
  for (const href of ["https://example.com/", "mailto:test@example.com", "tel:+224000000000", "#suite"]) {
    assert.ok(html.includes(`href="${href}"`));
  }
  assert.match(html, /<code>href=&quot;\/jeca\/&quot;<\/code>/);
});
test("le HTML et les liens exécutables sont refusés même imbriqués", () => {
  for (const body of [
    '<script>alert(1)</script>', '<img src=x onerror="alert(1)">',
    "Texte <iframe src='https://example.com'></iframe>",
    "[Lien](javascript:alert%281%29)", "[Lien](jav&#x61;script:alert%281%29)",
    "[Lien](data:text/html,test)", "[Lien](//example.com)",
    "> **[Lien](javascript:alert%281%29)**",
  ]) {
    write({}, body);
    assert.throws(getAllArticles, /HTML brut|lien/);
  }
});
test("les médias distants, sorties de dossier et liens symboliques sont refusés", () => {
  for (const src of ["https://example.com/a.jpg", "/images/test.svg", "/images/../secret.png", "/images/actualites/../../secret.png"]) {
    assert.throws(() => resolveImage(src, "Test", "test.md"), /image|extension/);
  }
  fs.copyFileSync(path.join(fixture, "public/images/actualites/test.png"), path.join(fixture, "secret.png"));
  fs.symlinkSync(path.join(fixture, "secret.png"), path.join(fixture, "public/images/lien.png"));
  assert.throws(() => resolveImage("/images/lien.png", "Test", "test.md"), /rester dans/);
});
test("un moteur de frontmatter exécutable ne peut pas être sélectionné", () => {
  fs.writeFileSync(path.join(articles, "test.md"), "---js\n({ title: 'Test' })\n---\nTexte");
  assert.throws(getAllArticles, /frontmatter YAML/);
});
