import coordonnees from "@content/coordonnees.json" with { type: "json" };

/**
 * Coordonnées du Groupe : contenu modifiable depuis le back-office, importé
 * statiquement car l'en-tête, le formulaire de contact et l'assistant les
 * utilisent côté navigateur. Une publication validée le remplace au build.
 *
 * Aucun lien n'est saisi : ils se déduisent des numéros et de l'adresse, pour
 * qu'un numéro corrigé suffise à corriger tout le site.
 */
export const contactValues = coordonnees.contacts;
export const hqAddress = coordonnees.address;
export const hqHours = coordonnees.hours;
export const facebookPages = coordonnees.facebookPages;

export function telHref(value: string): string {
  return `tel:${value.replace(/[^0-9+]/g, "")}`;
}

export function whatsappHref(value: string): string {
  return `https://wa.me/${value.replace(/[^0-9]/g, "")}`;
}

export function mailtoHref(value: string): string {
  return `mailto:${value}`;
}

/** Google Maps encode les espaces de ses requêtes par « + ». */
const mapQuery = encodeURIComponent(coordonnees.mapQuery).replaceAll("%20", "+");

export const hqMap = {
  query: coordonnees.mapQuery,
  embedUrl: `https://www.google.com/maps?q=${mapQuery}&z=15&output=embed`,
  directionsUrl: `https://www.google.com/maps/search/?api=1&query=${mapQuery}`,
} as const;
