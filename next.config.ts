import fs from "node:fs";
import path from "node:path";

import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/*
 * Coordonnées et textes de l'accueil sont modifiables depuis le back-office,
 * mais l'en-tête, le formulaire de contact et l'assistant les utilisent côté
 * navigateur : aucun chargeur serveur ne peut les fournir. Ils passent donc par
 * un alias résolu au build, que la publication redirige vers le fichier validé.
 * L'alias est toujours posé : le dépôt et une publication empruntent le même
 * mécanisme.
 */
const bundledContent = ["coordonnees.json", "textes.json"];
const contentAlias = Object.fromEntries(
  bundledContent.map((name) => {
    const published = `./.backoffice-content/${name}`;
    return [
      `@content/${name}`,
      fs.existsSync(path.join(process.cwd(), published)) ? published : `./content/${name}`,
    ];
  }),
);

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: basePath || undefined,
  images: { unoptimized: true },
  reactStrictMode: true,
  agentRules: false,
  turbopack: { resolveAlias: contentAlias },
  webpack: (config) => {
    for (const [request, target] of Object.entries(contentAlias)) {
      config.resolve.alias[request] = path.resolve(target);
    }
    return config;
  },
};

export default nextConfig;
