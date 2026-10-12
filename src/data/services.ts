import { translate as t } from "../lib/language.ts";

import { hqAddress } from "./site";

// Les visuels temp-*.jpg seront remplacés par les photos réelles du studio.

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
  /** Dimensions réelles requises : réutilisées par la médiathèque. */
  image: ServiceImage & { width: number; height: number };
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
  t("Mariage"),
  t("Baptême"),
  t("Anniversaire"),
  t("Conférence"),
  t("Shooting pro"),
  t("Mannequin"),
  t("Photo d’identité"),
  t("Spot publicitaire"),
  t("Événements privés"),
  t("Studio & extérieur"),
];

export const hostessTags: string[] = [
  t("Concerts géants"),
  t("Rencontres"),
  t("Mariages"),
  "Buffets",
  t("Conférences"),
  t("Lancements"),
  t("Événements privés"),
  t("Événements publics"),
  t("Baptêmes"),
  t("Soirées"),
  "Galas",
  t("Dîners"),
];

export const studioSpaces: StudioSpace[] = [
  {
    number: t("Espace 01"),
    title: t("Le studio classique"),
    text: t("Notre espace de prise de vue quotidien, ouvert à tous et sans rendez-vous : portraits, photos de famille, photos de groupe et pièces d’identité."),
    items: [
      t("Fond automatique et fond manuel"),
      t("Portraits, familles et groupes"),
      t("Photo d’identité remise sur place"),
      t("Séances rapides, sans rendez-vous"),
    ],
    image: {
      src: "/images/services/temp-studio-classique.jpg",
      alt: t("Fond de prise de vue et éclairage du studio classique"),
    },
  },
  {
    number: t("Espace 02"),
    title: t("Le studio VIP"),
    text: t("Un plateau haut de gamme réservé aux prises de vue les plus exigeantes : shooting pro, mannequin, mode et campagnes de marque."),
    items: [
      t("Décors et mises en scène soignées"),
      t("Paraflash, snoot optique et réflecteur"),
      t("Shooting mode, mannequin et marque"),
      t("Photo et vidéo"),
    ],
    image: {
      src: "/images/services/temp-studio-vip.jpg",
      alt: t("Shooting mode réalisé dans le studio VIP"),
    },
    vip: true,
  },
  {
    number: t("Espace 03"),
    title: t("L’espace anniversaire enfants"),
    text: t("Un décor pensé pour les plus petits, avec tout le nécessaire sur place pour des photos joyeuses et naturelles le jour de leur fête."),
    items: [
      t("Décors et ballons d’anniversaire"),
      t("Jouets et accessoires fournis"),
      t("Formule 30 photos"),
      t("Séance adaptée au rythme des enfants"),
    ],
    image: {
      src: "/images/services/temp-studio-enfants.jpg",
      alt: t("Séance photo d’une enfant dans l’espace anniversaire"),
    },
  },
];

export const studioGear: StudioGearItem[] = [
  {
    image: {
      src: "/images/services/temp-mat-canon.jpg",
      alt: t("Boîtier hybride Canon"),
    },
    title: t("Canon R10 professionnel"),
    text: t("Notre boîtier principal, pour des images nettes et lumineuses au studio comme en extérieur."),
  },
  {
    image: {
      src: "/images/services/temp-mat-nikon.jpg",
      alt: t("Reflex Nikon monté sur trépied"),
    },
    title: "Nikon D3500",
    text: t("Un second boîtier reflex, utilisé pour les séances rapides et les reportages d’événement."),
  },
  {
    image: {
      src: "/images/services/temp-mat-paraflash.jpg",
      alt: t("Paraflash de studio en cours de réglage"),
    },
    title: t("Paraflash"),
    text: t("L’éclairage principal du studio. Il peut être déplacé sur votre événement selon l’accord convenu avec le client."),
  },
  {
    image: {
      src: "/images/services/temp-mat-snoot.jpg",
      alt: t("Projecteurs de studio sur pieds"),
    },
    title: t("Snoot optique"),
    text: t("Pour diriger la lumière avec précision et travailler la profondeur des portraits."),
  },
  {
    image: {
      src: "/images/services/temp-mat-reflecteur.jpg",
      alt: t("Réflecteur circulaire de studio"),
    },
    title: t("Réflecteur"),
    text: t("Réservé au studio : il reste sur place et n’est pas déplaçable."),
  },
  {
    image: {
      src: "/images/services/temp-mat-fonds.jpg",
      alt: t("Fond de prise de vue et éclairages du studio"),
    },
    title: t("Fond automatique & fond manuel"),
    text: t("Deux systèmes de fonds pour changer de décor en quelques secondes."),
  },
];

