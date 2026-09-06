import type { Article } from "@/data/actualites";

import { NewsMeta } from "./NewsMeta";

type ArticleHeaderProps = {
  article: Article;
};

export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <NewsMeta category={article.category} date={article.date} light />
      <h1 className="mt-6 max-w-[1100px] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
        {article.title}
      </h1>
      <p className="lead mt-7 max-w-[720px] text-[rgba(255,255,255,.8)]">{article.excerpt}</p>
    </header>
  );
}
