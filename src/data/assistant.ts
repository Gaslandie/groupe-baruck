import { contactNeeds, hqHours } from "./contact";
import { edvCountries, edvPillars, edvTimeline } from "./espoir-de-vie";
import { activities, pageTeasers } from "./home";
import { jecaEditions } from "./jeca";
import { hostessOffers, hostessTags, studioFaq, studioPriceGroups } from "./services";
import { contacts, footers, hqAddress, routes, site, whatsappRequests } from "./site";

/*
 * Arbre de conversation de l'assistant guidé (docs/benchmark-chatbox-2026-09-06.md, § 5.2 et § 9).
 * Règle : aucune réponse n'invente un contenu. Chaque texte vient d'une donnée déjà publiée
 * (src/data/*) ou la reformule sans ajouter de chiffre, de date ni de dénomination.
 * Les mots-clés servent à la recherche locale sur la saisie libre (src/lib/assistant-search.ts).
 */

export type AssistantTopicId = "studio" | "hotesses" | "jeca" | "edv" | "groupe" | "contact";

export type AssistantNodeId =
  | "start"
  | "encore"
  | "humain"
  | "inconnu"
  | "plusieurs"
  | AssistantTopicId
  | "studio-tarifs"
  | "studio-rendez-vous"
  | "studio-adresse"
  | "studio-deplacement"
  | "studio-identite"
  | "studio-anniversaire"
  | "hotesses-offres"
  | "hotesses-evenements"
  | "hotesses-reserver"
  | "jeca-presentation"
  | "jeca-editions"
  | "jeca-participer"
  | "edv-mission"
  | "edv-orphelinat"
  | "edv-presence"
  | "edv-collaborer"
  | "groupe-presentation"
  | "groupe-presence"
  | "groupe-pdg"
  | "contact-adresse"
  | "contact-telephone"
  | "contact-email";

/** Blocs de réponse. Une chaîne seule = bloc texte. */
export type AssistantBlock =
  | { kind: "greeting"; text: string }
  | { kind: "text"; text: string }
  | { kind: "table"; title?: string; rows: { label: string; value: string; note?: string }[] }
  | { kind: "cards"; items: { title: string; meta?: string; text?: string }[] }
  | { kind: "chips"; items: string[] }
  | { kind: "facts"; items: { label: string; value: string; href?: string; external?: boolean }[] };

export type AssistantChannel = "whatsapp" | "phone" | "email" | "form";

export type AssistantOption =
  | { label: string; next: AssistantNodeId }
  | { label: string; href: string; external?: boolean }
  /** Sortie humaine : le lien est construit avec le contexte de la conversation. */
  | { label: string; channel: AssistantChannel };

export type AssistantNode = {
  topic?: AssistantTopicId;
  /** Intitulé de la question tel qu'il apparaît dans les menus et la recherche. */
  question?: string;
  keywords?: string[];
  messages: (string | AssistantBlock)[];
  options: AssistantOption[];
};

export const assistantMeta = {
  name: "Assistant Baruck",
  monogram: "B",
  launcher: "Assistant",
  openLabel: "Ouvrir l’assistant",
  closeLabel: "Fermer l’assistant",
  restartLabel: "Recommencer",
  humanLabel: "Parler à quelqu’un",
  botSpeaker: "Assistant",
  userSpeaker: "Vous",
  typingLabel: "L’assistant rédige une réponse",
  inputLabel: "Votre question",
  inputPlaceholder: "Posez votre question…",
  sendLabel: "Envoyer",
  searchNote: "D’après votre question :",
  choiceNote: "Plusieurs réponses peuvent correspondre :",
} as const;

export const topicLabels: Record<AssistantTopicId, string> = {
  studio: "Studio photo",
  hotesses: "Hôtesses événementielles",
  jeca: "JECA",
  edv: "Espoir de Vie",
  groupe: "Le Groupe",
  contact: "Nous joindre",
};

/** Contexte transmis à WhatsApp et à l'e-mail quand le visiteur demande un humain. */
export const topicContexts: Record<AssistantTopicId, { subject: string; intro: string }> = {
  studio: { subject: "Studio photo", intro: "je consultais le Studio Photo Baruck sur votre site." },
  hotesses: { subject: "Hôtesses événementielles", intro: "je consultais vos hôtesses événementielles sur votre site." },
  jeca: { subject: "JECA", intro: "je consultais la JECA sur votre site." },
  edv: { subject: "Espoir de Vie", intro: "je consultais Espoir de Vie sur votre site." },
  groupe: { subject: "Le Groupe Baruck", intro: "je consultais la présentation du Groupe Baruck sur votre site." },
  contact: { subject: "Contact", intro: "je vous écris depuis l’assistant de votre site." },
};

