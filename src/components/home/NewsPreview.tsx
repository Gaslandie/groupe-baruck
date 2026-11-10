import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { NewsCard } from "@/components/actualites/NewsCard";
import { SectionHead } from "@/components/ui/SectionHead";

import { getAllArticles } from "@/lib/actualites";
import { Icon } from "../ui/Icon";

export function NewsPreview() {
  const articles = getAllArticles().slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section
      id="actualites"
      className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <SectionHead
        eyebrow={pageText("home", "NewsPreview.1")}
        title={pageText("home", "NewsPreview.2")}
        text={pageText("home", "NewsPreview.3")}
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-3 gap-x-6 gap-y-14 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
      <Link href={pageValue<string>("home", "NewsPreview.4")} className="text-link mt-14">{pageText("home", "NewsPreview.5") + " "}<span><Icon name={pageLinkIcon("home", "NewsPreview.4")} /></span>
      </Link>
    </section>
  );
}
