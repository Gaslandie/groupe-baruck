import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ActivitiesSection } from "@/components/home/ActivitiesSection";
import { ContactCta } from "@/components/home/ContactCta";
import { HeroSection } from "@/components/home/HeroSection";
import { NewsPreview } from "@/components/home/NewsPreview";
import { PageTeaser } from "@/components/home/PageTeaser";
import { Marquee } from "@/components/ui/Marquee";
import { pageTeasers } from "@/data/home";
import { site } from "@/data/site";

export const metadata: Metadata = {
  alternates: { canonical: site.url },
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
      <HeroSection />
      <Marquee items={marqueeItems} label="Domaines d’activité" />
      <ActivitiesSection />
      {pageTeasers.map((teaser) => (
        <PageTeaser key={teaser.id} {...teaser} />
      ))}
      <NewsPreview />
      <ContactCta />
    </PageShell>
  );
}
