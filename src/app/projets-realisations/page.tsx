import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: "Projets & Réalisations",
  description: "Projets et réalisations du Groupe Baruck — page en cours de construction.",
};

export default function ProjectsPage() {
  return (
    <ConstructionPage
      index="06 / 07"
      eyebrow="Projets & Réalisations"
      text="Nos projets, productions et collaborations seront présentés ici prochainement."
      footerItems={["Groupe Baruck", "Imaginer · Construire · Réaliser"]}
    />
  );
}
