import { translate as t } from "../lib/language.ts";

import { routes } from "./site";

export type Milestone = {
  /** Année affichée. */
  year: string;
  /** Valeur machine du <time>, reprise des dates déjà publiées quand elles existent. */
  dateTime: string;
  title: string;
  text: string;
  /** Ancre locale (#…) ou route interne du site. */
  href: string;
};

/** Repères documentés du dirigeant, de la JECA et d'Espoir de Vie. Aucune date du Groupe. */
export const milestones: Milestone[] = [
  {
    year: "2015",
    dateTime: "2015-12-23",
    title: t("Premières actions de solidarité"),
    text: t("À Grôh, mille jouets sont remis aux enfants du village autour d’un arbre de Noël et d’un moment de partage."),
    href: "/espoir-de-vie/#actions",
  },
  {
    year: "2016",
    dateTime: "2016",
    title: t("Protection de l’enfant"),
    text: t("MR Djoro Joël Shaloom Krasso exerce la fonction d’agent de développement pour la protection de l’enfant au sein des Nations Unies."),
    href: "#experience-onu",
  },
  {
    year: "2016",
    dateTime: "2016",
    title: t("Premiers pensionnaires"),
    text: t("L’orphelinat, construit en 2015, accueille ses premiers enfants et ouvre officiellement ses portes."),
    href: "/espoir-de-vie/#orphelinat",
  },
  {
    year: "2019",
    dateTime: "2019",
    title: t("Création de la JECA"),
    text: t("La JECA est créée pour sensibiliser la diaspora africaine à l’investissement en Afrique."),
    href: "/jeca/#vision",
  },
  {
    year: "2022",
    dateTime: "2022-08-04",
    title: t("Première édition de la JECA"),
    text: t("La première édition se tient à Dakar, du 04 au 14 août 2022."),
    href: "/jeca/#edition-1",
  },
  {
    year: "2023",
    dateTime: "2023-12-02",
    title: t("Deuxième édition de la JECA"),
    text: t("La deuxième édition se tient à Dakar, du 02 au 08 décembre 2023."),
    href: "/jeca/#edition-2",
  },
  {
    year: "2025",
    dateTime: "2025-07-26",
    title: t("Les premiers concours Baruck"),
    text: t("Baruck Communication lance ses propres rendez-vous en Guinée : Miss Baruck Guinée le 26 juillet, puis le Top Modèle Baruck Guinée le 27 septembre."),
    href: "/actualites/miss-baruck-guinee-2025/",
  },
  {
    year: "2026",
    dateTime: "2026-07-30",
    title: t("Troisième édition de la JECA"),
    text: t("La troisième édition se tient à Conakry, du 30 juillet au 04 août 2026."),
    href: "/jeca/#edition-3",
  },
];

/**
 * Les ambassadeurs de la marque Baruck, ajoutés à la page Le Groupe le
 * 2026-09-19. Le client a fourni ces photos sans date : elles sont donc
 * présentées comme une galerie, pas comme une actualité datée.
 *
 * Douze photos retenues sur les vingt-six reçues, pour ne pas alourdir la
 * page : la rencontre avec le PDG, l'équipe au complet, puis des passages de
 * la séance au Studio Photo Baruck.
 */
