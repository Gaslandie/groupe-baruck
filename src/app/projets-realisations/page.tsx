import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";
import { routes, site } from "@/data/site";

export const metadata: Metadata = {
  title: "Projets & Réalisations",
  description: "Projets et réalisations du Groupe Baruck — page en cours de construction.",
  alternates: { canonical: site.url + routes.projects.slice(1) },
};

export default function ProjectsPage() {
  return (
    <ConstructionPage
      index="À venir"
      eyebrow="Projets & Réalisations"
      text="Nos projets, productions et collaborations seront présentés ici prochainement."
      footerItems={["Groupe Baruck", "Imaginer · Construire · Réaliser"]}
    />
  );
}