export const defaultContext = { subject: "Groupe Baruck", intro: "je vous écris depuis l’assistant de votre site." };

export type AssistantContext = { topic?: AssistantTopicId; question?: string };

export function contactHref(channel: AssistantChannel, context: AssistantContext): { href: string; external: boolean } {
  const base = context.topic ? topicContexts[context.topic] : defaultContext;
  const message = `Bonjour, ${base.intro}${context.question ? ` Sujet : ${context.question}.` : ""}`;
  switch (channel) {
    case "whatsapp":
      return { href: `${contacts.whatsappHq.href}?text=${encodeURIComponent(message)}`, external: true };
    case "email":
      return {
        href: `${contacts.email.href}?subject=${encodeURIComponent(base.subject)}&body=${encodeURIComponent(message)}`,
        external: false,
      };
    case "phone":
      return { href: contacts.landline.href, external: false };
    case "form":
      return { href: `${routes.contact}#formulaire`, external: false };
  }
}

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

const priceTables: AssistantBlock[] = studioPriceGroups.map((group) => ({
  kind: "table",
  title: group.title,
  rows: group.items.map((item) => ({ label: item.label, value: item.price, note: item.note })),
}));

const humanOptions: AssistantOption[] = [
  { label: `WhatsApp · ${contacts.whatsappHq.value}`, channel: "whatsapp" },
  { label: `Appeler · ${contacts.landline.value}`, channel: "phone" },
  { label: `E-mail · ${contacts.email.value}`, channel: "email" },
  { label: "Formulaire de contact", channel: "form" },
];

const topicOptions: AssistantOption[] = (Object.keys(topicLabels) as AssistantTopicId[]).map((id) => ({
  label: topicLabels[id],
  next: id,
}));

const backOptions = (topic: AssistantTopicId, href: string, pageLabel: string): AssistantOption[] => [
  { label: `Autres questions · ${topicLabels[topic]}`, next: topic },
  { label: pageLabel, href },
  { label: "Autre sujet", next: "start" },
];

const studioBack = backOptions("studio", routes.studio, "Voir la page Studio photo");
const hostessesBack = backOptions("hotesses", routes.hostesses, "Voir la page Hôtesses");
const jecaBack = backOptions("jeca", routes.jeca, "Voir la page JECA");
const edvBack = backOptions("edv", routes.edv, "Voir la page Espoir de Vie");
const groupBack = backOptions("groupe", routes.group, "Voir la page Le Groupe");
const contactBack = backOptions("contact", routes.contact, "Voir la page Contact");

