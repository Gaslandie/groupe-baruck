import { translate as t } from "../lib/language.ts";

import { contactNeeds, hqHours } from "./contact";
import { edvCountries, edvPillars, edvTimeline } from "./espoir-de-vie";
import { activities, mainActivities, pageTeasers } from "./home";
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
  name: t("Assistant Baruck"),
  monogram: "B",
  launcher: "Assistant",
  openLabel: t("Ouvrir l’assistant"),
  closeLabel: t("Fermer l’assistant"),
  restartLabel: t("Recommencer"),
  humanLabel: t("Parler à quelqu’un"),
  botSpeaker: "Assistant",
  userSpeaker: t("Vous"),
  typingLabel: t("L’assistant rédige une réponse"),
  inputLabel: t("Votre question"),
  inputPlaceholder: t("Posez votre question…"),
  sendLabel: t("Envoyer"),
  searchNote: t("D’après votre question :"),
  choiceNote: t("Plusieurs réponses peuvent correspondre :"),
} as const;

export const topicLabels: Record<AssistantTopicId, string> = {
  studio: t("Studio photo"),
  hotesses: t("Hôtesses événementielles"),
  jeca: "JECA",
  edv: "Espoir de Vie",
  groupe: t("Le Groupe"),
  contact: t("Nous joindre"),
};

/** Contexte transmis à WhatsApp et à l'e-mail quand le visiteur demande un humain. */
export const topicContexts: Record<AssistantTopicId, { subject: string; intro: string }> = {
  studio: { subject: t("Studio photo"), intro: t("je consultais le Studio Photo Baruck sur votre site.") },
  hotesses: { subject: t("Hôtesses événementielles"), intro: t("je consultais vos hôtesses événementielles sur votre site.") },
  jeca: { subject: "JECA", intro: t("je consultais la JECA sur votre site.") },
  edv: { subject: "Espoir de Vie", intro: t("je consultais Espoir de Vie sur votre site.") },
  groupe: { subject: t("Le Groupe Baruck"), intro: t("je consultais la présentation du Groupe Baruck sur votre site.") },
  contact: { subject: "Contact", intro: t("je vous écris depuis l’assistant de votre site.") },
};

export const defaultContext = { subject: "Groupe Baruck", intro: t("je vous écris depuis l’assistant de votre site.") };

export type AssistantContext = { topic?: AssistantTopicId; question?: string };

export function contactHref(channel: AssistantChannel, context: AssistantContext): { href: string; external: boolean } {
  const base = context.topic ? topicContexts[context.topic] : defaultContext;
  const message = (t("Bonjour, ") + String(base.intro) + t("") + String(context.question ? ` ${t("Sujet :")} ${context.question}.` : "") + t(""));
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
  const item = studioFaq.find((entry) => entry.question === t(question));
  if (!item) throw new Error(`FAQ studio introuvable : ${question}`);
  return item.answer;
};

const teaser = (id: string): string => {
  const item = [...pageTeasers, ...mainActivities].find((entry) => entry.id === id);
  if (!item) throw new Error(`Aperçu introuvable : ${id}`);
  return item.text;
};

const need = (title: string): string => {
  const item = contactNeeds.find((entry) => entry.title === t(title));
  if (!item) throw new Error(`Besoin de contact introuvable : ${title}`);
  return item.text;
};

const timelineDate = (title: string): string => {
  const item = edvTimeline.find((entry) => entry.title === t(title));
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
  { label: (t("Appeler · ") + String(contacts.landline.value) + t("")), channel: "phone" },
  { label: (t("E-mail · ") + String(contacts.email.value) + t("")), channel: "email" },
  { label: t("Formulaire de contact"), channel: "form" },
];

const topicOptions: AssistantOption[] = (Object.keys(topicLabels) as AssistantTopicId[]).map((id) => ({
  label: topicLabels[id],
  next: id,
}));

