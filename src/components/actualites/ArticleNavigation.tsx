import Link from "next/link";

import type { ArticleSummary } from "@/data/actualites";
import { routes } from "@/data/site";

type ArticleNavigationProps = {
  /** Article plus récent. */
  previous?: ArticleSummary;
  /** Article plus ancien. */
  next?: ArticleSummary;
};

const labelClass = "text-label uppercase tracking-[.14em] text-[#77746e]";
const titleClass =
  "font-display text-display-sm font-normal leading-[1.1] tracking-[-.03em] transition-colors duration-[250ms] group-hover:text-accent";

export function ArticleNavigation({ previous, next }: ArticleNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav
      aria-label="Navigation entre les actualités"
      className="mx-auto mt-[clamp(3rem,5vw,5rem)] grid max-w-[1100px] grid-cols-2 gap-8 border-t border-line pt-8 max-tablet:grid-cols-1"
    >
      {previous ? (
        <Link href={`${routes.news}${previous.slug}/`} className="group flex flex-col gap-3">
          <span className={labelClass}>
            <span aria-hidden="true" className="mr-3 text-accent">
              ←
            </span>
            Article précédent
          </span>
          <span className={titleClass}>{previous.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link
          href={`${routes.news}${next.slug}/`}
          className="group col-start-2 flex flex-col gap-3 text-right max-tablet:col-start-1 max-tablet:text-left"
        >
          <span className={labelClass}>
            Article suivant
            <span aria-hidden="true" className="ml-3 text-accent">
              →
            </span>
          </span>
          <span className={titleClass}>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
