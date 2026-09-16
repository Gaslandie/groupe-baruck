import type { Metadata } from "next";

import { AboutCommitments } from "@/components/about/AboutCommitments";
import { AboutCommunication } from "@/components/about/AboutCommunication";
import { AboutCta } from "@/components/about/AboutCta";
import { EdvImpactHighlights } from "@/components/espoir-de-vie/EdvImpactHighlights";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutMilestones } from "@/components/about/AboutMilestones";
import { AboutOnu } from "@/components/about/AboutOnu";
import { AboutPresence } from "@/components/about/AboutPresence";
import { AboutQuote } from "@/components/about/AboutQuote";
import { AboutRoles } from "@/components/about/AboutRoles";
import { PageShell } from "@/components/layout/PageShell";
import { presidentOnu1 } from "@/data/media";
import { routes, site } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Le Groupe",
  description:
    "Le Groupe Baruck — la direction, les fonctions et les engagements de MR Djoro Joël Shaloom Krasso, PDG du Groupe Baruck, président de la JECA et de l’ONG Espoir de Vie.",
  alternates: pageAlternates(site.url + routes.group.slice(1)),
  openGraph: socialMetadata(presidentOnu1),
};

export default function GroupPage() {
  // Bandeau d’en-tête plein (variante home) : le hero est désormais sur fond crème.
  return (
    <PageShell variant="home" current="group" footer="about">
      <AboutHero />
      <AboutIntro />
      <AboutCommunication />
      <AboutMilestones />
      <AboutRoles />
      <AboutOnu />
      <AboutQuote />
      <AboutPresence />
      <AboutCommitments />
      <EdvImpactHighlights />
      <AboutCta />
    </PageShell>
  );
}
