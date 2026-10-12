import { translate as t } from "../../../lib/language.ts";

import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArticleBody } from "@/components/actualites/ArticleBody";
import { ArticleCover } from "@/components/actualites/ArticleCover";
import { ArticleGroups } from "@/components/actualites/ArticleGroups";
import { ArticleHeader } from "@/components/actualites/ArticleHeader";
import { ArticleNavigation } from "@/components/actualites/ArticleNavigation";
import { ArticleShare } from "@/components/actualites/ArticleShare";
import { NewsCarousel } from "@/components/actualites/NewsCarousel";
import { NewsEmpty } from "@/components/actualites/NewsEmpty";
import { NewsHero } from "@/components/actualites/NewsHero";
import { PageShell } from "@/components/layout/PageShell";
import { newsDescription } from "@/data/actualites";
import { site } from "@/data/site";
import {
  getAdjacentArticles,
  getAllArticles,
  getArticle,
  placeholderSlug,
} from "@/lib/actualites";
import { StructuredData } from "@/components/ui/StructuredData";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
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
      title: t("Actualités"),
      description: newsDescription,
      alternates: pageAlternates(site.url + "actualites/"),
    };
  }

  const article = getArticle(slug);
  if (!article) notFound();

  return {
    title: article.title,
    description: article.excerpt,
    alternates: article.translationPending
      ? { canonical: `${site.url.replace(/\/en\//, "/")}actualites/${article.slug}/` }
      : pageAlternates(`${site.url}actualites/${article.slug}/`),
    ...(article.translationPending ? { robots: { index: false, follow: true } } : {}),
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

  const { previous, next } = getAdjacentArticles(article.slug);

  return (
    <PageShell variant="about" current="news" footer="about">
      <StructuredData data={articleSchema(article)} />
      <ArticleHeader article={article} />
      <ArticleCover cover={article.cover} />
      <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3rem,6vw,6rem)]">
        {article.translationPending ? (
          <p className="mx-auto mb-8 max-w-[720px] border-l-2 border-accent pl-4 text-body">
            This article is currently available in French. Its English translation is pending.
          </p>
        ) : null}
        <ArticleBody html={article.html} contentLanguage={article.translationPending ? "fr" : undefined} />
        <NewsCarousel gallery={article.gallery} />
        <ArticleGroups
          title={article.groupsTitle}
          intro={article.groupsIntro}
          groups={article.groups}
        />
        <ArticleShare
          title={article.title}
          url={`${site.url}actualites/${article.slug}/`}
        />
        <ArticleNavigation previous={previous} next={next} />
      </section>
    </PageShell>
  );
}
