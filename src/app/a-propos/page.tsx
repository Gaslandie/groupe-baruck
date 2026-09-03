import type { Metadata } from "next";

import { AboutCommitments } from "@/components/about/AboutCommitments";
import { AboutCta } from "@/components/about/AboutCta";
import { AboutHero } from "@/components/about/AboutHero";
import { AboutIntro } from "@/components/about/AboutIntro";
import { AboutOnu } from "@/components/about/AboutOnu";
import { AboutPresence } from "@/components/about/AboutPresence";
import { AboutQuote } from "@/components/about/AboutQuote";
import { AboutRoles } from "@/components/about/AboutRoles";
import { PageShell } from "@/components/layout/PageShell";
import { Marquee } from "@/components/ui/Marquee";

export const metadata: Metadata = {
  title: "À propos",
  description:
    "À propos du Groupe Baruck — la direction, les fonctions et les engagements de MR Djoro Joël Shaloom Krasso, PDG du Groupe Baruck, président de la JECA et de l’ONG Espoir de Vie.",
};

const marqueeItems = [
  "Leadership",
  "Entrepreneuriat",
  "Impact social",
  "Guinée",
  "Sénégal",
  "Côte d’Ivoire",
];

export default function AboutPage() {
  return (
    <PageShell variant="about" current="about" footer="about">
      <AboutHero />
      <Marquee items={marqueeItems} label="Repères du Groupe Baruck" />
      <AboutIntro />
      <AboutRoles />
      <AboutOnu />
      <AboutQuote />
      <AboutPresence />
      <AboutCommitments />
      <AboutCta />
    </PageShell>
  );
}
