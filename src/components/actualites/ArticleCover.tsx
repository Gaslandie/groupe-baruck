import type { NewsImage } from "@/data/actualites";
import { asset } from "@/lib/asset";

type ArticleCoverProps = {
  cover?: NewsImage;
};

export function ArticleCover({ cover }: ArticleCoverProps) {
  if (!cover) return null;

  return (
    <figure className="m-0 mx-auto mt-[-3rem] max-w-[1100px] px-[clamp(1.3rem,6vw,7.5rem)] max-tablet:mt-0">
      <img
        src={asset(cover.src as `/${string}`)}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full"
      />
    </figure>
  );
}
