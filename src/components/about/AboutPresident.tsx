import Link from "next/link";

import { presidentPortrait } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

import { Icon } from "../ui/Icon";

/**
 * Le président et sa vision (2026-09-18). La page parlait de ses fonctions
 * (`AboutRoles`) et de son passage aux Nations Unies (`AboutOnu`), mais on ne
 * le voyait pas et sa vision n'était écrite nulle part en toutes lettres.
 *
 * Rien n'est inventé ici : le portrait est celui de l'accueil, les quatre
 * fonctions sont celles déjà publiées, et la phrase reprise en grand est la
 * citation qui occupait la section `AboutQuote`, retirée de la page le même
 * jour pour ne pas la dire deux fois. Le parcours détaillé reste à fournir par
 * la direction (voir `AboutRoles`).
 */
const visionPoints = [
  {
    number: "01",
    title: "Entreprendre en Guinée",
    text: "Faire de la Guinée le point d’ancrage du groupe et y développer des activités qui tiennent dans la durée.",
  },
  {
    number: "02",
    title: "Ouvrir vers la région",
    text: "Porter cette base vers le Sénégal et la Côte d’Ivoire, où le dirigeant conduit déjà ses engagements.",
  },
  {
    number: "03",
    title: "Rendre à la société",
    text: "Faire répondre à l’activité économique un engagement social, par la JECA et par l’ONG Espoir de Vie.",
  },
];

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
          MR Djoro Joël Shaloom Krasso
        </figcaption>
      </figure>

      <div className="reveal">
        <p className="eyebrow light">Le président</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-display-lg font-normal leading-[.95] tracking-[-.04em]">
          Un dirigeant,
          <em className="block font-normal text-accent">quatre engagements.</em>
        </h2>
        <p className="mb-0 mt-[1.6rem] max-w-[620px] text-lead leading-[1.7] text-[rgba(255,255,255,.74)]">
          MR Djoro Joël Shaloom Krasso dirige le Groupe Baruck. Il préside la JECA, qui réunit la diaspora autour de
          l’investissement en Afrique, et l’ONG Espoir de Vie, qui protège les enfants et accompagne les familles. En
          2016, il exerce la fonction d’agent de développement pour la protection de l’enfant au sein des Nations Unies.
        </p>

        <blockquote className="mb-0 mt-[clamp(2rem,4vw,3rem)] border-l border-[rgba(255,255,255,.22)] pl-[clamp(1.2rem,2.5vw,2rem)] font-display text-display-sm font-normal italic leading-[1.35] text-ivory">
          « Construire, entreprendre et créer un impact durable. »
        </blockquote>

        <dl className="m-0 mt-[clamp(2rem,4vw,3rem)] grid grid-cols-3 gap-[clamp(1rem,2vw,2rem)] border-t border-[rgba(255,255,255,.18)] pt-[1.6rem] max-tablet:grid-cols-1 max-tablet:gap-6">
          {visionPoints.map((point) => (
            <div key={point.number}>
              <dt className="text-micro uppercase tracking-[.15em] text-accent">{point.number}</dt>
              <p className="mb-[.5rem] mt-[.9rem] font-display text-title font-normal leading-[1.15]">{point.title}</p>
              <dd className="m-0 text-small leading-[1.7] text-[rgba(255,255,255,.62)]">{point.text}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-[clamp(2rem,4vw,2.6rem)] flex flex-wrap items-center gap-[.8rem]">
          <a href="#fonctions" className="button button-primary">
            Ses quatre fonctions <span><Icon name="arrow-down" /></span>
          </a>
          <Link href={routes.jeca} className="button button-ghost">
            La JECA <span><Icon name="arrow-up-right" /></span>
          </Link>
        </div>
      </div>
    </section>
  );
}
