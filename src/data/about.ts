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
    text: "À Grôh, cent jouets sont remis aux enfants du village autour d’un arbre de Noël et d’un moment de partage.",
    href: "/espoir-de-vie/#actions",
  },
  {
    year: "2016",
    dateTime: "2016",
    title: "Protection de l’enfant",
    text: "Djoro Joël Shaloom Krasso exerce la fonction d’agent de développement pour la protection de l’enfant au sein des Nations Unies.",
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
