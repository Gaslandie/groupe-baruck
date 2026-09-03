import type { Metadata } from "next";

import { NewsHero } from "@/components/actualites/NewsHero";
import { NewsList } from "@/components/actualites/NewsList";
import { PageShell } from "@/components/layout/PageShell";
import { getAllArticles } from "@/lib/actualites";

export const metadata: Metadata = {
  title: "Actualités",
  description:
    "Actualités du Groupe Baruck — annonces, événements et communiqués du Groupe, de la JECA et d’Espoir de Vie.",
};

export default function NewsPage() {
  const articles = getAllArticles();

  return (
    <PageShell variant="about" current="news" footer="about">
      <NewsHero />
      <NewsList articles={articles} />
    </PageShell>
  );
}
