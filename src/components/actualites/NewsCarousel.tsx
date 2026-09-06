"use client";

import { useEffect, useRef, useState } from "react";

import type { NewsImage } from "@/data/actualites";
import { asset } from "@/lib/asset";

type NewsCarouselProps = {
  gallery: NewsImage[];
};

export function NewsCarousel({ gallery }: NewsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const total = gallery.length;

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateIndex = () => {
      const firstSlide = track.querySelector<HTMLElement>("figure");
      if (!firstSlide) return;

      const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
      const step = firstSlide.getBoundingClientRect().width + gap;
      const nextIndex = step ? Math.round(track.scrollLeft / step) : 0;
      setIndex(Math.max(0, Math.min(total - 1, nextIndex)));
    };

    updateIndex();
    track.addEventListener("scroll", updateIndex, { passive: true });
    return () => track.removeEventListener("scroll", updateIndex);
  }, [total]);

  if (total === 0) return null;

  const scrollBySlide = (direction: -1 | 1) => {
    const track = trackRef.current;
    const firstSlide = track?.querySelector<HTMLElement>("figure");
    if (!track || !firstSlide) return;

    const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
    track.scrollBy({ left: direction * (firstSlide.getBoundingClientRect().width + gap) });
  };

  return (
    <div className="mx-auto mt-[clamp(3rem,5vw,5rem)] max-w-[1100px]">
      <div className="mb-6 flex items-end justify-between">
        <p className="eyebrow mb-0">En images</p>
        <span
          className="font-display text-small italic text-[#77746e]"
          aria-live="polite"
        >
          {index + 1} / {total}
        </span>
      </div>
      <div
        ref={trackRef}
        role="region"
        aria-roledescription="carrousel"
        aria-label="Photos de l’article"
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") {
            event.preventDefault();
            scrollBySlide(-1);
          }
          if (event.key === "ArrowRight") {
            event.preventDefault();
            scrollBySlide(1);
          }
        }}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth [scrollbar-width:none] motion-reduce:scroll-auto [&::-webkit-scrollbar]:hidden"
      >
        {gallery.map((image) => (
          <figure key={image.src} className="m-0 w-[min(100%,860px)] shrink-0 snap-start">
            <img
              src={asset(image.src as `/${string}`)}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
              className="aspect-[16/10] w-full bg-[#cac5bb] object-cover"
            />
            {image.caption ? (
              <figcaption className="mt-3 text-label uppercase tracking-[.14em] text-[#77746e]">
                {image.caption}
              </figcaption>
            ) : null}
          </figure>
        ))}
      </div>
      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          aria-label="Photo précédente"
          disabled={index === 0}
          onClick={() => scrollBySlide(-1)}
          className="h-12 w-12 cursor-pointer border border-line transition-[background,color] duration-[250ms] hover:bg-ink hover:text-ivory disabled:cursor-default disabled:opacity-30"
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Photo suivante"
          disabled={index === total - 1}
          onClick={() => scrollBySlide(1)}
          className="h-12 w-12 cursor-pointer border border-line transition-[background,color] duration-[250ms] hover:bg-ink hover:text-ivory disabled:cursor-default disabled:opacity-30"
        >
          →
        </button>
      </div>
    </div>
  );
}
