/**
 * Contrat du fichier de coordonnées : uniquement ce que le client modifie.
 * Les intitulés des lignes de contact appartiennent au site (src/data/site.ts).
 * Le fichier est résolu par un alias de build (next.config.ts) pour qu'une
 * publication validée puisse le remplacer ; il n'est donc pas typé par
 * l'inférence JSON.
 */
declare module "@content/coordonnees.json" {
  const coordonnees: {
    contacts: Record<"landline" | "mobile" | "whatsappHq" | "whatsappCeo" | "email", string>;
    address: string;
    hours: { days: string; hours: string }[];
    facebookPages: { country: string; href: string }[];
    mapQuery: string;
  };

  export default coordonnees;
}

/**
 * Contrat du fichier de textes de l'accueil. Le code garde la structure — les
 * identifiants, les images, les dégradés, les liens — le fichier ne porte que
 * les mots. Résolu par le même alias de build que les coordonnées.
 */
declare module "@content/textes.json" {
  type Entry = { title: string; description: string };

  const textes: {
    heroSlides: Record<"guinee" | "studio-photo" | "hotesses", Entry>;
    activities: Record<"hotellerie" | "restauration" | "agrobusiness" | "studio" | "cinema" | "mobilite" | "communication" | "artistes" | "clips", Entry>;
  };

  export default textes;
}
