import Link from "next/link";
import { getAllArticles } from "@/lib/actualites";
import { translate as t } from "@/lib/language";
import { routes } from "@/data/site";
import { Icon } from "@/components/ui/Icon";

/** Seulement les articles publiés dans cette activité, sans inventer de référence client. */
export function ServiceNews({ category }: { category: "studio-photo" | "hotesses" }) {
  const articles = getAllArticles().filter(article => article.category === category && !article.draft && !article.translationPending).slice(0, 3);
  if (!articles.length) return null;
  return (
    <aside aria-label={t("À lire aussi")} className="mt-8 border-t border-line pt-6">
      <p className="mb-3 text-label uppercase tracking-[.14em] text-accent">{t("À lire aussi")}</p>
      <ul className="m-0 grid list-none gap-5 p-0">
        {articles.map(article => (
          <li key={article.slug}>
            <Link href={`${routes.news}${article.slug}/`} className="inline-flex items-start gap-3 text-body font-bold underline decoration-line underline-offset-4 hover:text-accent focus-visible:text-accent">
              {article.title}<span aria-hidden="true" className="shrink-0 text-accent"><Icon name="arrow-up-right" /></span>
            </Link>
            <p className="mb-0 mt-2 text-small leading-[1.65] text-[#5f5d57]">{article.excerpt}</p>
          </li>
        ))}
      </ul>
    </aside>
  );
}
