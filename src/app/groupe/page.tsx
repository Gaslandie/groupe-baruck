import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: "Le Groupe",
  description: "Présentation du Groupe Baruck — page en cours de construction.",
};

export default function GroupPage() {
  return (
    <ConstructionPage
      index="02 / 07"
      eyebrow="Le Groupe"
      text="Nous préparons actuellement cette page afin de vous présenter plus en détail la vision et les activités du Groupe Baruck."
      footerItems={["Groupe Baruck", "Vision · Excellence · Impact"]}
    />
  );
}
