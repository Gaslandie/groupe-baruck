import { activities } from "@/data/home";

import { AboutSectionHead } from "./AboutSectionHead";

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

/**
 * Les domaines du groupe, listés sur la page Le Groupe depuis le 2026-09-18.
 *
 * Les titres et les descriptions viennent du back-office (`content/textes.json`,
 * via `activities`), donc les mêmes que les cartes de l'accueil : une seule
 * saisie, deux endroits. Ici les domaines ne sont pas des liens — aucun n'a de
 * page à lui. Les deux activités qui en ont une, le studio photo et les
 * hôtesses, sont présentées juste au-dessus par `AboutCommunication`.
 */
export function AboutActivities() {
  return (
    <section
      id="activites-principales"
      className="scroll-mt-[92px] bg-paper px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow="Activités principales"
        title="Les domaines"
        emphasis="du groupe."
        text="Autour du pôle guinéen, le groupe réunit des domaines complémentaires : hospitalité, création, production et développement."
        tone="dark"
      />

      <dl className="reveal-stagger m-0 grid grid-cols-3 border-l border-t border-line max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {activities.map((activity, index) => (
          <div
            key={activity.id}
            className="reveal flex min-h-[180px] flex-col border-b border-r border-line bg-ivory p-[clamp(1.3rem,2vw,1.9rem)] max-tablet:min-h-0"
          >
            <dt className="text-micro uppercase tracking-[.18em] text-[#8d8a84]">
              {formatNumber(index + 1)} / {formatNumber(activities.length)}
            </dt>
            <p className="mb-0 mt-[1.1rem] text-balance font-display text-display-sm font-normal leading-[1.08] tracking-[-.03em]">
              {activity.title}
            </p>
            <dd className="mb-0 ml-0 mr-0 mt-[.9rem] text-small leading-[1.7] text-[#64645f]">
              {activity.description}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
