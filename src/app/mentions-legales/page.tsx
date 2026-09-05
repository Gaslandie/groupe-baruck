import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { LegalContent } from "@/components/legal/LegalContent";
import { LegalHero } from "@/components/legal/LegalHero";
import { routes, site } from "@/data/site";
import { pageAlternates } from "@/lib/metadata";

// Pas d'openGraph propre : l'image sociale du layout (logo) reste le repli.
export const metadata: Metadata = {
  title: "Mentions légales et confidentialité",
  description:
    "Mentions légales, hébergement, confidentialité, formulaire de contact et crédits photographiques du site Groupe Baruck.",
  alternates: pageAlternates(site.url + routes.legal.slice(1)),
};

export default function LegalPage() {
  return (
    <PageShell variant="about" footer="about">
      <LegalHero />
      <LegalContent />
    </PageShell>
  );
}
