import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/actualites/ArticleBody";
import { ArticleCover } from "@/components/actualites/ArticleCover";
import { ArticleHeader } from "@/components/actualites/ArticleHeader";
import { NewsCarousel } from "@/components/actualites/NewsCarousel";
import { NewsEmpty } from "@/components/actualites/NewsEmpty";
import { NewsHero } from "@/components/actualites/NewsHero";
import { PageShell } from "@/components/layout/PageShell";
import { site } from "@/data/site";
import {
  getAllArticles,
  getArticle,
  placeholderSlug,
} from "@/lib/actualites";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const articles = getAllArticles();
  return articles.length
    ? articles.map((article) => ({ slug: article.slug }))
    : [{ slug: placeholderSlug }];
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug === placeholderSlug) {
    return {
      title: "Actualités",
      description:
        "Actualités du Groupe Baruck — annonces, événements et communiqués du Groupe, de la JECA et d’Espoir de Vie.",
    };
  }

  const article = getArticle(slug);
  if (!article) notFound();

  return {
    title: article.title,
    description: article.excerpt,
    // URL absolue : site.url porte déjà le basePath, ne pas repasser par asset().
    // Clé omise sans couverture, pour ne pas écraser l’héritage du layout.
    ...(article.cover
      ? {
          openGraph: {
            images: [site.url + article.cover.src.slice(1)],
          },
        }
      : {}),
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    if (slug === placeholderSlug && getAllArticles().length === 0) {
      return (
        <PageShell variant="about" current="news" footer="about">
          <NewsHero />
          <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]">
            <NewsEmpty />
          </section>
        </PageShell>
      );
    }

    notFound();
  }

  return (
    <PageShell variant="about" current="news" footer="about">
      <ArticleHeader article={article} />
      <ArticleCover cover={article.cover} />
      <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3rem,6vw,6rem)]">
        <ArticleBody html={article.html} />
        <NewsCarousel gallery={article.gallery} />
      </section>
    </PageShell>
  );
}