export type AmbassadorPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const ambassadorPhotos: AmbassadorPhoto[] = [
  { src: "/images/groupe/ambassadeurs/01.webp", alt: t("Le PDG du Groupe Baruck entouré des ambassadeurs de la marque, tous vêtus de noir, devant le siège de Baruck Communication"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/02.webp", alt: t("Le PDG du Groupe Baruck posant avec deux ambassadeurs de la marque dans son bureau"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/03.webp", alt: t("Les ambassadeurs brandissant les flyers du Studio Photo Baruck devant le mur Baruck Communication"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/04.webp", alt: t("Les ambassadeurs rassemblés, l’un d’eux agenouillé au premier plan"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/05.webp", alt: t("L’équipe des ambassadeurs réunie en studio, un membre agenouillé au premier plan"), width: 668, height: 667 },
  { src: "/images/groupe/ambassadeurs/06.webp", alt: t("L’équipe des ambassadeurs en studio, certains portant le tee-shirt aux couleurs de Baruck"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/07.webp", alt: t("Un ambassadeur assis en tailleur, capuche et gants noirs, un chapeau posé sur un sac de voyage"), width: 716, height: 1080 },
  { src: "/images/groupe/ambassadeurs/08.webp", alt: t("Un ambassadeur soulevant le bord de son chapeau noir, en studio"), width: 1000, height: 667 },
  { src: "/images/groupe/ambassadeurs/09.webp", alt: t("Une ambassadrice en trench noir, les mains dans les poches, sur fond sombre"), width: 720, height: 1080 },
  { src: "/images/groupe/ambassadeurs/10.webp", alt: t("Un ambassadeur en veste de cuir noire et casquette plate, en studio"), width: 720, height: 1080 },
  { src: "/images/groupe/ambassadeurs/11.webp", alt: t("Un ambassadeur les bras croisés tenant un sac de voyage noir, en studio"), width: 720, height: 1080 },
  { src: "/images/groupe/ambassadeurs/12.webp", alt: t("Deux ambassadeurs accroupis de part et d’autre d’un sac de voyage noir, en studio"), width: 1000, height: 667 },
];

export type CommunicationService = {
  title: string;
  text: string;
  href: string;
  cta: string;
};

export type BaruckCommunication = {
  eyebrow: string;
  name: string;
  description: string;
  presence: string;
  servicesLabel: string;
  services: CommunicationService[];
};

/** Pôle opérationnel guinéen : uniquement ce qui est déjà publié sur le site. */
export const baruckCommunication: BaruckCommunication = {
  eyebrow: t("Pôle opérationnel · Guinée"),
  name: "Baruck Communication",
  description:
    t("Baruck Communication est une maison de communication, pas une agence de mannequinat : la distinction est celle du PDG lui-même. En Guinée, elle opère le Studio Photo Baruck la Prospérité et les services d’hôtesses événementielles présentés sur ce site, et organise les rendez-vous du groupe."),
  presence: t("Guinée"),
  servicesLabel: t("Studio photo · Hôtesses événementielles · Événements"),
  services: [
    {
      title: "Studio Photo Baruck la Prospérité",
      text: t("Deux studios équipés à Kobayah, à Conakry, pour des prises de vue au studio comme en extérieur."),
      href: routes.studio,
      cta: t("Découvrir le studio"),
    },
    {
      title: t("Hôtesses événementielles"),
      text: t("Une équipe élégante, professionnelle et dynamique pour la couverture de différents événements en Guinée."),
      href: routes.hostesses,
      cta: t("Découvrir les hôtesses"),
    },
  ],
};

export type PresenceLink = {
  label: string;
  href: string;
};

export type PresenceCountry = {
  /** Rang affiché, dans l'ordre de la liste. */
  number: string;
  name: string;
  /** Nature de la présence, en une formule courte. */
  role: string;
  text: string;
  /** Pages du site consacrées à ce qui s'y passe ; absentes quand il n'y en a pas. */
  links?: PresenceLink[];
};

/**
 * Les cinq pays, au même niveau (2026-09-19).
 *
 * Le PDG a cité la France et le Cap-Vert en plus des trois pays déjà publiés,
 * dans une vidéo diffusée sur la page Facebook du groupe. La carte d'Afrique de
 * l'Ouest qui portait cette section ne pouvait pas les accueillir — la France
 * en sort, et le Cap-Vert est absent du fond de carte Natural Earth à cette
 * échelle — elle a donc été retirée au profit de cette liste.
 *
 * Ce qui est écrit de la France et du Cap-Vert s'arrête à ce qui est su : le
 * groupe y est représenté. Le détail des activités viendra du client.
 */
export const presenceCountries: PresenceCountry[] = [
  {
    number: "01",
    name: t("Guinée"),
    role: t("Point d’ancrage"),
    text: t("Siège du groupe. Baruck Communication y opère le Studio Photo Baruck la Prospérité, à Kobayah (Conakry), ainsi que ses équipes d’hôtesses événementielles."),
    links: [
      { label: t("Studio photo"), href: routes.studio },
      { label: t("Hôtesses événementielles"), href: routes.hostesses },
    ],
  },
  {
    number: "02",
    name: t("Sénégal"),
    role: t("Présence régionale"),
    text: t("C’est à Dakar que la JECA a réuni la diaspora lors de ses deux premiers forums, en 2022 et 2023."),
    links: [{ label: t("Les forums JECA"), href: routes.jeca }],
  },
  {
    number: "03",
    name: "Côte d’Ivoire",
    role: t("Présence régionale · Abidjan"),
    text: t("Terre d’engagement d’Espoir de Vie : à Grôh, Hiré, Zaroko et Divo — jouets, kits scolaires, aide aux familles et construction de l’orphelinat."),
    links: [{ label: "Espoir de Vie", href: routes.edv }],
  },
  {
    number: "04",
    name: "France",
    role: t("Représentation"),
    text: t("Le Groupe Baruck y est représenté, hors du continent africain."),
  },
  {
    number: "05",
    name: t("Cap-Vert"),
    role: t("Représentation"),
    text: t("Le Groupe Baruck y est représenté, dans l’archipel au large du Sénégal."),
  },
];
