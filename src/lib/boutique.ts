import fs from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";

import { brandCategories, type BrandCategory, type BrandProduct } from "@/data/marque-baruck";

// Le catalogue est un contenu suivi dans Git, remplaçable par un export validé
// du back-office. Une publication qui n’en porte aucun laisse celui du dépôt.
const editorialRoot = process.env.BARUCK_EDITORIAL_ROOT;
const exported = editorialRoot ? path.join(editorialRoot, "content", "boutique.json") : "";
const catalogueFile =
  exported && fs.existsSync(exported) ? exported : path.join(process.cwd(), "content", "boutique.json");
const idPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function error(message: string): never {
  throw new Error(`Boutique "${catalogueFile}" : ${message}`);
}

function requiredString(value: unknown, field: string, max: number): string {
  if (typeof value !== "string" || value.trim() === "" || value.length > max) {
    error(`le champ requis "${field}" est manquant, vide ou trop long.`);
  }

  return value.trim();
}

function resolveImage(value: unknown, productId: string) {
  if (typeof value !== "object" || value === null) {
    error(`une image de "${productId}" n’est pas renseignée.`);
  }

  const { src, alt } = value as { src?: unknown; alt?: unknown };
  const source = requiredString(src, `images[].src (${productId})`, 255);
  const description = requiredString(alt, `images[].alt (${productId})`, 500);

  if (!source.startsWith("/images/") || !/\.(?:jpe?g|png|webp)$/i.test(source)) {
    error(`le chemin d’image "${source}" doit désigner un fichier de "/images/".`);
  }

  // Une image importée depuis le back-office n’existe que dans son export.
  const isUpload = source.startsWith("/images/actualites/uploads/") && editorialRoot;
  const imageBase = isUpload ? editorialRoot : process.cwd();
  const file = path.join(imageBase, "public", source.slice(1));
  const imagesRoot = path.join(imageBase, "public", "images");
  if (
    source.includes("\\") ||
    source.split("/").some((segment) => segment === "." || segment === "..") ||
    !file.startsWith(`${imagesRoot}${path.sep}`)
  ) {
    error(`le chemin d’image "${source}" doit rester dans "/images/".`);
  }
  if (!fs.existsSync(file)) {
    error(`le fichier image "${source}" n’existe pas.`);
  }
  if (!fs.realpathSync(file).startsWith(`${fs.realpathSync(imagesRoot)}${path.sep}`)) {
    error(`le fichier image "${source}" doit rester dans "/images/".`);
  }

  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) {
    error(`les dimensions de l’image "${source}" sont introuvables.`);
  }

  return { src: source as `/${string}`, alt: description, width, height };
}

function parseProduct(value: unknown, seen: Set<string>): BrandProduct {
  if (typeof value !== "object" || value === null) {
    error("chaque article doit être un objet.");
  }

  const { id, name, category, images } = value as Record<string, unknown>;
  const identifier = requiredString(id, "id", 120);
  if (!idPattern.test(identifier)) {
    error(`l’identifiant "${identifier}" doit contenir des minuscules, chiffres et tirets.`);
  }
  if (seen.has(identifier)) {
    error(`l’identifiant "${identifier}" est utilisé deux fois.`);
  }
  seen.add(identifier);

  const key = requiredString(category, `category (${identifier})`, 32);
  if (!Object.hasOwn(brandCategories, key)) {
    error(`la catégorie "${key}" de "${identifier}" est inconnue.`);
  }

  if (!Array.isArray(images) || images.length === 0 || images.length > 6) {
    error(`"${identifier}" doit porter de 1 à 6 photos.`);
  }

  const photos = images.map((image) => resolveImage(image, identifier));

  return {
    id: identifier,
    name: requiredString(name, `name (${identifier})`, 160),
    category: key as BrandCategory,
    images: photos as [(typeof photos)[number], ...typeof photos],
  };
}

/** Catalogue de la marque, lu au build : ordre du fichier, aucune valeur par défaut. */
export function loadProducts(): BrandProduct[] {
  const source: unknown = JSON.parse(fs.readFileSync(catalogueFile, "utf8"));
  const list = (source as { products?: unknown }).products;
  if (!Array.isArray(list)) {
    error("le fichier doit contenir une liste « products ».");
  }
  if (list.length === 0) {
    error("la boutique doit présenter au moins un article.");
  }
  if (list.length > 500) {
    error("la boutique accepte au maximum 500 articles.");
  }

  const seen = new Set<string>();
  return list.map((product) => parseProduct(product, seen));
}
