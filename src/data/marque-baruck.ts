import { translate as t } from "../lib/language.ts";

import type { ImageAsset } from "./media";

export const brandCategories = {
  homme: t("Homme"),
  femme: t("Femme"),
  enfant: t("Enfant"),
  vetements: t("Autres vêtements"),
  sacs: t("Sacs & petite maroquinerie"),
  chaussures: t("Chaussures"),
  parfums: t("Parfums"),
  accessoires: t("Accessoires"),
} as const;

export type BrandCategory = keyof typeof brandCategories;
export type BrandProduct = {
  id: string;
  name: string;
  category: BrandCategory;
  images: [ImageAsset, ...ImageAsset[]];
};

export const brandStory = {
  signature: t("L’élégance, notre affaire."),
  introduction: t("Découvrez l’univers Baruck, où chaque détail respire le luxe et la sophistication. Des vêtements aux lignes épurées, des accessoires raffinés, des escarpins qui allient confort et prestige, jusqu’au parfum qui laisse une empreinte inoubliable : chaque produit est pensé pour sublimer votre quotidien."),
  clothing: t("Des tenues élégantes et modernes pour homme et femme, symboles de classe et de raffinement. Des accessoires et des chaussures pour accompagner chaque allure, du quotidien aux grandes occasions."),
  perfume: t("Un parfum unique et envoûtant, une empreinte inoubliable. Découvrez les eaux de toilette Baruck et trouvez la touche qui prolonge votre style."),
  attitude: t("Avec Baruck, vous ne portez pas seulement une marque : vous incarnez une attitude, un style de vie."),
};

/** Visuel d’ouverture de la page : choix de mise en page, indépendant du catalogue. */
export const brandHero: ImageAsset = {
  src: "/images/marque-baruck/sac-main-noir-hero.jpg",
  alt: t("Sac à main noir Baruck"),
  width: 928,
  height: 928,
};
