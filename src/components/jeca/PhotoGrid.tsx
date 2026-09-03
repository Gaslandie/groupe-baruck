import type { JecaGallery } from "@/data/jeca";

import { GalleryPhoto } from "./JecaGallery";

const sevenPlacements = [
  "col-[1/3] row-[1] max-tablet:col-[1/3] max-tablet:row-[1]",
  "col-[3] row-[1/3] max-tablet:col-[1] max-tablet:row-[2/4]",
  "col-[4] row-[1] max-tablet:col-[2] max-tablet:row-[2]",
  "col-[1] row-[2] max-tablet:col-[2] max-tablet:row-[3]",
  "col-[2] row-[2] max-tablet:col-[1/3] max-tablet:row-[4]",
  "col-[4] row-[2] max-tablet:col-[1] max-tablet:row-[5]",
  "col-[1/5] row-[3] max-tablet:col-[2] max-tablet:row-[5]",
];

const sixPlacements = [
  "col-[1/3] row-[1] max-tablet:col-[1/3] max-tablet:row-[1]",
  "col-[3] row-[1] max-tablet:col-[1] max-tablet:row-[2]",
  "col-[4] row-[1] max-tablet:col-[2] max-tablet:row-[2]",
  "col-[1] row-[2] max-tablet:col-[1/3] max-tablet:row-[3]",
  "col-[2/4] row-[2] max-tablet:col-[1] max-tablet:row-[4]",
  "col-[4] row-[2] max-tablet:col-[2] max-tablet:row-[4]",
];

const galleryLabels = {
  1: "Photos de la première édition",
  2: "Photos de la deuxième édition",
  3: "Photos de la troisième édition",
};

export function PhotoGrid({
  gallery,
  offset,
  grid,
}: {
  gallery: JecaGallery;
  offset: number;
  grid: "seven" | "six";
}) {
  const placements = grid === "seven" ? sevenPlacements : sixPlacements;

  return (
    <div
      aria-label={galleryLabels[gallery.edition]}
      className="grid auto-rows-[clamp(190px,18vw,310px)] grid-cols-4 gap-[.7rem] max-tablet:auto-rows-[180px] max-tablet:grid-cols-2 max-tablet:gap-[.45rem] max-[420px]:auto-rows-[155px]"
    >
      {gallery.photos.map((photo, index) => (
        <GalleryPhoto
          key={photo.src}
          photo={photo}
          index={offset + index}
          className={placements[index]}
        />
      ))}
    </div>
  );
}
