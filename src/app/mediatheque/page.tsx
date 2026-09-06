import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { MediaHero } from "@/components/mediatheque/MediaHero";
import { MediaLibrary } from "@/components/mediatheque/MediaLibrary";
import { jecaGalleries } from "@/data/jeca";
import { routes, site } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Médiathèque",
  description:
    "Médiathèque du Groupe Baruck — galeries des éditions de la JECA et du Studio Photo Baruck.",
  alternates: pageAlternates(site.url + routes.media.slice(1)),
  openGraph: socialMetadata(jecaGalleries[2].photos[0]),
};

export default function MediaPage() {
  return (
    <PageShell variant="about" current="media" footer="about">
      <MediaHero />
      <MediaLibrary />
    </PageShell>
  );
}
