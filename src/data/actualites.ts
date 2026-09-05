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

export type Article = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  cover?: NewsImage;
  gallery: NewsImage[];
  draft: boolean;
  html: string;
};

/** Titre et description du flux et de la page Actualités : source unique. */
export const newsFeedTitle = "Actualités — Groupe Baruck";

export const newsDescription =
  "Actualités du Groupe Baruck — annonces, événements et communiqués du Groupe, de la JECA et d’Espoir de Vie.";
