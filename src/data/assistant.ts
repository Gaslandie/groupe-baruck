import { contactNeeds, hqHours } from "./contact";
import { edvCountries, edvPillars, edvTimeline } from "./espoir-de-vie";
import { activities, pageTeasers } from "./home";
import { jecaEditions } from "./jeca";
import { hostessOffers, hostessTags, studioFaq, studioPriceGroups } from "./services";
import { contacts, footers, hqAddress, routes, site, whatsappRequests } from "./site";

/*
 * Arbre de conversation de l'assistant guidé (docs/benchmark-chatbox-2026-09-06.md, § 5.2).
 * Règle : aucune réponse n'invente un contenu. Chaque texte vient d'une donnée déjà publiée
 * (src/data/*) ou la reformule sans ajouter de chiffre, de date ni de dénomination.
 */

export type AssistantNodeId =
  | "start"
  | "encore"
  | "humain"
  | "studio"
  | "studio-tarifs"
  | "studio-rendez-vous"
  | "studio-adresse"
  | "studio-deplacement"
  | "studio-identite"
  | "studio-anniversaire"
  | "hotesses"
  | "hotesses-offres"
  | "hotesses-evenements"
  | "hotesses-reserver"
  | "jeca"
  | "jeca-presentation"
  | "jeca-editions"
  | "jeca-participer"
  | "edv"
  | "edv-mission"
  | "edv-orphelinat"
  | "edv-presence"
  | "edv-collaborer"
  | "groupe"
  | "groupe-presentation"
  | "groupe-presence"
  | "groupe-pdg"
  | "contact"
  | "contact-adresse"
  | "contact-telephone"
  | "contact-email";

export type AssistantTopicId = "studio" | "hotesses" | "jeca" | "edv" | "groupe" | "contact";

export type AssistantOption =
  | { label: string; next: AssistantNodeId }
  | { label: string; href: string; external?: boolean };

export type AssistantNode = {
  /** Un élément = une bulle. Les retours à la ligne sont conservés. */
  messages: string[];
  options: AssistantOption[];
};

export const assistantMeta = {
  name: "Assistant Baruck",
  tagline: "Réponses automatiques · aucune donnée collectée",
  launcher: "Assistant",
  openLabel: "Ouvrir l’assistant",
  closeLabel: "Fermer l’assistant",
  restartLabel: "Recommencer",
  humanLabel: "Parler à quelqu’un",
  botSpeaker: "Assistant",
  userSpeaker: "Vous",
  typingLabel: "L’assistant rédige une réponse",
} as const;

const faq = (question: string): string => {
  const item = studioFaq.find((entry) => entry.question === question);
  if (!item) throw new Error(`FAQ studio introuvable : ${question}`);
  return item.answer;
};

const teaser = (id: string): string => {
  const item = pageTeasers.find((entry) => entry.id === id);
  if (!item) throw new Error(`Aperçu introuvable : ${id}`);
  return item.text;
};

const need = (title: string): string => {
  const item = contactNeeds.find((entry) => entry.title === title);
  if (!item) throw new Error(`Besoin de contact introuvable : ${title}`);
  return item.text;
};

const timelineDate = (title: string): string => {
  const item = edvTimeline.find((entry) => entry.title === title);
  if (!item?.date) throw new Error(`Date de frise introuvable : ${title}`);
  return item.date.label;
};

const priceLines = studioPriceGroups.map(
  (group) =>
    `${group.title}\n` +
    group.items
      .map((item) => `• ${item.label} : ${item.price}${item.note ? ` (${item.note.toLowerCase()})` : ""}`)
      .join("\n"),
);

const hoursLine = hqHours.map((slot) => `${slot.days} : ${slot.hours.toLowerCase()}`).join(" · ");

const jecaEmail = `${contacts.email.href}?subject=JECA`;
const edvEmail = `${contacts.email.href}?subject=${encodeURIComponent("Espoir de Vie")}`;
const formHref = `${routes.contact}#formulaire`;

