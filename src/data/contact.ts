import { contacts, hqAddress, whatsappRequests } from "./site";

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

export const hqHours = [
  { days: "Lundi – Samedi", hours: "8h – 17h" },
  { days: "Dimanche", hours: "Fermé" },
] as const;

export const facebookPages = [
  { country: "Guinée", href: "https://www.facebook.com/profile.php?id=61583266386159" },
  { country: "Sénégal", href: "https://www.facebook.com/Baruckcommunicationsenegal" },
  { country: "Côte d’Ivoire", href: "https://www.facebook.com/BaruckCommunication" },
] as const;

export const hqMap = {
  query: "Kobayah, Conakry, Guinée",
  embedUrl: "https://www.google.com/maps?q=Kobayah%2C+Conakry%2C+Guin%C3%A9e&z=15&output=embed",
  directionsUrl: "https://www.google.com/maps/search/?api=1&query=Kobayah%2C+Conakry%2C+Guin%C3%A9e",
} as const;

type ContactFaqItem = {
  question: string;
  answer: string;
};

/** FAQ de la page Contact : uniquement des informations déjà publiées sur le site. */
export const contactFaq: ContactFaqItem[] = [
  {
    question: "Où se trouve le Groupe Baruck en Guinée ?",
    answer: `Le siège du Groupe Baruck en Guinée se trouve à ${hqAddress}`,
  },
  {
    question: "Quels sont les horaires du siège en Guinée ?",
    // Reprend hqHours (Lundi – Samedi 8h – 17h, Dimanche fermé) : le siège seulement, pas le studio.
    answer: "Le siège est ouvert du lundi au samedi de 8h à 17h et fermé le dimanche.",
  },
  {
    question: "Comment réserver le studio photo ou les hôtesses ?",
    answer: `Écrivez à l’équipe sur WhatsApp au ${contacts.whatsappHq.value} en précisant votre besoin. Des demandes préremplies sont proposées pour le studio photo et les hôtesses événementielles.`,
  },
  {
    question: "Comment collaborer avec Espoir de Vie ?",
    answer: `Pour proposer une collaboration avec Espoir de Vie, écrivez au Groupe Baruck à ${contacts.email.value}.`,
  },
  {
    question: "Dans quels pays le Groupe Baruck est-il présent ?",
    answer: "La présence du Groupe Baruck est validée en Guinée, au Sénégal et en Côte d’Ivoire.",
  },
];
