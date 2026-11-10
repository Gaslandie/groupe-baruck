import { pageValue } from "@/lib/page-content";

import type { ImageAsset } from "./media";

export type EdvGalleryCategory = {
  /** Ancre et clé de l'onglet. */
  id: string;
  /** Libellé court, dans les onglets. */
  label: string;
  /** Titre de la galerie une fois l'onglet ouvert. */
  title: string;
  place: string;
  /** Date affichée seulement quand elle est confirmée par le client. */
  date?: string;
  text: string;
  photos: ImageAsset[];
};

/** Les groupes, leurs textes et leurs photos viennent de la même liste validée. */
export const edvGalleryCategories: EdvGalleryCategory[] = pageValue<(Omit<EdvGalleryCategory, "id"> & { key: string })[]>(
  "espoir-de-vie", "data.galleries",
).map(value => ({ ...value, id: value.key }));

/** Nombre total de photos publiées, affiché en tête de galerie. */
export const edvGalleryPhotoCount = edvGalleryCategories.reduce(
  (total, category) => total + category.photos.length,
  0,
);
