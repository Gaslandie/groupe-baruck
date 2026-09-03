import {
  placeholderGradients,
  type NewsCategory,
  type NewsImage as NewsImageData,
} from "@/data/actualites";
import { asset } from "@/lib/asset";

type NewsImageProps = {
  cover?: NewsImageData;
  category: NewsCategory;
};

export function NewsImage({ cover, category }: NewsImageProps) {
  if (!cover) {
    return <div className={`aspect-[4/3] ${placeholderGradients[category]}`} />;
  }

  return (
    <img
      src={asset(cover.src as `/${string}`)}
      alt={cover.alt}
      width={cover.width}
      height={cover.height}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}
