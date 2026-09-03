import { contacts, whatsappRequests } from "./site";

export const contactSubjects = [
  "Studio photo",
  "Hôtesses événementielles",
  "JECA",
  "Espoir de Vie",
  "Partenariat ou collaboration",
  "Autre demande",
] as const;

export const contactNeeds = [
  {
    number: "01",
    title: "Studio photo",
    text: "Tarifs, réservation, séance en studio ou en extérieur.",
    href: whatsappRequests.studioPrices,
    external: true,
  },
  {
    number: "02",
    title: "Hôtesses événementielles",
    text: "Réserver une équipe pour votre événement.",
    href: whatsappRequests.hostessBooking,
    external: true,
  },
  {
    number: "03",
    title: "JECA",
    text: "Participer, intervenir ou soutenir le forum.",
    href: `${contacts.email.href}?subject=JECA`,
  },
  {
    number: "04",
    title: "Espoir de Vie",
    text: "Collaborer avec l’ONG et ses actions.",
    href: `${contacts.email.href}?subject=${encodeURIComponent("Espoir de Vie")}`,
  },
  {
    number: "05",
    title: "Partenariat",
    text: "Une collaboration, un projet, une proposition.",
    href: "#formulaire",
  },
] as const;
