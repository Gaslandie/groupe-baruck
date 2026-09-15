import type { ReactNode } from "react";

import { jecaGalleries } from "./jeca";
import { brandHero } from "./marque-baruck";
import {
  edvLogo,
  hostessesHero,
  placeholderImages,
  presidentOnu1,
  studioHero,
  type ImageAsset,
} from "./media";
import { routes, whatsappRequests } from "./site";
import { siteTexts } from "./textes";

export type HeroAction = {
  label: string;
  href: string;
  external?: boolean;
};

export type HeroSlide = {
  id: string;
  title: string;
  description: string;
  image: string;
  position: string;
  bg: string;
  art: string;
  primary: HeroAction;
  secondary: HeroAction;
};

export type Activity = {
  id: string;
  title: string;
  description: string;
  image: string;
  bg: string;
  art: string;
};

export type PageTeaser = {
  id: string;
  tone: "paper" | "ink" | "jeca" | "edv";
  reverse?: boolean;
  eyebrow: string;
  title: ReactNode;
  emphasis: string;
  text: string;
  href: string;
  linkLabel: string;
  image?: ImageAsset & { position?: string };
  logo?: ImageAsset;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "guinee",
    ...siteTexts.heroSlides["guinee"],
    image: placeholderImages.hotellerie.src,
    position: "center",
    bg: "linear-gradient(145deg, #101820, #263b48 58%, #72563d)",
    art: "linear-gradient(125deg, transparent 45%, rgba(255,255,255,.08) 45.4% 46%, transparent 46.4%)",
    primary: { label: "Découvrir le Groupe", href: routes.group },
    secondary: { label: "Nous contacter", href: routes.contact },
  },
  {
    id: "studio-photo",
    ...siteTexts.heroSlides["studio-photo"],
    image: "/images/services/studio-photo-hero.webp",
    position: "center",
    bg: "linear-gradient(145deg, #161211, #633329 58%, #b3492e)",
    art: "linear-gradient(140deg, transparent 55%, rgba(151,24,18,.14))",
    primary: {
      label: "Connaître les prix",
      href: whatsappRequests.studioPrices,
      external: true,
    },
    secondary: { label: "Voir les détails", href: routes.studio },
  },
  {
    id: "hotesses",
    ...siteTexts.heroSlides["hotesses"],
    image: "/images/services/hotesses-hero.webp",
    position: "center 42%",
    bg: "linear-gradient(145deg, #170e13, #6f1934 58%, #a73a4d)",
    art: "linear-gradient(145deg, transparent 48%, rgba(122,5,42,.16))",
    primary: {
      label: "Réserver une équipe",
      href: whatsappRequests.hostessBooking,
      external: true,
    },
    secondary: { label: "Voir les détails", href: routes.hostesses },
  },
];

