import { pageValue } from "@/lib/page-content";

import { type ImageAsset, type RemotePhoto } from "./media";

type EdvSectionNavItem = {
  href: `#${string}`;
  number: string;
  title: string;
  subtitle: string;
};

type EdvPillar = {
  number: string;
  title: string;
  text: string;
};

type EdvImpactItem = {
  value: string;
  label: string;
};

type EdvDate = {
  /** Jour complet, ou année seule quand le jour n'est pas confirmé. */
  iso: `${number}-${number}-${number}` | `${number}`;
  label: string;
};

type EdvTimelineItem = {
  date?: EdvDate;
  step?: string;
  title: string;
  text: string;
  photo?: ImageAsset;
};

type EdvAction = {
  number: string;
  date?: EdvDate;
  period?: string;
  place: string;
  title: string;
  text: string;
  highlight?: string;
  tone?: "featured" | "dark";
  photo?: ImageAsset;
};

/** Visuel cadré par `background-position`, local (ImageAsset) ou distant (RemotePhoto). */
export type EdvPositionedPhoto = (ImageAsset | RemotePhoto) & { position: string };

type EdvCountry = {
  code: string;
  number: string;
  title: string;
  text: string;
  photo: EdvPositionedPhoto;
};

export type EdvGalleryItem = {
  photo: ImageAsset;
  caption: string;
};

type EdvCollaboration = {
  number: string;
  title: string;
  text: string;
};

/**
 * Photos d'archives de la fondation remises par le client, retaillées en WebP
 * dans `public/images/espoir-de-vie/`. Un même fichier peut servir à plusieurs
 * endroits : rien n'est dupliqué.
 */
const initialPhotos = Object.fromEntries([
  "orphelinatVueAerienne",
  "orphelinatVueAerienneCour",
  "orphelinatChantier",
  "orphelinatChantierVisite",
  "orphelinatDortoir",
  "orphelinatCuisine",
  "orphelinatAccueilFamilles",
  "orphelinatInaugurationRuban",
  "orphelinatInaugurationCortege",
  "orphelinatDiscoursFondateur",
  "orphelinatDroitsDeLEnfant",
  "orphelinatRemiseVetements",
  "orphelinatRepasPartage",
  "orphelinatRepasService",
  "grohRemiseJouets",
  "grohJouets",
  "grohArbreDeNoel",
  "kitsScolairesCartables",
  "kitsScolairesEleves",
  "kitsScolairesRemise",
  "divoKitsScolaires",
  "divoFournitures",
  "veuvesRemiseVivres",
  "veuvesVivres",
  "feteDesMeres",
  "presidentFondateurEnfants",
  "fondationRoseGuiraud",
  "partageSolidarite"
].map(key => [key, pageValue<ImageAsset>("espoir-de-vie", "photo." + key)])) as Record<string,ImageAsset>;

/** Une seule image pour toutes les actions qui la choisissent. */
export const edvPhotos: Record<string, ImageAsset> = {
  ...initialPhotos,
  ...Object.fromEntries(pageValue<{ key: string; image: ImageAsset }[]>("espoir-de-vie", "data.additionalPhotos")
    .map(({ key, image }) => [key, image])),
};

/** Photo du panneau droit du hero : le repas partagé à l'orphelinat. */
export const edvHeroPhoto = { ...edvPhotos.orphelinatRepasPartage, position: "center 42%" } satisfies EdvPositionedPhoto;

/**
 * Bandeau de la section « Notre mission » : le président fondateur entouré
 * d'enfants, photo choisie par Mohamed le 1er octobre 2026. Cadrage haut pour
 * garder son visage et les enfants derrière lui dans le bandeau large.
 */
export const edvMissionPhoto = { ...edvPhotos.presidentFondateurEnfants, position: "center 14%" } satisfies EdvPositionedPhoto;

export const edvSectionNav: EdvSectionNavItem[] = pageValue<Omit<EdvSectionNavItem, "number">[]>("espoir-de-vie", "data.nav").map((value, index) => ({...value, number: String(index + 1).padStart(2, "0")}));

export const edvPillars: EdvPillar[] = pageValue<Omit<EdvPillar,"number">[]>("espoir-de-vie", "data.pillars").map((value,index)=>({...value,number:String(index+1).padStart(2,"0")}));

export const edvImpact = pageValue<EdvImpactItem[]>("espoir-de-vie", "data.impact");

/*
 * Dates corrigées par le client le 29 septembre 2026 : construction en 2015,
 * ouverture en 2016 (et non 2017). Années seules, faute de jour confirmé.
 */
export const edvTimeline: EdvTimelineItem[] = pageValue<(Omit<EdvTimelineItem,"photo"> & {photo:string})[]>("espoir-de-vie", "data.timeline").map(value=>({...value,date:value.date?.iso?value.date:undefined,photo:edvPhotos[value.photo]}));

/** Les numéros et les tons suivent l’ordre choisi dans le formulaire. */
export const edvActions: EdvAction[] = pageValue<(Omit<EdvAction,"number"|"photo"> & {photo:string})[]>("espoir-de-vie", "data.actions").map((value,index,all)=>({...value,date:value.date?.iso?value.date:undefined,photo:edvPhotos[value.photo],number:String(index+1).padStart(2,"0"),tone:index===0?"featured":index===all.length-1?"dark":undefined}));

export const edvCountries: EdvCountry[] = pageValue<{title:string;text:string;photo:string}[]>("espoir-de-vie", "data.countries").map((value, index) => ({
  code: String(index), number: String(index + 1).padStart(2, "0"), title: value.title, text: value.text,
  photo: edvPhotos[value.photo] ? {...edvPhotos[value.photo], position:"center 45%"} : {src:value.photo,position:"center 60%",author:"",licence:"",href:""},
}));

/** Galerie de la section « Mémoire d'actions » (reprise aussi par la médiathèque). */
export const edvGallery: EdvGalleryItem[] = pageValue<{photo:string;caption:string}[]>("espoir-de-vie", "data.archives").map(value=>({...value,photo:edvPhotos[value.photo]}));

export const edvCollaborations: EdvCollaboration[] = pageValue<Omit<EdvCollaboration,"number">[]>("espoir-de-vie", "data.collaborations").map((value,index)=>({...value,number:String(index+1).padStart(2,"0")}));

export type EdvVideo = {
  id: string;
  /** Fichier déposé dans `public/videos/` ; la section n'existe que s'il est présent. */
  src: `/${string}`;
  poster?: `/${string}`;
  width: number;
  height: number;
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  date: EdvDate;
  caption: string;
};


/** L’ordre des vidéos suit la liste validée ; les dimensions viennent de l’affiche contrôlée. */
export const edvFieldVideos: EdvVideo[] = pageValue<(Omit<EdvVideo, "id" | "poster" | "width" | "height"> & {
  key: string;
  poster: ImageAsset;
})[]>("espoir-de-vie", "data.videos").map(value => ({
  ...value,
  id: value.key,
  poster: value.poster.src,
  width: value.poster.width,
  height: value.poster.height,
}));
