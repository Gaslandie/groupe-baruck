import Link from "next/link";

import { activities } from "@/data/home";
import { unsplashCredit } from "@/data/media";
import { routes } from "@/data/site";
import { imageUrl } from "@/lib/asset";

import { PhotoCredits } from "../ui/PhotoCredits";
import { SectionHead } from "../ui/SectionHead";

function formatNumber(value: number) {
  return String(value).padStart(2, "0");
}

export function ActivitiesSection() {
  return (
    <section
      id="activites"
      className="bg-ink px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <SectionHead
        eyebrow="Neuf expertises, une vision"
        title="Nos activités"
        text="Des domaines complémentaires réunis autour de l’hospitalité, de la création, de la production et du développement."
        tone="light"
      />
      <div className="reveal-stagger grid grid-cols-3 gap-px border border-[rgba(255,255,255,.15)] bg-[rgba(255,255,255,.15)] max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {activities.map((activity, index) => (
          <Link
            key={activity.id}
            id={activity.id}
            href={`${routes.home}#activites`}
            aria-label={`Découvrir l’activité ${activity.title}`}
            className="group reveal relative isolate flex min-h-[390px] scroll-mt-[92px] flex-col justify-between overflow-hidden p-[1.6rem] max-tablet:min-h-[440px]"
            style={{ background: activity.bg }}
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[-2] bg-cover bg-center transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.08]"
              style={{
                backgroundImage: `linear-gradient(145deg, rgba(5,6,7,.08), rgba(5,6,7,.22)), ${activity.art}, url("${imageUrl(activity.image)}")`,
              }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(0,0,0,.08),rgba(0,0,0,.78))]"
            />
            <div className="flex items-center justify-between">
              <span className="text-[.6rem] uppercase tracking-[.18em]">
                {formatNumber(index + 1)} / {formatNumber(activities.length)}
              </span>
              <i
                aria-hidden="true"
                className="font-sans text-[1.2rem] not-italic transition-transform duration-[250ms] group-hover:translate-x-1 group-hover:translate-y-[-4px]"
              >
                ↗
              </i>
            </div>
            <div>
              <h3 className="mb-[.75rem] text-balance font-display text-[clamp(2rem,3vw,3.4rem)] font-normal leading-[.92] tracking-[-.04em]">
                {activity.title}
              </h3>
              <p className="m-0 max-w-[320px] text-[.78rem] leading-[1.6] text-[rgba(255,255,255,.68)]">
                {activity.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
      <PhotoCredits source={unsplashCredit} tone="light" className="mt-6" />
    </section>
  );
}
