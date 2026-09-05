import type { Metadata, Viewport } from "next";

import { EditionNav } from "@/components/jeca/EditionNav";
import { ForumEdition } from "@/components/jeca/ForumEdition";
import { ForumsIntro } from "@/components/jeca/ForumsIntro";
import { JecaCta } from "@/components/jeca/JecaCta";
import { JecaGalleryProvider } from "@/components/jeca/JecaGallery";
import { JecaGoree } from "@/components/jeca/JecaGoree";
import { JecaHero } from "@/components/jeca/JecaHero";
import { JecaNextEdition } from "@/components/jeca/JecaNextEdition";
import { JecaJourney } from "@/components/jeca/JecaJourney";
import { JecaVision } from "@/components/jeca/JecaVision";
import { PageShell } from "@/components/layout/PageShell";
import { jecaEditions, jecaGalleries } from "@/data/jeca";
import { routes, site } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: { absolute: "JECA — Vision, engagement et forums" },
  description:
    "Découvrez la JECA, créée en 2019, sa vision pour l’investissement en Afrique et les trois éditions de son forum.",
  alternates: pageAlternates(site.url + routes.jeca.slice(1)),
  openGraph: socialMetadata(jecaGalleries[0].photos[0]),
};

export const viewport: Viewport = {
  themeColor: "#061b53",
};

const galleryPhotos = jecaGalleries.flatMap((gallery) => gallery.photos);

export default function JecaPage() {
  return (
    <PageShell variant="jeca" current="jeca" footer="jeca">
      <JecaHero />
      <JecaNextEdition />
      <EditionNav />
      <JecaVision />
      <JecaJourney />
      <JecaGoree />
      <ForumsIntro />
      <JecaGalleryProvider photos={galleryPhotos}>
        <ForumEdition edition={jecaEditions[0]} gallery={jecaGalleries[0]} offset={0} />
        <ForumEdition edition={jecaEditions[1]} gallery={jecaGalleries[1]} offset={7} />
        <ForumEdition edition={jecaEditions[2]} gallery={jecaGalleries[2]} offset={14} />
      </JecaGalleryProvider>
      <JecaCta />
    </PageShell>
  );
}
