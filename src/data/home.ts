import { whatsappRequests } from "./site";
import { pageValue } from "@/lib/page-content";
import { translate as t } from "../lib/language.ts";

import type { ReactNode } from "react";

import { edvPhotos } from "./espoir-de-vie";
import { jecaGalleries, jecaPortrait } from "./jeca";
import { brandHero } from "./marque-baruck";
import {
  hostessesHero,
  presidentOnu1,
  studioHero,
  type ImageAsset,
} from "./media";

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

/** Vidéo d'une section, déposée dans `public/videos/` ; l'image reste affichée tant qu'elle manque. */
export type TeaserVideo = {
  src: `/${string}`;
  poster: `/${string}`;
  width: number;
  height: number;
  label: string;
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
  /** Prend la place de l'image quand le fichier est présent. */
  video?: TeaserVideo;
  logo?: ImageAsset;
};

/**
 * Visite du studio filmée par le client (2026-09-30). Source 640 × 360, 60 s,
 * avec le son ; l'image d'attente est tirée de la première seconde. Montrée
 * deux fois sur l'accueil (2026-10-01) : juste sous le hero, puis à la place
 * de la photo dans la section du studio.
 */
export const studioVideo: TeaserVideo = { src: pageValue<`/${string}`>("home", "video.src"), label: pageValue<string>("home", "video.label"), poster: pageValue<ImageAsset>("home", "video.poster").src, width: 640, height: 360 };

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
    eyebrow: pageValue<string>("home", "activite-guinee.eyebrow"),
  },
  {
    id: "activite-studio",
    tone: "paper",
    title: siteTexts.heroSlides["studio-photo"].title,
    text: siteTexts.heroSlides["studio-photo"].description,
    eyebrow: pageValue<string>("home", "activite-studio.eyebrow"),
    image: { ...studioHero, position: "center" },
    video: studioVideo,
    href: whatsappRequests.studioPrices,
    linkLabel: pageValue<string>("home", "activite-studio.linkLabel"),
    externalLink: true,
    secondary: pageValue<TeaserAction>("home", "activite-studio.secondary"),
  },
  {
    id: "activite-hotesses",
    tone: "ink",
    title: siteTexts.heroSlides["hotesses"].title,
    text: siteTexts.heroSlides["hotesses"].description,
    eyebrow: pageValue<string>("home", "activite-hotesses.eyebrow"),
    image: { ...hostessesHero, position: "center 38%" },
    href: whatsappRequests.hostessBooking,
    linkLabel: pageValue<string>("home", "activite-hotesses.linkLabel"),
    externalLink: true,
    secondary: pageValue<TeaserAction>("home", "activite-hotesses.secondary"),
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
    eyebrow: pageValue<string>("home", "apercu-marque.eyebrow"),
    title: pageValue<string>("home", "apercu-marque.title"),
    emphasis: pageValue<string>("home", "apercu-marque.emphasis"),
    text: pageValue<string>("home", "apercu-marque.text"),
    href: pageValue<string>("home", "apercu-marque.href"),
    linkLabel: pageValue<string>("home", "apercu-marque.linkLabel"),
  },
  {
    id: "apercu-about",
    tone: "ink",
    image: { ...presidentOnu1, position: "center 30%" },
    eyebrow: pageValue<string>("home", "apercu-about.eyebrow"),
    title: pageValue<string>("home", "apercu-about.title"),
    emphasis: pageValue<string>("home", "apercu-about.emphasis"),
    text: pageValue<string>("home", "apercu-about.text"),
    href: pageValue<string>("home", "apercu-about.href"),
    linkLabel: pageValue<string>("home", "apercu-about.linkLabel"),
  },
  {
    id: "apercu-jeca",
    tone: "jeca",
    image: jecaGalleries.at(-1)?.photos[0] ?? jecaPortrait,
    eyebrow: pageValue<string>("home", "apercu-jeca.eyebrow"),
    title: pageValue<string>("home", "apercu-jeca.title"),
    emphasis: pageValue<string>("home", "apercu-jeca.emphasis"),
    text: pageValue<string>("home", "apercu-jeca.text"),
    href: pageValue<string>("home", "apercu-jeca.href"),
    linkLabel: pageValue<string>("home", "apercu-jeca.linkLabel"),
  },
  {
    id: "apercu-edv",
    tone: "edv",
    image: { ...edvPhotos.divoKitsScolaires, position: "center 40%" },
    eyebrow: pageValue<string>("home", "apercu-edv.eyebrow"),
    title: pageValue<string>("home", "apercu-edv.title"),
    emphasis: pageValue<string>("home", "apercu-edv.emphasis"),
    text: pageValue<string>("home", "apercu-edv.text"),
    href: pageValue<string>("home", "apercu-edv.href"),
    linkLabel: pageValue<string>("home", "apercu-edv.linkLabel"),
  },
];

