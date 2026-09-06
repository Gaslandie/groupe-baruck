import { assistantNodes, type AssistantNodeId } from "@/data/assistant";

/*
 * Recherche locale sur la saisie libre de l'assistant : aucun réseau, aucune IA.
 * On compare les mots de la question (accents retirés) aux intitulés et mots-clés des nœuds.
 */

const STOP_WORDS = new Set([
  "les", "des", "une", "est", "sont", "pour", "avec", "dans", "sur", "que", "qui", "quoi", "quel", "quelle",
  "quels", "quelles", "comment", "vous", "votre", "vos", "nous", "notre", "nos", "mon", "mes", "ils", "elles",
  "aux", "par", "pas", "plus", "bonjour", "bonsoir", "merci", "svp", "est-ce", "ce", "cet", "cette", "ces",
  "peut", "peux", "faire", "fait", "avoir", "etre", "ete", "j’ai", "jai", "moi", "toi", "lui", "leur", "leurs",
  "the", "and", "you", "your", "what", "how", "where", "when",
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
      const keywordTerms = [...new Set((node.keywords ?? []).map((keyword) => normalizeText(keyword).trim()))];
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
