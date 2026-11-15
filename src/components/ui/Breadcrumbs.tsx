import Link from "next/link";

import { translate as t } from "@/lib/language";
import { breadcrumbSchema, type BreadcrumbItem } from "@/lib/structured-data";

import { StructuredData } from "./StructuredData";

export function Breadcrumbs({ items }: { items: readonly BreadcrumbItem[] }) {
  return (
    <nav aria-label={t("Fil d’Ariane")} className="mb-6 text-small leading-[1.5]">
      <ol className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-1 p-0">
        {items.map(({ name, href }, index) => (
          <li key={href} className="flex min-w-0 items-baseline gap-3 [overflow-wrap:anywhere]">
            {index > 0 ? <span aria-hidden="true" className="opacity-60">/</span> : null}
            {index === items.length - 1 ? (
              <span aria-current="page">{name}</span>
            ) : (
              <Link href={href} className="inline-block py-2 underline decoration-current underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4">
                {name}
              </Link>
            )}
          </li>
        ))}
      </ol>
      <StructuredData data={breadcrumbSchema(items)} />
    </nav>
  );
}
