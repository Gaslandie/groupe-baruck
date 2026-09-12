import type { ImageAsset } from "./media";

export const brandCategories = {
  homme: "Homme",
  femme: "Femme",
  enfant: "Enfant",
  vetements: "Autres vêtements",
  sacs: "Sacs & petite maroquinerie",
  chaussures: "Chaussures",
  parfums: "Parfums",
  accessoires: "Accessoires",
} as const;

export type BrandCategory = keyof typeof brandCategories;
export type BrandProduct = {
  id: string;
  name: string;
  category: BrandCategory;
  images: [ImageAsset, ...ImageAsset[]];
};

export const brandStory = {
  signature: "L’élégance, notre affaire.",
  introduction: "Découvrez l’univers Baruck, où chaque détail respire le luxe et la sophistication. Des vêtements aux lignes épurées, des accessoires raffinés, des escarpins qui allient confort et prestige, jusqu’au parfum qui laisse une empreinte inoubliable : chaque produit est pensé pour sublimer votre quotidien.",
  clothing: "Des tenues élégantes et modernes pour homme et femme, symboles de classe et de raffinement. Des accessoires et des chaussures pour accompagner chaque allure, du quotidien aux grandes occasions.",
  perfume: "Un parfum unique et envoûtant, une empreinte inoubliable. Découvrez les eaux de toilette Baruck et trouvez la touche qui prolonge votre style.",
  attitude: "Avec Baruck, vous ne portez pas seulement une marque : vous incarnez une attitude, un style de vie.",
};

/** Visuel d’ouverture de la page : choix de mise en page, indépendant du catalogue. */
export const brandHero: ImageAsset = {
  src: "/images/marque-baruck/sac-main-noir.jpg",
  alt: "Sac à main noir Baruck",
  width: 1024,
  height: 1024,
};
