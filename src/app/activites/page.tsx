import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: "Activités",
  description: "Activités du Groupe Baruck — page en cours de construction.",
};

export default function ActivitiesPage() {
  return (
    <ConstructionPage
      index="05 / 07"
      eyebrow="Nos activités"
      text="Nous préparons une présentation complète des neuf domaines d’activité du Groupe Baruck."
      footerItems={["Groupe Baruck", "Hospitalité · Création · Développement"]}
    />
  );
}
