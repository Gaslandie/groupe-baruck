import { edvGallery } from "./espoir-de-vie";
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
  jeca: "JECA",
  "studio-photo": "Studio photo",
  "espoir-de-vie": "Espoir de Vie",
};

/**
 * Collections construites uniquement depuis les galeries existantes
 * (jecaGalleries, studioGallery) : aucun chemin, alt ou légende recopié.
 */
export const mediaCollections: MediaCollection[] = [
  ...jecaGalleries.map(
    (gallery): MediaCollection => ({
      id: `jeca-edition-${gallery.edition}`,
      category: "jeca",
      title: gallery.caption,
      href: `${routes.jeca}#edition-${gallery.edition}`,
      photos: gallery.photos.map(({ src, alt, width, height, caption }) => ({
        src,
        alt,
        width,
        height,
        caption,
      })),
    }),
  ),
  {
    id: "espoir-de-vie",
    category: "espoir-de-vie",
    title: "Les actions d’Espoir de Vie",
    href: `${routes.edv}#galerie`,
    photos: edvGallery.map(({ photo, caption }) => ({
      src: photo.src,
      alt: photo.alt,
      width: photo.width,
      height: photo.height,
      caption,
    })),
  },
  {
    id: "studio-photo",
    category: "studio-photo",
    title: "Studio Photo Baruck",
    href: `${routes.studio}#galerie`,
    photos: studioGallery.map(({ image, caption }) => ({
      src: image.src,
      alt: image.alt,
      width: image.width,
      height: image.height,
      caption,
    })),
  },
];
