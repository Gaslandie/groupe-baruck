import { pageValue } from "@/lib/page-content";
import { translate as t } from "../lib/language.ts";

export type ImageAsset = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
};

export type RemotePhoto = { src: string; position: string; author: string; licence: string; href: string };

/** Source d'un lot de photos, sans liste de photographes (crédits des mentions légales). */
export type CreditSource = { label: string; href: string };

export const unsplashCredit: CreditSource = {
  label: "Unsplash",
  href: "https://unsplash.com/?utm_source=groupe_baruck&utm_medium=referral",
};

/** Visuels d’ambiance auto-hébergés en WebP (accueil), à remplacer par les photos du client. */
export const placeholderImages = {
  hotellerie: { src: "/images/placeholders/hotellerie.webp", alt: t("Photo d’ambiance — hôtellerie"), width: 1800, height: 1013 },
  restauration: { src: "/images/placeholders/restauration.webp", alt: t("Photo d’ambiance — restauration"), width: 1800, height: 1200 },
  agrobusiness: { src: "/images/placeholders/agrobusiness.webp", alt: t("Photo d’ambiance — agro-business"), width: 1800, height: 1013 },
  studioEnregistrement: { src: "/images/placeholders/studio-enregistrement.webp", alt: t("Photo d’ambiance — studio d’enregistrement"), width: 1800, height: 1200 },
  cinema: { src: "/images/placeholders/cinema.webp", alt: t("Photo d’ambiance — cinéma"), width: 1800, height: 1200 },
  voituresLuxe: { src: "/images/placeholders/voitures-luxe.webp", alt: t("Photo d’ambiance — voitures de luxe"), width: 1800, height: 1200 },
  communicationDigitale: { src: "/images/placeholders/communication-digitale.webp", alt: t("Photo d’ambiance — communication digitale"), width: 1800, height: 1282 },
  productionArtistes: { src: "/images/placeholders/production-artistes.webp", alt: t("Photo d’ambiance — production d’artistes"), width: 1800, height: 1200 },
  clipsVideo: { src: "/images/placeholders/clips-video.webp", alt: t("Photo d’ambiance — clips vidéo"), width: 1800, height: 1216 },
  contactEquipe: { src: "/images/placeholders/contact-equipe.webp", alt: t("Photo d’ambiance — équipe en réunion"), width: 2000, height: 2998 },
} as const satisfies Record<string, ImageAsset>;

export const placeholderPhotos = {
  conakryHero: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ville_de_Conaky.jpg/1920px-Ville_de_Conaky.jpg",
    position: "center 40%",
    author: "Boubacar Bila Diao Balde",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Ville_de_Conaky.jpg",
  },
  madina: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Madina_1.jpg/1920px-Madina_1.jpg",
    position: "center",
    author: "Thie Abdoul",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Madina_1.jpg",
  },
  conakryBay: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/42/Un_aper%C3%A7u_de_la_ville_de_conakry.jpg/1280px-Un_aper%C3%A7u_de_la_ville_de_conakry.jpg",
    position: "center 60%",
    author: "Alpha hmd",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Un_aper%C3%A7u_de_la_ville_de_conakry.jpg",
  },
  ouagadougou: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Ouagadougou_city_centre.JPG/1280px-Ouagadougou_city_centre.JPG",
    position: "center 60%",
    author: "Wegmann",
    licence: "CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Ouagadougou_city_centre.JPG",
  },
  dakarHorizon: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Gor%C3%A9e_2024_-_Vue_de_Dakar_-_17.jpg/1920px-Gor%C3%A9e_2024_-_Vue_de_Dakar_-_17.jpg",
    position: "center 62%",
    author: "Fawaz.tairou",
    licence: "CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Gor%C3%A9e_2024_-_Vue_de_Dakar_-_17.jpg",
  },
} as const satisfies Record<string, RemotePhoto>;

export const brandLogo: ImageAsset = pageValue<ImageAsset>("home", "common.brandLogo");

export const jecaLogo: ImageAsset = {
  src: "/images/brand/jeca-logo.webp",
  alt: "JECA — Jeunes Entrepreneurs Chrétiens Africains",
  width: 384,
  height: 256,
};

export const edvLogo: ImageAsset = {
  src: "/images/brand/espoir-de-vie-logo.webp",
  alt: t("Logo Espoir de Vie"),
  width: 600,
  height: 521,
};

export const presidentPortrait: ImageAsset = pageValue<ImageAsset>("groupe", "media.presidentPortrait");

export const presidentOnu1: ImageAsset = pageValue<ImageAsset>("groupe", "media.presidentOnu1");

export const presidentOnu2: ImageAsset = pageValue<ImageAsset>("groupe", "media.presidentOnu2");

/** Portrait fourni par le client pour le hero de la page Groupe. */
export const groupHeroPortrait: ImageAsset = pageValue<ImageAsset>("groupe", "media.groupHeroPortrait");

/** Photos complémentaires fournies par le client, sans date déduite des fichiers. */
export const presidentOnuGallery: ImageAsset[] = pageValue<ImageAsset[]>("groupe", "media.presidentOnuGallery");

export const studioHero: ImageAsset = pageValue<ImageAsset>("home", "media.studioHero");

export const hostessesHero: ImageAsset = pageValue<ImageAsset>("home", "media.hostessesHero");
