import { asset } from "@/lib/asset";

import { getNewsCoverDimensions } from "./NewsImage";

type ArticleCoverProps = {
  cover?: string;
  coverAlt?: string;
};

export function ArticleCover({ cover, coverAlt }: ArticleCoverProps) {
  if (!cover) return null;

  const { width, height } = getNewsCoverDimensions(cover);

  return (
    <figure className="m-0 mx-auto mt-[-3rem] max-w-[1100px] px-[clamp(1.3rem,6vw,7.5rem)] max-tablet:mt-0">
      <img
        src={asset(cover as `/${string}`)}
        alt={coverAlt ?? ""}
        width={width}
        height={height}
        loading="eager"
        fetchPriority="high"
        className="h-auto w-full"
      />
    </figure>
  );
}
