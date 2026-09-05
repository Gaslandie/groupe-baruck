import { Suspense } from "react";

import { newsListId, type Article } from "@/data/actualites";
import { toArticleSummary } from "@/lib/actualites";

import { NewsEmpty } from "./NewsEmpty";
import { NewsFilter, NewsFilterView } from "./NewsFilter";

type NewsListProps = {
  articles: Article[];
};

export function NewsList({ articles }: NewsListProps) {
  const summaries = articles.map(toArticleSummary);

  return (
    <section
      id={newsListId}
      className="scroll-mt-[92px] bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]"
    >
      {articles.length === 0 ? (
        <NewsEmpty />
      ) : (
        // useSearchParams suspend au prérendu : le HTML statique contient le
        // fallback, soit la liste complète avec « Toutes » active.
        <Suspense fallback={<NewsFilterView articles={summaries} category={null} />}>
          <NewsFilter articles={summaries} />
        </Suspense>
      )}
    </section>
  );
}