export const activities: Activity[] = [
  {
    id: "hotellerie",
    ...siteTexts.activities["hotellerie"],
    image: placeholderImages.hotellerie.src,
    bg: "radial-gradient(circle at 72% 24%, #d6a363 0 5%, transparent 5.5%), linear-gradient(135deg, #16211e 0%, #6a4c34 54%, #17191a 100%)",
    art: "repeating-linear-gradient(90deg, transparent 0 13%, rgba(255,255,255,.07) 13.2% 13.6%), linear-gradient(25deg, transparent 47%, rgba(255,255,255,.12) 47.3% 48%, transparent 48.3%)",
  },
  {
    id: "restauration",
    ...siteTexts.activities["restauration"],
    image: placeholderImages.restauration.src,
    bg: "radial-gradient(circle at 70% 44%, #dfbd83 0 13%, #7f5538 13.3% 14%, transparent 14.3%), linear-gradient(145deg, #3d1711, #8b4b2f 60%, #1e1210)",
    art: "radial-gradient(ellipse at 70% 44%, transparent 0 19%, rgba(255,255,255,.13) 19.3% 20%, transparent 20.3%)",
  },
  {
    id: "agrobusiness",
    ...siteTexts.activities["agrobusiness"],
    image: placeholderImages.agrobusiness.src,
    bg: "linear-gradient(140deg, #101b16, #496346 55%, #aa8353)",
    art: "repeating-radial-gradient(ellipse at 85% 110%, transparent 0 8%, rgba(229,208,155,.18) 8.3% 9%, transparent 9.3% 16%)",
  },
  {
    id: "studio",
    ...siteTexts.activities["studio"],
    image: placeholderImages.studioEnregistrement.src,
    bg: "linear-gradient(145deg, #101116, #35233d 55%, #9e452c)",
    art: "repeating-linear-gradient(90deg, transparent 0 5%, rgba(255,255,255,.11) 5.3% 5.7%, transparent 6% 10%)",
  },
  {
    id: "cinema",
    ...siteTexts.activities["cinema"],
    image: placeholderImages.cinema.src,
    bg: "radial-gradient(circle at 80% 20%, #ead0a1 0 2%, rgba(219,140,65,.45) 3%, transparent 23%), linear-gradient(150deg, #091015, #263746 50%, #5c3425)",
    art: "linear-gradient(113deg, transparent 46%, rgba(255,224,175,.12) 46.5% 58%, transparent 58.5%)",
  },
  {
    id: "mobilite",
    ...siteTexts.activities["mobilite"],
    image: placeholderImages.voituresLuxe.src,
    bg: "linear-gradient(140deg, #111315, #35404a 58%, #7b6147)",
    art: "linear-gradient(165deg, transparent 54%, rgba(255,255,255,.13) 54.3% 55%, transparent 55.3%), radial-gradient(ellipse at 70% 65%, rgba(255,255,255,.14), transparent 38%)",
  },
  {
    id: "communication",
    ...siteTexts.activities["communication"],
    image: placeholderImages.communicationDigitale.src,
    bg: "linear-gradient(145deg, #121018, #302954 55%, #b25134)",
    art: "repeating-linear-gradient(45deg, transparent 0 12%, rgba(255,255,255,.06) 12.2% 12.6%)",
  },
  {
    id: "artistes",
    ...siteTexts.activities["artistes"],
    image: placeholderImages.productionArtistes.src,
    bg: "radial-gradient(circle at 28% 28%, rgba(239,163,89,.8), transparent 16%), linear-gradient(145deg, #171217, #64243a 56%, #be6034)",
    art: "radial-gradient(circle at 64% 48%, transparent 0 12%, rgba(255,255,255,.1) 12.4% 13%, transparent 13.4% 24%, rgba(255,255,255,.07) 24.4% 25%, transparent 25.4%)",
  },
  {
    id: "clips",
    ...siteTexts.activities["clips"],
    image: placeholderImages.clipsVideo.src,
    bg: "linear-gradient(135deg, #0b1316, #194653 54%, #914b36)",
    art: "linear-gradient(35deg, transparent 0 34%, rgba(255,255,255,.13) 34.3% 35%, transparent 35.3%), linear-gradient(125deg, transparent 0 67%, rgba(255,255,255,.09) 67.3% 68%, transparent 68.3%)",
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
    id: "apercu-studio",
    tone: "paper",
    image: { ...studioHero, position: "center" },
    eyebrow: "Baruck Communication · Guinée",
    title: "Studio Photo Baruck",
    emphasis: "la Prospérité.",
    text: "Ouvert à tout le monde, à Kobayah (Conakry). Deux studios équipés et une équipe qui se déplace : nous réalisons vos photos au studio comme en extérieur, à toute heure.",
    href: routes.studio,
    linkLabel: "Découvrir le studio",
  },
  {
    id: "apercu-hostesses",
    tone: "ink",
    image: { ...hostessesHero, position: "center 38%" },
    eyebrow: "Baruck Communication · Guinée",
    title: "Hôtesses",
    emphasis: "événementielles.",
    text: "Une équipe élégante, professionnelle et dynamique à votre service pour la couverture de vos différents événements.",
    href: routes.hostesses,
    linkLabel: "Réserver une équipe",
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
    logo: edvLogo,
    eyebrow: "Engagement humanitaire · Afrique de l’Ouest",
    title: "Espoir de Vie.",
    emphasis: "Agir pour les plus vulnérables.",
    text: "Protéger les enfants, accompagner les familles et apporter une aide concrète là où elle est nécessaire.",
    href: routes.edv,
    linkLabel: "Découvrir les actions",
  },
];
