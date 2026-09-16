import Link from "next/link";

import { activities } from "@/data/home";
import { routes } from "@/data/site";
import { SectionHead } from "../ui/SectionHead";

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Cartes des neuf autres activités : fond clair, carte blanche, aucun visuel.
 * Depuis le 2026-09-16 : plus de flèche dans le coin, le titre remonte à droite
 * du numéro et le texte passe d'un cran dans l'échelle typographique.
 * Au survol (et au focus clavier), la carte se soulève et son ombre s'accentue ;
 * `prefers-reduced-motion` neutralise ces transitions dans `globals.css`.
 */
export function ActivitiesSection() {
  return (
    <section
      id="activites"
      className="bg-paper-deep px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] text-ink max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <SectionHead
        title="Nos autres activités"
        text="Des domaines complémentaires réunis autour de l’hospitalité, de la création, de la production et du développement."
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-3 gap-[clamp(.9rem,1.6vw,1.4rem)] max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {activities.map((activity, index) => (
          <Link
            key={activity.id}
            id={activity.id}
            href={`${routes.home}#activites`}
            aria-label={`Découvrir l’activité ${activity.title}`}
            className="group reveal flex min-h-[170px] scroll-mt-[92px] flex-col rounded-[10px] border border-[rgba(11,12,14,.09)] bg-ivory p-[1.7rem] shadow-[0_1px_2px_rgba(11,12,14,.05)] transition-[transform,border-color,box-shadow] duration-[420ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:translate-y-[-4px] hover:border-[rgba(11,12,14,.18)] hover:shadow-[0_18px_40px_rgba(11,12,14,.12)] focus-visible:translate-y-[-4px] focus-visible:border-[rgba(11,12,14,.18)] focus-visible:shadow-[0_18px_40px_rgba(11,12,14,.12)] max-tablet:min-h-0 max-tablet:p-[1.5rem]"
          >
            <div className="flex items-baseline gap-[1.05rem]">
              <span className="shrink-0 text-micro uppercase tracking-[.18em] text-[#8d8a84] transition-colors duration-[320ms] group-hover:text-accent group-focus-visible:text-accent">
                {formatNumber(index + 1)} / {formatNumber(activities.length)}
              </span>
              <h3 className="m-0 text-balance font-display text-display-sm font-normal leading-[1.08] tracking-[-.03em]">
                {activity.title}
              </h3>
            </div>
            <p className="mb-0 mt-[1.15rem] max-w-[380px] text-small leading-[1.7] text-[#64645f]">
              {activity.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
