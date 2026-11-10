import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { jecaEditionNav } from "@/data/jeca";
import { routes } from "@/data/site";

import { Icon } from "../ui/Icon";
import { AboutSectionHead } from "./AboutSectionHead";

/**
 * Les rendez-vous organisés, ajoutés à la page Le Groupe le 2026-09-18.
 *
 * Deux familles depuis le 2026-09-19 : le forum de la JECA, dont les villes et
 * les dates viennent de la page JECA (`jecaEditionNav`, source unique), et les
 * concours organisés en Guinée par Baruck Communication. Ces derniers ont été
 * ajoutés après les précisions du PDG en vidéo : deux éditions, leurs dotations,
 * et le passage aux défilés de mode pour la suite.
 *
 * Les actions de terrain d'Espoir de Vie, qui ne sont pas des rendez-vous du
 * même ordre, restent sur leur page ; un lien y conduit.
 *
 * Une seule flèche par lien de bas de section, et aucune dans les cartes
 * (règle des flèches du site).
 */

/**
 * Depuis le 2026-09-19, les trois concours ont chacun leur article : les cartes
 * sont donc devenues cliquables, comme celles de la JECA, et le lien isolé qui
 * renvoyait vers la seule finale 2026 a été retiré (il faisait doublon).
 */
const baruckContests = pageValue<{ title: string; text: string; dates: string; href: string }[]>("groupe", "AboutEvents.list").map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));

const familyTitleClass =
  "m-0 mb-[clamp(1.2rem,2vw,1.8rem)] font-display text-display-sm font-normal leading-[1.15]";

export function AboutEvents() {
  return (
    <section
      id="evenements"
      className="scroll-mt-[92px] bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow={pageText("groupe", "AboutEvents.1")}
        title={pageText("groupe", "AboutEvents.2")}
        emphasis={pageText("groupe", "AboutEvents.3")}
        text={pageText("groupe", "AboutEvents.4")}
        tone="dark"
      />

      <h3 className={`reveal ${familyTitleClass}`}>{pageText("groupe", "AboutEvents.5")}</h3>
      <ol className="reveal-stagger m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-[1080px]:grid-cols-1">
        {jecaEditionNav.map((edition) => (
          <li key={edition.href}>
            <Link
              href={`${routes.jeca}${edition.href}`}
              className="group flex h-full flex-col border border-line bg-ivory px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_18px_40px_rgba(11,12,14,.12)] focus-visible:translate-y-[-6px] focus-visible:shadow-[0_18px_40px_rgba(11,12,14,.12)]"
            >
              <span className="text-micro tracking-[.15em] text-accent">{pageText("groupe", "AboutEvents.6") + " "}{edition.number}</span>
              <span className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">
                {edition.city}
              </span>
              <span className="text-small leading-[1.7] text-[#65645f]">{edition.dates}</span>
              <i
                aria-hidden="true"
                className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent"
              >{pageText("groupe", "AboutEvents.7")}</i>
            </Link>
          </li>
        ))}
      </ol>

      <h3 className={`reveal mt-[clamp(3rem,5vw,4.5rem)] ${familyTitleClass}`}>{pageText("groupe", "AboutEvents.8")}</h3>
      <ol className="reveal-stagger m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-[1080px]:grid-cols-1">
        {baruckContests.map((contest) => (
          <li key={contest.number}>
            <Link
              href={contest.href}
              className="group flex h-full flex-col border border-line bg-ivory px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_18px_40px_rgba(11,12,14,.12)] focus-visible:translate-y-[-6px] focus-visible:shadow-[0_18px_40px_rgba(11,12,14,.12)]"
            >
              <span className="text-micro tracking-[.15em] text-accent">{pageText("groupe", "AboutEvents.9") + " "}{contest.number}</span>
              <span className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">
                {contest.title}
              </span>
              <span className="text-label uppercase tracking-[.13em] text-[#8d8a84]">{contest.dates}</span>
              <p className="mb-0 mt-[.9rem] text-small leading-[1.7] text-[#65645f]">{contest.text}</p>
              <i
                aria-hidden="true"
                className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent"
              >{pageText("groupe", "AboutEvents.10")}</i>
            </Link>
          </li>
        ))}
      </ol>

      <div className="reveal mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center gap-[.8rem]">
        <Link href={pageValue<string>("groupe", "AboutEvents.11")} className="button button-dark">{pageText("groupe", "AboutEvents.12") + " "}<span><Icon name={pageLinkIcon("groupe", "AboutEvents.11")} /></span>
        </Link>
        <Link href={pageValue<string>("groupe", "AboutEvents.13")} className="button button-outline">{pageText("groupe", "AboutEvents.14")}</Link>
      </div>
    </section>
  );
}