export const assistantNodes: Record<AssistantNodeId, AssistantNode> = {
  start: {
    messages: [
      {
        kind: "greeting",
        text: `je suis l’assistant automatique du ${site.name}. Je réponds aux questions les plus fréquentes à partir des informations du site.`,
      },
      "Choisissez un sujet ou posez votre question ci-dessous. Pour tout le reste, l’équipe vous répond directement sur WhatsApp, par téléphone ou par e-mail.",
    ],
    options: topicOptions,
  },

  encore: {
    messages: ["Je reste disponible ici. Souhaitez-vous autre chose ?"],
    options: topicOptions,
  },

  humain: {
    question: "Parler à quelqu’un",
    keywords: ["humain", "personne", "quelqu’un", "conseiller", "equipe", "parler", "agent", "responsable"],
    messages: ["L’équipe du Groupe Baruck vous répond directement par le canal de votre choix. Votre sujet sera indiqué dans le message."],
    options: [...humanOptions, { label: "Retour aux sujets", next: "start" }],
  },

  inconnu: {
    messages: [
      "Je n’ai pas de réponse prête pour cette question. L’équipe vous répond directement, votre question sera indiquée dans le message.",
    ],
    options: [...humanOptions, { label: "Retour aux sujets", next: "start" }],
  },

  plusieurs: {
    messages: [assistantMeta.choiceNote],
    options: [{ label: "Retour aux sujets", next: "start" }],
  },

  /* ---------- Studio photo ---------- */
  studio: {
    topic: "studio",
    question: topicLabels.studio,
    keywords: ["studio", "photo", "photographe", "shooting", "seance", "portrait"],
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
    topic: "studio",
    question: "Les tarifs du studio",
    keywords: ["prix", "tarif", "tarifs", "cout", "coute", "combien", "gnf", "devis", "formule", "mannequin", "mariage", "spot", "conference", "album", "pack"],
    messages: [...priceTables, "Pour un devis précis, écrivez directement au studio sur WhatsApp."],
    options: [
      { label: "Demander un tarif sur WhatsApp", href: whatsappRequests.studioPrices, external: true },
      { label: "Voir la grille complète", href: `${routes.studio}#tarifs` },
      { label: `Autres questions · ${topicLabels.studio}`, next: "studio" },
      { label: "Autre sujet", next: "start" },
    ],
  },
  "studio-rendez-vous": {
    topic: "studio",
    question: "Rendez-vous et horaires du studio",
    keywords: ["rendez-vous", "rdv", "horaire", "horaires", "ouvert", "ouverture", "heure", "heures", "quand", "disponible", "reserver"],
    messages: [faq("Faut-il prendre rendez-vous ?"), faq("Quand le studio est-il ouvert ?")],
    options: studioBack,
  },
  "studio-adresse": {
    topic: "studio",
    question: "Où se trouve le studio ?",
    keywords: ["adresse", "situe", "trouve", "kobayah", "conakry", "lieu", "localisation", "transfo", "pharmacie"],
    messages: [{ kind: "facts", items: [{ label: "Adresse du studio", value: faq("Où se trouve le studio ?") }] }],
    options: [{ label: "Itinéraire et carte", href: `${routes.contact}#carte` }, ...studioBack],
  },
  "studio-deplacement": {
    topic: "studio",
    question: "Déplacement et matériel",
    keywords: ["deplacement", "deplacez", "deplace", "exterieur", "materiel", "evenement", "domicile", "paraflash", "reflecteur", "interieur", "pays"],
    messages: [faq("Vous déplacez-vous en dehors du studio ?"), faq("Le matériel du studio peut-il venir sur mon événement ?")],
    options: studioBack,
  },
  "studio-identite": {
    topic: "studio",
    question: "Photo d’identité",
    keywords: ["identite", "passeport", "pieces", "piece", "carte"],
    messages: [faq("Combien coûte une photo d’identité et quand est-elle remise ?")],
    options: studioBack,
  },
  "studio-anniversaire": {
    topic: "studio",
    question: "Anniversaires d’enfants",
    keywords: ["anniversaire", "enfant", "enfants", "ballons", "fete", "bebe"],
    messages: [faq("Proposez-vous des anniversaires pour enfants ?")],
    options: studioBack,
  },

  /* ---------- Hôtesses ---------- */
  hotesses: {
    topic: "hotesses",
    question: topicLabels.hotesses,
    keywords: ["hotesse", "hotesses", "evenementiel", "evenementielles"],
    messages: [teaser("apercu-hostesses")],
    options: [
      { label: "Que proposent les hôtesses ?", next: "hotesses-offres" },
      { label: "Pour quels événements ?", next: "hotesses-evenements" },
      { label: "Comment réserver ?", next: "hotesses-reserver" },
    ],
  },
  "hotesses-offres": {
    topic: "hotesses",
    question: "Que proposent les hôtesses ?",
    keywords: ["accueil", "orientation", "representation", "prestation", "prestations", "service", "equipe", "proposent"],
    messages: [{ kind: "cards", items: hostessOffers.map((offer) => ({ title: offer.title, meta: offer.number, text: offer.text })) }],
    options: hostessesBack,
  },
  "hotesses-evenements": {
    topic: "hotesses",
    question: "Pour quels événements ?",
    keywords: ["concert", "concerts", "buffet", "lancement", "evenement", "evenements", "soiree", "ceremonie", "rencontre"],
    messages: [{ kind: "chips", items: hostessTags }],
    options: [{ label: "Comment réserver ?", next: "hotesses-reserver" }, ...hostessesBack],
  },
  "hotesses-reserver": {
    topic: "hotesses",
    question: "Comment réserver des hôtesses ?",
    keywords: ["reserver", "reservation", "louer", "engager", "commander", "booking"],
    messages: [`${need("Hôtesses événementielles")} Écrivez au siège de Baruck en Guinée sur WhatsApp, ou appelez le fixe.`],
    options: [
      { label: "Réserver sur WhatsApp", href: whatsappRequests.hostessBooking, external: true },
      { label: `Appeler · ${contacts.landline.value}`, channel: "phone" },
      ...hostessesBack,
    ],
  },

  /* ---------- JECA ---------- */
  jeca: {
    topic: "jeca",
    question: topicLabels.jeca,
    keywords: ["jeca", "forum", "entrepreneurs", "chretiens", "africains"],
    messages: ["JECA · Jeunes Entrepreneurs Chrétiens Africains."],
    options: [
      { label: "Qu’est-ce que la JECA ?", next: "jeca-presentation" },
      { label: "Les éditions", next: "jeca-editions" },
      { label: "Participer ou intervenir", next: "jeca-participer" },
    ],
  },
  "jeca-presentation": {
    topic: "jeca",
    question: "Qu’est-ce que la JECA ?",
    keywords: ["diaspora", "investir", "investissement", "afrique", "vision", "mission", "objectif", "presentation"],
    messages: [footers.jeca.blurb, teaser("apercu-jeca")],
    options: [{ label: "Les éditions", next: "jeca-editions" }, ...jecaBack],
  },
  "jeca-editions": {
    topic: "jeca",
    question: "Les éditions de la JECA",
    keywords: ["edition", "editions", "dakar", "conakry", "2022", "2023", "2026", "prochaine", "date", "dates", "programme", "galerie", "photos"],
    messages: [
      {
        kind: "cards",
        items: jecaEditions.map((edition) => ({
          title: `Édition ${edition.edition} · ${edition.place}`,
          meta: edition.date.label,
          text: edition.story?.lead ?? edition.simpleLead,
        })),
      },
    ],
    options: [{ label: "Voir les galeries", href: `${routes.jeca}#editions` }, ...jecaBack],
  },
  "jeca-participer": {
    topic: "jeca",
    question: "Participer ou intervenir à la JECA",
    keywords: ["participer", "participation", "intervenir", "intervenant", "inscription", "inscrire", "soutenir", "sponsor", "partenaire", "partenariat"],
    messages: [`${need("JECA")} Écrivez à l’équipe par e-mail en précisant votre demande, ou sur WhatsApp.`],
    options: [
      { label: "Écrire un e-mail · objet JECA", channel: "email" },
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, channel: "whatsapp" },
      ...jecaBack,
    ],
  },

  /* ---------- Espoir de Vie ---------- */
  edv: {
    topic: "edv",
    question: topicLabels.edv,
    keywords: ["espoir", "vie", "ong", "humanitaire", "solidarite", "association"],
    messages: [footers.edv.blurb],
    options: [
      { label: "La mission", next: "edv-mission" },
      { label: "L’orphelinat", next: "edv-orphelinat" },
      { label: "Où agit Espoir de Vie ?", next: "edv-presence" },
      { label: "Collaborer", next: "edv-collaborer" },
    ],
  },
  "edv-mission": {
    topic: "edv",
    question: "La mission d’Espoir de Vie",
    keywords: ["mission", "proteger", "eduquer", "nourrir", "soigner", "accompagner", "enfants", "orphelins", "familles", "veuves", "actions"],
    messages: [
      teaser("apercu-edv"),
      { kind: "cards", items: edvPillars.map((pillar) => ({ title: pillar.title, meta: pillar.number, text: pillar.text })) },
    ],
    options: edvBack,
  },
  "edv-orphelinat": {
    topic: "edv",
    question: "L’orphelinat",
    keywords: ["orphelinat", "orphelins", "inauguration", "pensionnaires", "2017", "batiment", "dortoirs"],
    messages: [
      `Les premiers pensionnaires ont été accueillis le ${timelineDate("Premiers pensionnaires")}, avant l’inauguration officielle le ${timelineDate("Inauguration")}.`,
    ],
    options: [{ label: "L’histoire de l’orphelinat", href: `${routes.edv}#orphelinat` }, ...edvBack],
  },
  "edv-presence": {
    topic: "edv",
    question: "Où agit Espoir de Vie ?",
    keywords: ["pays", "cote", "ivoire", "guinee", "burkina", "faso", "divo", "zaroko", "groh", "presence", "agit", "intervient"],
    messages: [{ kind: "cards", items: edvCountries.map((country) => ({ title: country.title, meta: country.number, text: country.text })) }],
    options: edvBack,
  },
  "edv-collaborer": {
    topic: "edv",
    question: "Collaborer avec Espoir de Vie",
    keywords: ["collaborer", "collaboration", "aider", "aide", "benevole", "benevolat", "don", "dons", "donner", "soutenir", "contribuer", "partenaire"],
    messages: [`${need("Espoir de Vie")} Écrivez à l’équipe par e-mail en précisant votre proposition.`],
    options: [
      { label: "Écrire un e-mail · objet Espoir de Vie", channel: "email" },
      { label: `WhatsApp · ${contacts.whatsappHq.value}`, channel: "whatsapp" },
      ...edvBack,
    ],
  },

  /* ---------- Le Groupe ---------- */
  groupe: {
    topic: "groupe",
    question: topicLabels.groupe,
    keywords: ["groupe", "baruck", "entreprise", "societe", "holding", "qui"],
    messages: [site.description],
    options: [
      { label: "Les domaines d’activité", next: "groupe-presentation" },
      { label: "Où est présent le Groupe ?", next: "groupe-presence" },
      { label: "Le PDG", next: "groupe-pdg" },
      { label: "Les actualités", href: routes.news },
    ],
  },
  "groupe-presentation": {
    topic: "groupe",
    question: "Les domaines d’activité",
    keywords: ["activites", "activite", "domaines", "domaine", "services", "secteurs", "hotellerie", "restauration", "agrobusiness", "agro", "cinema", "voitures", "luxe", "communication", "artistes", "clips", "enregistrement", "musique"],
    messages: [`${activities.length} domaines d’activité :`, { kind: "chips", items: activities.map((activity) => activity.title) }],
    options: [{ label: "Voir les activités", href: routes.services }, ...groupBack],
  },
  "groupe-presence": {
    topic: "groupe",
    question: "Où est présent le Groupe ?",
    keywords: ["present", "presence", "pays", "senegal", "guinee", "cote", "ivoire", "implante", "bureaux", "afrique"],
    messages: [footers.home.blurb],
    options: [{ label: "Notre présence", href: `${routes.group}#presence` }, ...groupBack],
  },
  "groupe-pdg": {
    topic: "groupe",
    question: "Le PDG",
    keywords: ["pdg", "president", "fondateur", "dirigeant", "directeur", "krasso", "joel", "djoro", "shaloom"],
    messages: [teaser("apercu-about")],
    options: [{ label: "Découvrir le PDG", href: `${routes.home}#president` }, ...groupBack],
  },

  /* ---------- Contact ---------- */
  contact: {
    topic: "contact",
    question: topicLabels.contact,
    keywords: ["contact", "contacter", "joindre", "coordonnees"],
    messages: ["Comment souhaitez-vous nous joindre ?"],
    options: [
      { label: "Adresse et horaires", next: "contact-adresse" },
      { label: "Téléphone et WhatsApp", next: "contact-telephone" },
      { label: "E-mail et formulaire", next: "contact-email" },
    ],
  },
  "contact-adresse": {
    topic: "contact",
    question: "Adresse et horaires",
    keywords: ["adresse", "siege", "horaires", "horaire", "ouvert", "ferme", "dimanche", "kobayah", "itineraire", "carte", "plan", "conakry"],
    messages: [
      { kind: "facts", items: [{ label: "Siège", value: hqAddress }] },
      { kind: "table", title: "Horaires du siège", rows: hqHours.map((slot) => ({ label: slot.days, value: slot.hours })) },
    ],
    options: [{ label: "Itinéraire et carte", href: `${routes.contact}#carte` }, ...contactBack],
  },
  "contact-telephone": {
    topic: "contact",
    question: "Téléphone et WhatsApp",
    keywords: ["telephone", "appeler", "appel", "numero", "whatsapp", "fixe", "mobile", "portable"],
    messages: [
      {
        kind: "facts",
        items: [
          { label: contacts.landline.label, value: contacts.landline.value, href: contacts.landline.href },
          { label: contacts.whatsappHq.label, value: contacts.whatsappHq.value, href: contacts.whatsappHq.href, external: true },
          { label: contacts.mobile.label, value: contacts.mobile.value, href: contacts.mobile.href },
        ],
      },
    ],
    options: [{ label: `WhatsApp · ${contacts.whatsappHq.value}`, channel: "whatsapp" }, ...contactBack],
  },
  "contact-email": {
    topic: "contact",
    question: "E-mail et formulaire",
    keywords: ["email", "mail", "courriel", "formulaire", "ecrire", "message", "envoyer"],
    messages: [
      { kind: "facts", items: [{ label: contacts.email.label, value: contacts.email.value, href: contacts.email.href }] },
      "Le formulaire du site transmet votre message à l’équipe.",
    ],
    options: [
      { label: `Écrire · ${contacts.email.value}`, channel: "email" },
      { label: "Formulaire de contact", channel: "form" },
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

export function greetingFor(hour: number): string {
  return hour >= 18 || hour < 5 ? "Bonsoir" : "Bonjour";
}
