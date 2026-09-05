import type { Metadata, Viewport } from "next";

import { EdvActions } from "@/components/espoir-de-vie/EdvActions";
import { EdvArchives } from "@/components/espoir-de-vie/EdvArchives";
import { EdvCollaborations } from "@/components/espoir-de-vie/EdvCollaborations";
import { EdvCta } from "@/components/espoir-de-vie/EdvCta";
import { EdvHero } from "@/components/espoir-de-vie/EdvHero";
import { EdvImpact } from "@/components/espoir-de-vie/EdvImpact";
import { EdvMission } from "@/components/espoir-de-vie/EdvMission";
import { EdvOrphanage } from "@/components/espoir-de-vie/EdvOrphanage";
import { EdvPresence } from "@/components/espoir-de-vie/EdvPresence";
import { EdvSectionNav } from "@/components/espoir-de-vie/EdvSectionNav";
import { PageShell } from "@/components/layout/PageShell";
import { edvLogo } from "@/data/media";
import { routes, site } from "@/data/site";
import { StructuredData } from "@/components/ui/StructuredData";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { espoirDeVieSchema } from "@/lib/structured-data";

const description =
  "Découvrez Espoir de Vie, ses actions en faveur des enfants, des familles et des personnes vulnérables en Côte d’Ivoire, en Guinée et au Burkina Faso.";

export const metadata: Metadata = {
  title: { absolute: "Espoir de Vie — Protéger, accompagner, redonner espoir" },
  description,
  alternates: pageAlternates(site.url + routes.edv.slice(1)),
  openGraph: socialMetadata(edvLogo),
};

export const viewport: Viewport = {
  themeColor: "#1a100b",
};

export default function EspoirDeViePage() {
  return (
    <PageShell variant="edv" current="edv" footer="edv" mainClassName="overflow-hidden">
      <StructuredData data={espoirDeVieSchema(description)} />
      <EdvHero />
      <EdvSectionNav />
      <EdvMission />
      <EdvImpact />
      <EdvOrphanage />
      <EdvActions />
      <EdvPresence />
      <EdvArchives />
      <EdvCollaborations />
      <EdvCta />
    </PageShell>
  );
}
