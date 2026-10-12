import { translate as t } from "../lib/language.ts";

import { contactValues, mailtoHref, telHref, whatsappHref } from "./coordonnees";

export { hqAddress } from "./coordonnees";

export type RouteKey =
  | "home"
  | "group"
  | "services"
  | "studio"
  | "hostesses"
  | "brand"
  | "jeca"
  | "edv"
  | "news"
  | "projects"
  | "contact"
  | "legal"
  | "media";

export type ContactId =
  | "landline"
  | "mobile"
  | "whatsappHq"
  | "whatsappCeo"
  | "email";

export type ContactLink = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
};

export type NavItem = {
  number: `${number}${number}`;
  label: string;
  href: string;
  shortLabel?: string;
  children?: (Omit<NavItem, "number" | "children"> & { featured?: boolean })[];
};

export type FooterLink = {
  label: string;
  href: string;
  external?: boolean;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export type FooterContent = {
  blurb: string;
  columns: FooterColumn[];
  backToTop: string;
};

export type FooterVariant = "home" | "about" | "service" | "jeca" | "edv";

export const routes: Record<RouteKey, string> = {
  home: "/",
  group: "/groupe/",
  services: "/#activites",
  studio: "/studio-photo/",
  hostesses: "/hotesses-evenementielles/",
  brand: "/marque-baruck/",
  jeca: "/jeca/",
  edv: "/espoir-de-vie/",
  news: "/actualites/",
  projects: "/projets-realisations/",
  contact: "/contact/",
  legal: "/mentions-legales/",
  media: "/mediatheque/",
};

const contactHrefs: Record<ContactId, string> = {
  landline: telHref(contactValues.landline),
  mobile: telHref(contactValues.mobile),
  whatsappHq: whatsappHref(contactValues.whatsappHq),
  whatsappCeo: whatsappHref(contactValues.whatsappCeo),
  email: mailtoHref(contactValues.email),
};

/** Intitulés des lignes de contact : nomenclature du site, pas une donnée modifiable. */
const contactLabels: Record<ContactId, string> = {
  landline: t("Téléphone fixe Baruck Siège Guinée"),
  mobile: t("Téléphone mobile"),
  whatsappHq: t("WhatsApp Baruck Siège Guinée"),
  whatsappCeo: t("WhatsApp PDG"),
  email: t("E-mail"),
};

export const site = {
  name: "Groupe Baruck",
  designer: "GassTech Solutions",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaslandie.github.io/groupe-baruck/").replace(/\/?$/, "/"),
  description:
    t("Groupe Baruck — Un groupe multisectoriel porté par une vision entrepreneuriale, créative et engagée."),
};

export const contacts: Record<ContactId, ContactLink> = {
  landline: { label: contactLabels.landline, value: contactValues.landline, href: contactHrefs.landline },
  mobile: { label: contactLabels.mobile, value: contactValues.mobile, href: contactHrefs.mobile },
  whatsappHq: { label: contactLabels.whatsappHq, value: contactValues.whatsappHq, href: contactHrefs.whatsappHq, external: true },
  whatsappCeo: { label: contactLabels.whatsappCeo, value: contactValues.whatsappCeo, href: contactHrefs.whatsappCeo, external: true },
  email: { label: contactLabels.email, value: contactValues.email, href: contactHrefs.email },
};

/** Demandes préremplies : le texte appartient au site, le numéro aux coordonnées. */
const whatsappRequest = (text: string) =>
  `${contactHrefs.whatsappHq}?text=${encodeURIComponent(text)}`;

export const whatsappRequests = {
  studioPrices: whatsappRequest(
    t("Bonjour, je souhaite connaître les tarifs du Studio Photo Baruck."),
  ),
  hostessBooking: whatsappRequest(
    t("Bonjour, je souhaite réserver les hôtesses événementielles Baruck."),
  ),
} as const;

export const mainNav: NavItem[] = [
  { number: "01", label: t("Accueil"), href: routes.home },
  { number: "02", label: t("Le Groupe"), href: routes.group },
  {
    number: "03",
    label: t("Nos services"),
    shortLabel: "Services",
    href: routes.services,
    children: [
      { label: t("Studio photo"), href: routes.studio, featured: true },
      { label: t("Hôtesses événementielles"), href: routes.hostesses, featured: true },
      // Les autres domaines ne sont plus listés un à un dans le menu
      // (demande du 2026-09-18) : ce lien mène à leurs cartes sur l'accueil.
      { label: t("Nos autres services"), href: routes.services, featured: true },
    ],
  },
  { number: "04", label: "JECA", href: routes.jeca },
  { number: "05", label: "Espoir de Vie", href: routes.edv },
  {
    number: "06",
    label: t("Actualités"),
    href: routes.news,
    children: [
      { label: t("Toutes les actualités"), href: routes.news, featured: true },
      { label: t("Médiathèque"), href: routes.media, featured: true },
    ],
  },
  { number: "07", label: t("La marque"), href: routes.brand },
  { number: "08", label: "Contact", href: routes.contact },
];

export const footers = {
  home: {
    blurb:
      t("Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal, en Côte d’Ivoire, en France et au Cap-Vert."),
    columns: [
      {
        title: "Navigation",
        links: [
          { label: t("Le Groupe"), href: routes.group },
          { label: t("Studio photo"), href: routes.studio },
          { label: t("Hôtesses événementielles"), href: routes.hostesses },
          { label: t("Le PDG"), href: "#president" },
          { label: t("Actualités"), href: routes.news },
        ],
      },
      {
        title: t("Engagements"),
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: t("Contact direct"),
        links: [
          { label: contacts.landline.label, href: contactHrefs.landline },
          {
            label: contacts.whatsappHq.label,
            href: contactHrefs.whatsappHq,
            external: true,
          },
          {
            label: contacts.whatsappCeo.label,
            href: contactHrefs.whatsappCeo,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: "#accueil",
  },
  about: {
    blurb:
      t("Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal, en Côte d’Ivoire, en France et au Cap-Vert."),
    columns: [
      {
        title: "Navigation",
        links: [
          { label: t("Accueil"), href: routes.home },
          { label: t("Le Groupe"), href: routes.group },
          { label: t("Studio photo"), href: routes.studio },
          { label: t("Hôtesses événementielles"), href: routes.hostesses },
          { label: t("Actualités"), href: routes.news },
        ],
      },
      {
        title: t("Engagements"),
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: t("Contact direct"),
        links: [
          { label: contacts.landline.label, href: contactHrefs.landline },
          {
            label: contacts.whatsappHq.label,
            href: contactHrefs.whatsappHq,
            external: true,
          },
          {
            label: contacts.whatsappCeo.label,
            href: contactHrefs.whatsappCeo,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: "#top",
  },
  service: {
    blurb:
      t("Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal, en Côte d’Ivoire, en France et au Cap-Vert."),
    columns: [
      {
        title: "Navigation",
        links: [
          { label: t("Accueil"), href: routes.home },
          { label: t("Le Groupe"), href: routes.group },
          { label: t("Studio photo"), href: routes.studio },
          { label: t("Hôtesses événementielles"), href: routes.hostesses },
          { label: t("Actualités"), href: routes.news },
        ],
      },
      {
        title: t("Engagements"),
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: t("Contact direct"),
        links: [
          { label: contacts.landline.label, href: contactHrefs.landline },
          {
            label: contacts.whatsappHq.label,
            href: contactHrefs.whatsappHq,
            external: true,
          },
          {
            label: contacts.whatsappCeo.label,
            href: contactHrefs.whatsappCeo,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: "#top",
  },
  jeca: {
    blurb:
      t("Créée en 2019, la JECA œuvre pour sensibiliser la diaspora africaine à l’investissement en Afrique."),
    columns: [
      {
        title: "JECA",
        links: [
          { label: t("La vision"), href: "#vision" },
          { label: t("Édition 2022"), href: "#edition-1" },
          { label: t("Édition 2023"), href: "#edition-2" },
          { label: t("Édition 2026"), href: "#edition-3" },
        ],
      },
      {
        title: "Groupe Baruck",
        links: [
          { label: t("Le Groupe"), href: routes.group },
          { label: "Espoir de Vie", href: routes.edv },
          { label: t("Actualités"), href: routes.news },
        ],
      },
      {
        title: t("Contact direct"),
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: t("WhatsApp Baruck Guinée"),
            href: contactHrefs.whatsappHq,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: "#accueil",
  },
  edv: {
    blurb:
      t("Espoir de Vie agit en faveur des enfants, des familles et des personnes vulnérables en Afrique de l’Ouest."),
    columns: [
      {
        title: "Espoir de Vie",
        links: [
          { label: t("Notre mission"), href: "#mission" },
          { label: t("L’orphelinat"), href: "#orphelinat" },
          { label: t("Nos actions"), href: "#actions" },
          { label: t("Notre présence"), href: "#presence" },
        ],
      },
      {
        title: "Groupe Baruck",
        links: [
          { label: t("Le Groupe"), href: routes.group },
          { label: "JECA", href: routes.jeca },
          { label: t("Actualités"), href: routes.news },
        ],
      },
      {
        title: t("Contact direct"),
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: t("WhatsApp Baruck Guinée"),
            href: contactHrefs.whatsappHq,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: "#top",
  },
} satisfies Record<FooterVariant, FooterContent>;
