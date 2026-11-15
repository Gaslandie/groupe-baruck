import type { MetadataRoute } from "next";

import { site } from "@/data/site";
import { seoConfiguration } from "@/lib/seo";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    ...(seoConfiguration().indexable ? { sitemap: site.url + "sitemap.xml" } : {}),
  };
}
