import textes from "@content/textes.json" with { type: "json" };

/**
 * Textes de la page d'accueil modifiables depuis le back-office. Ils partent
 * dans le bundle du navigateur — l'assistant guidé les reprend — et suivent
 * donc le même alias de build que les coordonnées.
 */
export const siteTexts = textes;
