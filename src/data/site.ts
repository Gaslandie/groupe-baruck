import { pageValue, pageText } from "@/lib/page-content";
import { isEnglish } from "../lib/language.ts";

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

/** Intitulés partagés ; numéros et adresses conservent leur source dans Coordonnées. */
const contactLabels: Record<ContactId, string> = {
  landline: pageText("home", "common.site.1"),
  mobile: pageText("home", "common.site.2"),
  whatsappHq: pageText("home", "common.site.3"),
  whatsappCeo: pageText("home", "common.site.4"),
  email: pageText("home", "common.site.5"),
};

export const site = {
  name: pageText("home", "common.Brand.2"),
  designer: "GassTech Solutions",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaslandie.github.io/groupe-baruck/").replace(/\/?$/, "/"),
  description:
    pageText("home", "common.site.6"),
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
    pageText("home", "common.site.7"),
  ),
  hostessBooking: whatsappRequest(
    pageText("home", "common.site.8"),
  ),
} as const;

export const mainNav: NavItem[] = [
  { number: "01", label: pageText("home", "common.site.9"), href: routes.home },
  { number: "02", label: pageText("home", "common.site.10"), href: routes.group },
  {
    number: "03",
    label: pageText("home", "common.site.11"),
    shortLabel: pageText("home", "common.site.12"),
    href: routes.services,
    children: [
      { label: pageText("home", "common.site.13"), href: routes.studio, featured: true },
      { label: pageText("home", "common.site.14"), href: routes.hostesses, featured: true },
      // Les autres domaines ne sont plus listés un à un dans le menu
      // (demande du 2026-09-18) : ce lien mène à leurs cartes sur l'accueil.
      { label: pageText("home", "common.site.15"), href: routes.services, featured: true },
    ],
  },
  { number: "04", label: pageText("home", "common.site.16"), href: routes.jeca },
  { number: "05", label: pageText("home", "common.site.17"), href: routes.edv },
  {
    number: "06",
    label: pageText("home", "common.site.18"),
    href: routes.news,
    children: [
      { label: pageText("home", "common.site.19"), href: routes.news, featured: true },
      { label: pageText("home", "common.site.20"), href: routes.media, featured: true },
    ],
  },
  { number: "07", label: pageText("home", "common.site.21"), href: routes.brand },
  { number: "08", label: pageText("home", "common.site.22"), href: routes.contact },
];

export const footers = {
  home: {
    blurb:
      pageText("home", "common.site.23"),
    columns: [
      {
        title: pageText("home", "common.site.24"),
        links: [
          { label: pageText("home", "common.site.10"), href: routes.group },
          { label: pageText("home", "common.site.13"), href: routes.studio },
          { label: pageText("home", "common.site.14"), href: routes.hostesses },
          { label: pageText("home", "common.site.25"), href: "#president" },
          { label: pageText("home", "common.site.18"), href: routes.news },
        ],
      },
      {
        title: pageText("home", "common.site.26"),
        links: [
          { label: pageText("home", "common.site.16"), href: routes.jeca },
          { label: pageText("home", "common.site.17"), href: routes.edv },
          { label: pageText("home", "common.site.22"), href: routes.contact },
        ],
      },
      {
        title: pageText("home", "common.site.27"),
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
    backToTop: pageText("home", "common.site.28"),
  },
  about: {
    blurb:
      pageText("home", "common.site.23"),
    columns: [
      {
        title: pageText("home", "common.site.24"),
        links: [
          { label: pageText("home", "common.site.9"), href: routes.home },
          { label: pageText("home", "common.site.10"), href: routes.group },
          { label: pageText("home", "common.site.13"), href: routes.studio },
          { label: pageText("home", "common.site.14"), href: routes.hostesses },
          { label: pageText("home", "common.site.18"), href: routes.news },
        ],
      },
      {
        title: pageText("home", "common.site.26"),
        links: [
          { label: pageText("home", "common.site.16"), href: routes.jeca },
          { label: pageText("home", "common.site.17"), href: routes.edv },
          { label: pageText("home", "common.site.22"), href: routes.contact },
        ],
      },
      {
        title: pageText("home", "common.site.27"),
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
    backToTop: pageText("home", "common.site.29"),
  },
  service: {
    blurb:
      pageText("home", "common.site.23"),
    columns: [
      {
        title: pageText("home", "common.site.24"),
        links: [
          { label: pageText("home", "common.site.9"), href: routes.home },
          { label: pageText("home", "common.site.10"), href: routes.group },
          { label: pageText("home", "common.site.13"), href: routes.studio },
          { label: pageText("home", "common.site.14"), href: routes.hostesses },
          { label: pageText("home", "common.site.18"), href: routes.news },
        ],
      },
      {
        title: pageText("home", "common.site.26"),
        links: [
          { label: pageText("home", "common.site.16"), href: routes.jeca },
          { label: pageText("home", "common.site.17"), href: routes.edv },
          { label: pageText("home", "common.site.22"), href: routes.contact },
        ],
      },
      {
        title: pageText("home", "common.site.27"),
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
    backToTop: pageText("home", "common.site.29"),
  },
  jeca: {
    blurb:
      pageText("home", "common.site.30"),
    columns: [
      {
        title: pageText("home", "common.site.16"),
        links: [
          { label: pageText("home", "common.site.31"), href: "#vision" },
          ...pageValue<{key:string;date:{iso:string}}[]>("jeca","data.editions").map(edition=>({label:isEnglish ? `${edition.date.iso.slice(0,4)} edition` : `Édition ${edition.date.iso.slice(0,4)}`,href:`#edition-${edition.key}`})),
        ],
      },
      {
        title: pageText("home", "common.Brand.2"),
        links: [
          { label: pageText("home", "common.site.10"), href: routes.group },
          { label: pageText("home", "common.site.17"), href: routes.edv },
          { label: pageText("home", "common.site.18"), href: routes.news },
        ],
      },
      {
        title: pageText("home", "common.site.27"),
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: pageText("home", "common.site.32"),
            href: contactHrefs.whatsappHq,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: pageText("home", "common.site.28"),
  },
  edv: {
    blurb:
      pageText("home", "common.site.33"),
    columns: [
      {
        title: pageText("home", "common.site.17"),
        links: [
          { label: pageText("home", "common.site.34"), href: "#mission" },
          { label: pageText("home", "common.site.35"), href: "#orphelinat" },
          { label: pageText("home", "common.site.36"), href: "#actions" },
          { label: pageText("home", "common.site.37"), href: "#presence" },
        ],
      },
      {
        title: pageText("home", "common.Brand.2"),
        links: [
          { label: pageText("home", "common.site.10"), href: routes.group },
          { label: pageText("home", "common.site.16"), href: routes.jeca },
          { label: pageText("home", "common.site.18"), href: routes.news },
        ],
      },
      {
        title: pageText("home", "common.site.27"),
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: pageText("home", "common.site.32"),
            href: contactHrefs.whatsappHq,
            external: true,
          },
          { label: contacts.email.value, href: contactHrefs.email },
        ],
      },
    ],
    backToTop: pageText("home", "common.site.29"),
  },
} satisfies Record<FooterVariant, FooterContent>;
