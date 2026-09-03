import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: "Page introuvable",
};

export default function NotFound() {
  return (
    <ConstructionPage
      index="404"
      eyebrow="Page introuvable"
      title="Cette page"
      emphasis="n’existe pas."
      text="L’adresse demandée ne correspond à aucune page du site du Groupe Baruck. Retrouvez l’accueil ou utilisez le menu."
      footerItems={["Groupe Baruck", "Vision · Excellence · Impact"]}
    />
  );
}
