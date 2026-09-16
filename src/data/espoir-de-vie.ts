import { placeholderPhotos, type ImageAsset, type RemotePhoto } from "./media";

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
  iso: `${number}-${number}-${number}`;
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
  number: `0${1 | 2 | 3 | 4 | 5 | 6}`;
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
  code: "CI" | "GN" | "BF";
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
export const edvPhotos = {
  orphelinatVueAerienne: { src: "/images/espoir-de-vie/orphelinat-vue-aerienne.webp", alt: "Vue aérienne de l’orphelinat Espoir de Vie et de sa cour", width: 2000, height: 1444 },
  orphelinatVueAerienneCour: { src: "/images/espoir-de-vie/orphelinat-vue-aerienne-cour.webp", alt: "L’orphelinat Espoir de Vie vu depuis les airs, devant son portail", width: 1400, height: 1011 },
  orphelinatChantier: { src: "/images/espoir-de-vie/orphelinat-chantier.webp", alt: "Le bâtiment de l’orphelinat pendant sa construction", width: 1400, height: 1011 },
  orphelinatChantierVisite: { src: "/images/espoir-de-vie/orphelinat-chantier-visite.webp", alt: "Le président fondateur sur le chantier de l’orphelinat", width: 1100, height: 1524 },
  orphelinatDortoir: { src: "/images/espoir-de-vie/orphelinat-dortoir.webp", alt: "Dortoir de l’orphelinat : lits superposés et berceaux devant une fresque", width: 1400, height: 1011 },
  orphelinatCuisine: { src: "/images/espoir-de-vie/orphelinat-cuisine.webp", alt: "La cuisine équipée de l’orphelinat", width: 1100, height: 794 },
  orphelinatAccueilFamilles: { src: "/images/espoir-de-vie/orphelinat-accueil-familles.webp", alt: "Familles et enfants accueillis dans une salle de l’orphelinat", width: 1100, height: 733 },
  orphelinatInaugurationRuban: { src: "/images/espoir-de-vie/orphelinat-inauguration-ruban.webp", alt: "Coupure du ruban devant le portail de l’orphelinat le jour de l’ouverture", width: 1100, height: 733 },
  orphelinatInaugurationCortege: { src: "/images/espoir-de-vie/orphelinat-inauguration-cortege.webp", alt: "Cortège accompagné d’une fanfare le jour de l’ouverture de l’orphelinat", width: 1400, height: 933 },
  orphelinatDiscoursFondateur: { src: "/images/espoir-de-vie/orphelinat-discours-fondateur.webp", alt: "Prise de parole devant l’affiche des dix principes de la Déclaration des droits de l’enfant", width: 1100, height: 733 },
  orphelinatDroitsDeLEnfant: { src: "/images/espoir-de-vie/orphelinat-droits-de-l-enfant.webp", alt: "Salle de l’orphelinat où un mur rappelle qu’un enfant a droit à la vie et à l’éducation", width: 1800, height: 1300 },
  orphelinatRemiseVetements: { src: "/images/espoir-de-vie/orphelinat-remise-vetements.webp", alt: "Remise de vêtements aux enfants, devant une valise ouverte", width: 1100, height: 794 },
  orphelinatRepasPartage: { src: "/images/espoir-de-vie/orphelinat-repas-partage.webp", alt: "Repas partagé autour de la grande table de l’orphelinat", width: 1400, height: 933 },
  orphelinatRepasService: { src: "/images/espoir-de-vie/orphelinat-repas-service.webp", alt: "Service du repas aux enfants accueillis à l’orphelinat", width: 1100, height: 733 },
  grohRemiseJouets: { src: "/images/espoir-de-vie/groh-remise-jouets.webp", alt: "Remise de jouets aux enfants du village de Grôh", width: 1400, height: 1011 },
  grohJouets: { src: "/images/espoir-de-vie/groh-jouets.webp", alt: "Les jouets rassemblés avant la distribution aux enfants de Grôh", width: 1100, height: 794 },
  grohArbreDeNoel: { src: "/images/espoir-de-vie/groh-arbre-de-noel.webp", alt: "Distribution de jouets devant l’arbre de Noël, à Grôh", width: 1100, height: 794 },
  kitsScolairesCartables: { src: "/images/espoir-de-vie/kits-scolaires-cartables.webp", alt: "Cartables empilés avant la distribution des kits scolaires", width: 1100, height: 794 },
  kitsScolairesEleves: { src: "/images/espoir-de-vie/kits-scolaires-eleves.webp", alt: "Élèves rassemblés pour la distribution des kits scolaires à Zaroko", width: 1400, height: 1011 },
  kitsScolairesRemise: { src: "/images/espoir-de-vie/kits-scolaires-remise.webp", alt: "Remise d’un cartable à un enfant du village de Zaroko", width: 1100, height: 733 },
  divoKitsScolaires: { src: "/images/espoir-de-vie/divo-kits-scolaires.webp", alt: "Enfants du quartier Dialogue de Divo avec leurs cartables", width: 1400, height: 1011 },
  divoFournitures: { src: "/images/espoir-de-vie/divo-fournitures.webp", alt: "Carton de fournitures scolaires prêtes à être distribuées", width: 1100, height: 794 },
  veuvesRemiseVivres: { src: "/images/espoir-de-vie/veuves-remise-vivres.webp", alt: "Remise de vivres à une femme veuve", width: 1100, height: 794 },
  veuvesVivres: { src: "/images/espoir-de-vie/veuves-vivres.webp", alt: "Femmes veuves réunies avec les vivres reçus", width: 1100, height: 794 },
  feteDesMeres: { src: "/images/espoir-de-vie/fete-des-meres.webp", alt: "Mamans réunies avec les présents remis à l’occasion de la fête des Mères", width: 1100, height: 825 },
  fondationRoseGuiro: { src: "/images/espoir-de-vie/fondation-rose-guiraud.webp", alt: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiro", width: 1100, height: 794 },
} as const satisfies Record<string, ImageAsset>;

/** Photo du panneau droit du hero : le repas partagé à l'orphelinat. */
export const edvHeroPhoto = { ...edvPhotos.orphelinatRepasPartage, position: "center 42%" } satisfies EdvPositionedPhoto;

/** Bandeau de la section « Notre mission ». */
export const edvMissionPhoto = { ...edvPhotos.orphelinatDroitsDeLEnfant, position: "center 42%" } satisfies EdvPositionedPhoto;

export const edvSectionNav = [
  { href: "#mission", number: "01", title: "Notre mission", subtitle: "Protéger et accompagner" },
  { href: "#orphelinat", number: "02", title: "L’orphelinat", subtitle: "Une histoire depuis 2017" },
  { href: "#actions", number: "03", title: "Nos actions", subtitle: "Des engagements concrets" },
  { href: "#presence", number: "04", title: "Notre présence", subtitle: "Trois pays d’engagement" },
] satisfies EdvSectionNavItem[];

export const edvPillars = [
  { number: "01", title: "Protéger", text: "Offrir un cadre sûr aux enfants orphelins et vulnérables." },
  {
    number: "02",
    title: "Éduquer",
    text: "Faciliter la scolarisation par la remise de fournitures et de kits scolaires.",
  },
  { number: "03", title: "Nourrir & soigner", text: "Apporter une aide alimentaire et soutenir l’accès aux soins." },
  {
    number: "04",
    title: "Accompagner",
    text: "Soutenir les veuves, les mères et les familles confrontées à la précarité.",
  },
  {
    number: "05",
    title: "Agir",
    text: "Aller sur le terrain et fédérer les bonnes volontés autour d’actions concrètes.",
  },
] satisfies EdvPillar[];

export const edvImpact = [
  { value: "2015", label: "Premières actions de solidarité" },
  { value: "100", label: "Jouets remis aux enfants de Grôh" },
  { value: "200", label: "Orphelins accompagnés à la rentrée 2016–2017" },
  { value: "2017", label: "Accueil des premiers pensionnaires" },
] satisfies EdvImpactItem[];

export const edvTimeline = [
  {
    step: "Étape 01",
    title: "Construction",
    text: "Édification du bâtiment destiné à accueillir et accompagner les enfants.",
    photo: edvPhotos.orphelinatChantier,
  },
  {
    step: "Étape 02",
    title: "Aménagement",
    text: "Préparation des dortoirs, des berceaux, de la cuisine et des espaces de vie.",
    photo: edvPhotos.orphelinatDortoir,
  },
  {
    date: { iso: "2017-02-11", label: "11 février 2017" },
    title: "Premiers pensionnaires",
    text: "Accueil des premiers enfants avant l’ouverture officielle de l’établissement.",
    photo: edvPhotos.orphelinatAccueilFamilles,
  },
  {
    date: { iso: "2017-02-15", label: "15 février 2017" },
    title: "Inauguration",
    text: "Ouverture officielle en présence des communautés et des autorités invitées.",
    photo: edvPhotos.orphelinatInaugurationRuban,
  },
  {
    date: { iso: "2017-03-04", label: "04 mars 2017" },
    title: "Un repas partagé",
    text: "Le président fondateur partage un moment de convivialité avec les enfants accueillis.",
    photo: edvPhotos.orphelinatRepasPartage,
  },
] satisfies EdvTimelineItem[];

export const edvActions = [
  {
    number: "01",
    date: { iso: "2015-12-23", label: "23 décembre 2015" },
    place: "Grôh · Département d’Hiré · Côte d’Ivoire",
    title: "Un Noël pour les enfants",
    text: "Cent jouets remis aux enfants du village autour d’un arbre de Noël et d’un moment de partage.",
    highlight: "100 jouets",
    tone: "featured",
    photo: edvPhotos.grohRemiseJouets,
  },
  {
    number: "02",
    period: "Rentrées scolaires",
    place: "Zaroko et Divo · Côte d’Ivoire",
    title: "Favoriser l’accès à l’école",
    text: "Distribution de cartables, cahiers, fournitures et vivres aux enfants orphelins, dont 200 bénéficiaires au quartier Dialogue de Divo pour la rentrée 2016–2017.",
    photo: edvPhotos.divoKitsScolaires,
  },
  {
    number: "03",
    period: "Actions communautaires",
    place: "Côte d’Ivoire",
    title: "Soutenir les femmes et les familles",
    text: "Dons aux mères, aide alimentaire aux veuves et accompagnement de petites initiatives génératrices de revenus.",
    photo: edvPhotos.veuvesRemiseVivres,
  },
  {
    number: "04",
    period: "2017",
    place: "Orphelinat · Divo · Zaroko · Côte d’Ivoire",
    title: "Vêtir et chausser dignement",
    text: "Des vêtements ont été remis aux enfants de l’orphelinat. Des chaussures ont ensuite été distribuées aux enfants démunis de Divo, puis, le 3 juin 2017, aux enfants du village de Zaroko.",
    highlight: "4 000 chaussures à Divo · 2 000 à Zaroko",
    photo: edvPhotos.orphelinatRemiseVetements,
  },
  {
    number: "05",
    period: "Solidarité associative",
    place: "Fondation Marie Rose Guiro",
    title: "Unir les forces",
    text: "Remise de vivres et de produits non alimentaires à la Fondation Marie Rose Guiro pour accompagner ses bénéficiaires.",
    photo: edvPhotos.fondationRoseGuiro,
  },
  {
    number: "06",
    period: "Rayonnement africain",
    place: "Guinée et Burkina Faso",
    title: "Porter l’espoir au-delà des frontières",
    text: "Soutien aux enfants de la rue, partage avec des personnes sans-abri et actions en faveur de la santé, de l’alimentation et de l’éducation.",
    tone: "dark",
  },
] satisfies EdvAction[];

export const edvCountries = [
  {
    code: "CI",
    number: "01",
    title: "Côte d’Ivoire",
    text: "Grôh, Hiré, Zaroko et Divo : jouets, kits scolaires, aide aux familles, vêtements, chaussures et construction de l’orphelinat.",
    photo: { ...edvPhotos.kitsScolairesEleves, position: "center 45%" },
  },
  {
    code: "GN",
    number: "02",
    title: "Guinée",
    text: "Des actions autour du droit à la santé, à une alimentation équilibrée, à la protection et à l’éducation.",
    photo: placeholderPhotos.conakryBay,
  },
  {
    code: "BF",
    number: "03",
    title: "Burkina Faso",
    text: "Soutien aux enfants de la rue et moments de partage avec des personnes sans-abri pendant une tournée africaine.",
    photo: placeholderPhotos.ouagadougou,
  },
] satisfies EdvCountry[];

/** Galerie de la section « Mémoire d'actions » (reprise aussi par la médiathèque). */
export const edvGallery = [
  { photo: edvPhotos.orphelinatVueAerienneCour, caption: "L’orphelinat" },
  { photo: edvPhotos.orphelinatChantierVisite, caption: "Le chantier" },
  { photo: edvPhotos.orphelinatInaugurationCortege, caption: "Jour d’ouverture" },
  { photo: edvPhotos.orphelinatDiscoursFondateur, caption: "Les droits de l’enfant" },
  { photo: edvPhotos.orphelinatCuisine, caption: "La cuisine" },
  { photo: edvPhotos.orphelinatRepasService, caption: "Un repas partagé" },
  { photo: edvPhotos.grohJouets, caption: "Grôh · Les jouets" },
  { photo: edvPhotos.grohArbreDeNoel, caption: "Grôh · Un Noël" },
  { photo: edvPhotos.kitsScolairesCartables, caption: "Les cartables" },
  { photo: edvPhotos.kitsScolairesRemise, caption: "Zaroko · Rentrée" },
  { photo: edvPhotos.divoFournitures, caption: "Les fournitures" },
  { photo: edvPhotos.feteDesMeres, caption: "Fête des Mères" },
  { photo: edvPhotos.veuvesVivres, caption: "Soutien aux veuves" },
  { photo: edvPhotos.fondationRoseGuiro, caption: "Fondation Marie Rose Guiro" },
] satisfies EdvGalleryItem[];

export const edvCollaborations = [
  {
    number: "01",
    title: "Fondation Marie Rose Guiro",
    text: "Des vivres et des produits non alimentaires ont été remis pour accompagner ses bénéficiaires.",
  },
  {
    number: "02",
    title: "Église M.C.A",
    text: "Des actions de solidarité ont été menées auprès des mamans à l’occasion de la fête des Mères.",
  },
  {
    number: "03",
    title: "Ouverture associative",
    text: "L’orphelinat a reçu la visite d’une organisation française venue rencontrer les enfants et les équipes.",
  },
] satisfies EdvCollaboration[];

export type EdvVideo = {
  /** Fichier déposé dans `public/videos/` ; la section n'existe que s'il est présent. */
  src: `/${string}`;
  poster?: `/${string}`;
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  date: { iso: string; label: string };
  caption: string;
};

export const edvVisitVideo = {
  src: "/videos/don-orphelinat-precieux-soleils.mp4",
  poster: "/images/espoir-de-vie/don-orphelinat-precieux-soleils.jpg",
  eyebrow: "Sur le terrain · Conakry",
  title: "Un don à l’orphelinat",
  emphasis: "des Précieux Soleils.",
  text: "Le PDG du Groupe Baruck, également président de la JECA, s’est rendu dans le quartier de Sonfonia T7, à Conakry, auprès des enfants de l’orphelinat des Précieux Soleils.",
  date: { iso: "2026-09-11", label: "Vendredi 11 septembre 2026" },
  caption: "Remise d’un don aux enfants et à l’équipe de l’orphelinat des Précieux Soleils, à Sonfonia T7.",
} satisfies EdvVideo;
