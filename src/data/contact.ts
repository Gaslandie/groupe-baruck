import { translate as t } from "../lib/language.ts";

import { facebookPages, hqHours, hqMap } from "./coordonnees";
import { contacts, hqAddress, whatsappRequests } from "./site";

export { facebookPages, hqHours, hqMap };

export const contactSubjects = [
  t("Studio photo"),
  t("Hôtesses événementielles"),
  "JECA",
  "Espoir de Vie",
  t("Partenariat ou collaboration"),
  t("Autre demande"),
] as const;

export const contactNeeds = [
  {
    number: "01",
    title: t("Studio photo"),
    text: t("Tarifs, réservation, séance en studio ou en extérieur."),
    href: whatsappRequests.studioPrices,
    external: true,
  },
  {
    number: "02",
    title: t("Hôtesses événementielles"),
    text: t("Réserver une équipe pour votre événement."),
    href: whatsappRequests.hostessBooking,
    external: true,
  },
  {
    number: "03",
    title: "JECA",
    text: t("Participer, intervenir ou soutenir le forum."),
    href: `${contacts.email.href}?subject=JECA`,
  },
  {
    number: "04",
    title: "Espoir de Vie",
    text: t("Collaborer avec l’ONG et ses actions."),
    href: `${contacts.email.href}?subject=${encodeURIComponent("Espoir de Vie")}`,
  },
  {
    number: "05",
    title: t("Partenariat"),
    text: t("Une collaboration, un projet, une proposition."),
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
    question: t("Où se trouve le Groupe Baruck en Guinée ?"),
    answer: (t("Le siège du Groupe Baruck en Guinée se trouve à ") + String(hqAddress) + t("")),
  },
  {
    question: t("Quels sont les horaires du siège en Guinée ?"),
    // Suit hqHours : une modification des horaires ne doit pas laisser une réponse fausse.
    answer: (t("Horaires du siège en Guinée : ") + String(hqHours
      .map(({ days, hours }) => `${days} : ${hours}`)
      .join(" ; ")) + t(". Ces horaires concernent le siège, pas le studio.")),
  },
  {
    question: t("Comment réserver le studio photo ou les hôtesses ?"),
    answer: (t("Écrivez à l’équipe sur WhatsApp au ") + String(contacts.whatsappHq.value) + t(" en précisant votre besoin. Des demandes préremplies sont proposées pour le studio photo et les hôtesses événementielles.")),
  },
  {
    question: t("Comment collaborer avec Espoir de Vie ?"),
    answer: (t("Pour proposer une collaboration avec Espoir de Vie, écrivez au Groupe Baruck à ") + String(contacts.email.value) + t(".")),
  },
  {
    question: t("Dans quels pays le Groupe Baruck est-il présent ?"),
    answer: t("Le Groupe Baruck est présent en Guinée, au Sénégal, en Côte d’Ivoire, en France et au Cap-Vert. La Guinée est son point d’ancrage : le siège et les activités de Baruck Communication s’y trouvent."),
  },
];
