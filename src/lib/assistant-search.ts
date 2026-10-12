import { isEnglish } from "./language.ts";

import { assistantNodes, type AssistantNodeId } from "@/data/assistant";

/*
 * Recherche locale sur la saisie libre de l'assistant : aucun réseau, aucune IA.
 * On compare les mots de la question (accents retirés) aux intitulés et mots-clés des nœuds.
 */

/** Synonymes anglais des mêmes sujets, sans réponse ni service supplémentaire. */
const englishKeywords: Record<string, string[]> = {
  "humain": ["human"],
  "personne": ["person"],
  "quelqu\u2019un": ["someone"],
  "conseiller": ["advisor"],
  "equipe": ["team"],
  "parler": ["talk"],
  "responsable": ["manager"],
  "photographe": ["photographer"],
  "seance": ["session"],
  "prix": ["price", "prices"],
  "tarif": ["price"],
  "tarifs": ["prices"],
  "cout": ["cost"],
  "coute": ["cost"],
  "combien": ["much"],
  "devis": ["quote", "quotation"],
  "formule": ["package"],
  "mannequin": ["model", "modelling"],
  "mariage": ["wedding"],
  "rendez-vous": ["appointment"],
  "rdv": ["appointment"],
  "horaire": ["hours"],
  "horaires": ["hours"],
  "ouvert": ["open"],
  "ouverture": ["opening"],
  "heure": ["hour"],
  "heures": ["hours"],
  "quand": ["when"],
  "disponible": ["available"],
  "reserver": ["book"],
  "adresse": ["address"],
  "situe": ["located"],
  "trouve": ["find"],
  "lieu": ["location"],
  "localisation": ["location"],
  "pharmacie": ["pharmacy"],
  "deplacement": ["travel"],
  "deplacez": ["travel"],
  "deplace": ["travel"],
  "exterieur": ["outdoor"],
  "materiel": ["equipment"],
  "evenement": ["event"],
  "domicile": ["home"],
  "reflecteur": ["reflector"],
  "interieur": ["inland"],
  "pays": ["country", "countries"],
  "identite": ["identity", "id"],
  "passeport": ["passport"],
  "pieces": ["prints"],
  "piece": ["print"],
  "carte": ["card", "map"],
  "anniversaire": ["birthday"],
  "enfant": ["child"],
  "enfants": ["children"],
  "ballons": ["balloons"],
  "fete": ["party"],
  "bebe": ["baby"],
  "hotesse": ["hostess"],
  "hotesses": ["hostesses"],
  "evenementiel": ["event"],
  "evenementielles": ["events"],
  "accueil": ["welcome"],
  "orientation": ["guidance"],
  "prestation": ["service"],
  "prestations": ["services"],
  "proposent": ["offer"],
  "lancement": ["launch"],
  "evenements": ["events"],
  "soiree": ["evening"],
  "ceremonie": ["ceremony"],
  "rencontre": ["meeting"],
  "reservation": ["booking"],
  "louer": ["hire"],
  "engager": ["hire"],
  "commander": ["order"],
  "chretiens": ["christian"],
  "africains": ["african"],
  "investir": ["invest"],
  "investissement": ["investment"],
  "afrique": ["africa"],
  "objectif": ["aim"],
  "prochaine": ["next"],
  "programme": ["programme", "program"],
  "galerie": ["gallery"],
  "participer": ["participate"],
  "intervenir": ["speak"],
  "intervenant": ["speaker"],
  "inscription": ["registration"],
  "inscrire": ["register"],
  "soutenir": ["support"],
  "partenaire": ["partner"],
  "partenariat": ["partnership"],
  "ong": ["ngo"],
  "humanitaire": ["humanitarian"],
  "solidarite": ["solidarity"],
  "proteger": ["protect"],
  "eduquer": ["educate"],
  "nourrir": ["feed"],
  "soigner": ["care"],
  "accompagner": ["support"],
  "orphelins": ["orphans"],
  "familles": ["families"],
  "veuves": ["widows"],
  "orphelinat": ["orphanage"],
  "pensionnaires": ["residents"],
  "batiment": ["building"],
  "dortoirs": ["dormitories"],
  "agrement": ["approval"],
  "infirmerie": ["infirmary"],
  "internat": ["boarding"],
  "guinee": ["guinea"],
  "agit": ["works"],
  "intervient": ["works"],
  "collaborer": ["collaborate"],
  "aider": ["help"],
  "aide": ["help"],
  "benevole": ["volunteer"],
  "benevolat": ["volunteering"],
  "don": ["donation"],
  "dons": ["donations"],
  "donner": ["give"],
  "contribuer": ["contribute"],
  "groupe": ["group"],
  "entreprise": ["business"],
  "societe": ["company"],
  "activites": ["activities"],
  "activite": ["activity"],
  "domaines": ["areas"],
  "domaine": ["area"],
  "secteurs": ["sectors"],
  "hotellerie": ["hospitality"],
  "restauration": ["restaurants", "catering"],
  "voitures": ["cars"],
  "luxe": ["luxury"],
  "artistes": ["artists"],
  "clips": ["videos"],
  "enregistrement": ["recording"],
  "musique": ["music"],
  "implante": ["based"],
  "bureaux": ["offices"],
  "pdg": ["ceo"],
  "fondateur": ["founder"],
  "dirigeant": ["leader"],
  "directeur": ["director"],
  "contacter": ["contact"],
  "joindre": ["contact"],
  "coordonnees": ["details"],
  "siege": ["headquarters"],
  "ferme": ["closed"],
  "dimanche": ["sunday"],
  "itineraire": ["directions"],
  "plan": ["map"],
  "telephone": ["telephone", "phone"],
  "appeler": ["call"],
  "appel": ["call"],
  "numero": ["number"],
  "fixe": ["landline"],
  "portable": ["mobile"],
  "courriel": ["email"],
  "formulaire": ["form"],
  "ecrire": ["write"],
  "envoyer": ["send"],
};

