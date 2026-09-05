import type { Metadata } from "next";

import { NewsHero } from "@/components/actualites/NewsHero";
import { NewsList } from "@/components/actualites/NewsList";
import { PageShell } from "@/components/layout/PageShell";
import { routes, site } from "@/data/site";
import { newsDescription } from "@/data/actualites";
import { getAllArticles } from "@/lib/actualites";
import { pageAlternates, socialMetadata } from "@/lib/metadata";

// Première couverture publiée, dans l'ordre de getAllArticles().
// Clé omise si aucun article n'en a : le logo du layout reste le repli.
const firstCover = getAllArticles().find((article) => article.cover)?.cover;

export const metadata: Metadata = {
  title: "Actualités",
  description: newsDescription,
  alternates: pageAlternates(site.url + routes.news.slice(1)),
  ...(firstCover ? { openGraph: socialMetadata(firstCover) } : {}),
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
