// Les visuels temp-*.jpg sont provisoires et devront être remplacés par les photos réelles du studio.

export type ServiceImage = {
  src: `/${string}`;
  alt: string;
};

export type StudioSpace = {
  number: string;
  title: string;
  text: string;
  items: string[];
  image: ServiceImage;
  vip?: true;
};

export type StudioGearItem = {
  image: ServiceImage;
  title: string;
  text: string;
};

export type StudioEvent = {
  number: string;
  title: string;
  text: string;
};

export type StudioGalleryItem = {
  image: ServiceImage;
  caption: string;
  layout: "tall" | "wide" | "standard";
};

export type StudioPriceGroup = {
  number: string;
  title: string;
  items: {
    label: string;
    price: string;
    note?: string;
  }[];
};

export type HostessOffer = {
  number: string;
  title: string;
  text: string;
};

export const studioTags: string[] = [
  "Mariage",
  "Baptême",
  "Anniversaire",
  "Conférence",
  "Shooting pro",
  "Mannequin",
  "Photo d’identité",
  "Spot publicitaire",
  "Événements privés",
  "Studio & extérieur",
];

export const hostessTags: string[] = [
  "Concerts géants",
  "Rencontres",
  "Mariages",
  "Buffets",
  "Conférences",
  "Lancements",
  "Événements privés",
  "Événements publics",
];

export const studioSpaces: StudioSpace[] = [
  {
    number: "Espace 01",
    title: "Le studio classique",
    text: "Notre espace de prise de vue quotidien, ouvert à tous et sans rendez-vous : portraits, photos de famille, photos de groupe et pièces d’identité.",
    items: [
      "Fond automatique et fond manuel",
      "Portraits, familles et groupes",
      "Photo d’identité remise sur place",
      "Séances rapides, sans rendez-vous",
    ],
    image: {
      src: "/images/services/temp-studio-classique.jpg",
      alt: "Fond de prise de vue et éclairage du studio classique",
    },
  },
  {
    number: "Espace 02",
    title: "Le studio VIP",
    text: "Un plateau haut de gamme réservé aux prises de vue les plus exigeantes : shooting pro, mannequin, mode et campagnes de marque.",
    items: [
      "Décors et mises en scène soignées",
      "Paraflash, snoot optique et réflecteur",
      "Shooting mode, mannequin et marque",
      "Photo et vidéo",
    ],
    image: {
      src: "/images/services/temp-studio-vip.jpg",
      alt: "Shooting mode réalisé dans le studio VIP",
    },
    vip: true,
  },
  {
    number: "Espace 03",
    title: "L’espace anniversaire enfants",
    text: "Un décor pensé pour les plus petits, avec tout le nécessaire sur place pour des photos joyeuses et naturelles le jour de leur fête.",
    items: [
      "Décors et ballons d’anniversaire",
      "Jouets et accessoires fournis",
      "Formule 30 photos",
      "Séance adaptée au rythme des enfants",
    ],
    image: {
      src: "/images/services/temp-studio-enfants.jpg",
      alt: "Séance photo d’une enfant dans l’espace anniversaire",
    },
  },
];

export const studioGear: StudioGearItem[] = [
  {
    image: {
      src: "/images/services/temp-mat-canon.jpg",
      alt: "Boîtier hybride Canon",
    },
    title: "Canon R10 professionnel",
    text: "Notre boîtier principal, pour des images nettes et lumineuses au studio comme en extérieur.",
  },
  {
    image: {
      src: "/images/services/temp-mat-nikon.jpg",
      alt: "Reflex Nikon monté sur trépied",
    },
    title: "Nikon D3500",
    text: "Un second boîtier reflex, utilisé pour les séances rapides et les reportages d’événement.",
  },
  {
    image: {
      src: "/images/services/temp-mat-paraflash.jpg",
      alt: "Paraflash de studio en cours de réglage",
    },
    title: "Paraflash",
    text: "L’éclairage principal du studio. Il peut être déplacé sur votre événement selon l’accord convenu avec le client.",
  },
  {
    image: {
      src: "/images/services/temp-mat-snoot.jpg",
      alt: "Projecteurs de studio sur pieds",
    },
    title: "Snoot optique",
    text: "Pour diriger la lumière avec précision et travailler la profondeur des portraits.",
  },
  {
    image: {
      src: "/images/services/temp-mat-reflecteur.jpg",
      alt: "Réflecteur circulaire de studio",
    },
    title: "Réflecteur",
    text: "Réservé au studio : il reste sur place et n’est pas déplaçable.",
  },
  {
    image: {
      src: "/images/services/temp-mat-fonds.jpg",
      alt: "Fond de prise de vue et éclairages du studio",
    },
    title: "Fond automatique & fond manuel",
    text: "Deux systèmes de fonds pour changer de décor en quelques secondes.",
  },
];

