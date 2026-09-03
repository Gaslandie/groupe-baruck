import type { MetadataRoute } from "next";

import { routes, site } from "@/data/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(routes).map((path) => ({
    url: path === "/" ? site.url : site.url + path.slice(1),
  }));
}
