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
import { StructuredData } from "@/components/ui/StructuredData";
import { socialMetadata } from "@/lib/metadata";
import { articleSchema } from "@/lib/structured-data";

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
      alternates: { canonical: site.url + "actualites/" },
    };
  }

  const article = getArticle(slug);
  if (!article) notFound();

  return {
    title: article.title,
    description: article.excerpt,
    alternates: { canonical: `${site.url}actualites/${article.slug}/` },
    // Clé omise sans couverture, pour ne pas écraser l’héritage du layout.
    ...(article.cover ? { openGraph: socialMetadata(article.cover) } : {}),
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
      <StructuredData data={articleSchema(article)} />
      <ArticleHeader article={article} />
      <ArticleCover cover={article.cover} />
      <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3rem,6vw,6rem)]">
        <ArticleBody html={article.html} />
        <NewsCarousel gallery={article.gallery} />
      </section>
    </PageShell>
  );
}
