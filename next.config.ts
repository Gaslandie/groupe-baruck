import fs from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
 * Les coordonnées sont un contenu modifiable depuis le back-office, mais
 * l'en-tête, le formulaire de contact et l'assistant les utilisent côté
 * navigateur : elles ne peuvent pas être lues par un chargeur serveur. Elles
 * passent donc par un alias résolu au build, que la publication redirige vers
 * le fichier validé. L'alias est toujours posé : le chemin du dépôt et celui
 * d'une publication empruntent le même mécanisme.
 */
const published = "./.backoffice-content/coordonnees.json";
const contactsFile = fs.existsSync(path.join(process.cwd(), published))
  ? published
  : "./content/coordonnees.json";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  agentRules: false,
  turbopack: { resolveAlias: { "@content/coordonnees.json": contactsFile } },
  webpack: (config) => {
    config.resolve.alias["@content/coordonnees.json"] = path.resolve(contactsFile);
    return config;
  },
};

export default nextConfig;
