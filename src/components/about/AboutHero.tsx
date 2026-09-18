import Link from "next/link";

import { presidentWorking } from "@/data/media";
import { routes } from "@/data/site";
import { siteTexts } from "@/data/textes";
import { asset } from "@/lib/asset";
import { Icon } from "../ui/Icon";

/**
 * Hero repris sur la logique des autres pages le 2026-09-16 : textes dans le
 * panneau clair de gauche, photo pleine hauteur à droite. Le texte
 * d'introduction est celui du back-office (`heroSlides.guinee`), et les trois
 * activités phares sont des liens.
 *
 * Photo (2026-09-18) : le PDG à son poste de travail, à la place de la photo
 * des hôtesses événementielles. Celle-ci est déjà le hero de sa propre page :
 * la page du Groupe annonçait donc une de ses activités au lieu du Groupe. Le
 * cadrage `center 12%` garde la casquette entière sur un panneau large.
 *
 * Mobile (2026-09-18) : plus d'empilement photo puis texte. La photo devient le
 * fond de la section et les textes passent par-dessus, en bas, comme sur
 * l'accueil et sur les pages de services. Les couleurs du texte basculent donc
 * en clair à cette taille, et la légende posée sur la photo est masquée : elle
 * tomberait sous le titre.
 */
export function AboutHero() {
  return (
    <section
      id="accueil"
      aria-label="Présentation du Groupe Baruck"
      className="grid min-h-[clamp(640px,82svh,800px)] grid-cols-[58%_42%] overflow-hidden border-b border-line bg-paper text-ink max-[1100px]:grid-cols-[55%_45%] max-tablet:relative max-tablet:block max-tablet:min-h-[100svh] max-tablet:border-0 max-tablet:bg-ink max-tablet:text-ivory"
    >
      <div className="relative col-start-2 row-start-1 min-h-0 overflow-hidden bg-ink max-tablet:absolute max-tablet:inset-0 max-tablet:z-0 max-tablet:h-full max-tablet:w-full">
        <img
          src={asset(presidentWorking.src)}
          alt={presidentWorking.alt}
          width={presidentWorking.width}
          height={presidentWorking.height}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_12%] saturate-[.92] contrast-[1.02]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(11,12,14,.12)_72%,rgba(11,12,14,.86))] max-tablet:bg-[linear-gradient(180deg,rgba(11,12,14,.34)_12%,rgba(11,12,14,.6)_48%,rgba(11,12,14,.95)_100%)]"
        />
        <p className="absolute bottom-[clamp(2rem,5vh,4rem)] left-[clamp(1.4rem,3.5vw,4rem)] right-6 z-[2] m-0 font-display text-display-sm font-normal leading-[1.1] text-ivory [text-shadow:0_2px_18px_rgba(0,0,0,.35)] max-tablet:hidden">
          <span className="mb-[.65rem] block font-sans text-micro font-bold uppercase leading-none tracking-[.18em] text-accent">
            Président-directeur général
          </span>
          MR Djoro Joël Shaloom Krasso
        </p>
      </div>
      <div className="hero-in relative col-start-1 row-start-1 flex flex-col justify-center pb-12 pl-[clamp(1.3rem,6vw,7.5rem)] pr-[clamp(1.3rem,6vw,7.5rem)] pt-[calc(92px+2rem)] max-[1100px]:px-10 max-tablet:z-10 max-tablet:min-h-[100svh] max-tablet:w-full max-tablet:justify-end max-tablet:px-[1.3rem] max-tablet:pb-[clamp(5rem,15vh,8rem)] max-tablet:pt-[7rem]">
        <p className="eyebrow">Le Groupe Baruck · Guinée</p>
        <h1 className="m-0 max-w-[760px] text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.05em]">
          Un groupe ancré en Guinée,
          <br />
          <em className="font-normal text-accent">tourné vers l’impact.</em>
        </h1>
        <p className="mb-[1.6rem] mt-[1.6rem] max-w-[560px] text-lead leading-[1.7] text-[#64645f] max-tablet:mt-[1.4rem] max-tablet:text-small max-tablet:text-[rgba(255,253,248,.78)]">
          {siteTexts.heroSlides["guinee"].description}
        </p>
        <div className="mb-[1.8rem] grid gap-[.55rem] text-caption uppercase leading-[1.35] tracking-[.06em] text-[#4b4a46] max-tablet:gap-[.45rem] max-tablet:text-label max-tablet:text-[rgba(255,253,248,.84)]">
          <Link href={routes.studio} className="role-link">
            Studio Photo Baruck
          </Link>
          <Link href={routes.hostesses} className="role-link">
            Hôtesses événementielles
          </Link>
          <Link href={routes.hostesses} className="role-link">
            Restauration & hôtellerie
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-[.8rem] max-tablet:gap-2">
          <a href="#identite" className="button button-dark max-tablet:border-ivory max-tablet:bg-ivory max-tablet:text-ink">
            Notre identité <span><Icon name="arrow-down" /></span>
          </a>
          <Link href={routes.contact} className="button button-outline max-tablet:border-[rgba(255,255,255,.34)] max-tablet:text-ivory">
            Nous contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
