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

export type Article = {
  slug: string;
  title: string;
  date: string;
  category: NewsCategory;
  excerpt: string;
  cover?: string;
  coverAlt?: string;
  draft: boolean;
  html: string;
};
