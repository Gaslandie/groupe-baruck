import { translate as t } from "../../lib/language.ts";

import Link from "next/link";

import { routes } from "@/data/site";
import { Icon } from "../ui/Icon";

type ArticleBodyProps = {
  html: string;
  contentLanguage?: "fr";
};

export function ArticleBody({ html, contentLanguage }: ArticleBodyProps) {
  return (
    <div className="mx-auto max-w-[720px]">
      <div className="article-body" lang={contentLanguage} dangerouslySetInnerHTML={{ __html: html }} />
      <Link href={routes.news} className="text-link mt-12">{t("Toutes les actualités ")}<span><Icon name="arrow-up-left" /></span>
      </Link>
    </div>
  );
}
