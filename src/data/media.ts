export type ImageAsset = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
};

export type RemotePhoto = { src: string; position: string; author: string; licence: string; href: string };

/** Source d'un lot de photos provisoires, sans liste de photographes. */
export type CreditSource = { label: string; href: string };

export const unsplashCredit: CreditSource = {
  label: "Unsplash",
  href: "https://unsplash.com/?utm_source=groupe_baruck&utm_medium=referral",
};

/** Visuels Unsplash provisoires, auto-hébergés en WebP (accueil). Photographes non établis. */
export const placeholderImages = {
  hotellerie: { src: "/images/placeholders/hotellerie.webp", alt: "Photo d’ambiance provisoire — hôtellerie", width: 1800, height: 1013 },
  restauration: { src: "/images/placeholders/restauration.webp", alt: "Photo d’ambiance provisoire — restauration", width: 1800, height: 1200 },
  agrobusiness: { src: "/images/placeholders/agrobusiness.webp", alt: "Photo d’ambiance provisoire — agro-business", width: 1800, height: 1013 },
  studioEnregistrement: { src: "/images/placeholders/studio-enregistrement.webp", alt: "Photo d’ambiance provisoire — studio d’enregistrement", width: 1800, height: 1200 },
  cinema: { src: "/images/placeholders/cinema.webp", alt: "Photo d’ambiance provisoire — cinéma", width: 1800, height: 1200 },
  voituresLuxe: { src: "/images/placeholders/voitures-luxe.webp", alt: "Photo d’ambiance provisoire — voitures de luxe", width: 1800, height: 1200 },
  communicationDigitale: { src: "/images/placeholders/communication-digitale.webp", alt: "Photo d’ambiance provisoire — communication digitale", width: 1800, height: 1282 },
  productionArtistes: { src: "/images/placeholders/production-artistes.webp", alt: "Photo d’ambiance provisoire — production d’artistes", width: 1800, height: 1200 },
  clipsVideo: { src: "/images/placeholders/clips-video.webp", alt: "Photo d’ambiance provisoire — clips vidéo", width: 1800, height: 1216 },
  contactEquipe: { src: "/images/placeholders/contact-equipe.webp", alt: "Photo d’ambiance provisoire — équipe en réunion", width: 2000, height: 2998 },
} as const satisfies Record<string, ImageAsset>;

export const placeholderPhotos = {
  conakryHero: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ville_de_Conaky.jpg/1920px-Ville_de_Conaky.jpg",
    position: "center 40%",
    author: "Boubacar Bila Diao Balde",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Ville_de_Conaky.jpg",
  },
  conakry: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Ville_de_Conaky.jpg/1280px-Ville_de_Conaky.jpg",
    position: "center 40%",
    author: "Boubacar Bila Diao Balde",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Ville_de_Conaky.jpg",
  },
  dakar: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Pointe_des_Almadies_-_Senegal.jpg/1280px-Pointe_des_Almadies_-_Senegal.jpg",
    position: "center 55%",
    author: "Jeff Attaway",
    licence: "CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Pointe_des_Almadies_-_Senegal.jpg",
  },
  abidjan: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/PlateauSudAbidjanApril2016.JPG/1280px-PlateauSudAbidjanApril2016.JPG",
    position: "center 30%",
    author: "Citizen59",
    licence: "CC BY 3.0",
    href: "https://commons.wikimedia.org/wiki/File:PlateauSudAbidjanApril2016.JPG",
  },
  madina: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Madina_1.jpg/1920px-Madina_1.jpg",
    position: "center",
    author: "Thie Abdoul",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Madina_1.jpg",
  },
  divo: {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Rue_de_Divo.jpg/1280px-Rue_de_Divo.jpg",
    position: "center 60%",
    author: "Aman ADO",
    licence: "CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Rue_de_Divo.jpg",
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
  alt: "Djoro Joël Shaloom Krasso participant à une séance de travail",
  width: 720,
  height: 540,
};

export const presidentOnu2: ImageAsset = {
  src: "/images/president/onu-2016-2.jpg",
  alt: "Djoro Joël Shaloom Krasso devant un portrait de Kofi Annan",
  width: 720,
  height: 540,
};

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
