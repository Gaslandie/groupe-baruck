import { pageText } from "@/lib/page-content";
import { pageMetadata } from "@/lib/page-metadata";


import type { Metadata } from "next";

import { ConstructionPage } from "@/components/ui/ConstructionPage";
import { routes, site } from "@/data/site";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: pageMetadata("projets-realisations").title,
  description: pageMetadata("projets-realisations").description,
  alternates: pageAlternates(site.url + routes.projects.slice(1)),
};

export default function ProjectsPage() {
  return (
    <ConstructionPage
      index={pageText("projets-realisations", "copy.page.1")}
      eyebrow={pageText("projets-realisations", "copy.page.2")}
      text={pageText("projets-realisations", "copy.page.3")}
      footerItems={[site.name, pageText("projets-realisations", "copy.page.4")]}
    />
  );
}