const backOptions = (topic: AssistantTopicId, href: string, pageLabel: string): AssistantOption[] => [
  { label: (t("Autres questions · ") + String(topicLabels[topic]) + t("")), next: topic },
  { label: pageLabel, href },
  { label: t("Autre sujet"), next: "start" },
];

const studioBack = backOptions("studio", routes.studio, t("Voir la page Studio photo"));
const hostessesBack = backOptions("hotesses", routes.hostesses, t("Voir la page Hôtesses"));
const jecaBack = backOptions("jeca", routes.jeca, t("Voir la page JECA"));
const edvBack = backOptions("edv", routes.edv, t("Voir la page Espoir de Vie"));
const groupBack = backOptions("groupe", routes.group, t("Voir la page Le Groupe"));
const contactBack = backOptions("contact", routes.contact, t("Voir la page Contact"));

export const assistantNodes: Record<AssistantNodeId, AssistantNode> = {
  start: {
    messages: [
      {
        kind: "greeting",
        text: (t("je suis l’assistant automatique du ") + String(site.name) + t(". Je réponds aux questions les plus fréquentes à partir des informations du site.")),
      },
      t("Choisissez un sujet ou posez votre question ci-dessous. Pour tout le reste, l’équipe vous répond directement sur WhatsApp, par téléphone ou par e-mail."),
    ],
    options: topicOptions,
  },

  encore: {
    messages: [t("Je reste disponible ici. Souhaitez-vous autre chose ?")],
    options: topicOptions,
  },

  humain: {
    question: t("Parler à quelqu’un"),
    keywords: ["humain", "personne", "quelqu’un", "conseiller", "equipe", "parler", "agent", "responsable"],
    messages: [t("L’équipe du Groupe Baruck vous répond directement par le canal de votre choix. Votre sujet sera indiqué dans le message.")],
    options: [...humanOptions, { label: t("Retour aux sujets"), next: "start" }],
  },

  inconnu: {
    messages: [
      t("Je n’ai pas de réponse prête pour cette question. L’équipe vous répond directement, votre question sera indiquée dans le message."),
    ],
    options: [...humanOptions, { label: t("Retour aux sujets"), next: "start" }],
  },

  plusieurs: {
    messages: [assistantMeta.choiceNote],
    options: [{ label: t("Retour aux sujets"), next: "start" }],
  },

  /* ---------- Studio photo ---------- */
  studio: {
    topic: "studio",
    question: topicLabels.studio,
    keywords: ["studio", "photo", "photographe", "shooting", "seance", "portrait"],
    messages: [teaser("activite-studio")],
    options: [
      { label: t("Les tarifs"), next: "studio-tarifs" },
      { label: t("Rendez-vous et horaires"), next: "studio-rendez-vous" },
      { label: t("Où se trouve le studio ?"), next: "studio-adresse" },
      { label: t("Déplacement et matériel"), next: "studio-deplacement" },
      { label: t("Photo d’identité"), next: "studio-identite" },
      { label: t("Anniversaires d’enfants"), next: "studio-anniversaire" },
    ],
  },
  "studio-tarifs": {
    topic: "studio",
    question: t("Les tarifs du studio"),
    keywords: ["prix", "tarif", "tarifs", "cout", "coute", "combien", "gnf", "devis", "formule", "mannequin", "mariage", "spot", "conference", "album", "pack"],
    messages: [...priceTables, t("Pour un devis précis, écrivez directement au studio sur WhatsApp.")],
    options: [
      { label: t("Demander un tarif sur WhatsApp"), href: whatsappRequests.studioPrices, external: true },
      { label: t("Voir la grille complète"), href: `${routes.studio}#tarifs` },
      { label: (t("Autres questions · ") + String(topicLabels.studio) + t("")), next: "studio" },
      { label: t("Autre sujet"), next: "start" },
    ],
  },
  "studio-rendez-vous": {
    topic: "studio",
    question: t("Rendez-vous et horaires du studio"),
    keywords: ["rendez-vous", "rdv", "horaire", "horaires", "ouvert", "ouverture", "heure", "heures", "quand", "disponible", "reserver"],
    messages: [faq(t("Faut-il prendre rendez-vous ?")), faq(t("Quand le studio est-il ouvert ?"))],
    options: studioBack,
  },
  "studio-adresse": {
    topic: "studio",
    question: t("Où se trouve le studio ?"),
    keywords: ["adresse", "situe", "trouve", "kobayah", "conakry", "lieu", "localisation", "transfo", "pharmacie"],
    messages: [{ kind: "facts", items: [{ label: t("Adresse du studio"), value: faq(t("Où se trouve le studio ?")) }] }],
    options: [{ label: t("Itinéraire et carte"), href: `${routes.contact}#carte` }, ...studioBack],
  },
  "studio-deplacement": {
    topic: "studio",
    question: t("Déplacement et matériel"),
    keywords: ["deplacement", "deplacez", "deplace", "exterieur", "materiel", "evenement", "domicile", "paraflash", "reflecteur", "interieur", "pays"],
    messages: [faq(t("Vous déplacez-vous en dehors du studio ?")), faq(t("Le matériel du studio peut-il venir sur mon événement ?"))],
    options: studioBack,
  },
  "studio-identite": {
    topic: "studio",
    question: t("Photo d’identité"),
    keywords: ["identite", "passeport", "pieces", "piece", "carte"],
    messages: [faq(t("Combien coûte une photo d’identité et quand est-elle remise ?"))],
    options: studioBack,
  },
  "studio-anniversaire": {
    topic: "studio",
    question: t("Anniversaires d’enfants"),
    keywords: ["anniversaire", "enfant", "enfants", "ballons", "fete", "bebe"],
    messages: [faq(t("Proposez-vous des anniversaires pour enfants ?"))],
    options: studioBack,
  },

  /* ---------- Hôtesses ---------- */
  hotesses: {
    topic: "hotesses",
    question: topicLabels.hotesses,
    keywords: ["hotesse", "hotesses", "evenementiel", "evenementielles"],
    messages: [teaser("activite-hotesses")],
    options: [
      { label: t("Que proposent les hôtesses ?"), next: "hotesses-offres" },
      { label: t("Pour quels événements ?"), next: "hotesses-evenements" },
      { label: t("Comment réserver ?"), next: "hotesses-reserver" },
    ],
  },
  "hotesses-offres": {
    topic: "hotesses",
    question: t("Que proposent les hôtesses ?"),
    keywords: ["accueil", "orientation", "representation", "prestation", "prestations", "service", "equipe", "proposent"],
    messages: [{ kind: "cards", items: hostessOffers.map((offer) => ({ title: offer.title, meta: offer.number, text: offer.text })) }],
    options: hostessesBack,
  },
  "hotesses-evenements": {
    topic: "hotesses",
    question: t("Pour quels événements ?"),
    keywords: ["concert", "concerts", "buffet", "lancement", "evenement", "evenements", "soiree", "ceremonie", "rencontre"],
    messages: [{ kind: "chips", items: hostessTags }],
    options: [{ label: t("Comment réserver ?"), next: "hotesses-reserver" }, ...hostessesBack],
  },
  "hotesses-reserver": {
    topic: "hotesses",
    question: t("Comment réserver des hôtesses ?"),
    keywords: ["reserver", "reservation", "louer", "engager", "commander", "booking"],
    messages: [(t("") + String(need("Hôtesses événementielles")) + t(" Écrivez au siège de Baruck en Guinée sur WhatsApp, ou appelez le fixe."))],
    options: [
      { label: t("Réserver sur WhatsApp"), href: whatsappRequests.hostessBooking, external: true },
      { label: (t("Appeler · ") + String(contacts.landline.value) + t("")), channel: "phone" },
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
      { label: t("Qu’est-ce que la JECA ?"), next: "jeca-presentation" },
      { label: t("Les éditions"), next: "jeca-editions" },
      { label: t("Participer ou intervenir"), next: "jeca-participer" },
    ],
  },
  "jeca-presentation": {
    topic: "jeca",
    question: t("Qu’est-ce que la JECA ?"),
    keywords: ["diaspora", "investir", "investissement", "afrique", "vision", "mission", "objectif", "presentation"],
    messages: [footers.jeca.blurb, teaser("apercu-jeca")],
    options: [{ label: t("Les éditions"), next: "jeca-editions" }, ...jecaBack],
  },
  "jeca-editions": {
    topic: "jeca",
    question: t("Les éditions de la JECA"),
    keywords: ["edition", "editions", "dakar", "conakry", "2022", "2023", "2026", "prochaine", "date", "dates", "programme", "galerie", "photos"],
    messages: [
      {
        kind: "cards",
        items: jecaEditions.map((edition) => ({
          title: (t("Édition ") + String(edition.edition) + t(" · ") + String(edition.place) + t("")),
          meta: edition.date.label,
          text: edition.story?.lead ?? edition.simpleLead,
        })),
      },
    ],
    options: [{ label: t("Voir les galeries"), href: `${routes.jeca}#editions` }, ...jecaBack],
  },
  "jeca-participer": {
    topic: "jeca",
    question: t("Participer ou intervenir à la JECA"),
    keywords: ["participer", "participation", "intervenir", "intervenant", "inscription", "inscrire", "soutenir", "sponsor", "partenaire", "partenariat"],
    messages: [(t("") + String(need("JECA")) + t(" Écrivez à l’équipe par e-mail en précisant votre demande, ou sur WhatsApp."))],
    options: [
      { label: t("Écrire un e-mail · objet JECA"), channel: "email" },
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
      { label: t("La mission"), next: "edv-mission" },
      { label: t("L’orphelinat"), next: "edv-orphelinat" },
      { label: t("Où agit Espoir de Vie ?"), next: "edv-presence" },
      { label: t("Collaborer"), next: "edv-collaborer" },
    ],
  },
  "edv-mission": {
    topic: "edv",
    question: t("La mission d’Espoir de Vie"),
    keywords: ["mission", "proteger", "eduquer", "nourrir", "soigner", "accompagner", "enfants", "orphelins", "familles", "veuves", "actions"],
    messages: [
      teaser("apercu-edv"),
      { kind: "cards", items: edvPillars.map((pillar) => ({ title: pillar.title, meta: pillar.number, text: pillar.text })) },
    ],
    options: edvBack,
  },
  "edv-orphelinat": {
    topic: "edv",
    question: t("L’orphelinat"),
    keywords: ["orphelinat", "orphelins", "inauguration", "pensionnaires", "2015", "2016", "batiment", "dortoirs", "agrement", "infirmerie", "internat"],
    messages: [
      (t("L’orphelinat a été construit en ") + String(timelineDate("Construction")) + t(" et inauguré en ") + String(timelineDate("Inauguration")) + t(". Agréé par l’État de Côte d’Ivoire depuis 2019, il accueille 60 orphelins et dispose d’un internat et d’une infirmerie.")),
    ],
    options: [{ label: t("L’histoire de l’orphelinat"), href: `${routes.edv}#orphelinat` }, ...edvBack],
  },
  "edv-presence": {
    topic: "edv",
    question: t("Où agit Espoir de Vie ?"),
    keywords: ["pays", "cote", "ivoire", "guinee", "burkina", "faso", "divo", "zaroko", "groh", "presence", "agit", "intervient"],
    messages: [{ kind: "cards", items: edvCountries.map((country) => ({ title: country.title, meta: country.number, text: country.text })) }],
    options: edvBack,
  },
  "edv-collaborer": {
    topic: "edv",
    question: t("Collaborer avec Espoir de Vie"),
    keywords: ["collaborer", "collaboration", "aider", "aide", "benevole", "benevolat", "don", "dons", "donner", "soutenir", "contribuer", "partenaire"],
    messages: [(t("") + String(need("Espoir de Vie")) + t(" Écrivez à l’équipe par e-mail en précisant votre proposition."))],
    options: [
      { label: t("Écrire un e-mail · objet Espoir de Vie"), channel: "email" },
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
      { label: t("Les domaines d’activité"), next: "groupe-presentation" },
      { label: t("Où est présent le Groupe ?"), next: "groupe-presence" },
      { label: t("Le PDG"), next: "groupe-pdg" },
      { label: t("Les actualités"), href: routes.news },
    ],
  },
  "groupe-presentation": {
    topic: "groupe",
    question: t("Les domaines d’activité"),
    keywords: ["activites", "activite", "domaines", "domaine", "services", "secteurs", "hotellerie", "restauration", "agrobusiness", "agro", "cinema", "voitures", "luxe", "communication", "artistes", "clips", "enregistrement", "musique"],
    messages: [(t("") + String(activities.length) + t(" domaines d’activité :")), { kind: "chips", items: activities.map((activity) => activity.title) }],
    options: [{ label: t("Voir les activités"), href: routes.services }, ...groupBack],
  },
  "groupe-presence": {
    topic: "groupe",
    question: t("Où est présent le Groupe ?"),
    keywords: ["present", "presence", "pays", "senegal", "guinee", "cote", "ivoire", "implante", "bureaux", "afrique"],
    messages: [footers.home.blurb],
    options: [{ label: t("Notre présence"), href: `${routes.group}#presence` }, ...groupBack],
  },
  "groupe-pdg": {
    topic: "groupe",
    question: t("Le PDG"),
    keywords: ["pdg", "president", "fondateur", "dirigeant", "directeur", "krasso", "joel", "djoro", "shaloom"],
    messages: [teaser("apercu-about")],
    options: [{ label: t("Découvrir le PDG"), href: `${routes.home}#president` }, ...groupBack],
  },

  /* ---------- Contact ---------- */
  contact: {
    topic: "contact",
    question: topicLabels.contact,
    keywords: ["contact", "contacter", "joindre", "coordonnees"],
    messages: [t("Comment souhaitez-vous nous joindre ?")],
    options: [
      { label: t("Adresse et horaires"), next: "contact-adresse" },
      { label: t("Téléphone et WhatsApp"), next: "contact-telephone" },
      { label: t("E-mail et formulaire"), next: "contact-email" },
    ],
  },
  "contact-adresse": {
    topic: "contact",
    question: t("Adresse et horaires"),
    keywords: ["adresse", "siege", "horaires", "horaire", "ouvert", "ferme", "dimanche", "kobayah", "itineraire", "carte", "plan", "conakry"],
    messages: [
      { kind: "facts", items: [{ label: t("Siège"), value: hqAddress }] },
      { kind: "table", title: t("Horaires du siège"), rows: hqHours.map((slot) => ({ label: slot.days, value: slot.hours })) },
    ],
    options: [{ label: t("Itinéraire et carte"), href: `${routes.contact}#carte` }, ...contactBack],
  },
  "contact-telephone": {
    topic: "contact",
    question: t("Téléphone et WhatsApp"),
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
    question: t("E-mail et formulaire"),
    keywords: ["email", "mail", "courriel", "formulaire", "ecrire", "message", "envoyer"],
    messages: [
      { kind: "facts", items: [{ label: contacts.email.label, value: contacts.email.value, href: contacts.email.href }] },
      t("Le formulaire du site transmet votre message à l’équipe."),
    ],
    options: [
      { label: (t("Écrire · ") + String(contacts.email.value) + t("")), channel: "email" },
      { label: t("Formulaire de contact"), channel: "form" },
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
  return hour >= 18 || hour < 5 ? t("Bonsoir") : t("Bonjour");
}
