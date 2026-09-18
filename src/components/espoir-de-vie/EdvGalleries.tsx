"use client";

import { useState } from "react";

import { edvGalleryCategories, edvGalleryPhotoCount } from "@/data/edv-galerie";
import { asset } from "@/lib/asset";

/**
 * Galeries d'Espoir de Vie par action (2026-09-18).
 *
 * Une action à la fois : les photos des autres restent dans la page mais sont
 * masquées avec `hidden`, donc le navigateur ne les télécharge pas tant qu'on
 * n'ouvre pas leur onglet, et elles restent lisibles sans JavaScript et par les
 * moteurs de recherche. Chaque image est en chargement différé.
 *
 * Les onglets sont de vrais boutons dans une liste `tablist`, avec les flèches
 * du clavier gérées par le navigateur via `tabIndex`, comme attendu d'un motif
 * d'onglets accessible.
 *
 * L'ancre `#galerie` est reprise de l'ancienne grille de quatorze vignettes qui
 * vivait dans `EdvArchives` : la médiathèque pointe dessus (`src/data/mediatheque.ts`).
 */
const tabClass =
  "inline-flex min-h-11 items-center border px-[1rem] text-label uppercase tracking-[.13em] transition-[background,color,border-color] duration-[250ms]";

export function EdvGalleries() {
  const [active, setActive] = useState(edvGalleryCategories[0].id);

  return (
    <section
      id="galerie"
      aria-labelledby="galerie-titre"
      className="scroll-mt-[72px] border-t border-edv-line bg-edv-cream px-[clamp(1.3rem,7vw,8rem)] py-[clamp(4.5rem,8vw,8rem)] max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <div className="reveal mb-[clamp(2rem,4vw,3rem)]">
        <p className="edv-kicker">Les actions en images</p>
        <h2
          id="galerie-titre"
          className="m-0 text-balance font-display text-display-lg font-normal leading-[.92] tracking-[-.05em]"
        >
          {edvGalleryPhotoCount} photos,
          <em className="font-[inherit] text-edv-ember"> onze rendez-vous.</em>
        </h2>
        <p className="mb-0 mt-6 max-w-[680px] text-body leading-[1.8] text-edv-muted">
          Les archives de la fondation, classées par action : du premier Noël au village de Grôh à l’ouverture de
          l’orphelinat, puis aux repas partagés avec les enfants.
        </p>
      </div>

      <div role="tablist" aria-label="Choisir une action" className="reveal mb-[clamp(1.8rem,3vw,2.6rem)] flex flex-wrap gap-[.5rem]">
        {edvGalleryCategories.map((category) => {
          const selected = category.id === active;
          return (
            <button
              key={category.id}
              type="button"
              role="tab"
              id={`onglet-${category.id}`}
              aria-selected={selected}
              aria-controls={`galerie-${category.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(category.id)}
              className={[
                tabClass,
                selected
                  ? "border-edv-ember bg-edv-ember text-white"
                  : "border-edv-line text-edv-muted hover:border-edv-ember hover:text-edv-ember focus-visible:border-edv-ember focus-visible:text-edv-ember",
              ].join(" ")}
            >
              {category.label}
              <span className="ml-[.6rem] text-micro opacity-70">{category.photos.length}</span>
            </button>
          );
        })}
      </div>

      {edvGalleryCategories.map((category) => (
        <div
          key={category.id}
          role="tabpanel"
          id={`galerie-${category.id}`}
          aria-labelledby={`onglet-${category.id}`}
          hidden={category.id !== active}
        >
          <div className="mb-[clamp(1.4rem,2.5vw,2rem)] border-t border-edv-line pt-[1.3rem]">
            <h3 className="m-0 font-display text-display-sm font-normal leading-[1.15]">{category.title}</h3>
            <p className="mb-0 mt-[.7rem] text-label uppercase tracking-[.14em] text-edv-ember">
              {category.place}
              {category.date ? ` · ${category.date}` : ""}
            </p>
            <p className="mb-0 mt-[1rem] max-w-[720px] text-small leading-[1.75] text-edv-muted">{category.text}</p>
          </div>

          <div className="grid grid-cols-4 gap-[.7rem] max-[1100px]:grid-cols-3 max-tablet:grid-cols-2 max-tablet:gap-[.45rem]">
            {category.photos.map((photo) => (
              <img
                key={photo.src}
                src={asset(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                decoding="async"
                className="aspect-[4/3] w-full bg-edv-paper-deep object-cover"
              />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