const topics: { id: AssistantTopicId; label: string }[] = [
  { id: "studio", label: "Studio photo" },
  { id: "hotesses", label: "Hôtesses événementielles" },
  { id: "jeca", label: "JECA" },
  { id: "edv", label: "Espoir de Vie" },
  { id: "groupe", label: "Le Groupe" },
  { id: "contact", label: "Nous joindre" },
];

const topicOptions: AssistantOption[] = topics.map((topic) => ({ label: topic.label, next: topic.id }));

const backOptions = (topic: AssistantTopicId, topicLabel: string, href: string, pageLabel: string): AssistantOption[] => [
  { label: `Autres questions · ${topicLabel}`, next: topic },
  { label: pageLabel, href },
  { label: "Autre sujet", next: "start" },
];

const studioBack = backOptions("studio", "Studio photo", routes.studio, "Voir la page Studio photo");
const hostessesBack = backOptions("hotesses", "Hôtesses", routes.hostesses, "Voir la page Hôtesses");
const jecaBack = backOptions("jeca", "JECA", routes.jeca, "Voir la page JECA");
const edvBack = backOptions("edv", "Espoir de Vie", routes.edv, "Voir la page Espoir de Vie");
const groupBack = backOptions("groupe", "Le Groupe", routes.group, "Voir la page Le Groupe");
const contactBack = backOptions("contact", "Nous joindre", routes.contact, "Voir la page Contact");

