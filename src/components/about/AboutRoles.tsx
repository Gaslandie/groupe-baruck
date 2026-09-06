import Link from "next/link";

import { routes } from "@/data/site";

import { AboutSectionHead } from "./AboutSectionHead";

const sharedCardStyles =
  "reveal flex flex-col border px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_22px_55px_rgba(23,21,16,.12)]";

export function AboutRoles() {
  return (
    <section id="fonctions" className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <AboutSectionHead
        eyebrow="Le président"
        title="Quatre fonctions,"
        emphasis="une même exigence."
        text="Seules les fonctions confirmées par la direction figurent sur cette page. Le parcours détaillé du président sera ajouté après validation."
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-4 gap-[1.1rem] max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
        <Link href="/#activites" className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">01</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">PDG du Groupe Baruck</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">Il dirige le pôle économique et entrepreneurial du groupe et porte sa stratégie de développement à travers l’ensemble de ses activités.</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">Voir les activités ↗</i>
        </Link>
        <Link href={routes.jeca} className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">02</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">Président de la JECA</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">Jeunes Entrepreneurs Chrétiens Africains : une initiative consacrée à l’entrepreneuriat chrétien africain et à la mise en réseau des jeunes entrepreneurs.</p>
          <small className="mt-[.8rem] block text-label italic text-[#8a8880]">Libellé officiel à confirmer.</small>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">Découvrir la JECA ↗</i>
        </Link>
        <Link href={routes.edv} className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">03</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">Président de l’ONG Espoir de Vie</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">Une action sociale consacrée à la protection des enfants, à l’accompagnement des familles et au soutien des personnes vulnérables.</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">Découvrir l’ONG ↗</i>
        </Link>
        <a href="#experience-onu" className={`${sharedCardStyles} border-ink bg-ink text-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">04</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">Agent de développement · ONU 2016</h3>
          <p className="m-0 text-small leading-[1.7] text-[rgba(255,255,255,.68)]">Agent de développement pour la protection de l’enfant au sein des Nations Unies, en 2016.</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">Voir cette expérience ↓</i>
        </a>
      </div>
    </section>
  );
}
