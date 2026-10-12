import { translate as t } from "../lib/language.ts";

import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";

export const metadata: Metadata = {
  title: t("Page introuvable"),
};

export default function NotFound() {
  return (
    <ConstructionPage
      index="404"
      eyebrow={t("Page introuvable")}
      title={t("Cette page")}
      emphasis={t("n’existe pas.")}
      text={t("L’adresse demandée ne correspond à aucune page du site du Groupe Baruck. Retrouvez l’accueil ou utilisez le menu.")}
      footerItems={["Groupe Baruck", "Vision · Excellence · Impact"]}
    />
  );
}
