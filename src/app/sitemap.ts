import type { MetadataRoute } from "next";

import { routes, site } from "@/data/site";
import { getAllArticles } from "@/lib/actualites";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = Object.values(routes).map((path) => ({
    url: path === "/" ? site.url : site.url + path.slice(1),
  }));
  const articles = getAllArticles().map((article) => ({
    url: `${site.url}actualites/${article.slug}/`,
    lastModified: article.date,
  }));

  return [...pages, ...articles];
}
