import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsPreview } from "@/components/home/NewsPreview";
import { PageTeaser } from "@/components/home/PageTeaser";
import { EdvImpactHighlights } from "@/components/espoir-de-vie/EdvImpactHighlights";
import { Marquee } from "@/components/ui/Marquee";
import { pageTeasers } from "@/data/home";
import { presidentPortrait } from "@/data/media";
import { site } from "@/data/site";
import { StructuredData } from "@/components/ui/StructuredData";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { organizationSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: pageAlternates(site.url),
  openGraph: socialMetadata(presidentPortrait),
};

const marqueeItems = [
  "Guinée",
  "Studio Photo",
  "Hôtesses événementielles",
  "Communication",
  "Entrepreneuriat",
  "Impact social",
];

export default function Home() {
  return (
    <PageShell variant="home" current="home" footer="home">
      <StructuredData data={organizationSchema} />
      <HeroSection />
      <Marquee items={marqueeItems} label="Domaines d’activité" />
      <ActivitiesSection />
      {pageTeasers.map((teaser) => (
        <PageTeaser key={teaser.id} {...teaser} />
      ))}
      <EdvImpactHighlights />
      <NewsPreview />
      <ContactCta />
    </PageShell>
  );
}
