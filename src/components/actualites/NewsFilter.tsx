"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, type Ref } from "react";

import {
  categoryLabels,
  newsListId,
  type ArticleSummary,
  type NewsCategory,
} from "@/data/actualites";
import { routes } from "@/data/site";
import { revealWithin } from "@/lib/reveal";

import { NewsCard } from "./NewsCard";
import { NewsFeature } from "./NewsFeature";

/** Catégories réellement présentes dans les articles, dans l’ordre de categoryLabels. */
function availableCategories(articles: ArticleSummary[]): NewsCategory[] {
  return (Object.keys(categoryLabels) as NewsCategory[]).filter((category) =>
    articles.some((article) => article.category === category),
  );
}

function filterHref(category: NewsCategory | null): string {
  const query = category ? `?categorie=${category}` : "";
  return `${routes.news}${query}#${newsListId}`;
}

const filterLinkClass =
  "inline-flex min-h-11 items-center border px-[1.1rem] text-[.6rem] uppercase tracking-[.14em] transition-[background,color,border-color] duration-[250ms]";

type NewsFilterViewProps = {
  articles: ArticleSummary[];
  /** Valeur brute de ?categorie= ; inconnue ou absente → « Toutes ». */
  category: string | null;
  ref?: Ref<HTMLDivElement>;
};

/**
 * Rendu pur des filtres et de la liste. Sert de fallback statique (six articles,
 * « Toutes » active) et de rendu client une fois la query lue.
 */
export function NewsFilterView({ articles, category, ref }: NewsFilterViewProps) {
  const categories = availableCategories(articles);
  const active = categories.find((item) => item === category) ?? null;
  const filtered = active
    ? articles.filter((article) => article.category === active)
    : articles;
  const [feature, ...rest] = filtered;

  if (!feature) return null;

  return (
    <div ref={ref}>
      {categories.length > 1 ? (
        <nav
          aria-label="Filtrer les actualités par catégorie"
          className="mb-[clamp(2.5rem,4vw,4rem)]"
        >
          <ul className="m-0 flex list-none flex-wrap gap-[.6rem] p-0">
            {[null, ...categories].map((item) => {
              const isActive = item === active;

              return (
                <li key={item ?? "toutes"}>
                  <Link
                    href={filterHref(item)}
                    aria-current={isActive ? "true" : undefined}
                    className={`${filterLinkClass} ${
                      isActive
                        ? "border-ink bg-ink text-ivory"
                        : "border-line text-[#696963] hover:border-ink hover:text-ink"
                    }`}
                  >
                    {item ? categoryLabels[item] : "Toutes"}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
      <div key={active ?? "toutes"}>
        <NewsFeature article={feature} />
        <div className="reveal-stagger grid grid-cols-3 gap-x-6 gap-y-14 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
          {rest.map((article) => (
            <NewsCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </div>
  );
}

type NewsFilterProps = {
  articles: ArticleSummary[];
};

/** Lit ?categorie= côté client ; à envelopper dans Suspense (prérendu statique). */
export function NewsFilter({ articles }: NewsFilterProps) {
  const category = useSearchParams().get("categorie");
  const rootRef = useRef<HTMLDivElement>(null);

  // Le contenu est rendu côté client après RevealObserver : on révèle ici les
  // cartes montées par ce composant, à chaque changement de filtre.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return revealWithin(root);
  }, [category]);

  return <NewsFilterView ref={rootRef} articles={articles} category={category} />;
}
