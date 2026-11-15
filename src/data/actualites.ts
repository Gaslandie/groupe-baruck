import { pageText } from "@/lib/page-content";

export type NewsCategory =
  | "groupe"
  | "jeca"
  | "espoir-de-vie"
  | "studio-photo"
  | "hotesses";

export const categoryLabels: Record<NewsCategory, string> = {
  groupe: pageText("actualites", "category.groupe"),
  jeca: pageText("actualites", "category.jeca"),
  "espoir-de-vie": pageText("actualites", "category.espoir-de-vie"),
  "studio-photo": pageText("actualites", "copy.actualites.1"),
  hotesses: pageText("actualites", "copy.actualites.2"),
};

export const placeholderGradients: Record<NewsCategory, string> = {
  groupe: "bg-[linear-gradient(145deg,#161211,#633329_58%,#b3492e)]",
  jeca: "bg-[linear-gradient(145deg,#061b53,#0b3da4_62%,#087a3e)]",
  "espoir-de-vie": "bg-[linear-gradient(145deg,#1a100b,#8f260d_58%,#c7461c)]",
  "studio-photo": "bg-[linear-gradient(145deg,#161211,#633329_58%,#b3492e)]",
  hotesses: "bg-[linear-gradient(145deg,#161211,#633329_58%,#b3492e)]",
};

export type NewsImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
};

/**
 * Vidéo auto-hébergée d’un groupe. Les dimensions sont celles de l’affiche,
 * qui est une image du film : le cadre garde le bon rapport avant la lecture.
 */
export type NewsVideo = {
  src: string;
  poster: string;
  width: number;
  height: number;
};

/**
 * Photos regroupées sous un intitulé, affichées après le corps de l’article
 * (passage d’un candidat, étape d’une action…). Complément de `gallery`, qui
 * reste une suite d’images sans regroupement.
 */
export type NewsGroup = {
  label: string;
  /** Précision courte affichée à côté de l’intitulé, p. ex. un pays. */
  note?: string;
  photos: NewsImage[];
  /** Facultative : tous les groupes n’ont pas de film de leur passage. */
  video?: NewsVideo;
};

export type Article = {
  slug: string;
  hasEnglishTranslation: boolean;
  translationPending?: boolean;
  title: string;
  date: string;
  /** "year" : seule l'année est sûre ; le jour de `date` ne sert qu'au tri et n'est pas affiché. */
  datePrecision?: "year";
  category: NewsCategory;
  excerpt: string;
  cover?: NewsImage;
  gallery: NewsImage[];
  groupsTitle?: string;
  groupsIntro?: string;
  groups: NewsGroup[];
  draft: boolean;
  html: string;
};

/** Sous-ensemble d’Article transmis aux composants client : ni html, ni gallery, ni draft. */
export type ArticleSummary = Pick<
  Article,
  "slug" | "title" | "date" | "datePrecision" | "category" | "excerpt" | "cover"
>;

/** Ancre de la liste filtrable sur /actualites/ (cible des liens de filtre). */
export const newsListId = "liste-actualites";

/** Titre du flux RSS. */
export const newsFeedTitle = pageText("actualites", "copy.actualites.3");
