"use client";

import { useState } from "react";

import type { NewsGroup } from "@/data/actualites";
import { asset } from "@/lib/asset";

import { VideoPlayer } from "../ui/VideoPlayer";

type ArticleGroupsProps = {
  title?: string;
  intro?: string;
  groups: NewsGroup[];
};

/**
 * Photos d'un article regroupées sous un intitulé, un groupe à la fois
 * (passage d'un candidat, étape d'une action…).
 *
 * Même motif d'onglets que les galeries d'Espoir de Vie : les groupes inactifs
 * restent dans la page mais sont masqués avec `hidden`, donc le navigateur ne
 * télécharge leurs photos qu'à l'ouverture de leur onglet — un article de
 * trente-cinq photos ne coûte que celles du premier groupe au chargement. Le
 * contenu reste lisible sans JavaScript et par les moteurs de recherche.
 *
 * Les onglets sont de vrais boutons dans une liste `tablist` ; les flèches du
 * clavier sont gérées par le navigateur via `tabIndex`, comme attendu d'un
 * motif d'onglets accessible.
 *
 * Un groupe peut porter une vidéo, placée avant ses photos : c'est le passage
 * lui-même, les photos le complètent. Le lecteur est celui du site, en
 * `preload="none"` — seule l'affiche se charge tant qu'on ne lance pas la
 * lecture, et rien du tout tant que l'onglet reste fermé.
 */
const tabClass =
  "inline-flex min-h-11 items-center border px-[.9rem] text-label uppercase tracking-[.13em] transition-[background,color,border-color] duration-[250ms]";

/** Une photo seule garde une largeur de lecture ; deux ou trois se partagent la ligne. */
function photoGridClass(count: number) {
  return count === 1
    ? "grid-cols-1 max-w-[760px]"
    : "grid-cols-2 max-tablet:grid-cols-1";
}

function groupId(index: number) {
  return `groupe-${index + 1}`;
}

export function ArticleGroups({ title, intro, groups }: ArticleGroupsProps) {
  const [active, setActive] = useState(0);

  if (groups.length === 0) return null;

  return (
    <section
      id="en-images"
      aria-labelledby="en-images-titre"
      className="mx-auto mt-[clamp(3.5rem,6vw,6rem)] max-w-[1100px] scroll-mt-[92px] border-t border-line pt-[clamp(2.5rem,5vw,4rem)]"
    >
      <div className="reveal mb-[clamp(1.8rem,3vw,2.6rem)]">
        <h2
          id="en-images-titre"
          className="m-0 text-balance font-display text-display-md font-normal leading-[1] tracking-[-.04em]"
        >
          {title}
        </h2>
        {intro ? (
          <p className="mb-0 mt-5 max-w-[680px] text-body leading-[1.8] text-[#696963]">{intro}</p>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label="Choisir un groupe de photos"
        className="reveal mb-[clamp(1.8rem,3vw,2.6rem)] flex flex-wrap gap-[.5rem]"
      >
        {groups.map((group, index) => {
          const selected = index === active;
          return (
            <button
              key={group.label}
              type="button"
              role="tab"
              id={`onglet-${groupId(index)}`}
              aria-selected={selected}
              aria-controls={groupId(index)}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(index)}
              className={[
                tabClass,
                selected
                  ? "border-ink bg-ink text-ivory"
                  : "border-line text-[#696963] hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent",
              ].join(" ")}
            >
              {group.label}
            </button>
          );
        })}
      </div>

      {groups.map((group, index) => (
        <div
          key={group.label}
          role="tabpanel"
          id={groupId(index)}
          aria-labelledby={`onglet-${groupId(index)}`}
          hidden={index !== active}
        >
          <div className="mb-[clamp(1.2rem,2vw,1.8rem)]">
            <h3 className="m-0 font-display text-display-sm font-normal leading-[1.15]">
              {group.label}
            </h3>
            {group.note ? (
              <p className="mb-0 mt-[.7rem] text-label uppercase tracking-[.14em] text-accent">
                {group.note}
              </p>
            ) : null}
          </div>

          {group.video ? (
            <div className="mb-[clamp(1rem,2vw,1.4rem)]">
              <VideoPlayer
                src={asset(group.video.src as `/${string}`)}
                poster={asset(group.video.poster as `/${string}`)}
                width={group.video.width}
                height={group.video.height}
                className="aspect-video"
              />
            </div>
          ) : null}

          <div className={`grid gap-[.9rem] max-tablet:gap-[.6rem] ${photoGridClass(group.photos.length)}`}>
            {group.photos.map((photo) => (
              <figure key={photo.src} className="m-0">
                <img
                  src={asset(photo.src as `/${string}`)}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  loading="lazy"
                  decoding="async"
                  className="h-auto w-full bg-paper-deep"
                />
                {photo.caption ? (
                  <figcaption className="mt-3 text-label uppercase tracking-[.14em] text-[#77746e]">
                    {photo.caption}
                  </figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
