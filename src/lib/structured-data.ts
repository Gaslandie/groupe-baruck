import type { Article } from "@/data/actualites";
import { facebookPages } from "@/data/contact";
import { jecaEditions, type JecaEdition } from "@/data/jeca";
import { brandLogo, edvLogo } from "@/data/media";
import { contacts, routes, site } from "@/data/site";

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

const organizationId = `${site.url}#organization`;

const organizationLogo = imageObject({ ...brandLogo, alt: site.name });

/** Groupe Baruck — rendu uniquement sur l'accueil. */
export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": organizationId,
  name: site.name,
  url: site.url,
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
  url: site.url,
  logo: organizationLogo,
};

const espoirDeVieUrl = site.url + routes.edv.slice(1);

/** Espoir de Vie — rendu sur sa page. La description reprend celle de la page. */
export function espoirDeVieSchema(description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${espoirDeVieUrl}#organization`,
    name: "Espoir de Vie",
    url: espoirDeVieUrl,
    description,
    logo: imageObject(edvLogo),
    areaServed: [
      { "@type": "Country", name: "Côte d’Ivoire" },
      { "@type": "Country", name: "Guinée" },
      { "@type": "Country", name: "Burkina Faso" },
    ],
  };
}

const articleUrl = (slug: string) => `${site.url}actualites/${slug}/`;

function newsArticleNode(article: Article) {
  const url = articleUrl(article.slug);

  return {
    "@type": "NewsArticle",
    "@id": `${url}#article`,
    url,
    mainEntityOfPage: url,
    headline: article.title,
    description: article.excerpt,
    datePublished: article.date,
    publisher,
    ...(article.cover ? { image: imageObject(article.cover) } : {}),
  };
}

const eventPlaces: Record<JecaEdition["place"], { addressLocality: string; addressCountry: string }> = {
  "Dakar · Sénégal": { addressLocality: "Dakar", addressCountry: "SN" },
  "Conakry · Guinée": { addressLocality: "Conakry", addressCountry: "GN" },
};

/** Édition JECA correspondant exactement à la date de l'article, sinon undefined. */
function matchingEdition(article: Article): JecaEdition | undefined {
  if (article.category !== "jeca") return undefined;
  return jecaEditions.find((edition) => edition.date.iso === article.date);
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
    // EventScheduled couvre aussi un événement qui a eu lieu comme prévu.
    eventStatus: "https://schema.org/EventScheduled",
    location: {
      "@type": "Place",
      address: { "@type": "PostalAddress", ...eventPlaces[edition.place] },
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
