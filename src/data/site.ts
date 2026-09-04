export type RouteKey =
  | "home"
  | "group"
  | "services"
  | "studio"
  | "hostesses"
  | "jeca"
  | "edv"
  | "news"
  | "projects"
  | "contact";

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
  jeca: "/jeca/",
  edv: "/espoir-de-vie/",
  news: "/actualites/",
  projects: "/projets-realisations/",
  contact: "/contact/",
};

const contactHrefs: Record<ContactId, string> = {
  landline: "tel:+224625197258",
  mobile: "tel:+224623546657",
  whatsappHq: "https://wa.me/224623720427",
  whatsappCeo: "https://wa.me/33755423754",
  email: "mailto:jokrasso2@gmail.com",
};

export const site = {
  name: "Groupe Baruck",
  designer: "GassTech Solutions",
  url: "https://gaslandie.github.io/groupe-baruck/",
  description:
    "Groupe Baruck — Un groupe multisectoriel porté par une vision entrepreneuriale, créative et engagée.",
};

export const hqAddress = "Kobayah, carrefour Transfo, près de la pharmacie Binta Sow, au 1er étage.";

export const contacts: Record<ContactId, ContactLink> = {
  landline: {
    label: "Téléphone fixe Baruck Siège Guinée",
    value: "+224 625 19 72 58",
    href: contactHrefs.landline,
  },
  mobile: {
    label: "Téléphone mobile",
    value: "+224 623 54 66 57",
    href: contactHrefs.mobile,
  },
  whatsappHq: {
    label: "WhatsApp Baruck Siège Guinée",
    value: "+224 623 72 04 27",
    href: contactHrefs.whatsappHq,
    external: true,
  },
  whatsappCeo: {
    label: "WhatsApp PDG",
    value: "+33 7 55 42 37 54",
    href: contactHrefs.whatsappCeo,
    external: true,
  },
  email: {
    label: "E-mail",
    value: "jokrasso2@gmail.com",
    href: contactHrefs.email,
  },
};

export const whatsappRequests = {
  studioPrices:
    "https://wa.me/224623720427?text=Bonjour%2C%20je%20souhaite%20conna%C3%AEtre%20les%20tarifs%20du%20Studio%20Photo%20Baruck.",
  hostessBooking:
    "https://wa.me/224623720427?text=Bonjour%2C%20je%20souhaite%20r%C3%A9server%20les%20h%C3%B4tesses%20%C3%A9v%C3%A9nementielles%20Baruck.",
} as const;

export const mainNav: NavItem[] = [
  { number: "01", label: "Accueil", href: routes.home },
  { number: "02", label: "Le Groupe", href: routes.group },
  {
    number: "03",
    label: "Nos services",
    shortLabel: "Services",
    href: routes.services,
    children: [
      { label: "Studio photo", href: routes.studio, featured: true },
      { label: "Hôtesses événementielles", href: routes.hostesses, featured: true },
      { label: "Hôtellerie", href: "/#hotellerie" },
      { label: "Restauration", href: "/#restauration" },
      { label: "Agro-business", href: "/#agrobusiness" },
      { label: "Studio d’enregistrement", href: "/#studio" },
      { label: "Cinéma", href: "/#cinema" },
      { label: "Voitures de luxe", href: "/#mobilite" },
      { label: "Communication digitale", href: "/#communication" },
      { label: "Production d’artistes", href: "/#artistes" },
      { label: "Clips vidéo", href: "/#clips" },
    ],
  },
  { number: "04", label: "JECA", href: routes.jeca },
  { number: "05", label: "Espoir de Vie", href: routes.edv },
  { number: "06", label: "Actualités", href: routes.news },
  { number: "07", label: "Contact", href: routes.contact },
];

export const sideNavContacts: ContactLink[] = [
  contacts.landline,
  contacts.whatsappHq,
  contacts.whatsappCeo,
  contacts.mobile,
  contacts.email,
];

export const footers = {
  home: {
    blurb:
      "Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal et en Côte d’Ivoire.",
    columns: [
      {
        title: "Navigation",
        links: [
          { label: "Le Groupe", href: routes.group },
          { label: "Studio photo", href: routes.studio },
          { label: "Hôtesses événementielles", href: routes.hostesses },
          { label: "Le PDG", href: "#president" },
          { label: "Actualités", href: routes.news },
        ],
      },
      {
        title: "Engagements",
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: "Contact direct",
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
      "Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal et en Côte d’Ivoire.",
    columns: [
      {
        title: "Navigation",
        links: [
          { label: "Accueil", href: routes.home },
          { label: "Le Groupe", href: routes.group },
          { label: "Studio photo", href: routes.studio },
          { label: "Hôtesses événementielles", href: routes.hostesses },
          { label: "Actualités", href: routes.news },
        ],
      },
      {
        title: "Engagements",
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: "Contact direct",
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
      "Un groupe multisectoriel porté par la vision, l’excellence et l’impact, présent en Guinée, au Sénégal et en Côte d’Ivoire.",
    columns: [
      {
        title: "Navigation",
        links: [
          { label: "Accueil", href: routes.home },
          { label: "Le Groupe", href: routes.group },
          { label: "Studio photo", href: routes.studio },
          { label: "Hôtesses événementielles", href: routes.hostesses },
          { label: "Actualités", href: routes.news },
        ],
      },
      {
        title: "Engagements",
        links: [
          { label: "JECA", href: routes.jeca },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Contact", href: routes.contact },
        ],
      },
      {
        title: "Contact direct",
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
      "Créée en 2019, la JECA œuvre pour sensibiliser la diaspora africaine à l’investissement en Afrique.",
    columns: [
      {
        title: "JECA",
        links: [
          { label: "La vision", href: "#vision" },
          { label: "Édition 2022", href: "#edition-1" },
          { label: "Édition 2023", href: "#edition-2" },
          { label: "Édition 2026", href: "#edition-3" },
        ],
      },
      {
        title: "Groupe Baruck",
        links: [
          { label: "Le Groupe", href: routes.group },
          { label: "Espoir de Vie", href: routes.edv },
          { label: "Actualités", href: routes.news },
        ],
      },
      {
        title: "Contact direct",
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: "WhatsApp Baruck Guinée",
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
      "Espoir de Vie agit en faveur des enfants, des familles et des personnes vulnérables en Afrique de l’Ouest.",
    columns: [
      {
        title: "Espoir de Vie",
        links: [
          { label: "Notre mission", href: "#mission" },
          { label: "L’orphelinat", href: "#orphelinat" },
          { label: "Nos actions", href: "#actions" },
          { label: "Notre présence", href: "#presence" },
        ],
      },
      {
        title: "Groupe Baruck",
        links: [
          { label: "Le Groupe", href: routes.group },
          { label: "JECA", href: routes.jeca },
          { label: "Actualités", href: routes.news },
        ],
      },
      {
        title: "Contact direct",
        links: [
          { label: contacts.landline.value, href: contactHrefs.landline },
          {
            label: "WhatsApp Baruck Guinée",
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
