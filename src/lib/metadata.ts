import type { Metadata } from "next";

import { newsFeedTitle } from "@/data/actualites";
import { site } from "@/data/site";

/** Canonical de la page, plus l'autodécouverte du flux RSS des actualités. */
export function pageAlternates(canonical: string): Metadata["alternates"] {
  return {
    canonical,
    types: {
      "application/rss+xml": [{ url: site.url + "feed.xml", title: newsFeedTitle }],
    },
  };
}

/** Toute image locale du site : ImageAsset, GalleryPhoto ou couverture d'article. */
export type SocialImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

/**
 * Bloc openGraph d'une page, avec son image sociale en URL absolue.
 * `site.url` porte déjà le basePath : ne jamais repasser par asset().
 * Next.js dérive les métadonnées Twitter de ce bloc.
 */
export function socialMetadata(image: SocialImage, alt?: string): Metadata["openGraph"] {
  return {
    type: "website",
    locale: "fr_FR",
    siteName: site.name,
    images: [
      {
        url: site.url + image.src.replace(/^\//, ""),
        width: image.width,
        height: image.height,
        alt: alt?.trim() || image.alt.trim() || site.name,
      },
    ],
  };
}
