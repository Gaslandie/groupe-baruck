import { translate as t } from "../../lib/language.ts";

import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";
import { routes, site } from "@/data/site";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: t("Projets & Réalisations"),
  description: t("Projets et réalisations du Groupe Baruck — page en cours de construction."),
  alternates: pageAlternates(site.url + routes.projects.slice(1)),
};

export default function ProjectsPage() {
  return (
    <ConstructionPage
      index={t("À venir")}
      eyebrow={t("Projets & Réalisations")}
      text={t("Nos projets, productions et collaborations seront présentés ici prochainement.")}
      footerItems={["Groupe Baruck", t("Imaginer · Construire · Réaliser")]}
    />
  );
}
