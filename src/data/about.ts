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
    title: "Premières actions de solidarité",
    text: "À Grôh, mille jouets sont remis aux enfants du village autour d’un arbre de Noël et d’un moment de partage.",
    href: "/espoir-de-vie/#actions",
  },
  {
    year: "2016",
    dateTime: "2016",
    title: "Protection de l’enfant",
    text: "MR Djoro Joël Shaloom Krasso exerce la fonction d’agent de développement pour la protection de l’enfant au sein des Nations Unies.",
    href: "#experience-onu",
  },
  {
    year: "2017",
    dateTime: "2017-02-11",
    title: "Premiers pensionnaires",
    text: "L’orphelinat accueille ses premiers enfants avant son inauguration officielle.",
    href: "/espoir-de-vie/#orphelinat",
  },
  {
    year: "2019",
    dateTime: "2019",
    title: "Création de la JECA",
    text: "La JECA est créée pour sensibiliser la diaspora africaine à l’investissement en Afrique.",
    href: "/jeca/#vision",
  },
  {
    year: "2022",
    dateTime: "2022-08-04",
    title: "Première édition de la JECA",
    text: "La première édition se tient à Dakar, du 04 au 14 août 2022.",
    href: "/jeca/#edition-1",
  },
  {
    year: "2023",
    dateTime: "2023-12-02",
    title: "Deuxième édition de la JECA",
    text: "La deuxième édition se tient à Dakar, du 02 au 08 décembre 2023.",
    href: "/jeca/#edition-2",
  },
  {
    year: "2026",
    dateTime: "2026-07-30",
    title: "Troisième édition de la JECA",
    text: "La troisième édition se tient à Conakry, du 30 juillet au 04 août 2026.",
    href: "/jeca/#edition-3",
  },
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
  eyebrow: "Pôle opérationnel · Guinée",
  name: "Baruck Communication",
  description:
    "Baruck Communication est une maison de communication, pas une agence de mannequinat : la distinction est celle du PDG lui-même. En Guinée, elle opère le Studio Photo Baruck la Prospérité et les services d’hôtesses événementielles présentés sur ce site, et organise les rendez-vous du groupe.",
  presence: "Guinée",
  servicesLabel: "Studio photo · Hôtesses événementielles · Événements",
  services: [
    {
      title: "Studio Photo Baruck la Prospérité",
      text: "Deux studios équipés à Kobayah, à Conakry, pour des prises de vue au studio comme en extérieur.",
      href: routes.studio,
      cta: "Découvrir le studio",
    },
    {
      title: "Hôtesses événementielles",
      text: "Une équipe élégante, professionnelle et dynamique pour la couverture de différents événements en Guinée.",
      href: routes.hostesses,
      cta: "Découvrir les hôtesses",
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
    name: "Guinée",
    role: "Point d’ancrage",
    text: "Siège du groupe. Baruck Communication y opère le Studio Photo Baruck la Prospérité, à Kobayah (Conakry), ainsi que ses équipes d’hôtesses événementielles.",
    links: [
      { label: "Studio photo", href: routes.studio },
      { label: "Hôtesses événementielles", href: routes.hostesses },
    ],
  },
  {
    number: "02",
    name: "Sénégal",
    role: "Présence régionale",
    text: "C’est à Dakar que la JECA a réuni la diaspora lors de ses deux premiers forums, en 2022 et 2023.",
    links: [{ label: "Les forums JECA", href: routes.jeca }],
  },
  {
    number: "03",
    name: "Côte d’Ivoire",
    role: "Présence régionale · Abidjan",
    text: "Terre d’engagement d’Espoir de Vie : à Grôh, Hiré, Zaroko et Divo — jouets, kits scolaires, aide aux familles et construction de l’orphelinat.",
    links: [{ label: "Espoir de Vie", href: routes.edv }],
  },
  {
    number: "04",
    name: "France",
    role: "Représentation",
    text: "Le Groupe Baruck y est représenté, hors du continent africain.",
  },
  {
    number: "05",
    name: "Cap-Vert",
    role: "Représentation",
    text: "Le Groupe Baruck y est représenté, dans l’archipel au large du Sénégal.",
  },
];
