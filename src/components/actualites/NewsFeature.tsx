import Link from "next/link";

import type { ArticleSummary } from "@/data/actualites";
import { routes } from "@/data/site";

import { NewsImage } from "./NewsImage";
import { NewsMeta } from "./NewsMeta";

type NewsFeatureProps = {
  article: ArticleSummary;
};

export function NewsFeature({ article }: NewsFeatureProps) {
  return (
    <Link
      href={`${routes.news}${article.slug}/`}
      className="group reveal mb-[clamp(4rem,7vw,7rem)] grid grid-cols-[1.1fr_.9fr] items-center gap-10 max-tablet:grid-cols-1"
    >
      <div className="reveal-media aspect-[4/3] overflow-hidden bg-[#cac5bb]">
        <NewsImage cover={article.cover} category={article.category} />
      </div>
      <div>
        <NewsMeta category={article.category} date={article.date} />
        <h2 className="mt-5 font-display text-[clamp(2.4rem,4vw,4.6rem)] font-normal leading-[.95] tracking-[-.045em]">
          {article.title}
        </h2>
        <p className="mt-5 max-w-[520px] text-[.95rem] leading-[1.7] text-[#696963]">
          {article.excerpt}
        </p>
        <span className="text-link mt-6">
          Lire l’article <span>↗</span>
        </span>
      </div>
    </Link>
  );
}