export const studioEvents: StudioEvent[] = [
  {
    number: "01",
    title: "Mariage",
    text: "Préparatifs, cérémonie et réception : votre journée entière racontée en images.",
  },
  {
    number: "02",
    title: "Baptême",
    text: "Un reportage doux et discret pour la cérémonie et les moments en famille.",
  },
  {
    number: "03",
    title: "Anniversaire",
    text: "Enfants comme adultes : décor, ballons et jouets disponibles au studio.",
  },
  {
    number: "04",
    title: "Conférence",
    text: "Couverture complète de vos rencontres, à Conakry comme à l’intérieur du pays.",
  },
  {
    number: "05",
    title: "Shooting mannequin",
    text: "Studio ou extérieur, avec photos, vidéo et album selon la formule choisie.",
  },
  {
    number: "06",
    title: "Photo d’identité",
    text: "Quatre pièces réalisées et remises rapidement, directement sur place.",
  },
  {
    number: "07",
    title: "Spot publicitaire",
    text: "Photos et vidéos de communication pour valoriser votre marque ou votre activité.",
  },
  {
    number: "08",
    title: "Événements privés",
    text: "Remises de diplômes, soirées, inaugurations et cérémonies d’entreprise.",
  },
];

export const studioGallery: StudioGalleryItem[] = [
  {
    image: {
      src: "/images/services/temp-galerie-portrait.jpg",
      alt: "Portrait d’homme réalisé en studio",
    },
    caption: "Portrait studio",
    layout: "tall",
  },
  {
    image: {
      src: "/images/services/temp-galerie-mariage.jpg",
      alt: "Couple de mariés en tenue traditionnelle",
    },
    caption: "Mariage",
    layout: "wide",
  },
  {
    image: {
      src: "/images/services/temp-galerie-conference.jpg",
      alt: "Public assistant à une conférence",
    },
    caption: "Conférence",
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-anniversaire.jpg",
      alt: "Famille réunie autour d’un gâteau d’anniversaire",
    },
    caption: "Anniversaire",
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-bapteme.jpg",
      alt: "Cérémonie religieuse célébrée devant un autel fleuri",
    },
    caption: "Baptême & cérémonie",
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-shooting.jpg",
      alt: "Shooting studio en noir et blanc",
    },
    caption: "Shooting pro",
    layout: "standard",
  },
];

export const studioPriceGroups: StudioPriceGroup[] = [
  {
    number: "01",
    title: "Séances studio",
    items: [
      { label: "Photo d’identité — 4 pièces", price: "10 000 GNF", note: "Rapide sur place" },
      { label: "Studio photo simple", price: "15 000 GNF" },
      { label: "Shooting pro studio", price: "25 000 GNF" },
      { label: "Shoot mannequin — 10 photos", price: "400 000 GNF" },
    ],
  },
  {
    number: "02",
    title: "Formules mannequin",
    items: [
      { label: "1 jour", price: "4 000 000 GNF", note: "Photos studio + album 80 photos" },
      { label: "2 jours", price: "4 000 000 GNF", note: "Photos + vidéo + album 100 photos" },
      { label: "3 jours", price: "5 000 000 GNF", note: "Photos + vidéo + album 120 photos" },
    ],
  },
  {
    number: "03",
    title: "Événements & extérieur",
    items: [
      { label: "Anniversaire — 30 photos", price: "750 000 GNF" },
      {
        label: "Déplacement shoot — 2 h",
        price: "350 000 GNF",
        note: "Matériel déplaçable selon accord",
      },
      {
        label: "Conférence complète",
        price: "1 000 000 GNF",
        note: "Hors Conakry : 1 500 000 GNF",
      },
      { label: "Spot publicitaire", price: "2 000 000 GNF" },
      { label: "Mariage — pack complet", price: "Dès 2 800 000 GNF" },
    ],
  },
];

export const hostessOffers: HostessOffer[] = [
  {
    number: "01",
    title: "Accueil",
    text: "Réception des invités avec courtoisie et professionnalisme.",
  },
  {
    number: "02",
    title: "Orientation",
    text: "Accompagnement du public et fluidité des déplacements.",
  },
  {
    number: "03",
    title: "Représentation",
    text: "Une présence soignée, dynamique et adaptée à votre image.",
  },
];
