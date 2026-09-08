import assert from "node:assert/strict";
import fs from "node:fs";
import { registerHooks } from "node:module";
import { test } from "node:test";
import { imageSize } from "image-size";

registerHooks({
  resolve(specifier, context, nextResolve) {
    return nextResolve(specifier.startsWith("@/")
      ? new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href
      : specifier, context);
  },
});

const { brandOrderHref } = await import("../src/lib/brand-order.ts");
const { brandProducts, brandCategories } = await import("../src/data/marque-baruck.ts");
const { routes, site, contacts } = await import("../src/data/site.ts");

test("chaque demande identifie l’article et son visuel, vers le WhatsApp du siège", () => {
  for (const product of brandProducts) {
    const url = new URL(brandOrderHref(product, "  Taille M & coloris blanc\nQuantité : 2  "));
    assert.equal(url.origin + url.pathname, contacts.whatsappHq.href);
    const message = url.searchParams.get("text");
    assert.ok(message.includes(product.name));
    assert.ok(message.includes(`${site.url}${routes.brand.slice(1)}#produit-${product.id}`));
    assert.ok(message.includes(`${site.url}${product.images[0].src.slice(1)}`));
    assert.ok(message.includes("Taille M & coloris blanc\nQuantité : 2"));
    assert.equal([...url.searchParams.keys()].length, 1);
  }
  assert.ok(new URL(brandOrderHref()).searchParams.get("text").includes("marque Baruck"));
  assert.ok(!new URL(brandOrderHref(brandProducts[0], "  ")).searchParams.get("text").includes("Ma demande :"));
});

test("le catalogue a des ancres uniques, des catégories connues et des images locales exactes", () => {
  assert.equal(new Set(brandProducts.map(({ id }) => id)).size, brandProducts.length);
  for (const product of brandProducts) {
    assert.match(product.id, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    assert.ok(brandCategories[product.category]);
    assert.ok(product.images.length > 0);
    for (const photo of product.images) {
      assert.match(photo.src, /^\/images\/marque-baruck\/[a-z0-9-]+\.jpg$/);
      const buffer = fs.readFileSync(new URL(`../public${photo.src}`, import.meta.url));
      const dimensions = imageSize(buffer);
      assert.equal(photo.width, dimensions.width);
      assert.equal(photo.height, dimensions.height);
      assert.ok(photo.alt.trim());
    }
  }
});
