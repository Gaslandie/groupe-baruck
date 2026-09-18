import Link from "next/link";

import { jecaEditionNav } from "@/data/jeca";
import { routes } from "@/data/site";

import { Icon } from "../ui/Icon";
import { AboutSectionHead } from "./AboutSectionHead";

/**
 * Les rendez-vous organisés, ajoutés à la page Le Groupe le 2026-09-18.
 *
 * Seules les éditions du forum de la JECA sont listées : ce sont les
 * rassemblements que le dirigeant organise, et leurs villes et dates sont déjà
 * publiées sur la page JECA (`jecaEditionNav`, source unique). Les actions de
 * terrain d'Espoir de Vie, qui ne sont pas des rendez-vous du même ordre,
 * restent sur leur page ; un lien y conduit.
 *
 * Une seule flèche pour la section, sur le lien final, et aucune dans les
 * cartes (règle des flèches du site).
 */
export function AboutEvents() {
  return (
    <section
      id="evenements"
      className="scroll-mt-[92px] bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow="Événements organisés"
        title="Le forum de la JECA,"
        emphasis="trois éditions."
        text="Depuis 2022, la JECA réunit la diaspora africaine autour de l’investissement sur le continent, à Dakar puis à Conakry."
        tone="dark"
      />

      <ol className="reveal-stagger m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-[1080px]:grid-cols-1">
        {jecaEditionNav.map((edition) => (
          <li key={edition.href}>
            <Link
              href={`${routes.jeca}${edition.href}`}
              className="group flex h-full flex-col border border-line bg-ivory px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_18px_40px_rgba(11,12,14,.12)] focus-visible:translate-y-[-6px] focus-visible:shadow-[0_18px_40px_rgba(11,12,14,.12)]"
            >
              <span className="text-micro tracking-[.15em] text-accent">Édition {edition.number}</span>
              <span className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">
                {edition.city}
              </span>
              <span className="text-small leading-[1.7] text-[#65645f]">{edition.dates}</span>
              <i
                aria-hidden="true"
                className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent"
              >
                Voir l’édition
              </i>
            </Link>
          </li>
        ))}
      </ol>

      <div className="reveal mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center gap-[.8rem]">
        <Link href={routes.jeca} className="button button-dark">
          Découvrir la JECA <span><Icon name="arrow-up-right" /></span>
        </Link>
        <Link href={`${routes.edv}#actions`} className="button button-outline">
          Les actions d’Espoir de Vie
        </Link>
      </div>
    </section>
  );
}