export const studioEvents: StudioEvent[] = [
  {
    number: "01",
    title: t("Mariage"),
    text: t("Préparatifs, cérémonie et réception : votre journée entière racontée en images."),
  },
  {
    number: "02",
    title: t("Baptême"),
    text: t("Un reportage doux et discret pour la cérémonie et les moments en famille."),
  },
  {
    number: "03",
    title: t("Anniversaire"),
    text: t("Enfants comme adultes : décor, ballons et jouets disponibles au studio."),
  },
  {
    number: "04",
    title: t("Conférence"),
    text: t("Couverture complète de vos rencontres, à Conakry comme à l’intérieur du pays."),
  },
  {
    number: "05",
    title: t("Shooting mannequin"),
    text: t("Studio ou extérieur, avec photos, vidéo et album selon la formule choisie."),
  },
  {
    number: "06",
    title: t("Photo d’identité"),
    text: t("Quatre pièces réalisées et remises rapidement, directement sur place."),
  },
  {
    number: "07",
    title: t("Spot publicitaire"),
    text: t("Photos et vidéos de communication pour valoriser votre marque ou votre activité."),
  },
  {
    number: "08",
    title: t("Événements privés"),
    text: t("Remises de diplômes, soirées, inaugurations et cérémonies d’entreprise."),
  },
];

export const studioGallery: StudioGalleryItem[] = [
  {
    image: {
      src: "/images/services/temp-galerie-portrait.jpg",
      alt: t("Portrait d’homme réalisé en studio"),
      width: 1000,
      height: 1200,
    },
    caption: t("Portrait studio"),
    layout: "tall",
  },
  {
    image: {
      src: "/images/services/temp-galerie-mariage.jpg",
      alt: t("Couple de mariés en tenue traditionnelle"),
      width: 1000,
      height: 800,
    },
    caption: t("Mariage"),
    layout: "wide",
  },
  {
    image: {
      src: "/images/services/temp-galerie-conference.jpg",
      alt: t("Public assistant à une conférence"),
      width: 1000,
      height: 800,
    },
    caption: t("Conférence"),
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-anniversaire.jpg",
      alt: t("Famille réunie autour d’un gâteau d’anniversaire"),
      width: 1000,
      height: 800,
    },
    caption: t("Anniversaire"),
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-bapteme.jpg",
      alt: t("Cérémonie religieuse célébrée devant un autel fleuri"),
      width: 1000,
      height: 800,
    },
    caption: t("Baptême & cérémonie"),
    layout: "standard",
  },
  {
    image: {
      src: "/images/services/temp-galerie-shooting.jpg",
      alt: t("Shooting studio en noir et blanc"),
      width: 1000,
      height: 1200,
    },
    caption: t("Shooting pro"),
    layout: "standard",
  },
];

export const studioPriceGroups: StudioPriceGroup[] = [
  {
    number: "01",
    title: t("Séances studio"),
    items: [
      { label: t("Photo d’identité — 4 pièces"), price: "10 000 GNF", note: t("Rapide sur place") },
      { label: t("Studio photo simple"), price: "15 000 GNF" },
      { label: t("Shooting pro studio"), price: "25 000 GNF" },
      { label: t("Shoot mannequin — 10 photos"), price: "400 000 GNF" },
    ],
  },
  {
    number: "02",
    title: t("Formules mannequin"),
    items: [
      { label: t("1 jour"), price: "4 000 000 GNF", note: t("Photos studio + album 80 photos") },
      { label: t("2 jours"), price: "4 000 000 GNF", note: t("Photos + vidéo + album 100 photos") },
      { label: t("3 jours"), price: "5 000 000 GNF", note: t("Photos + vidéo + album 120 photos") },
    ],
  },
  {
    number: "03",
    title: t("Événements & extérieur"),
    items: [
      { label: t("Anniversaire — 30 photos"), price: "750 000 GNF" },
      {
        label: t("Déplacement shoot — 2 h"),
        price: "350 000 GNF",
        note: t("Matériel déplaçable selon accord"),
      },
      {
        label: t("Conférence complète"),
        price: "1 000 000 GNF",
        note: t("Hors Conakry : 1 500 000 GNF"),
      },
      { label: t("Spot publicitaire"), price: "2 000 000 GNF" },
      { label: t("Mariage — pack complet"), price: t("Dès 2 800 000 GNF") },
    ],
  },
];

