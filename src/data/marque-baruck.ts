import { pageValue } from "@/lib/page-content";

import type { ImageAsset } from "./media";

export const brandCategories = pageValue<Record<"homme"|"femme"|"enfant"|"vetements"|"sacs"|"chaussures"|"parfums"|"accessoires",string>>("marque-baruck", "data.brandCategories");

export type BrandCategory = keyof typeof brandCategories;
export type BrandProduct = {
  id: string;
  name: string;
  category: BrandCategory;
  images: [ImageAsset, ...ImageAsset[]];
};

export const brandStory = pageValue<{signature:string;introduction:string;clothing:string;perfume:string;attitude:string}>("marque-baruck", "data.brandStory");

/** Visuel d’ouverture de la page : choix de mise en page, indépendant du catalogue. */
export const brandHero: ImageAsset = pageValue<ImageAsset>("home", "media.brandHero");