export const assistantNodes: Record<AssistantNodeId, AssistantNode> = {
  start: {
    messages: [
      `Bonjour, je suis l’assistant automatique du ${site.name}. Je réponds aux questions les plus fréquentes à partir des informations du site.`,
      "Choisissez un sujet ci-dessous. Pour tout le reste, l’équipe vous répond directement sur WhatsApp, par téléphone ou par e-mail.",
    ],
    options: topicOptions,
  },

  encore: {
    messages: ["Je reste disponible ici. Souhaitez-vous autre chose ?"],
    options: topicOptions,
  },

  humain: {
    messages: ["L’équipe du Groupe Baruck vous répond directement par le canal de votre choix."],
    options: [
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, href: contacts.whatsappHq.href, external: true },
      { label: `Appeler · ${contacts.landline.value}`, href: contacts.landline.href },
      { label: `E-mail · ${contacts.email.value}`, href: contacts.email.href },
      { label: "Formulaire de contact", href: formHref },
      { label: "Retour aux sujets", next: "start" },
    ],
  },

  /* ---------- Studio photo ---------- */
  studio: {
    messages: [teaser("apercu-studio")],
    options: [
      { label: "Les tarifs", next: "studio-tarifs" },
      { label: "Rendez-vous et horaires", next: "studio-rendez-vous" },
      { label: "Où se trouve le studio ?", next: "studio-adresse" },
      { label: "Déplacement et matériel", next: "studio-deplacement" },
      { label: "Photo d’identité", next: "studio-identite" },
      { label: "Anniversaires d’enfants", next: "studio-anniversaire" },
    ],
  },
  "studio-tarifs": {
    messages: [...priceLines, "Pour un devis précis, écrivez directement au studio sur WhatsApp."],
    options: [
      { label: "Demander un tarif sur WhatsApp", href: whatsappRequests.studioPrices, external: true },
      { label: "Voir la grille complète", href: `${routes.studio}#tarifs` },
      { label: "Autres questions · Studio photo", next: "studio" },
      { label: "Autre sujet", next: "start" },
    ],
  },
  "studio-rendez-vous": {
    messages: [faq("Faut-il prendre rendez-vous ?"), faq("Quand le studio est-il ouvert ?")],
    options: studioBack,
  },
  "studio-adresse": {
    messages: [faq("Où se trouve le studio ?")],
    options: [
      { label: "Itinéraire et carte", href: `${routes.contact}#carte` },
      ...studioBack,
    ],
  },
  "studio-deplacement": {
    messages: [
      faq("Vous déplacez-vous en dehors du studio ?"),
      faq("Le matériel du studio peut-il venir sur mon événement ?"),
    ],
    options: studioBack,
  },
  "studio-identite": {
    messages: [faq("Combien coûte une photo d’identité et quand est-elle remise ?")],
    options: studioBack,
  },
  "studio-anniversaire": {
    messages: [faq("Proposez-vous des anniversaires pour enfants ?")],
    options: studioBack,
  },

  /* ---------- Hôtesses ---------- */
  hotesses: {
    messages: [teaser("apercu-hostesses")],
    options: [
      { label: "Que proposent les hôtesses ?", next: "hotesses-offres" },
      { label: "Pour quels événements ?", next: "hotesses-evenements" },
      { label: "Comment réserver ?", next: "hotesses-reserver" },
    ],
  },
  "hotesses-offres": {
    messages: hostessOffers.map((offer) => `${offer.title} : ${offer.text}`),
    options: hostessesBack,
  },
  "hotesses-evenements": {
    messages: [`${hostessTags.join(" · ")}.`],
    options: [{ label: "Comment réserver ?", next: "hotesses-reserver" }, ...hostessesBack],
  },
  "hotesses-reserver": {
    messages: [
      `${need("Hôtesses événementielles")} Écrivez au siège de Baruck en Guinée sur WhatsApp, ou appelez le fixe.`,
    ],
    options: [
      { label: "Réserver sur WhatsApp", href: whatsappRequests.hostessBooking, external: true },
      { label: `Appeler · ${contacts.landline.value}`, href: contacts.landline.href },
      ...hostessesBack,
    ],
  },

  /* ---------- JECA ---------- */
  jeca: {
    messages: ["JECA · Jeunes Entrepreneurs Chrétiens Africains."],
    options: [
      { label: "Qu’est-ce que la JECA ?", next: "jeca-presentation" },
      { label: "Les éditions", next: "jeca-editions" },
      { label: "Participer ou intervenir", next: "jeca-participer" },
    ],
  },
  "jeca-presentation": {
    messages: [footers.jeca.blurb, teaser("apercu-jeca")],
    options: [{ label: "Les éditions", next: "jeca-editions" }, ...jecaBack],
  },
  "jeca-editions": {
    messages: jecaEditions.map(
      (edition) =>
        `Édition ${edition.edition} · ${edition.place} · ${edition.date.label}.\n${edition.story?.lead ?? edition.simpleLead ?? ""}`.trim(),
    ),
    options: [{ label: "Voir les galeries", href: `${routes.jeca}#editions` }, ...jecaBack],
  },
  "jeca-participer": {
    messages: [`${need("JECA")} Écrivez à l’équipe par e-mail en précisant votre demande, ou sur WhatsApp.`],
    options: [
      { label: "Écrire un e-mail · objet JECA", href: jecaEmail },
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, href: contacts.whatsappHq.href, external: true },
      ...jecaBack,
    ],
  },

  /* ---------- Espoir de Vie ---------- */
  edv: {
    messages: [footers.edv.blurb],
    options: [
      { label: "La mission", next: "edv-mission" },
      { label: "L’orphelinat", next: "edv-orphelinat" },
      { label: "Où agit Espoir de Vie ?", next: "edv-presence" },
      { label: "Collaborer", next: "edv-collaborer" },
    ],
  },
  "edv-mission": {
    messages: [
      teaser("apercu-edv"),
      edvPillars.map((pillar) => `• ${pillar.title} : ${pillar.text}`).join("\n"),
    ],
    options: edvBack,
  },
  "edv-orphelinat": {
    messages: [
      `Les premiers pensionnaires ont été accueillis le ${timelineDate("Premiers pensionnaires")}, avant l’inauguration officielle le ${timelineDate("Inauguration")}.`,
    ],
    options: [{ label: "L’histoire de l’orphelinat", href: `${routes.edv}#orphelinat` }, ...edvBack],
  },
  "edv-presence": {
    messages: edvCountries.map((country) => `${country.title} : ${country.text}`),
    options: edvBack,
  },
  "edv-collaborer": {
    messages: [`${need("Espoir de Vie")} Écrivez à l’équipe par e-mail en précisant votre proposition.`],
    options: [
      { label: "Écrire un e-mail · objet Espoir de Vie", href: edvEmail },
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, href: contacts.whatsappHq.href, external: true },
      ...edvBack,
    ],
  },

  /* ---------- Le Groupe ---------- */
  groupe: {
    messages: [site.description],
    options: [
      { label: "Les domaines d’activité", next: "groupe-presentation" },
      { label: "Où est présent le Groupe ?", next: "groupe-presence" },
      { label: "Le PDG", next: "groupe-pdg" },
      { label: "Les actualités", href: routes.news },
    ],
  },
  "groupe-presentation": {
    messages: [
      `${activities.length} domaines d’activité :\n${activities.map((activity) => `• ${activity.title}`).join("\n")}`,
    ],
    options: [{ label: "Voir les activités", href: routes.services }, ...groupBack],
  },
  "groupe-presence": {
    messages: [footers.home.blurb],
    options: [{ label: "Notre présence", href: `${routes.group}#presence` }, ...groupBack],
  },
  "groupe-pdg": {
    messages: [teaser("apercu-about")],
    options: [{ label: "Découvrir le PDG", href: `${routes.home}#president` }, ...groupBack],
  },

  /* ---------- Contact ---------- */
  contact: {
    messages: ["Comment souhaitez-vous nous joindre ?"],
    options: [
      { label: "Adresse et horaires", next: "contact-adresse" },
      { label: "Téléphone et WhatsApp", next: "contact-telephone" },
      { label: "E-mail et formulaire", next: "contact-email" },
    ],
  },
  "contact-adresse": {
    messages: [`Siège : ${hqAddress}`, `Horaires · ${hoursLine}.`],
    options: [{ label: "Itinéraire et carte", href: `${routes.contact}#carte` }, ...contactBack],
  },
  "contact-telephone": {
    messages: [
      `${contacts.landline.label} : ${contacts.landline.value}`,
      `${contacts.whatsappHq.label} : ${contacts.whatsappHq.value}`,
    ],
    options: [
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, href: contacts.whatsappHq.href, external: true },
      { label: `Appeler · ${contacts.landline.value}`, href: contacts.landline.href },
      { label: `Mobile · ${contacts.mobile.value}`, href: contacts.mobile.href },
      ...contactBack,
    ],
  },
  "contact-email": {
    messages: [`${contacts.email.label} : ${contacts.email.value}`, "Le formulaire du site transmet votre message à l’équipe."],
    options: [
      { label: `Écrire · ${contacts.email.value}`, href: contacts.email.href },
      { label: "Formulaire de contact", href: formHref },
      ...contactBack,
    ],
  },
};

/** Sujet mis en avant selon la page courante (pathname sans basePath). */
export const topicByPath: { prefix: string; topic: AssistantTopicId }[] = [
  { prefix: routes.studio, topic: "studio" },
  { prefix: routes.hostesses, topic: "hotesses" },
  { prefix: routes.jeca, topic: "jeca" },
  { prefix: routes.edv, topic: "edv" },
  { prefix: routes.group, topic: "groupe" },
  { prefix: routes.contact, topic: "contact" },
];

/** Options de départ, sujet de la page courante en premier. */
export function startOptionsFor(pathname: string | null): AssistantOption[] {
  const match = pathname ? topicByPath.find((entry) => pathname.startsWith(entry.prefix)) : undefined;
  if (!match) return topicOptions;
  const first = topicOptions.find((option) => "next" in option && option.next === match.topic);
  if (!first) return topicOptions;
  return [first, ...topicOptions.filter((option) => option !== first)];
}

export function isAssistantNodeId(value: unknown): value is AssistantNodeId {
  return typeof value === "string" && value in assistantNodes;
}
