import { translate as t } from "./language.ts";

import type { Article } from "@/data/actualites";
import { facebookPages } from "@/data/contact";
import { jecaEditions, type JecaEdition } from "@/data/jeca";
import { brandLogo, edvLogo } from "@/data/media";
import { contacts, routes, site } from "@/data/site";
import { hqMap } from "@/data/coordonnees";
import { pageText } from "./page-content";
import { primarySiteUrl } from "./seo";
import { asset } from "./asset";

import type { SocialImage } from "./metadata";

/** URL absolue d'un média public : site.url porte déjà le basePath. */
const absolute = (path: string) => site.url + path.replace(/^\//, "");

/** "+224625197258" depuis "tel:+224625197258" ou "https://wa.me/224623720427". */
function phoneNumber(href: string): string {
  const value = href.replace(/^tel:/, "").replace(/^https:\/\/wa\.me\//, "");
  return value.startsWith("+") ? value : `+${value}`;
}

function imageObject(image: SocialImage) {
  return {
    "@type": "ImageObject",
    url: absolute(image.src),
    width: image.width,
    height: image.height,
    ...(image.alt ? { description: image.alt } : {}),
  };
}

const organizationId = `${primarySiteUrl}#organization`;

const organizationLogo = imageObject({ ...brandLogo, alt: site.name });

/** Groupe Baruck — rendu uniquement sur l'accueil. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  url: primarySiteUrl,
  description: site.description,
  logo: organizationLogo,
  sameAs: facebookPages.map((page) => page.href),
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: phoneNumber(contacts.landline.href),
      email: contacts.email.href.replace(/^mailto:/, ""),
    },
    {
      "@type": "ContactPoint",
      telephone: phoneNumber(contacts.whatsappHq.href),
      url: contacts.whatsappHq.href,
    },
  ],
};

/** Référence courte à l'organisation, pour le champ publisher. */
const publisher = {
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  url: primarySiteUrl,
  logo: organizationLogo,
};

const espoirDeVieUrl = site.url + routes.edv.slice(1);

/** Espoir de Vie — rendu sur sa page. La description reprend celle de la page. */
export function espoirDeVieSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${primarySiteUrl}${routes.edv.slice(1)}#organization`,
    name: "Espoir de Vie",
    url: espoirDeVieUrl,
    description,
    logo: imageObject(edvLogo),
    areaServed: [
      { "@type": "Country", name: "Côte d’Ivoire" },
      { "@type": "Country", name: t("Guinée") },
      { "@type": "Country", name: "Burkina Faso" },
    ],
  };
}

const articleUrl = (slug: string) => `${site.url}actualites/${slug}/`;

export type BreadcrumbItem = { name: string; href: string };

/** Les mêmes éléments alimentent le chemin visible et sa description JSON-LD. */
export function breadcrumbSchema(items: readonly BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map(({ name, href }, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name,
      item: absolute(href),
    })),
  };
}

export type ServicePage = "studio-photo" | "hotesses-evenementielles";

export function serviceSchema(page: ServicePage) {
  const route = page === "studio-photo" ? routes.studio : routes.hostesses;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${primarySiteUrl}${route.slice(1)}#service`,
    name: pageText(page, "meta.title"),
    description: pageText(page, page === "studio-photo" ? "copy.page.16" : "copy.page.13"),
    url: absolute(route),
    provider: publisher,
    // Reprise de la zone affichée, sans déduire une couverture nationale du pays.
    areaServed: hqMap.label,
  };
}

function newsArticleNode(article: Article) {
  const url = articleUrl(article.slug);

  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: article.title,
    description: article.excerpt,
    // `date` décrit les faits racontés. L'auteur et la date de publication
    // ne sont pas renseignés dans les contenus : ne pas les inventer.
    publisher,
    ...(article.cover ? { image: imageObject(article.cover) } : {}),
  };
}

/** Une date commune ne suffit pas : l'article doit aussi citer cette édition. */
function matchingEdition(article: Article): JecaEdition | undefined {
  if (article.category !== "jeca" || article.datePrecision === "year") return undefined;
  return jecaEditions.find((edition) => edition.date.iso === article.date &&
    article.html.includes(`href="${asset(`/jeca/#${edition.id}`)}"`));
}

function jecaEventNode(article: Article, edition: JecaEdition) {
  const url = articleUrl(article.slug);

  return {
    "@type": "Event",
    "@id": `${url}#event`,
    url,
    name: article.title,
    description: article.excerpt,
    startDate: edition.date.iso,
    endDate: edition.date.endIso,
    // Le statut et l'adresse précise du lieu ne sont pas documentés.
    location: {
      "@type": "Place",
      name: edition.place,
    },
    organizer: {
      "@type": "Organization",
      name: "JECA",
      url: site.url + routes.jeca.slice(1),
    },
    ...(article.cover ? { image: imageObject(article.cover) } : {}),
  };
}

/** NewsArticle d'un article, plus l'Event quand il correspond à une édition JECA. */
export function articleSchema(article: Article) {
  const edition = matchingEdition(article);

  return {
    "@context": "https://schema.org",
    "@graph": edition
      ? [newsArticleNode(article), jecaEventNode(article, edition)]
      : [newsArticleNode(article)],
  };
}
