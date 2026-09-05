import { categoryLabels, type NewsCategory } from "@/data/actualites";
import { formatDate } from "@/lib/date";

type NewsMetaProps = {
  category: NewsCategory;
  date: string;
  light?: boolean;
};

export function NewsMeta({ category, date, light = false }: NewsMetaProps) {
  return (
    <div className="flex items-center gap-3 text-[.58rem] uppercase tracking-[.16em]">
      <span className="text-accent">{categoryLabels[category]}</span>
      <span aria-hidden="true" className="text-[#96958f]">
        ·
      </span>
      <time
        dateTime={date}
        className={light ? "text-[rgba(255,255,255,.55)]" : "text-[#77746e]"}
      >
        {formatDate(date)}
      </time>
    </div>
  );
}
