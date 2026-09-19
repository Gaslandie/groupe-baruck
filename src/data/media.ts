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
  hotellerie: { src: "/images/placeholders/hotellerie.webp", alt: "Photo d’ambiance — hôtellerie", width: 1800, height: 1013 },
  restauration: { src: "/images/placeholders/restauration.webp", alt: "Photo d’ambiance — restauration", width: 1800, height: 1200 },
  agrobusiness: { src: "/images/placeholders/agrobusiness.webp", alt: "Photo d’ambiance — agro-business", width: 1800, height: 1013 },
  studioEnregistrement: { src: "/images/placeholders/studio-enregistrement.webp", alt: "Photo d’ambiance — studio d’enregistrement", width: 1800, height: 1200 },
  cinema: { src: "/images/placeholders/cinema.webp", alt: "Photo d’ambiance — cinéma", width: 1800, height: 1200 },
  voituresLuxe: { src: "/images/placeholders/voitures-luxe.webp", alt: "Photo d’ambiance — voitures de luxe", width: 1800, height: 1200 },
  communicationDigitale: { src: "/images/placeholders/communication-digitale.webp", alt: "Photo d’ambiance — communication digitale", width: 1800, height: 1282 },
  productionArtistes: { src: "/images/placeholders/production-artistes.webp", alt: "Photo d’ambiance — production d’artistes", width: 1800, height: 1200 },
  clipsVideo: { src: "/images/placeholders/clips-video.webp", alt: "Photo d’ambiance — clips vidéo", width: 1800, height: 1216 },
  contactEquipe: { src: "/images/placeholders/contact-equipe.webp", alt: "Photo d’ambiance — équipe en réunion", width: 2000, height: 2998 },
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

export const brandLogo: ImageAsset = {
  src: "/images/brand/baruck-logo.jpg",
  alt: "",
  width: 1170,
  height: 634,
};

export const jecaLogo: ImageAsset = {
  src: "/images/brand/jeca-logo.webp",
  alt: "JECA — Jeunes Entrepreneurs Chrétiens Africains",
  width: 384,
  height: 256,
};

export const edvLogo: ImageAsset = {
  src: "/images/brand/espoir-de-vie-logo.webp",
  alt: "Logo Espoir de Vie",
  width: 600,
  height: 521,
};

export const presidentPortrait: ImageAsset = {
  src: "/images/president/portrait.jpg",
  alt: "Portrait de MR Djoro Joël Shaloom Krasso, PDG du Groupe Baruck",
  width: 683,
  height: 1024,
};

export const presidentOnu1: ImageAsset = {
  src: "/images/president/onu-2016-1.jpg",
  alt: "MR Djoro Joël Shaloom Krasso participant à une séance de travail",
  width: 720,
  height: 540,
};

export const presidentOnu2: ImageAsset = {
  src: "/images/president/onu-2016-2.jpg",
  alt: "MR Djoro Joël Shaloom Krasso devant un portrait de Kofi Annan",
  width: 720,
  height: 540,
};

/**
 * Photo du PDG à son poste de travail, retenue le 2026-09-18 pour le hero de la
 * page Groupe : elle montre le Groupe lui-même au lieu d'emprunter la photo
 * d'une de ses activités. Source transmise par WhatsApp, donc déjà compressée
 * et limitée à 638 px de large — à remplacer par l'original si le client le
 * retrouve.
 */
export const presidentWorking: ImageAsset = {
  src: "/images/president/pdg-au-travail.webp",
  alt: "MR Djoro Joël Shaloom Krasso, PDG du Groupe Baruck, à son poste de travail",
  width: 638,
  height: 960,
};

/** Photos complémentaires fournies par le client, sans date déduite des fichiers. */
export const presidentOnuGallery: ImageAsset[] = [
  { src: "/images/president/onu-seance-travail.jpg", alt: "MR Djoro Joël Shaloom Krasso à une table de travail aux Nations Unies", width: 720, height: 540 },
  { src: "/images/president/onu-devant-drapeaux.jpg", alt: "MR Djoro Joël Shaloom Krasso devant les drapeaux des Nations Unies", width: 960, height: 720 },
  { src: "/images/president/onu-salle-conference.jpg", alt: "MR Djoro Joël Shaloom Krasso dans une salle de conférence des Nations Unies", width: 960, height: 720 },
];

export const studioHero: ImageAsset = {
  src: "/images/services/studio-photo-hero.webp",
  alt: "Studio Photo Baruck la Prospérité",
  width: 1254,
  height: 1254,
};

export const hostessesHero: ImageAsset = {
  src: "/images/services/hotesses-hero.webp",
  alt: "Hôtesses événementielles Baruck Communication Guinée",
  width: 941,
  height: 1672,
};
