import Link from "next/link";

import { routes } from "@/data/site";
import { Icon } from "../ui/Icon";

type ArticleBodyProps = {
  html: string;
};

export function ArticleBody({ html }: ArticleBodyProps) {
  return (
    <div className="mx-auto max-w-[720px]">
      <div className="article-body" dangerouslySetInnerHTML={{ __html: html }} />
      <Link href={routes.news} className="text-link mt-12">
        Toutes les actualités <span><Icon name="arrow-up-left" /></span>
      </Link>
    </div>
  );
}
