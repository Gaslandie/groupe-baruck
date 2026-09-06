"use client";

import {
  createContext,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import type { GalleryPhoto as GalleryPhotoData } from "@/data/jeca";
import { asset } from "@/lib/asset";

type GalleryContextValue = {
  openPhoto: (index: number) => void;
};

const GalleryContext = createContext<GalleryContextValue | null>(null);

export function JecaGalleryProvider({ photos, children }: { photos: GalleryPhotoData[]; children: ReactNode }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (activeIndex !== null && dialog && !dialog.open) dialog.showModal();
  }, [activeIndex]);

  const close = () => dialogRef.current?.close();
  const move = (step: number) => {
    setActiveIndex((current) =>
      current === null ? null : (current + step + photos.length) % photos.length,
    );
  };
  const handleKeyDown = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
  };
  const handleBackdropClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) close();
  };

  return (
    <GalleryContext.Provider value={{ openPhoto: setActiveIndex }}>
      {children}
      <dialog
        ref={dialogRef}
        aria-label="Agrandissement de la photo"
        onClose={() => setActiveIndex(null)}
        onClick={handleBackdropClick}
        onKeyDown={handleKeyDown}
        className="h-[min(92vh,1000px)] max-h-none w-[min(94vw,1400px)] max-w-none overflow-visible border-0 bg-transparent p-0 text-white backdrop:bg-[rgba(2,7,20,.92)] backdrop:backdrop-blur-[8px] max-tablet:h-[86vh] max-tablet:w-[96vw]"
      >
        <button
          type="button"
          aria-label="Fermer l’image"
          onClick={close}
          className="fixed right-6 top-[1.2rem] z-[2] h-12 w-12 cursor-pointer border border-[rgba(255,255,255,.4)] bg-[rgba(4,16,49,.65)] text-[1.8rem] text-white max-tablet:right-[.7rem] max-tablet:top-[.7rem]"
        >
          ×
        </button>
        <button
          type="button"
          aria-label="Photo précédente"
          onClick={() => move(-1)}
          className="fixed left-6 top-1/2 z-[2] h-12 w-12 translate-y-[-50%] cursor-pointer border border-[rgba(255,255,255,.4)] bg-[rgba(4,16,49,.65)] text-white transition-[background,color] duration-[250ms] hover:bg-white hover:text-jeca-blue max-tablet:bottom-[.6rem] max-tablet:left-[.7rem] max-tablet:top-auto max-tablet:h-11 max-tablet:w-11 max-tablet:translate-y-0"
        >
          ←
        </button>
        {activePhoto && activeIndex !== null ? (
          <figure className="m-0 grid h-full w-full grid-rows-[1fr_auto] gap-[.8rem]">
            <img
              src={asset(activePhoto.src)}
              alt={activePhoto.alt}
              className="h-full w-full object-contain"
            />
            <figcaption className="flex justify-center gap-4 text-center text-caption uppercase tracking-[.12em]">
              <span>{activePhoto.caption}</span>
              <small className="text-[inherit] text-[rgba(255,255,255,.55)]">
                {activeIndex + 1} / {photos.length}
              </small>
            </figcaption>
          </figure>
        ) : null}
        <button
          type="button"
          aria-label="Photo suivante"
          onClick={() => move(1)}
          className="fixed right-6 top-1/2 z-[2] h-12 w-12 translate-y-[-50%] cursor-pointer border border-[rgba(255,255,255,.4)] bg-[rgba(4,16,49,.65)] text-white transition-[background,color] duration-[250ms] hover:bg-white hover:text-jeca-blue max-tablet:bottom-[.6rem] max-tablet:right-[.7rem] max-tablet:top-auto max-tablet:h-11 max-tablet:w-11 max-tablet:translate-y-0"
        >
          →
        </button>
      </dialog>
    </GalleryContext.Provider>
  );
}

export function GalleryPhoto({
  photo,
  index,
  className,
}: {
  photo: GalleryPhotoData;
  index: number;
  className: string;
}) {
  const gallery = useContext(GalleryContext);
  if (!gallery) throw new Error("GalleryPhoto doit être utilisé dans JecaGalleryProvider.");

  return (
    <button
      type="button"
      onClick={() => gallery.openPhoto(index)}
      className={`group relative h-full w-full min-w-0 cursor-zoom-in overflow-hidden border-0 bg-[#cad0d9] p-0 after:absolute after:bottom-4 after:right-4 after:grid after:h-[38px] after:w-[38px] after:translate-y-2 after:place-items-center after:bg-[rgba(4,16,49,.75)] after:text-lead after:text-white after:opacity-0 after:transition-[opacity,transform] after:duration-[250ms] after:content-['+'] hover:after:translate-y-0 hover:after:opacity-100 focus-visible:after:translate-y-0 focus-visible:after:opacity-100 max-tablet:after:bottom-[.6rem] max-tablet:after:right-[.6rem] max-tablet:after:h-8 max-tablet:after:w-8 max-tablet:after:translate-y-0 max-tablet:after:opacity-100 ${className}`}
    >
      <img
        src={asset(photo.src)}
        alt={photo.alt}
        width={photo.width}
        height={photo.height}
        loading="lazy"
        className="h-full w-full object-cover transition-[transform,filter] duration-[650ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.045] group-hover:saturate-[1.05]"
      />
    </button>
  );
}
