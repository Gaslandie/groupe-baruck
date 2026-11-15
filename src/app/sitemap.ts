import { isEnglish } from "../lib/language.ts";

import type { MetadataRoute } from "next";

import { routes, site } from "@/data/site";
import { getAllArticles } from "@/lib/actualites";
import { seoConfiguration } from "@/lib/seo";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!seoConfiguration().indexable) return [];
  // Les ancres et la page encore provisoire ne sont pas proposées à l'indexation.
  const pages = Object.entries(routes)
    .filter(([key]) => key !== "services" && key !== "projects")
    .map(([, path]) => ({
      url: path === "/" ? site.url : site.url + path.slice(1),
      hasEnglishTranslation: true,
    }));
  const articles = getAllArticles().map((article) => ({
    url: `${site.url}actualites/${article.slug}/`,
    hasEnglishTranslation: article.hasEnglishTranslation,
  }));

  // La date d'un événement ne prouve pas la date de modification de sa page.
  return [...pages, ...articles].flatMap(({ url, hasEnglishTranslation }): MetadataRoute.Sitemap => {
    const fr = isEnglish ? url.replace(/\/en\//, "/") : url;
    if (!hasEnglishTranslation) return isEnglish ? [] : [{ url: fr }];
    const en = isEnglish ? url : url.replace(site.url, site.url + "en/");
    const alternates = { languages: { fr, en } };
    return isEnglish ? [{ url: en, alternates }] : [{ url: fr, alternates }, { url: en, alternates }];
  });
}
