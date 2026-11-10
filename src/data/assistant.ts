import { pageText } from "@/lib/page-content";

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
  name: pageText("home", "common.assistant.1"),
  monogram: "B",
  launcher: pageText("home", "common.assistant.2"),
  openLabel: pageText("home", "common.assistant.3"),
  closeLabel: pageText("home", "common.assistant.4"),
  restartLabel: pageText("home", "common.assistant.5"),
  humanLabel: pageText("home", "common.assistant.6"),
  botSpeaker: pageText("home", "common.assistant.2"),
  userSpeaker: pageText("home", "common.assistant.7"),
  typingLabel: pageText("home", "common.assistant.8"),
  inputLabel: pageText("home", "common.assistant.9"),
  inputPlaceholder: pageText("home", "common.assistant.10"),
  sendLabel: pageText("home", "common.assistant.11"),
  searchNote: pageText("home", "common.assistant.12"),
  choiceNote: pageText("home", "common.assistant.13"),
} as const;

export const topicLabels: Record<AssistantTopicId, string> = {
  studio: pageText("home", "common.site.13"),
  hotesses: pageText("home", "common.site.14"),
  jeca: pageText("home", "common.site.16"),
  edv: pageText("home", "common.site.17"),
  groupe: pageText("home", "common.site.10"),
  contact: pageText("home", "common.assistant.14"),
};

/** Contexte transmis à WhatsApp et à l'e-mail quand le visiteur demande un humain. */
export const topicContexts: Record<AssistantTopicId, { subject: string; intro: string }> = {
  studio: { subject: pageText("home", "common.site.13"), intro: pageText("home", "common.assistant.15") },
  hotesses: { subject: pageText("home", "common.site.14"), intro: pageText("home", "common.assistant.16") },
  jeca: { subject: pageText("home", "common.site.16"), intro: pageText("home", "common.assistant.17") },
  edv: { subject: pageText("home", "common.site.17"), intro: pageText("home", "common.assistant.18") },
  groupe: { subject: pageText("home", "common.assistant.19"), intro: pageText("home", "common.assistant.20") },
  contact: { subject: pageText("home", "common.site.22"), intro: pageText("home", "common.assistant.21") },
};

export const defaultContext = { subject: pageText("home", "common.Brand.2"), intro: pageText("home", "common.assistant.21") };

export type AssistantContext = { topic?: AssistantTopicId; question?: string };