export const hostessOffers: HostessOffer[] = [
  {
    number: "01",
    title: t("Accueil"),
    text: t("Réception des invités avec courtoisie et professionnalisme."),
  },
  {
    number: "02",
    title: t("Orientation"),
    text: t("Accompagnement du public et fluidité des déplacements."),
  },
  {
    number: "03",
    title: t("Représentation"),
    text: t("Une présence soignée, dynamique et adaptée à votre image."),
  },
];

/** Complément extrait des affiches hôtesses fournies par le client. */
export const hostessServiceComplement = {
  title: t("Restauration & hôtellerie"),
  text: t("Baruck Communication Guinée propose également son service pour la restauration, l’événementiel et l’hôtellerie. Contactez l’équipe pour préciser les besoins de votre réception."),
};

export type ServiceFaqItem = { question: string; answer: string };

export const studioFaq: ServiceFaqItem[] = [
  {
    question: t("Faut-il prendre rendez-vous ?"),
    answer: t("Le studio classique est ouvert à tous et sans rendez-vous : portraits, photos de famille, photos de groupe et pièces d’identité. Pour les autres formules, contactez l’équipe pour confirmer les disponibilités et les conditions."),
  },
  {
    question: t("Quand le studio est-il ouvert ?"),
    answer: t("24h/24 et 7j/7 — le studio est ouvert à tout le monde."),
  },
  {
    question: t("Où se trouve le studio ?"),
    answer: hqAddress,
  },
  {
    question: t("Vous déplacez-vous en dehors du studio ?"),
    answer: t("Oui. Les prises de vue se font au studio comme en extérieur : l’équipe se déplace sur vos événements, à Conakry comme à l’intérieur du pays. Déplacement shoot de 2 h : 350 000 GNF. Conférence complète : 1 000 000 GNF, 1 500 000 GNF hors Conakry."),
  },
  {
    question: t("Le matériel du studio peut-il venir sur mon événement ?"),
    answer: t("Le paraflash peut être déplacé sur votre événement selon l’accord convenu avec le client. Le réflecteur est réservé au studio : il reste sur place et n’est pas déplaçable."),
  },
  {
    question: t("Combien coûte une photo d’identité et quand est-elle remise ?"),
    answer: t("10 000 GNF les 4 pièces, réalisées et remises rapidement, directement sur place."),
  },
  {
    question: t("Que comprennent les formules mannequin ?"),
    answer: t("Shoot mannequin 10 photos : 400 000 GNF. Formule 1 jour : photos studio + album 80 photos, 4 000 000 GNF. Formule 2 jours : photos + vidéo + album 100 photos, 4 000 000 GNF. Formule 3 jours : photos + vidéo + album 120 photos, 5 000 000 GNF."),
  },
  {
    question: t("Proposez-vous des anniversaires pour enfants ?"),
    answer: t("Oui. Un espace dédié aux anniversaires des enfants, avec décors et ballons, jouets et accessoires fournis. Formule 30 photos : 750 000 GNF."),
  },
];

export type HostessProcessStep = {
  number: "01" | "02" | "03";
  title: string;
  text: string;
};

/** Parcours de réservation. */
export const hostessProcess: HostessProcessStep[] = [
  {
    number: "01",
    title: t("Votre demande"),
    text: t("Vous nous écrivez sur WhatsApp avec la date, le lieu et le nombre d’hôtesses souhaité."),
  },
  {
    number: "02",
    title: t("Notre confirmation"),
    text: t("Nous confirmons les disponibilités de l’équipe et les conditions de la prestation."),
  },
  {
    number: "03",
    title: t("Le jour de l’événement"),
    text: t("L’équipe est présente le jour J."),
  },
];
