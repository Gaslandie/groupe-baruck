import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { imageSize } from "image-size";
import { marked } from "marked";

import {
  categoryLabels,
  type Article,
  type NewsCategory,
  type NewsImage,
} from "@/data/actualites";
import { asset } from "@/lib/asset";

const articlesDirectory = path.join(process.cwd(), "content", "actualites");
const slugPattern = /^[a-z0-9-]+$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export const placeholderSlug = "a-venir";

function error(filename: string, message: string): never {
  throw new Error(`Article "${filename}" : ${message}`);
}

function requiredString(
  value: unknown,
  field: string,
  filename: string,
): string {
  if (typeof value !== "string" || value.trim() === "") {
    error(filename, `le champ requis "${field}" est manquant ou invalide.`);
  }

  return value.trim();
}

function parseDate(value: unknown, filename: string): string {
  const date =
    value instanceof Date
      ? value.toISOString().slice(0, 10)
      : requiredString(value, "date", filename);

  if (!datePattern.test(date) || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) {
    error(filename, 'le champ "date" doit respecter le format YYYY-MM-DD.');
  }

  return date;
}

function parseCategory(value: unknown, filename: string): NewsCategory {
  const category = requiredString(value, "category", filename);

  if (!(category in categoryLabels)) {
    error(filename, `la catégorie "${category}" est inconnue.`);
  }

  return category as NewsCategory;
}

export function resolveImage(src: string, alt: string, filename: string): NewsImage {
  if (!src.startsWith("/images/")) {
    error(filename, `le chemin d’image "${src}" doit commencer par "/images/".`);
  }
  if (!/\.(?:jpe?g|png|webp)$/i.test(src)) {
    error(filename, `l’extension de l’image "${src}" doit être .jpg, .jpeg, .png ou .webp.`);
  }

  const file = path.join(process.cwd(), "public", src.slice(1));
  if (!fs.existsSync(file)) {
    error(filename, `le fichier image "${src}" n’existe pas.`);
  }

  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) {
    error(filename, `les dimensions de l’image "${src}" sont introuvables.`);
  }

  return { src, alt, width, height };
}

function parseGallery(value: unknown, filename: string): NewsImage[] {
  if (value === undefined) return [];
  if (!Array.isArray(value)) {
    error(filename, 'le champ "gallery" doit être une liste.');
  }

  return value.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) {
      error(filename, `l’image gallery[${index}] est invalide.`);
    }

    const image = item as Record<string, unknown>;
    const src = requiredString(image.src, `gallery[${index}].src`, filename);
    const alt = requiredString(image.alt, `gallery[${index}].alt`, filename);
    const caption =
      image.caption === undefined
        ? undefined
        : requiredString(image.caption, `gallery[${index}].caption`, filename);

    return { ...resolveImage(src, alt, filename), ...(caption ? { caption } : {}) };
  });
}

function parseArticle(filename: string): Article {
  const slug = filename.slice(0, -3);
  if (!slugPattern.test(slug)) {
    error(filename, "le slug doit contenir uniquement les caractères [a-z0-9-].");
  }
  if (slug === placeholderSlug) {
    error(filename, `le slug "${placeholderSlug}" est réservé.`);
  }

  const source = fs.readFileSync(path.join(articlesDirectory, filename), "utf8");
  const { data, content } = matter(source);
  const coverSrc =
    data.cover === undefined ? undefined : requiredString(data.cover, "cover", filename);
  const coverAlt =
    data.coverAlt === undefined
      ? undefined
      : requiredString(data.coverAlt, "coverAlt", filename);

  if (coverSrc && !coverAlt) {
    error(filename, 'le champ requis "coverAlt" est manquant pour cette cover.');
  }
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    error(filename, 'le champ "draft" doit être un booléen.');
  }

  const rendered = marked.parse(content, { gfm: true, async: false });
  const html = rendered
    .replaceAll('src="/images/', `src="${asset("/images/")}`)
    .replaceAll('href="/', `href="${asset("/")}`);

  return {
    slug,
    title: requiredString(data.title, "title", filename),
    date: parseDate(data.date, filename),
    category: parseCategory(data.category, filename),
    excerpt: requiredString(data.excerpt, "excerpt", filename),
    cover: coverSrc && coverAlt ? resolveImage(coverSrc, coverAlt, filename) : undefined,
    gallery: parseGallery(data.gallery, filename),
    draft: data.draft ?? false,
    html,
  };
}

export function getAllArticles(): Article[] {
  const articles = fs
    .readdirSync(articlesDirectory)
    .filter((filename) => filename.endsWith(".md"))
    .map(parseArticle)
    .filter((article) => process.env.NODE_ENV !== "production" || !article.draft);

  return articles.sort(
    (first, second) =>
      second.date.localeCompare(first.date) || first.title.localeCompare(second.title, "fr"),
  );
}

export function getArticle(slug: string): Article | undefined {
  if (!slugPattern.test(slug)) {
    throw new Error(`Slug d’article invalide : "${slug}".`);
  }

  return getAllArticles().find((article) => article.slug === slug);
}

export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
