import { pageText } from "@/lib/page-content";

import { edvGalleryCategories } from "./edv-galerie";
import { jecaGalleries } from "./jeca";
import { studioGallery } from "./services";
import { routes } from "./site";

export type MediaCategory = "jeca" | "studio-photo" | "espoir-de-vie";

export type MediaPhoto = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type MediaCollection = {
  id: string;
  category: MediaCategory;
  title: string;
  /** Galerie d’origine sur le site. */
  href: string;
  photos: MediaPhoto[];
};

export const mediaCategoryLabels: Record<MediaCategory, string> = {
  jeca: pageText("mediatheque", "category.jeca"),
  "studio-photo": pageText("mediatheque", "copy.mediatheque.1"),
  "espoir-de-vie": pageText("mediatheque", "category.espoir-de-vie"),
};

/**
 * Collections construites uniquement depuis les galeries existantes
 * (jecaGalleries, edvGalleryCategories, studioGallery) : aucun chemin, alt ou légende recopié.
 */
export const mediaCollections: MediaCollection[] = ([
  ...jecaGalleries.map(
    (gallery): MediaCollection => ({
      id: `jeca-${gallery.id}`,
      category: "jeca",
      title: gallery.caption,
      href: `${routes.jeca}#${gallery.id}`,
      photos: gallery.photos.map(({ src, alt, width, height, caption }) => ({
        src,
        alt,
        width,
        height,
        caption,
      })),
    }),
  ),
  ...edvGalleryCategories.map((gallery): MediaCollection => ({
    id: `espoir-de-vie-${gallery.id}`,
    category: "espoir-de-vie",
    title: gallery.title,
    href: `${routes.edv}#galerie-${gallery.id}`,
    photos: gallery.photos.map(photo => ({...photo,caption:gallery.title})),
  })),
  {
    id: "studio-photo",
    category: "studio-photo",
    title: pageText("mediatheque", "copy.mediatheque.3"),
    href: `${routes.studio}#galerie`,
    photos: studioGallery.map(({ image, caption }) => ({
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
      caption,
    })),
  },
] satisfies MediaCollection[]).filter(collection => collection.photos.length > 0);