/**
 * Événement mis en avant sur l'accueil, juste sous le hero depuis le
 * 2026-09-22 : les réalisations du groupe ouvrent la page, avant les activités.
 * La section reprend l'article portant ce slug : titre, chapeau, photos et lien.
 * Slug inconnu ou article retiré : la section disparaît, l'accueil reste entier.
 */
export const featuredEventSlug = pageValue<string>("home", "featuredEventSlug");

/** Sur-titre de la section : ce que l'on met en avant, pas le titre de l'article. */
export const featuredEventEyebrow = pageValue<string>("home", "featuredEventEyebrow");

/**
 * Les autres concours organisés en Guinée, montrés en petit sous l'événement
 * principal depuis le 2026-09-19 : ils ont chacun leur article, mais la page
 * d'accueil ne les annonçait nulle part. Ordre du plus récent au plus ancien.
 * Un slug inconnu est simplement ignoré, la section reste entière.
 */
export const featuredAlsoSlugs = pageValue<string[]>("home", "featuredAlsoSlugs");

/** Sur-titre de la liste secondaire. */
export const featuredAlsoTitle = pageValue<string>("home", "featuredAlsoTitle");

/** Photos d’origine des trois concours sur l’accueil, conservées quand
 * le back-office fournit un article sans groupes. Ne modifie pas les articles. */
export const featuredEventPhotos: Partial<Record<string, ImageAsset[]>> = {
  "top-modele-baruck-guinee-2026": [
    { src: "/images/actualites/top-modele-2026/laureats-01.webp", alt: t("Les deux lauréats, écharpe Top Modèle Baruck Guinée 2026 sur les épaules, devant le photocall du concours"), width: 1200, height: 1222 },
    { src: "/images/actualites/top-modele-2026/rtg-01.webp", alt: t("Une journaliste de la RTG tendant son micro au PDG du Groupe Baruck, assis à son bureau"), width: 1600, height: 1105 },
    { src: "/images/actualites/top-modele-2026/candidat-01-a.webp", alt: t("Le candidat n°1 sur le podium, en tenue traditionnelle dorée et pagne"), width: 1400, height: 735 },
    { src: "/images/actualites/top-modele-2026/candidat-02-a.webp", alt: t("Le candidat n°2 en longue robe bleu nuit à motifs losanges"), width: 1400, height: 736 },
  ],
  "top-modele-baruck-guinee-2025": [
    { src: "/images/actualites/top-modele-2025/affiche-01.webp", alt: t("Une candidate sur le podium devant l’affiche de la grande finale de la première édition du Top Modèle Baruck Guinée"), width: 720, height: 1080 },
    { src: "/images/actualites/top-modele-2025/parrain-01.webp", alt: t("Le PDG du Groupe Baruck au micro devant l’affiche du Top Modèle Baruck Guinée"), width: 720, height: 1080 },
    { src: "/images/actualites/top-modele-2025/podium-01.webp", alt: t("Passage sur le podium en blazer bleu marine, devant l’affiche du concours"), width: 720, height: 1080 },
    { src: "/images/actualites/top-modele-2025/parrain-02.webp", alt: t("Le PDG du Groupe Baruck assis dans la salle pendant la finale"), width: 720, height: 1080 },
  ],
  "miss-baruck-guinee-2025": [
    { src: "/images/actualites/miss-baruck-2025/reine-01.webp", alt: t("Mama Adama Bangoura, couronnée Miss Baruck Guinée 2025, portant l’écharpe du concours"), width: 1280, height: 854 },
    { src: "/images/actualites/miss-baruck-2025/reine-02.webp", alt: t("Mama Adama Bangoura, couronne sur la tête, aux côtés d’une autre participante pendant la soirée"), width: 1280, height: 854 },
    { src: "/images/actualites/miss-baruck-2025/soiree-01.webp", alt: t("Les participantes en tee-shirt Baruck devant le kakémono de la marque, « L’élégance notre affaire »"), width: 814, height: 814 },
    { src: "/images/actualites/miss-baruck-2025/candidate-01.webp", alt: t("Une candidate en écharpe Miss Baruck Guinée 2025, devant l’affiche de la grande finale"), width: 1073, height: 2048 },
  ],
};
