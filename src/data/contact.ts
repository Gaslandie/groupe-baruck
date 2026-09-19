import { facebookPages, hqHours, hqMap } from "./coordonnees";
import { contacts, hqAddress, whatsappRequests } from "./site";

export { facebookPages, hqHours, hqMap };

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
    // Suit hqHours : une modification des horaires ne doit pas laisser une réponse fausse.
    answer: `Horaires du siège en Guinée : ${hqHours
      .map(({ days, hours }) => `${days} : ${hours}`)
      .join(" ; ")}. Ces horaires concernent le siège, pas le studio.`,
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
    answer: "Le Groupe Baruck est présent en Guinée, au Sénégal, en Côte d’Ivoire, en France et au Cap-Vert. La Guinée est son point d’ancrage : le siège et les activités de Baruck Communication s’y trouvent.",
  },
];
