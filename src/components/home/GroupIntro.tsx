import Link from "next/link";

import { routes } from "@/data/site";

const values = [
  { number: "01", title: "Vision", text: "Voir plus loin et ouvrir de nouvelles perspectives." },
  { number: "02", title: "Excellence", text: "Placer la qualité au centre de chaque initiative." },
  { number: "03", title: "Impact", text: "Créer une valeur durable pour la société." },
];

export function GroupIntro() {
  return (
    <section
      id="groupe"
      className="grid grid-cols-[10%_42%_1fr] gap-[2.4rem] bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-tablet:grid-cols-1 max-tablet:gap-6 max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div className="reveal col-start-2 max-tablet:col-auto">
        <p className="eyebrow">Notre identité</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Un groupe,
          <br />
          <em className="font-normal text-accent">plusieurs univers.</em>
        </h2>
      </div>
      <div className="reveal col-start-3 max-w-[520px] self-end pb-[.4rem] max-tablet:col-auto">
        <p className="font-display text-[clamp(1.15rem,1.6vw,1.55rem)] font-normal leading-[1.5]">
          Le Groupe Baruck développe des activités complémentaires dans l’hôtellerie, la restauration,
          l’agro-business, la mobilité, la communication digitale et les industries créatives.
        </p>
        <p className="mb-8 mt-[1.4rem] text-[.9rem] leading-[1.75] text-[#64645f]">
          Avec la Guinée comme point d’ancrage et une présence au Sénégal et en Côte d’Ivoire, le Groupe porte une
          ambition régionale : construire des projets solides, modernes et créateurs de valeur, avec une même
          exigence — transformer une vision en impact concret.
        </p>
        <div
          aria-label="Présence régionale du Groupe Baruck"
          className="mb-8 grid grid-cols-[auto_1fr] items-center gap-[1.2rem] border-y border-line py-4 max-tablet:grid-cols-1 max-tablet:gap-[.55rem]"
        >
          <span className="text-[.52rem] uppercase tracking-[.15em] text-accent">Présence régionale</span>
          <p className="m-0 text-right font-display text-[.95rem] italic max-tablet:text-left max-tablet:text-[.9rem]">
            Guinée <i className="mx-[.55rem] font-sans text-[.34rem] not-italic text-accent">◆</i> Sénégal
            <i className="mx-[.55rem] font-sans text-[.34rem] not-italic text-accent">◆</i> Côte d’Ivoire
          </p>
        </div>
        <Link href={routes.activities} className="text-link">
          Explorer nos domaines <span>↘</span>
        </Link>
      </div>
      <div
        aria-label="Valeurs du Groupe Baruck"
        className="col-start-2 col-end-[-1] mt-20 grid grid-cols-3 border-t border-line max-tablet:col-auto max-tablet:mt-10 max-tablet:grid-cols-1"
      >
        {values.map((value) => (
          <article
            key={value.number}
            className="border-r border-line px-[clamp(1rem,2vw,2rem)] pt-8 first:pl-0 last:border-0 max-tablet:border-r-0 max-tablet:border-b max-tablet:px-0 max-tablet:py-[1.4rem] max-tablet:first:py-[1.4rem] max-tablet:last:border-0"
          >
            <span className="text-[.6rem] tracking-[.15em] text-accent">{value.number}</span>
            <h3 className="mb-[.7rem] mt-10 font-display text-[2rem] font-normal max-tablet:mb-[.35rem] max-tablet:mt-3">
              {value.title}
            </h3>
            <p className="max-w-[250px] text-[.82rem] leading-[1.6] text-[#6b6a65]">{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
