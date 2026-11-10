import { pageText, pageValue, pageLinkIcon, presidentName } from "@/lib/page-content";
import Link from "next/link";

import { presidentPortrait } from "@/data/media";

import { asset } from "@/lib/asset";

import { Icon } from "../ui/Icon";

/**
 * Le président et sa vision (2026-09-18). La page parlait de ses fonctions
 * (`AboutRoles`) et de son passage aux Nations Unies (`AboutOnu`), mais on ne
 * le voyait pas et sa vision n'était écrite nulle part en toutes lettres.
 *
 * Rien n'est inventé ici : le portrait est celui de l'accueil, les quatre
 * fonctions sont celles déjà publiées (elles restent dans `AboutRoles`, où le
 * bouton conduit), et la phrase reprise en grand est la
 * citation qui occupait la section `AboutQuote`, retirée de la page le même
 * jour pour ne pas la dire deux fois. Le parcours détaillé reste à fournir par
 * la direction (voir `AboutRoles`).
 */
const visionPoints = pageValue<{ title: string; text: string }[]>("groupe", "AboutPresident.list").map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));

export function AboutPresident() {
  return (
    <section
      id="president"
      className="reveal-stagger grid scroll-mt-[92px] grid-cols-[minmax(280px,.8fr)_1.2fr] items-center gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-[clamp(2.5rem,5vw,4rem)] bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory max-[1080px]:grid-cols-1 max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <figure className="reveal relative m-0 overflow-hidden bg-[#525667] max-[1080px]:mx-auto max-[1080px]:w-[min(420px,100%)]">
        <img
          src={asset(presidentPortrait.src)}
          alt={presidentPortrait.alt}
          width={presidentPortrait.width}
          height={presidentPortrait.height}
          loading="lazy"
          className="h-full w-full object-cover saturate-[.85] contrast-[1.04]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_58%,rgba(11,12,14,.72)_100%)]"
        />
        <figcaption className="absolute bottom-0 left-0 right-0 z-[2] p-[clamp(1.1rem,2vw,1.6rem)] text-label uppercase tracking-[.14em] text-[rgba(255,253,248,.82)]">
          {presidentName()}</figcaption>
      </figure>

      <div className="reveal">
        <p className="eyebrow light">{pageText("groupe", "AboutPresident.2")}</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-display-lg font-normal leading-[.95] tracking-[-.04em]">{pageText("groupe", "AboutPresident.3")}<em className="block font-normal text-accent">{pageText("groupe", "AboutPresident.4")}</em>
        </h2>
        <p className="mb-0 mt-[1.6rem] max-w-[620px] text-lead leading-[1.7] text-[rgba(255,255,255,.74)]">{pageText("groupe", "AboutPresident.5")}</p>

        <blockquote className="mb-0 mt-[clamp(2rem,4vw,3rem)] border-l border-[rgba(255,255,255,.22)] pl-[clamp(1.2rem,2.5vw,2rem)] font-display text-display-sm font-normal italic leading-[1.35] text-ivory">{pageText("groupe", "AboutPresident.6")}</blockquote>

        <p className="mb-0 mt-[clamp(2rem,4vw,3rem)] border-t border-[rgba(255,255,255,.18)] pt-[1.6rem] text-label uppercase tracking-[.14em] text-accent">{pageText("groupe", "AboutPresident.7")}</p>

        <dl className="m-0 mt-[1.4rem] grid grid-cols-3 gap-[clamp(1rem,2vw,2rem)] max-tablet:grid-cols-1 max-tablet:gap-6">
          {visionPoints.map((point) => (
            <div key={point.number}>
              <dt className="text-micro uppercase tracking-[.15em] text-accent">{point.number}</dt>
              <p className="mb-[.5rem] mt-[.9rem] font-display text-title font-normal leading-[1.15]">{point.title}</p>
              <dd className="m-0 text-small leading-[1.7] text-[rgba(255,255,255,.62)]">{point.text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[clamp(2rem,4vw,2.6rem)] flex flex-wrap items-center gap-[.8rem]">
          <a href={pageValue<string>("groupe", "AboutPresident.8")} className="button button-primary">{pageText("groupe", "AboutPresident.9") + " "}<span><Icon name="arrow-down" /></span>
          </a>
          <Link href={pageValue<string>("groupe", "AboutPresident.10")} className="button button-ghost">{pageText("groupe", "AboutPresident.11") + " "}<span><Icon name={pageLinkIcon("groupe", "AboutPresident.10")} /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
