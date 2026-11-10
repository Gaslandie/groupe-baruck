import { pageText } from "@/lib/page-content";

import Link from "next/link";

import { routes } from "@/data/site";
import { Icon } from "../ui/Icon";

export function NewsEmpty() {
  return (
    <div className="mx-auto max-w-[520px] text-center">
      <p className="eyebrow justify-center before:hidden">{pageText("actualites", "copy.NewsEmpty.1")}</p>
      <h2 className="font-display text-display-lg font-normal leading-[1] tracking-[-.04em]">{pageText("actualites", "copy.NewsEmpty.2")}</h2>
      <p className="mt-6 text-body leading-[1.7] text-[#696963]">{pageText("actualites", "copy.NewsEmpty.3")}</p>
      <Link href={routes.home} className="text-link mt-6">{(pageText("actualites", "copy.NewsEmpty.4") + " ")}<span><Icon name="arrow-up-left" /></span>
      </Link>
    </div>
  );
}
