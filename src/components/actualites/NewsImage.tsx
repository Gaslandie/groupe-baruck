import { asset } from "@/lib/asset";

const coverDimensions: Record<string, { width: number; height: number }> = {
  "/images/actualites/exemple-1.jpeg": { width: 1280, height: 720 },
  "/images/actualites/exemple-2.jpg": { width: 720, height: 540 },
};

export function getNewsCoverDimensions(cover: string) {
  const dimensions = coverDimensions[cover];
  if (!dimensions) {
    throw new Error(`Dimensions manquantes pour l’image d’actualité "${cover}".`);
  }

  return dimensions;
}

type NewsImageProps = {
  cover?: string;
  coverAlt?: string;
};

export function NewsImage({ cover, coverAlt }: NewsImageProps) {
  if (!cover) {
    return (
      <div className="aspect-[4/3] bg-[linear-gradient(145deg,#161211,#633329_58%,#b3492e)]" />
    );
  }

  const { width, height } = getNewsCoverDimensions(cover);

  return (
    <img
      src={asset(cover as `/${string}`)}
      alt={coverAlt ?? ""}
      width={width}
      height={height}
      loading="lazy"
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  );
}
