import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsPreview } from "@/components/home/NewsPreview";
import { PageTeaser } from "@/components/home/PageTeaser";
import { EdvImpactHighlights } from "@/components/espoir-de-vie/EdvImpactHighlights";
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

/** Les aperçus alternent image / texte d'un bloc à l'autre, dans l'ordre de la page. */
const studioTeaser = pageTeasers.find((teaser) => teaser.id === "apercu-studio");
const otherTeasers = pageTeasers.filter((teaser) => teaser.id !== "apercu-studio");

export default function Home() {
  return (
    <PageShell variant="home" current="home" footer="home">
      <StructuredData data={organizationSchema} />
      <HeroSection />
      {studioTeaser ? <PageTeaser {...studioTeaser} reverse /> : null}
      <ActivitiesSection />
      {otherTeasers.map((teaser, index) => (
        <PageTeaser key={teaser.id} {...teaser} reverse={index % 2 === 1} />
      ))}
      <EdvImpactHighlights />
      <NewsPreview />
      <ContactCta />
    </PageShell>
  );
}
