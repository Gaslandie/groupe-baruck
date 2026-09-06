import assert from "node:assert/strict";
import fs from "node:fs";
import { test } from "node:test";
import matter from "gray-matter";
import { categoryLabels } from "../src/data/actualites.ts";

const source = fs.readFileSync(new URL("../.pages.yml", import.meta.url), "utf8");
const config = matter(`---\n${source}\n---`).data;
const collection = config.content.find(({ name }) => name === "actualites");
const fields = Object.fromEntries(collection.fields.map((field) => [field.name, field]));

test("le schéma du CMS couvre les articles existants et leurs catégories", () => {
  assert.equal(collection.path, "content/actualites");
  assert.equal(collection.format, "yaml-frontmatter");
  assert.deepEqual(Object.fromEntries(fields.category.options.values.map(({ name, label }) => [name, label])), categoryLabels);
  for (const file of fs.readdirSync(new URL("../content/actualites/", import.meta.url))) {
    if (!file.endsWith(".md")) continue;
    const { data } = matter(fs.readFileSync(new URL(`../content/actualites/${file}`, import.meta.url), "utf8"));
    assert.equal(typeof data.draft, "boolean", `${file} : statut explicite requis pour éviter le défaut de création`);
    for (const key of Object.keys(data)) assert.ok(fields[key], `${file} : champ ${key} absent du CMS`);
  }
  assert.equal(fields.body.options.format, "markdown");
  assert.equal(fields.gallery.type, "object");
  assert.equal(fields.gallery.list, true);
  assert.deepEqual(fields.gallery.fields.map(({ name }) => name), ["src", "alt", "caption"]);
});
test("la création commence en brouillon et les noms d’articles restent stables", () => {
  assert.equal(fields.draft.default, true);
  assert.equal(fields.date.default, "");
  assert.equal(fields.date.options.format, "yyyy-MM-dd");
  assert.equal(collection.operations.rename, false);
  assert.equal(collection.operations.delete, false);
  assert.equal(config.settings.content.merge, true);
});
test("les chemins écrits par le CMS restent indépendants de GitHub Pages", () => {
  const media = config.media.find(({ name }) => name === fields.cover.options.media);
  assert.equal(media.input, "public/images");
  assert.equal(media.output, "/images");
  assert.deepEqual(media.extensions, ["jpg", "jpeg", "png", "webp"]);
  assert.equal(media.rename, "safe");
  assert.ok(fs.existsSync(new URL(`../${fields.cover.options.path}/`, import.meta.url)));
  assert.equal(fields.body.options.media, media.name);
});
