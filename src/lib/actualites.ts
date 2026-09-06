import fs from "node:fs";
import path from "node:path";

import matter from "gray-matter";
import { imageSize } from "image-size";
import { marked, Renderer } from "marked";

import {
  categoryLabels,
  type Article,
  type ArticleSummary,
  type NewsCategory,
  type NewsImage,
} from "@/data/actualites";
import { asset } from "@/lib/asset";

// Un export validé du back-office peut alimenter un build sans modifier les
// articles suivis dans Git. Sans cette variable, le fonctionnement est inchangé.
const editorialRoot = process.env.BARUCK_EDITORIAL_ROOT;
const articlesDirectory = path.join(editorialRoot ?? process.cwd(), "content", "actualites");
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

function parseDate(value: unknown, filename: string, frontmatter: string): string {
  // YAML convertit les dates non citées en Date et normalise le 30 février.
  // Relire leur valeur littérale avant de vérifier le calendrier.
  const date =
    value instanceof Date
      ? requiredString(
          frontmatter.replaceAll("\r\n", "\n")
            .match(/^date:[\t ]*(\d{4}-\d{2}-\d{2})[\t ]*(?:#.*)?$/m)?.[1],
          "date (YYYY-MM-DD)",
          filename,
        )
      : requiredString(value, "date", filename);

  const parsed = new Date(`${date}T00:00:00Z`);
  if (
    !datePattern.test(date) ||
    Number.isNaN(parsed.getTime()) ||
    parsed.toISOString().slice(0, 10) !== date
  ) {
    error(filename, 'le champ "date" doit respecter le format YYYY-MM-DD.');
  }

  return date;
}

function parseCategory(value: unknown, filename: string): NewsCategory {
  const category = requiredString(value, "category", filename);

  if (!Object.hasOwn(categoryLabels, category)) {
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

  const isUpload = src.startsWith("/images/actualites/uploads/") && editorialRoot;
  const imageBase = isUpload ? editorialRoot : process.cwd();
  const file = path.join(imageBase, "public", src.slice(1));
  const imagesRoot = path.join(imageBase, "public", "images");
  if (
    src.includes("\\") ||
    src.split("/").some((segment) => segment === "." || segment === "..") ||
    !file.startsWith(`${imagesRoot}${path.sep}`)
  ) {
    error(filename, `le chemin d’image "${src}" doit rester dans "/images/".`);
  }
  if (!fs.existsSync(file)) {
    error(filename, `le fichier image "${src}" n’existe pas.`);
  }
  if (!fs.realpathSync(file).startsWith(`${fs.realpathSync(imagesRoot)}${path.sep}`)) {
    error(filename, `le fichier image "${src}" doit rester dans "/images/".`);
  }

  const { width, height } = imageSize(fs.readFileSync(file));
  if (!width || !height) {
    error(filename, `les dimensions de l’image "${src}" sont introuvables.`);
  }

  return { src, alt, width, height };
}

function optionalString(value: unknown, field: string, filename: string): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  if (typeof value === "string" && value.trim() === "") return undefined;
  return requiredString(value, field, filename);
}

function parseGallery(value: unknown, filename: string): NewsImage[] {
  if (value === undefined || value === null) return [];
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
    const caption = optionalString(image.caption, `gallery[${index}].caption`, filename);

    return { ...resolveImage(src, alt, filename), ...(caption ? { caption } : {}) };
  });
}

function renderArticle(content: string, filename: string): string {
  const renderer = new Renderer();
  const renderLink = renderer.link;

  // Le contenu éditorial accepte Markdown ; aucune exécution de HTML fourni.
  renderer.html = () => error(filename, "le HTML brut n’est pas accepté dans le contenu.");
  renderer.link = function (token) {
    const { href } = token;
    if (/[\u0000-\u0020\\]/.test(href)) {
      error(filename, `le lien "${href}" contient des caractères non autorisés.`);
    }
    if (href.startsWith("/") && !href.startsWith("//")) {
      return renderLink.call(this, { ...token, href: asset(href as `/${string}`) });
    }
    if (!/^(?:https?:\/\/|mailto:|tel:|#)/i.test(href)) {
      error(filename, `le lien "${href}" doit être une route /…, une ancre #…, ou une URL HTTP(S), mailto: ou tel:.`);
    }
    return renderLink.call(this, token);
  };
  renderer.image = ({ href, title, text }) => {
    const image = resolveImage(href, requiredString(text, "description de l’image", filename), filename);
    const escape = (value: string) => value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
    return `<img src="${escape(asset(image.src as `/${string}`))}" alt="${escape(image.alt)}" width="${image.width}" height="${image.height}" loading="lazy"${title ? ` title="${escape(title)}"` : ""}>`;
  };

  return marked.parse(content, { gfm: true, async: false, renderer });
}

function parseArticle(filename: string): Article | undefined {
  const source = fs.readFileSync(path.join(articlesDirectory, filename), "utf8");
  // gray-matter propose aussi un moteur JavaScript : seul YAML est autorisé ici.
  if (!/^---\r?\n/.test(source)) {
    error(filename, "le fichier doit commencer par un frontmatter YAML délimité par ---.");
  }
  const { data, content, matter: frontmatter } = matter(source, { language: "yaml" });
  if (data.draft !== undefined && typeof data.draft !== "boolean") {
    error(filename, 'le champ "draft" doit être un booléen.');
  }
  // Un brouillon incomplet ne doit bloquer ni l’export ni les autres articles.
  if (process.env.NODE_ENV === "production" && data.draft === true) return undefined;

  const slug = filename.slice(0, -3);
  if (!slugPattern.test(slug)) {
    error(filename, "le slug doit contenir uniquement les caractères [a-z0-9-].");
  }
  if (slug === placeholderSlug) {
    error(filename, `le slug "${placeholderSlug}" est réservé.`);
  }

  const coverSrc = optionalString(data.cover, "cover", filename);
  const coverAlt = optionalString(data.coverAlt, "coverAlt", filename);

  if (coverSrc && !coverAlt) {
    error(filename, 'le champ requis "coverAlt" est manquant pour cette cover.');
  }
  const html = renderArticle(requiredString(content, "body", filename), filename);

  return {
    slug,
    title: requiredString(data.title, "title", filename),
    date: parseDate(data.date, filename, frontmatter),
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
    .filter((article) => article !== undefined);

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

/** Ne transmet aux composants client que les champs nécessaires aux cartes. */
export function toArticleSummary({
  slug,
  title,
  date,
  category,
  excerpt,
  cover,
}: Article): ArticleSummary {
  return { slug, title, date, category, excerpt, cover };
}

export type AdjacentArticles = {
  /** Article plus récent : index - 1 dans getAllArticles(). */
  previous?: ArticleSummary;
  /** Article plus ancien : index + 1 dans getAllArticles(). */
  next?: ArticleSummary;
};

/** Voisins d’un article dans l’ordre de getAllArticles() (du plus récent au plus ancien). */
export function getAdjacentArticles(slug: string): AdjacentArticles {
  const articles = getAllArticles();
  const index = articles.findIndex((article) => article.slug === slug);
  if (index === -1) return {};

  return {
    previous: index > 0 ? toArticleSummary(articles[index - 1]) : undefined,
    next: index < articles.length - 1 ? toArticleSummary(articles[index + 1]) : undefined,
  };
}
