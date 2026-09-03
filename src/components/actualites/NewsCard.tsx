import Link from "next/link";

import type { Article } from "@/data/actualites";
import { routes } from "@/data/site";

import { NewsImage } from "./NewsImage";
import { NewsMeta } from "./NewsMeta";

type NewsCardProps = {
  article: Article;
};

export function NewsCard({ article }: NewsCardProps) {
  return (
    <Link
      href={`${routes.news}${article.slug}/`}
      className="group reveal flex flex-col"
    >
      <div className="mb-5 aspect-[4/3] overflow-hidden bg-[#cac5bb]">
        <NewsImage cover={article.cover} category={article.category} />
      </div>
      <NewsMeta category={article.category} date={article.date} />
      <h3 className="mt-4 font-display text-[clamp(1.5rem,2vw,2rem)] font-normal leading-[1.05] tracking-[-.035em]">
        {article.title}
      </h3>
      <p className="mt-3 text-[.86rem] leading-[1.65] text-[#696963]">{article.excerpt}</p>
      <span className="mt-5 text-[.6rem] uppercase tracking-[.14em] text-accent">Lire ↗</span>
    </Link>
  );
}
