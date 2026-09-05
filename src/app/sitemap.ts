import type { MetadataRoute } from "next";

import { routes, site } from "@/data/site";
import { getAllArticles } from "@/lib/actualites";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // routes.services est une ancre de l'accueil ("/#activites"), pas une page.
  const pages = Object.entries(routes)
    .filter(([key]) => key !== "services")
    .map(([, path]) => ({
      url: path === "/" ? site.url : site.url + path.slice(1),
    }));
  const articles = getAllArticles().map((article) => ({
    url: `${site.url}actualites/${article.slug}/`,
    lastModified: article.date,
  }));

  return [...pages, ...articles];
}
