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
const baruckContests = [
  {
    number: "01",
    title: "Miss Baruck Guinée",
    dates: "Première édition · 26 juillet 2025",
    text: "Vingt millions de francs guinéens à partager entre les lauréats. Mama Adama Bangoura est couronnée Miss Baruck Guinée 2025.",
    href: `${routes.news}miss-baruck-guinee-2025/`,
  },
  {
    number: "02",
    title: "Top Modèle Baruck Guinée",
    dates: "Première édition · 27 septembre 2025",
    text: "La grande finale se tient à 22 h dans la salle Malick Condé de l’Université Kofi Annan, sous le parrainage du PDG du Groupe Baruck.",
    href: `${routes.news}top-modele-baruck-guinee-2025/`,
  },
  {
    number: "03",
    title: "Top Modèle Baruck Guinée",
    dates: "Deuxième édition · 8 août 2026",
    text: "Quatre-vingts millions de francs guinéens, et la dernière édition du genre : la suite passera par des défilés de mode, adossés à la maison de vêtements du groupe.",
    href: `${routes.news}top-modele-baruck-guinee-2026/`,
  },
];

const familyTitleClass =
  "m-0 mb-[clamp(1.2rem,2vw,1.8rem)] font-display text-display-sm font-normal leading-[1.15]";

export function AboutEvents() {
  return (
    <section
      id="evenements"
      className="scroll-mt-[92px] bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow="Événements organisés"
        title="Le forum de la JECA,"
        emphasis="les concours Baruck."
        text="Depuis 2022, la JECA réunit la diaspora africaine autour de l’investissement sur le continent. En Guinée, Baruck Communication organise ses propres rendez-vous."
        tone="dark"
      />

      <h3 className={`reveal ${familyTitleClass}`}>Le forum de la JECA</h3>
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

      <h3 className={`reveal mt-[clamp(3rem,5vw,4.5rem)] ${familyTitleClass}`}>Les concours Baruck</h3>
      <ol className="reveal-stagger m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-[1080px]:grid-cols-1">
        {baruckContests.map((contest) => (
          <li key={contest.number}>
            <Link
              href={contest.href}
              className="group flex h-full flex-col border border-line bg-ivory px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_18px_40px_rgba(11,12,14,.12)] focus-visible:translate-y-[-6px] focus-visible:shadow-[0_18px_40px_rgba(11,12,14,.12)]"
            >
              <span className="text-micro tracking-[.15em] text-accent">Concours {contest.number}</span>
              <span className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">
                {contest.title}
              </span>
              <span className="text-label uppercase tracking-[.13em] text-[#8d8a84]">{contest.dates}</span>
              <p className="mb-0 mt-[.9rem] text-small leading-[1.7] text-[#65645f]">{contest.text}</p>
              <i
                aria-hidden="true"
                className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent"
              >
                Lire l’article
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
