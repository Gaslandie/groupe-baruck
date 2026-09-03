import Link from "next/link";

import { routes } from "@/data/site";

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3rem,6vw,6rem)]">
      <div className="mx-auto max-w-[720px]">
        <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
        <Link href={routes.news} className="text-link mt-12">
          Toutes les actualités <span>↖</span>
        </Link>
      </div>
    </section>
  );
}
