"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

import {
  mediaCategoryLabels,
  mediaCollections,
  type MediaCategory,
} from "@/data/mediatheque";
import { asset } from "@/lib/asset";
import { revealWithin } from "@/lib/reveal";

type MediaFilter = "all" | MediaCategory;

const filters: { value: MediaFilter; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: "jeca", label: mediaCategoryLabels.jeca },
  { value: "studio-photo", label: mediaCategoryLabels["studio-photo"] },
];

const filterButtonClass =
  "inline-flex min-h-11 cursor-pointer items-center border px-[1.1rem] text-label uppercase tracking-[.14em] transition-[background,color,border-color] duration-[250ms]";

export function MediaLibrary() {
  const [filter, setFilter] = useState<MediaFilter>("all");
  const rootRef = useRef<HTMLElement>(null);
  const collections = mediaCollections.filter(
    (collection) => filter === "all" || collection.category === filter,
  );

  // Les collections remontées après un changement de filtre ne sont pas vues par
  // RevealObserver (observation au montage) : on les révèle ici.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return revealWithin(root);
  }, [filter]);

  return (
    <section
      id="galeries"
      ref={rootRef}
      className="scroll-mt-[92px] bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,8vw,8rem)]"
    >
      <nav aria-label="Filtrer la médiathèque" className="mb-[clamp(2.5rem,4vw,4rem)]">
        <ul className="m-0 flex list-none flex-wrap gap-[.6rem] p-0">
          {filters.map((item) => {
            const isActive = item.value === filter;

            return (
              <li key={item.value}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setFilter(item.value)}
                  className={`${filterButtonClass} ${
                    isActive
                      ? "border-ink bg-ink text-ivory"
                      : "border-line text-[#696963] hover:border-ink hover:text-ink"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {collections.map((collection) => (
        <section
          key={collection.id}
          id={collection.id}
          className="reveal border-t border-line py-[clamp(2.5rem,4vw,4rem)]"
        >
          <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="eyebrow">{mediaCategoryLabels[collection.category]}</p>
              <h2 className="m-0 font-display text-display-lg font-normal leading-[1] tracking-[-.04em]">
                {collection.title}
              </h2>
            </div>
            <Link href={collection.href} className="text-link">
              Voir la galerie d’origine <span>↗</span>
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-[.8rem] max-desktop:grid-cols-2 max-[430px]:grid-cols-1">
            {collection.photos.map((photo) => (
              <figure key={photo.src} className="m-0">
                <img
                  src={asset(photo.src)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-[#cac5bb] object-cover"
                />
                <figcaption className="mt-3 text-label uppercase tracking-[.14em] text-[#77746e]">
                  {photo.caption}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </section>
  );
}
