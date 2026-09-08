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

/** Intitulés descriptifs des visuels client. Prix, stocks et caractéristiques à confirmer par WhatsApp. */
export const brandProducts: BrandProduct[] = [
  {
    "id": "sac-main-noir",
    "name": "Sac à main noir",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/sac-main-noir.jpg",
        "alt": "Sac à main noir Baruck",
        "width": 1024,
        "height": 1024
      }
    ]
  },
  {
    "id": "chemise-motifs",
    "name": "Chemise à motifs",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/chemise-motifs.jpg",
        "alt": "Chemise à motifs Baruck",
        "width": 736,
        "height": 981
      }
    ]
  },
  {
    "id": "robe-blanche",
    "name": "Robe blanche",
    "category": "femme",
    "images": [
      {
        "src": "/images/marque-baruck/robe-blanche.jpg",
        "alt": "Robe blanche Baruck",
        "width": 720,
        "height": 1196
      }
    ]
  },
  {
    "id": "escarpin-noir",
    "name": "Escarpin noir",
    "category": "chaussures",
    "images": [
      {
        "src": "/images/marque-baruck/escarpin-noir.jpg",
        "alt": "Escarpin noir Baruck",
        "width": 720,
        "height": 961
      }
    ]
  },
  {
    "id": "eau-toilette-flacon-rond",
    "name": "Eau de toilette · flacon rond",
    "category": "parfums",
    "images": [
      {
        "src": "/images/marque-baruck/eau-toilette-flacon-rond.jpg",
        "alt": "Eau de toilette · flacon rond Baruck",
        "width": 736,
        "height": 736
      }
    ]
  },
  {
    "id": "montre-noire-doree",
    "name": "Montre noire et dorée",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/montre-noire-doree.jpg",
        "alt": "Montre noire et dorée Baruck",
        "width": 1024,
        "height": 1024
      }
    ]
  },
  {
    "id": "sac-dos-noir",
    "name": "Sac à dos noir",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/sac-dos-noir.jpg",
        "alt": "Sac à dos noir Baruck",
        "width": 1024,
        "height": 1024
      }
    ]
  },
  {
    "id": "costume-sombre",
    "name": "Costume sombre",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/costume-sombre.jpg",
        "alt": "Costume sombre Baruck",
        "width": 509,
        "height": 511
      }
    ]
  },
  {
    "id": "tenues-col-polo",
    "name": "Tenues à col polo",
    "category": "femme",
    "images": [
      {
        "src": "/images/marque-baruck/tenues-col-polo.jpg",
        "alt": "Tenues à col polo Baruck",
        "width": 1080,
        "height": 1080
      }
    ]
  },
  {
    "id": "echarpe-blanche",
    "name": "Écharpe blanche",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/echarpe-blanche.jpg",
        "alt": "Écharpe blanche Baruck",
        "width": 617,
        "height": 1080
      }
    ]
  },
  {
    "id": "trousse-blanche",
    "name": "Trousse blanche",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/trousse-blanche.jpg",
        "alt": "Trousse blanche Baruck",
        "width": 1080,
        "height": 719
      }
    ]
  },
  {
    "id": "sac-cordons",
    "name": "Sac à cordons",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/sac-cordons.jpg",
        "alt": "Sac à cordons Baruck",
        "width": 736,
        "height": 736
      }
    ]
  },
  {
    "id": "chemise-blanche-details-motifs",
    "name": "Chemise blanche à détails imprimés",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/chemise-blanche-details-motifs.jpg",
        "alt": "Chemise blanche à détails imprimés Baruck",
        "width": 720,
        "height": 931
      }
    ]
  },
  {
    "id": "tenue-blanche-sans-manches",
    "name": "Tenue blanche sans manches",
    "category": "femme",
    "images": [
      {
        "src": "/images/marque-baruck/tenue-blanche-sans-manches.jpg",
        "alt": "Tenue blanche sans manches Baruck",
        "width": 607,
        "height": 1080
      }
    ]
  },
  {
    "id": "chemise-bande-coloree",
    "name": "Chemise blanche à bande colorée",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/chemise-bande-coloree.jpg",
        "alt": "Chemise blanche à bande colorée Baruck",
        "width": 736,
        "height": 1039
      }
    ]
  },
  {
    "id": "ceinture-boucle-doree",
    "name": "Ceinture à boucle dorée",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/ceinture-boucle-doree.jpg",
        "alt": "Ceinture à boucle dorée Baruck",
        "width": 720,
        "height": 728
      }
    ]
  },
  {
    "id": "lunettes",
    "name": "Lunettes de soleil",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/lunettes.jpg",
        "alt": "Lunettes de soleil Baruck",
        "width": 1024,
        "height": 1024
      }
    ]
  },
  {
    "id": "montre-argentee",
    "name": "Montre argentée à cadran noir",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/montre-argentee.jpg",
        "alt": "Montre argentée à cadran noir Baruck",
        "width": 326,
        "height": 514
      }
    ]
  },
  {
    "id": "sac-documents-marron",
    "name": "Sac porte-documents marron",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/sac-documents-marron.jpg",
        "alt": "Sac porte-documents marron Baruck",
        "width": 1080,
        "height": 1054
      },
      {
        "src": "/images/marque-baruck/sac-documents-marron-vue-2.jpg",
        "alt": "Sac porte-documents marron Baruck — autre vue",
        "width": 732,
        "height": 715
      }
    ]
  },
  {
    "id": "chemise-blanche-motif-noir",
    "name": "Chemise blanche à grand motif noir",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/chemise-blanche-motif-noir.jpg",
        "alt": "Chemise blanche à grand motif noir Baruck",
        "width": 720,
        "height": 720
      }
    ]
  },
  {
    "id": "portefeuille-noir",
    "name": "Portefeuille noir",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/portefeuille-noir.jpg",
        "alt": "Portefeuille noir Baruck",
        "width": 822,
        "height": 1080
      },
      {
        "src": "/images/marque-baruck/portefeuille-noir-vue-2.jpg",
        "alt": "Portefeuille noir Baruck — autre vue",
        "width": 800,
        "height": 1050
      }
    ]
  },
  {
    "id": "chemise-blanche-motifs-graphiques",
    "name": "Chemise blanche à motifs graphiques",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/chemise-blanche-motifs-graphiques.jpg",
        "alt": "Chemise blanche à motifs graphiques Baruck",
        "width": 736,
        "height": 751
      }
    ]
  },
  {
    "id": "eau-toilette-flacon-rectangulaire",
    "name": "Eau de toilette · flacon rectangulaire",
    "category": "parfums",
    "images": [
      {
        "src": "/images/marque-baruck/eau-toilette-flacon-rectangulaire.jpg",
        "alt": "Eau de toilette · flacon rectangulaire Baruck",
        "width": 736,
        "height": 736
      }
    ]
  },
  {
    "id": "ceinture-boucle-noire",
    "name": "Ceinture à boucle noire",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/ceinture-boucle-noire.jpg",
        "alt": "Ceinture à boucle noire Baruck",
        "width": 684,
        "height": 1010
      }
    ]
  },
  {
    "id": "gourde-blanche",
    "name": "Gourde blanche",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/gourde-blanche.jpg",
        "alt": "Gourde blanche Baruck",
        "width": 736,
        "height": 736
      }
    ]
  },
  {
    "id": "selection-logo-orange",
    "name": "Vêtements et accessoires au logo orange",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/selection-logo-orange.jpg",
        "alt": "Vêtements et accessoires au logo orange Baruck",
        "width": 1024,
        "height": 1024
      }
    ]
  },
  {
    "id": "tenues-sport-marron",
    "name": "Tenues de sport marron",
    "category": "femme",
    "images": [
      {
        "src": "/images/marque-baruck/tenues-sport-marron.jpg",
        "alt": "Tenues de sport marron Baruck",
        "width": 800,
        "height": 1140
      }
    ]
  },
  {
    "id": "casques-audio",
    "name": "Casques audio",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/casques-audio.jpg",
        "alt": "Casques audio Baruck",
        "width": 800,
        "height": 728
      },
      {
        "src": "/images/marque-baruck/casques-audio-vue-2.jpg",
        "alt": "Casques audio Baruck — autre vue",
        "width": 800,
        "height": 808
      }
    ]
  },
  {
    "id": "sweats-capuche",
    "name": "Sweats à capuche",
    "category": "vetements",
    "images": [
      {
        "src": "/images/marque-baruck/sweats-capuche.jpg",
        "alt": "Sweats à capuche Baruck",
        "width": 1280,
        "height": 1250
      }
    ]
  },
  {
    "id": "ensemble-polo-short",
    "name": "Ensemble polo et short blanc",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/ensemble-polo-short.jpg",
        "alt": "Ensemble polo et short blanc Baruck",
        "width": 736,
        "height": 980
      }
    ]
  },
  {
    "id": "ensemble-capuche-bleu",
    "name": "Ensemble à capuche bleu clair",
    "category": "vetements",
    "images": [
      {
        "src": "/images/marque-baruck/ensemble-capuche-bleu.jpg",
        "alt": "Ensemble à capuche bleu clair Baruck",
        "width": 1280,
        "height": 1280
      }
    ]
  },
  {
    "id": "bracelets",
    "name": "Bracelets",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/bracelets.jpg",
        "alt": "Bracelets Baruck",
        "width": 413,
        "height": 1102
      }
    ]
  },
  {
    "id": "sac-dos-blanc",
    "name": "Sac à dos blanc",
    "category": "sacs",
    "images": [
      {
        "src": "/images/marque-baruck/sac-dos-blanc.jpg",
        "alt": "Sac à dos blanc Baruck",
        "width": 720,
        "height": 1029
      }
    ]
  },
  {
    "id": "chaussettes",
    "name": "Chaussettes",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/chaussettes.jpg",
        "alt": "Chaussettes Baruck",
        "width": 748,
        "height": 948
      }
    ]
  },
  {
    "id": "montre-bracelet-marron",
    "name": "Montre à bracelet marron",
    "category": "accessoires",
    "images": [
      {
        "src": "/images/marque-baruck/montre-bracelet-marron.jpg",
        "alt": "Montre à bracelet marron Baruck",
        "width": 720,
        "height": 1080
      }
    ]
  },
  {
    "id": "jean-bleu",
    "name": "Jean bleu",
    "category": "vetements",
    "images": [
      {
        "src": "/images/marque-baruck/jean-bleu.jpg",
        "alt": "Jean bleu Baruck",
        "width": 854,
        "height": 1280
      }
    ]
  },
  {
    "id": "tunique-sombre",
    "name": "Tunique sombre",
    "category": "homme",
    "images": [
      {
        "src": "/images/marque-baruck/tunique-sombre.jpg",
        "alt": "Tunique sombre Baruck",
        "width": 818,
        "height": 1280
      }
    ]
  },
  {
    "id": "ensemble-enfant-bleu",
    "name": "Ensemble enfant bleu",
    "category": "enfant",
    "images": [
      {
        "src": "/images/marque-baruck/ensemble-enfant-bleu.jpg",
        "alt": "Ensemble enfant bleu Baruck",
        "width": 720,
        "height": 1280
      }
    ]
  },
  {
    "id": "debardeurs",
    "name": "Débardeurs",
    "category": "vetements",
    "images": [
      {
        "src": "/images/marque-baruck/debardeurs.jpg",
        "alt": "Débardeurs Baruck",
        "width": 962,
        "height": 1280
      }
    ]
  }
];

export const brandHero = brandProducts[0].images[0];
