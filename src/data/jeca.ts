import { pageValue, pageText } from "@/lib/page-content";

import type { ImageAsset } from "./media";
import { contacts } from "./site";

export type GalleryPhoto = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
  layout: "wide" | "tall" | "standard";
  caption: string;
};

export type JecaGallery = {
  edition: number;
  id: string;
  label: string;
  caption: string;
  photos: GalleryPhoto[];
};

export type JecaEdition = {
  edition: number;
  id: string;
  place: string;
  title: string;
  date: {
    iso: string;
    endIso: string;
    label: string;
  };
  tone: "paper" | "dark" | "white";
  grid: "seven" | "six" | "twelve";
  story?: {
    lead: string;
    paragraphs: string[];
    theme: string;
  };
  simpleLead?: string;
};

export type JecaEditionNavItem = {
  href: string;
  number: string;
  city: string;
  dates: string;
};

export const jecaPortrait = pageValue<ImageAsset>("jeca", "media.portrait");

export const goreeImage = pageValue<ImageAsset>("jeca", "media.goree");

type EditableEdition = {
  key: string;
  city: string;
  place: string;
  title: string;
  date: { iso: string; endIso: string; label: string };
  navDates: string;
  lead: string;
  paragraphs: string[];
  theme: string;
  caption: string;
  galleryLabel: string;
  photos: { image: ImageAsset; caption: string }[];
};
const editions = pageValue<EditableEdition[]>("jeca", "data.editions");

export const jecaEditions: JecaEdition[] = editions.map((value, index) => ({
  edition: index + 1,
  id: "edition-" + value.key,
  place: value.place,
  title: value.title,
  date: value.date,
  tone: (["paper", "dark", "white"] as const)[index % 3],
  grid: value.photos.length === 7 ? "seven" : value.photos.length === 12 ? "twelve" : "six",
  ...(value.theme || value.paragraphs.length
    ? { story: { lead: value.lead, paragraphs: value.paragraphs, theme: value.theme } }
    : { simpleLead: value.lead }),
}));

export const jecaEditionNav: JecaEditionNavItem[] = editions.map((value, index) => ({
  href: "#edition-" + value.key,
  number: String(index + 1).padStart(2, "0"),
  city: value.city,
  dates: value.navDates,
}));

export const jecaGalleries: JecaGallery[] = editions.map((value, index) => ({
  edition: index + 1,
  id: "edition-" + value.key,
  caption: value.caption,
  label: value.galleryLabel,
  photos: value.photos.map(({ image, caption }) => ({ ...image, caption, layout: "standard" })),
}));
export const jecaGalleryOffsets = jecaGalleries.map((_, index) =>
  jecaGalleries.slice(0, index).reduce((sum, gallery) => sum + gallery.photos.length, 0),
);

export type JecaNextEdition = {
  message: string;
  whatsappHref: string;
  emailHref: string;
};

const nextEditionMessage = pageText("jeca", "request.message");

/** Demandes d'information sur la prochaine édition : numéros et adresse jamais recopiés. */
export const jecaNextEdition: JecaNextEdition = {
  message: nextEditionMessage,
  whatsappHref: `${contacts.whatsappHq.href}?text=${encodeURIComponent(nextEditionMessage)}`,
  emailHref: `${contacts.email.href}?subject=${encodeURIComponent(
    pageText("jeca", "request.subject"),
  )}&body=${encodeURIComponent(nextEditionMessage)}`,
};

export type JecaVideo = {
  /** Fichier déposé dans `public/videos/` ; la section n'existe que s'il est présent. */
  src: `/${string}`;
  poster?: `/${string}`;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
  emphasis: string;
  caption: string;
  /** Ce que le président aborde, dans l'ordre : repères avant d'écouter. */
  chapters: { number: string; title: string; text: string }[];
};

const speech = pageValue<Omit<JecaVideo, "poster" | "width" | "height" | "chapters"> & {
  poster: ImageAsset;
  chapters: { title: string; text: string }[];
}>("jeca", "data.speech");
export const jecaSpeechVideo: JecaVideo = {
  ...speech,
  poster: speech.poster.src,
  width: speech.poster.width,
  height: speech.poster.height,
  chapters: speech.chapters.map((chapter, index) => ({ ...chapter, number: String(index + 1).padStart(2, "0") })),
};
