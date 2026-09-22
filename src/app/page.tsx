import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { FeaturedEvent } from "@/components/home/FeaturedEvent";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsPreview } from "@/components/home/NewsPreview";
import { PageTeaser } from "@/components/home/PageTeaser";
import { mainActivities, pageTeasers } from "@/data/home";
import { presidentPortrait } from "@/data/media";
import { site } from "@/data/site";
import { StructuredData } from "@/components/ui/StructuredData";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { organizationSchema } from "@/lib/structured-data";

export const metadata: Metadata = {
  alternates: pageAlternates(site.url),
  openGraph: socialMetadata(presidentPortrait),
};

export default function Home() {
  return (
    <PageShell variant="home" current="home" footer="home">
      <StructuredData data={organizationSchema} />
      <HeroSection />
      {/*
        Les concours organisés par le groupe passent juste sous le hero
        (2026-09-22) : le client veut que l'on voie ses réalisations en image
        dès la sortie du hero, avant la présentation des activités.
      */}
      <FeaturedEvent />
      {/* Activités principales : les trois volets de l'ancien carrousel du hero. */}
      {mainActivities.map((activity, index) => (
        <PageTeaser key={activity.id} {...activity} reverse={index % 2 === 0} />
      ))}
      <ActivitiesSection />
      {/* Les aperçus alternent image / texte d'un bloc à l'autre. */}
      {pageTeasers.map((teaser, index) => (
        <PageTeaser key={teaser.id} {...teaser} reverse={index % 2 === 1} />
      ))}
      <NewsPreview />
      <ContactCta />
    </PageShell>
  );
}
