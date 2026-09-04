import type { Article } from "@/data/actualites";

import { NewsCard } from "./NewsCard";
import { NewsEmpty } from "./NewsEmpty";
import { NewsFeature } from "./NewsFeature";

type NewsListProps = {
  articles: Article[];
};

export function NewsList({ articles }: NewsListProps) {
  return (
    <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]">
      {articles.length === 0 ? (
        <NewsEmpty />
      ) : (
        <>
          <NewsFeature article={articles[0]} />
          <div className="reveal-stagger grid grid-cols-3 gap-x-6 gap-y-14 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
            {articles.slice(1).map((article) => (
              <NewsCard key={article.slug} article={article} />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
