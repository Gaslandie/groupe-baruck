import type { ReactNode } from "react";

import { edvPhotos } from "./espoir-de-vie";
import { jecaGalleries } from "./jeca";
import { brandHero } from "./marque-baruck";
import {
  hostessesHero,
  presidentOnu1,
  studioHero,
  type ImageAsset,
} from "./media";
import { routes, whatsappRequests } from "./site";
import { siteTexts } from "./textes";

/** Second lien d'une section : discret, sans flèche. */
export type TeaserAction = {
  label: string;
  href: string;
  external?: boolean;
};

/** Carte d'activité : ni photo ni dégradé, seulement le texte et son numéro. */
export type Activity = {
  id: string;
  title: string;
  description: string;
};

export type PageTeaser = {
  id: string;
  tone: "paper" | "ink" | "jeca" | "edv";
  reverse?: boolean;
  /** Bande pleine largeur, sans visuel : titre à gauche, texte et liens à droite. */
  band?: boolean;
  eyebrow: string;
  title: ReactNode;
  text: string;
  emphasis?: string;
  /** Lien principal : facultatif, une bande peut n'en porter aucun. */
  href?: string;
  linkLabel?: string;
  externalLink?: boolean;
  secondary?: TeaserAction;
  image?: ImageAsset & { position?: string };
  logo?: ImageAsset;
};

/**
 * Activités principales du Groupe : les trois volets qui défilaient dans le
 * carrousel du hero sont devenus des sections à part entière, juste sous le
 * hero (2026-09-16). Les titres et les textes restent ceux du back-office
 * (`content/textes.json`, groupe « heroSlides ») : le client les modifie au
 * même endroit qu'avant.
 */
export const mainActivities: PageTeaser[] = [
  {
    id: "activite-guinee",
    tone: "paper",
    band: true,
    title: siteTexts.heroSlides["guinee"].title,
    text: siteTexts.heroSlides["guinee"].description,
    eyebrow: "Groupe Baruck · Guinée",
  },
  {
    id: "activite-studio",
    tone: "paper",
    title: siteTexts.heroSlides["studio-photo"].title,
    text: siteTexts.heroSlides["studio-photo"].description,
    eyebrow: "Baruck Communication · Guinée",
    image: { ...studioHero, position: "center" },
    href: whatsappRequests.studioPrices,
    linkLabel: "Connaître les prix",
    externalLink: true,
    secondary: { label: "Voir les détails", href: routes.studio },
  },
  {
    id: "activite-hotesses",
    tone: "ink",
    title: siteTexts.heroSlides["hotesses"].title,
    text: siteTexts.heroSlides["hotesses"].description,
    eyebrow: "Baruck Communication · Guinée",
    image: { ...hostessesHero, position: "center 38%" },
    href: whatsappRequests.hostessBooking,
    linkLabel: "Réserver une équipe",
    externalLink: true,
    secondary: { label: "Voir les détails", href: routes.hostesses },
  },
];

export const activities: Activity[] = [
  {
    id: "hotellerie",
    ...siteTexts.activities["hotellerie"],
  },
  {
    id: "restauration",
    ...siteTexts.activities["restauration"],
  },
  {
    id: "agrobusiness",
    ...siteTexts.activities["agrobusiness"],
  },
  {
    id: "studio",
    ...siteTexts.activities["studio"],
  },
  {
    id: "cinema",
    ...siteTexts.activities["cinema"],
  },
  {
    id: "mobilite",
    ...siteTexts.activities["mobilite"],
  },
  {
    id: "communication",
    ...siteTexts.activities["communication"],
  },
  {
    id: "artistes",
    ...siteTexts.activities["artistes"],
  },
  {
    id: "clips",
    ...siteTexts.activities["clips"],
  },
];

export const pageTeasers: PageTeaser[] = [
  {
    id: "apercu-marque",
    tone: "ink",
    image: brandHero,
    eyebrow: "La marque Baruck",
    title: "L’élégance,",
    emphasis: "notre affaire.",
    text: "Vêtements, sacs, chaussures, parfums et accessoires : découvrez l’univers Baruck et préparez votre commande par WhatsApp.",
    href: routes.brand,
    linkLabel: "Découvrir la collection",
  },
  {
    id: "apercu-about",
    tone: "ink",
    image: { ...presidentOnu1, position: "center 30%" },
    eyebrow: "Le Groupe",
    title: "Un homme, une vision,",
    emphasis: "un groupe.",
    text: "À la tête du Groupe Baruck, il porte une vision fondée sur l’entrepreneuriat, la création de valeur et l’engagement au service de la société.",
    href: routes.group,
    linkLabel: "Découvrir le Groupe",
  },
  {
    id: "apercu-jeca",
    tone: "jeca",
    image: jecaGalleries[2].photos[0],
    eyebrow: "JECA · Jeunes Entrepreneurs Chrétiens Africains",
    title: "Réunir la diaspora.",
    emphasis: "Investir en Afrique.",
    text: "La JECA sensibilise la diaspora africaine à l’investissement sur le continent et veut se placer comme un lien entre la diaspora et l’Afrique.",
    href: routes.jeca,
    linkLabel: "Voir les éditions",
  },
  {
    id: "apercu-edv",
    tone: "edv",
    image: { ...edvPhotos.divoKitsScolaires, position: "center 40%" },
    eyebrow: "Engagement humanitaire · Afrique de l’Ouest",
    title: "Espoir de Vie.",
    emphasis: "Agir pour les plus vulnérables.",
    text: "Protéger les enfants, accompagner les familles et apporter une aide concrète là où elle est nécessaire.",
    href: routes.edv,
    linkLabel: "Découvrir les actions",
  },
];

/**
 * Événement mis en avant sur l'accueil, juste sous le hero depuis le
 * 2026-09-22 : les réalisations du groupe ouvrent la page, avant les activités.
 * La section reprend l'article portant ce slug : titre, chapeau, photos et lien.
 * Slug inconnu ou article retiré : la section disparaît, l'accueil reste entier.
 */
export const featuredEventSlug = "top-modele-baruck-guinee-2026";

/** Sur-titre de la section : ce que l'on met en avant, pas le titre de l'article. */
export const featuredEventEyebrow = "L’événement";

/**
 * Les autres concours organisés en Guinée, montrés en petit sous l'événement
 * principal depuis le 2026-09-19 : ils ont chacun leur article, mais la page
 * d'accueil ne les annonçait nulle part. Ordre du plus récent au plus ancien.
 * Un slug inconnu est simplement ignoré, la section reste entière.
 */
export const featuredAlsoSlugs = [
  "top-modele-baruck-guinee-2025",
  "miss-baruck-guinee-2025",
];

/** Sur-titre de la liste secondaire. */
export const featuredAlsoTitle = "Les autres concours Baruck";
