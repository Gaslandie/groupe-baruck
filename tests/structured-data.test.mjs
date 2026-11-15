import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

const project = fileURLToPath(new URL("../", import.meta.url));

function readSchemas(language, preview = false) {
  const root = preview ? "https://gaslandie.github.io/groupe-baruck/" : "https://groupebaruck.com/";
  const base = `${preview ? "/groupe-baruck" : ""}${language === "en" ? "/en" : ""}`;
  const result = spawnSync(process.execPath, ["--disable-warning=MODULE_TYPELESS_PACKAGE_JSON", "--input-type=module", "-e", `
    import { registerHooks } from 'node:module';
    import { pathToFileURL } from 'node:url';
    import fs from 'node:fs';
    import ts from 'typescript';
    import React from 'react';
    import { renderToStaticMarkup } from 'react-dom/server';
    registerHooks({
      resolve(specifier, context, nextResolve) {
        if (specifier.startsWith('@/')) specifier = pathToFileURL(process.cwd() + '/src/' + specifier.slice(2) + '.ts').href;
        else if (specifier.startsWith('@content/')) specifier = pathToFileURL(process.cwd() + '/content/' + specifier.slice(9)).href;
        else if (context.parentURL?.endsWith('.ts') && specifier.startsWith('.') && !/\\.[a-z]+$/.test(specifier)) specifier += '.ts';
        return nextResolve(specifier, context);
      },
      load(url, context, nextLoad) {
        if (url.endsWith('.tsx')) return { format: 'module', shortCircuit: true, source: ts.transpileModule(fs.readFileSync(new URL(url), 'utf8'), {
          compilerOptions: { jsx: ts.JsxEmit.ReactJSX, module: ts.ModuleKind.ESNext }
        }).outputText };
        return nextLoad(url, context);
      }
    });
    const { organizationSchema, serviceSchema, breadcrumbSchema, articleSchema, espoirDeVieSchema } = await import('./src/lib/structured-data.ts');
    const { getAllArticles } = await import('./src/lib/actualites.ts');
    const { StructuredData } = await import('./src/components/ui/StructuredData.tsx');
    const articles = getAllArticles().filter(a => !a.draft);
    const jeca = articles.find(a => a.slug === 'jeca-2022-dakar');
    const hostile = { '@type': 'Service', name: '</script><script>alert(1)</script>' };
    console.log(JSON.stringify({
      organization: organizationSchema,
      services: ['studio-photo', 'hotesses-evenementielles'].map(serviceSchema),
      edv: espoirDeVieSchema('Description de test'),
      breadcrumbs: breadcrumbSchema([{name: 'Home', href: '/'}, {name: 'Studio', href: '/studio-photo/'}]),
      articles: articles.map(articleSchema),
      unrelated: articleSchema({...jeca, html: '<p>Autre événement le même jour.</p>'}),
      imprecise: articleSchema({...jeca, datePrecision: 'year'}),
      injected: renderToStaticMarkup(React.createElement(StructuredData, {data: hostile})),
      hostile
    }));
  `], {
    cwd: project, encoding: "utf8", env: {
      ...process.env, NODE_ENV: "production", BARUCK_SEO_MODE: preview ? "preview" : "production",
      NEXT_PUBLIC_SITE_URL: root + (language === "en" ? "en/" : ""),
      NEXT_PUBLIC_BASE_PATH: base, NEXT_PUBLIC_SITE_LANGUAGE: language,
    },
  });
  assert.equal(result.status, 0, result.stderr);
  return JSON.parse(result.stdout);
}

for (const preview of [false, true]) {
  for (const language of ["fr", "en"]) {
    test(`JSON-LD ${preview ? "copie" : "production"} ${language} : identité commune, chemins et faits cohérents`, () => {
      const data = readSchemas(language, preview);
      const root = preview ? "https://gaslandie.github.io/groupe-baruck/" : "https://groupebaruck.com/";
      const localizedRoot = root + (language === "en" ? "en/" : "");
      const organizationId = "https://groupebaruck.com/#organization";
      assert.equal(data.organization["@id"], organizationId);
      assert.equal(data.organization.url, "https://groupebaruck.com/");
      assert.equal(data.edv["@id"], "https://groupebaruck.com/espoir-de-vie/#organization");
      for (const [index, service] of data.services.entries()) {
        const path = index === 0 ? "studio-photo/" : "hotesses-evenementielles/";
        assert.equal(service["@type"], "Service");
        assert.equal(service["@id"], `https://groupebaruck.com/${path}#service`);
        assert.equal(service.url, localizedRoot + path);
        assert.equal(service.provider["@id"], organizationId);
        assert.equal(service.areaServed, language === "en" ? "Kobayah, Conakry, Guinea" : "Kobayah, Conakry, Guinée");
        assert.ok(service.name && service.description);
        assert.ok(!("openingHours" in service) && !("aggregateRating" in service));
      }
      assert.deepEqual(data.breadcrumbs.itemListElement.map(item => [item.position, item.item]), [[1, localizedRoot], [2, localizedRoot + "studio-photo/"]]);
      const nodes = data.articles.flatMap(item => item["@graph"]);
      const articles = nodes.filter(item => item["@type"] === "NewsArticle");
      assert.ok(articles.length > 0);
      assert.ok(articles.every(item => !("datePublished" in item) && !("dateModified" in item) && !("author" in item)));
      assert.ok(articles.every(item => item.publisher["@id"] === organizationId));
      const events = nodes.filter(item => item["@type"] === "Event");
      assert.ok(events.length > 0, "Les éditions citées gardent leurs dates d’événement.");
      assert.ok(events.every(item => item.startDate && item.endDate && item.location.name));
      assert.ok(events.every(item => !("eventStatus" in item)));
      assert.equal(data.unrelated["@graph"].length, 1, "Une date commune ne suffit pas à associer une édition.");
      assert.equal(data.imprecise["@graph"].length, 1, "Une année seule ne suffit pas à dater un événement.");
      assert.equal((data.injected.match(/<script/g) ?? []).length, 1);
      const serialized = data.injected.match(/^<script type="application\/ld\+json">(.*)<\/script>$/s)?.[1];
      assert.ok(serialized && !serialized.includes("<"));
      assert.deepEqual(JSON.parse(serialized), data.hostile, "Le contenu reste du JSON, pas du HTML exécutable.");
    });
  }
}
