import type { Article } from "@/data/actualites";
import { routes } from "@/data/site";
import { pageText } from "@/lib/page-content";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

import { NewsMeta } from "./NewsMeta";

type ArticleHeaderProps = {
  article: Article;
};

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <Breadcrumbs items={[
        { name: pageText("home", "common.site.9"), href: routes.home },
        { name: pageText("home", "common.site.18"), href: routes.news },
        { name: article.title, href: `${routes.news}${article.slug}/` },
      ]} />
      <NewsMeta category={article.category} date={article.date} datePrecision={article.datePrecision} light />
      <h1 className="mt-6 max-w-[1100px] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
        {article.title}
      </h1>
      <p className="lead mt-7 max-w-[720px] text-[rgba(255,255,255,.8)]">{article.excerpt}</p>
    </header>
  );
}