const STOP_WORDS = new Set([
  "les", "des", "une", "est", "sont", "pour", "avec", "dans", "sur", "que", "qui", "quoi", "quel", "quelle",
  "quels", "quelles", "comment", "vous", "votre", "vos", "nous", "notre", "nos", "mon", "mes", "ils", "elles",
  "aux", "par", "pas", "plus", "bonjour", "bonsoir", "merci", "svp", "est-ce", "ce", "cet", "cette", "ces",
  "peut", "peux", "faire", "fait", "avoir", "etre", "ete", "j’ai", "jai", "moi", "toi", "lui", "leur", "leurs",
  "the", "and", "you", "your", "what", "how", "where", "when",
  ...(isEnglish ? ["which", "does", "can", "are", "would", "could", "have", "will", "please"] : []),
]);

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ");
}

export function tokenize(value: string): string[] {
  return normalizeText(value)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token));
}

/* Un mot de l'intitulé de la question pèse plus qu'un mot-clé : « photo d'identité »
   doit l'emporter sur « combien coûte » (mots-clés des tarifs). */
const QUESTION_WEIGHT = 2;
const KEYWORD_WEIGHT = 1;

type IndexEntry = { id: AssistantNodeId; questionTerms: string[]; keywordTerms: string[] };

let index: IndexEntry[] | null = null;

function buildIndex(): IndexEntry[] {
  return (Object.keys(assistantNodes) as AssistantNodeId[])
    .map((id) => {
      const node = assistantNodes[id];
      const questionTerms = node.question ? [...new Set(tokenize(node.question))] : [];
      const keywordTerms = [...new Set((node.keywords ?? []).flatMap((keyword) => {
        const normalized = normalizeText(keyword).trim();
        return [normalized, ...(isEnglish ? englishKeywords[normalized] ?? [] : [])];
      }))];
      return { id, questionTerms, keywordTerms };
    })
    .filter((entry) => entry.questionTerms.length + entry.keywordTerms.length > 0);
}

function matches(term: string, query: string): boolean {
  if (term === query) return true;
  if (query.length >= 4 && term.startsWith(query)) return true;
  if (term.length >= 4 && query.startsWith(term)) return true;
  return false;
}

/** Nœuds les mieux notés (ex æquo conservés, quatre au plus), vide si rien ne correspond. */
export function searchAssistant(query: string): AssistantNodeId[] {
  const words = [...new Set(tokenize(query))];
  if (!words.length) return [];
  index ??= buildIndex();

  const scored = index
    .map((entry) => {
      const score = words.reduce((total, word) => {
        if (entry.questionTerms.some((term) => matches(term, word))) return total + QUESTION_WEIGHT;
        if (entry.keywordTerms.some((term) => matches(term, word))) return total + KEYWORD_WEIGHT;
        return total;
      }, 0);
      return { id: entry.id, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  if (!scored.length) return [];
  const best = scored[0].score;
  return scored.filter((entry) => entry.score === best).slice(0, 4).map((entry) => entry.id);
}
