import Link from "next/link";

import { NewsCard } from "@/components/actualites/NewsCard";
import { SectionHead } from "@/components/ui/SectionHead";
import { routes } from "@/data/site";
import { getAllArticles } from "@/lib/actualites";

export function NewsPreview() {
  const articles = getAllArticles().slice(0, 3);

  if (articles.length === 0) return null;

  return (
    <section
      id="actualites"
      className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <SectionHead
        eyebrow="Actualités"
        title="Les dernières nouvelles"
        text="Annonces, événements et communiqués du Groupe Baruck, de la JECA et d’Espoir de Vie."
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-3 gap-x-6 gap-y-14 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {articles.map((article) => (
          <NewsCard key={article.slug} article={article} />
        ))}
      </div>
      <Link href={routes.news} className="text-link mt-14">
        Toutes les actualités <span>↗</span>
      </Link>
    </section>
  );
}
