import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact du Groupe Baruck — page en cours de construction.",
};

export default function ContactPage() {
  return (
    <ConstructionPage
      index="07 / 07"
      eyebrow="Contact"
      text="La page de contact complète sera disponible prochainement. Les coordonnées restent accessibles sur la page d’accueil."
      footerItems={[
        "Groupe Baruck",
        "Téléphone fixe Baruck Siège Guinée : +224 625 19 72 58",
        "WhatsApp Baruck Siège Guinée : +224 623 72 04 27",
      ]}
    />
  );
}
