/**
 * Date ISO (YYYY-MM-DD) en toutes lettres, en français.
 * Fuseau UTC explicite : le rendu est identique au build et dans le navigateur,
 * quel que soit le fuseau du visiteur.
 */
export function formatDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
