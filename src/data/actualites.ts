export type NewsCategory =
  | "groupe"
  | "jeca"
  | "espoir-de-vie"
  | "studio-photo"
  | "hotesses";

export const categoryLabels: Record<NewsCategory, string> = {
  groupe: "Groupe Baruck",
  jeca: "JECA",
  "espoir-de-vie": "Espoir de Vie",
  "studio-photo": "Studio photo",
  hotesses: "Hôtesses événementielles",
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
  title: string;
  date: string;
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
  "slug" | "title" | "date" | "category" | "excerpt" | "cover"
>;

/** Ancre de la liste filtrable sur /actualites/ (cible des liens de filtre). */
export const newsListId = "liste-actualites";

/** Titre et description du flux et de la page Actualités : source unique. */
export const newsFeedTitle = "Actualités — Groupe Baruck";

export const newsDescription =
  "Actualités du Groupe Baruck — annonces, événements et communiqués du Groupe, de la JECA et d’Espoir de Vie.";
