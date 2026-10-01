/**
 * Date ISO (YYYY-MM-DD) en toutes lettres, en français.
 * Fuseau UTC explicite : le rendu est identique au build et dans le navigateur,
 * quel que soit le fuseau du visiteur.
 */
export function formatDate(iso: string, precision?: "year"): string {
  if (precision === "year") return iso.slice(0, 4);
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