export function contactHref(channel: AssistantChannel, context: AssistantContext): { href: string; external: boolean } {
  const base = context.topic ? topicContexts[context.topic] : defaultContext;
  const message = ((pageText("home", "common.assistant.22") + " ") + String(base.intro) + "" + String(context.question ? ` ${pageText("home", "common.assistant.23")} ${context.question}.` : "") + "");
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

const faq = (key: string): string => studioFaq.find(entry => entry.key === key)?.answer ?? pageText("home", "common.assistant.41");

const teaser = (id: string): string => {
  const item = [...pageTeasers, ...mainActivities].find((entry) => entry.id === id);
  if (!item) throw new Error(`Aperçu introuvable : ${id}`);
  return item.text;
};

const need = (key: string): string => contactNeeds.find(entry => entry.key === key)?.text ?? pageText("home", "common.assistant.41");


const priceTables: AssistantBlock[] = studioPriceGroups.map((group) => ({
  kind: "table",
  title: group.title,
  rows: group.items.map((item) => ({ label: item.label, value: item.price, note: item.note })),
}));

const humanOptions: AssistantOption[] = [
  { label: `WhatsApp · ${contacts.whatsappHq.value}`, channel: "whatsapp" },
  { label: ((pageText("home", "common.assistant.24") + " ") + String(contacts.landline.value) + ""), channel: "phone" },
  { label: ((pageText("home", "common.assistant.25") + " ") + String(contacts.email.value) + ""), channel: "email" },
  { label: pageText("home", "common.assistant.26"), channel: "form" },
];

const topicOptions: AssistantOption[] = (Object.keys(topicLabels) as AssistantTopicId[]).map((id) => ({
  label: topicLabels[id],
  next: id,
}));

const backOptions = (topic: AssistantTopicId, href: string, pageLabel: string): AssistantOption[] => [
  { label: ((pageText("home", "common.assistant.27") + " ") + String(topicLabels[topic]) + ""), next: topic },
  { label: pageLabel, href },
  { label: pageText("home", "common.assistant.28"), next: "start" },
];

const studioBack = backOptions("studio", routes.studio, pageText("home", "common.assistant.29"));
const hostessesBack = backOptions("hotesses", routes.hostesses, pageText("home", "common.assistant.30"));
const jecaBack = backOptions("jeca", routes.jeca, pageText("home", "common.assistant.31"));
const edvBack = backOptions("edv", routes.edv, pageText("home", "common.assistant.32"));
const groupBack = backOptions("groupe", routes.group, pageText("home", "common.assistant.33"));
const contactBack = backOptions("contact", routes.contact, pageText("home", "common.assistant.34"));

export const assistantNodes: Record<AssistantNodeId, AssistantNode> = {
  start: {
    messages: [
      {
        kind: "greeting",
        text: ((pageText("home", "common.assistant.35") + " ") + String(site.name) + pageText("home", "common.assistant.36")),
      },
      pageText("home", "common.assistant.37"),
    ],
    options: topicOptions,
  },

  encore: {
    messages: [pageText("home", "common.assistant.38")],
    options: topicOptions,
  },

  humain: {
    question: pageText("home", "common.assistant.6"),
    keywords: ["humain", "personne", "quelqu’un", "conseiller", "equipe", "parler", "agent", "responsable"],
    messages: [pageText("home", "common.assistant.39")],
    options: [...humanOptions, { label: pageText("home", "common.assistant.40"), next: "start" }],
  },

  inconnu: {
    messages: [
      pageText("home", "common.assistant.41"),
    ],
    options: [...humanOptions, { label: pageText("home", "common.assistant.40"), next: "start" }],
  },

  plusieurs: {
    messages: [assistantMeta.choiceNote],
    options: [{ label: pageText("home", "common.assistant.40"), next: "start" }],
  },

  /* ---------- Studio photo ---------- */
  studio: {
    topic: "studio",
    question: topicLabels.studio,
    keywords: ["studio", "photo", "photographe", "shooting", "seance", "portrait"],
    messages: [teaser("activite-studio")],
    options: [
      { label: pageText("home", "common.assistant.42"), next: "studio-tarifs" },
      { label: pageText("home", "common.assistant.43"), next: "studio-rendez-vous" },
      { label: pageText("home", "common.assistant.44"), next: "studio-adresse" },
      { label: pageText("home", "common.assistant.45"), next: "studio-deplacement" },
      { label: pageText("home", "common.assistant.46"), next: "studio-identite" },
      { label: pageText("home", "common.assistant.47"), next: "studio-anniversaire" },
    ],
  },
  "studio-tarifs": {
    topic: "studio",
    question: pageText("home", "common.assistant.48"),
    keywords: ["prix", "tarif", "tarifs", "cout", "coute", "combien", "gnf", "devis", "formule", "mannequin", "mariage", "spot", "conference", "album", "pack"],
    messages: [...priceTables, pageText("home", "common.assistant.49")],
    options: [
      { label: pageText("home", "common.assistant.50"), href: whatsappRequests.studioPrices, external: true },
      { label: pageText("home", "common.assistant.51"), href: `${routes.studio}#tarifs` },
      { label: ((pageText("home", "common.assistant.27") + " ") + String(topicLabels.studio) + ""), next: "studio" },
      { label: pageText("home", "common.assistant.28"), next: "start" },
    ],
  },
  "studio-rendez-vous": {
    topic: "studio",
    question: pageText("home", "common.assistant.52"),
    keywords: ["rendez-vous", "rdv", "horaire", "horaires", "ouvert", "ouverture", "heure", "heures", "quand", "disponible", "reserver"],
    messages: [faq("rendez-vous"), faq("ouverture")],
    options: studioBack,
  },
  "studio-adresse": {
    topic: "studio",
    question: pageText("home", "common.assistant.44"),
    keywords: ["adresse", "situe", "trouve", "kobayah", "conakry", "lieu", "localisation", "transfo", "pharmacie"],
    messages: [{ kind: "facts", items: [{ label: pageText("home", "common.assistant.55"), value: faq("adresse") }] }],
    options: [{ label: pageText("home", "common.assistant.56"), href: `${routes.contact}#carte` }, ...studioBack],
  },
  "studio-deplacement": {
    topic: "studio",
    question: pageText("home", "common.assistant.45"),
    keywords: ["deplacement", "deplacez", "deplace", "exterieur", "materiel", "evenement", "domicile", "paraflash", "reflecteur", "interieur", "pays"],
    messages: [faq("deplacement"), faq("materiel")],
    options: studioBack,
  },
  "studio-identite": {
    topic: "studio",
    question: pageText("home", "common.assistant.46"),
    keywords: ["identite", "passeport", "pieces", "piece", "carte"],
    messages: [faq("identite")],
    options: studioBack,
  },
  "studio-anniversaire": {
    topic: "studio",
    question: pageText("home", "common.assistant.47"),
    keywords: ["anniversaire", "enfant", "enfants", "ballons", "fete", "bebe"],
    messages: [faq("anniversaire")],
    options: studioBack,
  },

  /* ---------- Hôtesses ---------- */
  hotesses: {
    topic: "hotesses",
    question: topicLabels.hotesses,
    keywords: ["hotesse", "hotesses", "evenementiel", "evenementielles"],
    messages: [teaser("activite-hotesses")],
    options: [
      { label: pageText("home", "common.assistant.61"), next: "hotesses-offres" },
      { label: pageText("home", "common.assistant.62"), next: "hotesses-evenements" },
      { label: pageText("home", "common.assistant.63"), next: "hotesses-reserver" },
    ],
  },
  "hotesses-offres": {
    topic: "hotesses",
    question: pageText("home", "common.assistant.61"),
    keywords: ["accueil", "orientation", "representation", "prestation", "prestations", "service", "equipe", "proposent"],
    messages: [{ kind: "cards", items: hostessOffers.map((offer) => ({ title: offer.title, meta: offer.number, text: offer.text })) }],
    options: hostessesBack,
  },
  "hotesses-evenements": {
    topic: "hotesses",
    question: pageText("home", "common.assistant.62"),
    keywords: ["concert", "concerts", "buffet", "lancement", "evenement", "evenements", "soiree", "ceremonie", "rencontre"],
    messages: [{ kind: "chips", items: hostessTags }],
    options: [{ label: pageText("home", "common.assistant.63"), next: "hotesses-reserver" }, ...hostessesBack],
  },
  "hotesses-reserver": {
    topic: "hotesses",
    question: pageText("home", "common.assistant.64"),
    keywords: ["reserver", "reservation", "louer", "engager", "commander", "booking"],
    messages: [("" + String(need("hotesses")) + (" " + pageText("home", "common.assistant.65")))],
    options: [
      { label: pageText("home", "common.assistant.66"), href: whatsappRequests.hostessBooking, external: true },
      { label: ((pageText("home", "common.assistant.24") + " ") + String(contacts.landline.value) + ""), channel: "phone" },
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
      { label: pageText("home", "common.assistant.67"), next: "jeca-presentation" },
      { label: pageText("home", "common.assistant.68"), next: "jeca-editions" },
      { label: pageText("home", "common.assistant.69"), next: "jeca-participer" },
    ],
  },
  "jeca-presentation": {
    topic: "jeca",
    question: pageText("home", "common.assistant.67"),
    keywords: ["diaspora", "investir", "investissement", "afrique", "vision", "mission", "objectif", "presentation"],
    messages: [footers.jeca.blurb, teaser("apercu-jeca")],
    options: [{ label: pageText("home", "common.assistant.68"), next: "jeca-editions" }, ...jecaBack],
  },
  "jeca-editions": {
    topic: "jeca",
    question: pageText("home", "common.assistant.70"),
    keywords: ["edition", "editions", "dakar", "conakry", "2022", "2023", "2026", "prochaine", "date", "dates", "programme", "galerie", "photos"],
    messages: [
      {
        kind: "cards",
        items: jecaEditions.map((edition) => ({
          title: ((pageText("home", "common.assistant.71") + " ") + String(edition.edition) + " · " + String(edition.place) + ""),
          meta: edition.date.label,
          text: edition.story?.lead ?? edition.simpleLead,
        })),
      },
    ],
    options: [{ label: pageText("home", "common.assistant.72"), href: `${routes.jeca}#editions` }, ...jecaBack],
  },
  "jeca-participer": {
    topic: "jeca",
    question: pageText("home", "common.assistant.73"),
    keywords: ["participer", "participation", "intervenir", "intervenant", "inscription", "inscrire", "soutenir", "sponsor", "partenaire", "partenariat"],
    messages: [("" + String(need("jeca")) + (" " + pageText("home", "common.assistant.74")))],
    options: [
      { label: pageText("home", "common.assistant.75"), channel: "email" },
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
      { label: pageText("home", "common.assistant.76"), next: "edv-mission" },
      { label: pageText("home", "common.site.35"), next: "edv-orphelinat" },
      { label: pageText("home", "common.assistant.77"), next: "edv-presence" },
      { label: pageText("home", "common.assistant.78"), next: "edv-collaborer" },
    ],
  },
  "edv-mission": {
    topic: "edv",
    question: pageText("home", "common.assistant.79"),
    keywords: ["mission", "proteger", "eduquer", "nourrir", "soigner", "accompagner", "enfants", "orphelins", "familles", "veuves", "actions"],
    messages: [
      teaser("apercu-edv"),
      { kind: "cards", items: edvPillars.map((pillar) => ({ title: pillar.title, meta: pillar.number, text: pillar.text })) },
    ],
    options: edvBack,
  },
  "edv-orphelinat": {
    topic: "edv",
    question: pageText("home", "common.site.35"),
    keywords: ["orphelinat", "orphelins", "inauguration", "pensionnaires", "2015", "2016", "batiment", "dortoirs", "agrement", "infirmerie", "internat"],
    messages: [
      pageText("espoir-de-vie", "EdvOrphanage.4"),
      pageText("espoir-de-vie", "EdvOrphanage.5"),
      {kind:"cards",items:edvTimeline.map(item=>({title:item.title,meta:item.date?.label ?? item.step,text:item.text}))},
    ],
    options: [{ label: pageText("home", "common.assistant.83"), href: `${routes.edv}#orphelinat` }, ...edvBack],
  },
  "edv-presence": {
    topic: "edv",
    question: pageText("home", "common.assistant.77"),
    keywords: ["pays", "cote", "ivoire", "guinee", "burkina", "faso", "divo", "zaroko", "groh", "presence", "agit", "intervient"],
    messages: [{ kind: "cards", items: edvCountries.map((country) => ({ title: country.title, meta: country.number, text: country.text })) }],
    options: edvBack,
  },
  "edv-collaborer": {
    topic: "edv",
    question: pageText("home", "common.assistant.84"),
    keywords: ["collaborer", "collaboration", "aider", "aide", "benevole", "benevolat", "don", "dons", "donner", "soutenir", "contribuer", "partenaire"],
    messages: [("" + String(need("edv")) + (" " + pageText("home", "common.assistant.85")))],
    options: [
      { label: pageText("home", "common.assistant.86"), channel: "email" },
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
      { label: pageText("home", "common.assistant.87"), next: "groupe-presentation" },
      { label: pageText("home", "common.assistant.88"), next: "groupe-presence" },
      { label: pageText("home", "common.site.25"), next: "groupe-pdg" },
      { label: pageText("home", "common.assistant.89"), href: routes.news },
    ],
  },
  "groupe-presentation": {
    topic: "groupe",
    question: pageText("home", "common.assistant.87"),
    keywords: ["activites", "activite", "domaines", "domaine", "services", "secteurs", "hotellerie", "restauration", "agrobusiness", "agro", "cinema", "voitures", "luxe", "communication", "artistes", "clips", "enregistrement", "musique"],
    messages: [("" + String(activities.length) + (" " + pageText("home", "common.assistant.90"))), { kind: "chips", items: activities.map((activity) => activity.title) }],
    options: [{ label: pageText("home", "common.assistant.91"), href: routes.services }, ...groupBack],
  },
  "groupe-presence": {
    topic: "groupe",
    question: pageText("home", "common.assistant.88"),
    keywords: ["present", "presence", "pays", "senegal", "guinee", "cote", "ivoire", "implante", "bureaux", "afrique"],
    messages: [footers.home.blurb],
    options: [{ label: pageText("home", "common.site.37"), href: `${routes.group}#presence` }, ...groupBack],
  },
  "groupe-pdg": {
    topic: "groupe",
    question: pageText("home", "common.site.25"),
    keywords: ["pdg", "president", "fondateur", "dirigeant", "directeur", "krasso", "joel", "djoro", "shaloom"],
    messages: [teaser("apercu-about")],
    options: [{ label: pageText("home", "common.assistant.92"), href: `${routes.home}#president` }, ...groupBack],
  },

  /* ---------- Contact ---------- */
  contact: {
    topic: "contact",
    question: topicLabels.contact,
    keywords: ["contact", "contacter", "joindre", "coordonnees"],
    messages: [pageText("home", "common.assistant.93")],
    options: [
      { label: pageText("home", "common.assistant.94"), next: "contact-adresse" },
      { label: pageText("home", "common.assistant.95"), next: "contact-telephone" },
      { label: pageText("home", "common.assistant.96"), next: "contact-email" },
    ],
  },
  "contact-adresse": {
    topic: "contact",
    question: pageText("home", "common.assistant.94"),
    keywords: ["adresse", "siege", "horaires", "horaire", "ouvert", "ferme", "dimanche", "kobayah", "itineraire", "carte", "plan", "conakry"],
    messages: [
      { kind: "facts", items: [{ label: pageText("home", "common.assistant.97"), value: hqAddress }] },
      { kind: "table", title: pageText("home", "common.assistant.98"), rows: hqHours.map((slot) => ({ label: slot.days, value: slot.hours })) },
    ],
    options: [{ label: pageText("home", "common.assistant.56"), href: `${routes.contact}#carte` }, ...contactBack],
  },
  "contact-telephone": {
    topic: "contact",
    question: pageText("home", "common.assistant.95"),
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
    question: pageText("home", "common.assistant.96"),
    keywords: ["email", "mail", "courriel", "formulaire", "ecrire", "message", "envoyer"],
    messages: [
      { kind: "facts", items: [{ label: contacts.email.label, value: contacts.email.value, href: contacts.email.href }] },
      pageText("home", "common.assistant.99"),
    ],
    options: [
      { label: ((pageText("home", "common.assistant.100") + " ") + String(contacts.email.value) + ""), channel: "email" },
      { label: pageText("home", "common.assistant.26"), channel: "form" },
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
  return hour >= 18 || hour < 5 ? pageText("home", "common.assistant.101") : pageText("home", "common.assistant.102");
}
