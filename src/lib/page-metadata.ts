import { pageText } from "./page-content";

/** Données validées résolues au build ; les brouillons restent dans le back-office. */
export function pageMetadata(id: string): { title: string; description: string } {
  return { title: pageText(id, "meta.title"), description: pageText(id, "meta.description") };
}
