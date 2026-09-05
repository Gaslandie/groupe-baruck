import Link from "next/link";

import { edvImpact } from "@/data/espoir-de-vie";
import { routes } from "@/data/site";

/**
 * Bandeau compact des repères déjà publiés d'Espoir de Vie, pour l'accueil et
 * la page Le Groupe. Les valeurs viennent de edvImpact : rien n'est recopié.
 */
export function EdvImpactHighlights() {
  return (
    <section
      id="impact-espoir-de-vie"
      className="bg-edv-ink px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3.5rem,6vw,6rem)] text-white"
    >
      <div className="reveal mb-[clamp(2rem,4vw,3.2rem)] flex items-end justify-between gap-[clamp(2rem,5vw,5rem)] max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-6">
        <div>
          <p className="edv-kicker edv-kicker-light">Espoir de Vie · Repères documentés</p>
          <h2 className="m-0 text-balance font-display text-[clamp(2.2rem,4vw,4rem)] font-normal leading-[.95] tracking-[-.05em] max-tablet:text-[clamp(2.2rem,10vw,3.2rem)]">
            Des actions,
            <em className="font-[inherit] text-edv-gold"> des repères concrets.</em>
          </h2>
        </div>
        <div className="flex w-[min(430px,42%)] flex-col items-start gap-5 max-[1100px]:w-full">
          <p className="m-0 text-[.84rem] leading-[1.75] text-[rgba(255,255,255,.6)]">
            Ces repères proviennent des actions déjà présentées sur la page Espoir de Vie.
          </p>
          <Link href={`${routes.edv}#actions`} className="edv-button edv-button-line">
            Découvrir les actions <span>↗</span>
          </Link>
        </div>
      </div>

      <dl className="reveal-stagger m-0 grid grid-cols-5 border-l border-t border-[rgba(255,255,255,.15)] max-[1100px]:grid-cols-3 max-tablet:grid-cols-2 max-[430px]:grid-cols-1">
        {edvImpact.map((item) => (
          <div
            key={item.value + item.label}
            className="reveal flex min-h-[150px] flex-col justify-center border-b border-r border-[rgba(255,255,255,.15)] p-[clamp(1.1rem,2vw,1.8rem)] max-tablet:min-h-[130px]"
          >
            <dt className="font-display text-[clamp(1.9rem,3vw,3rem)] font-normal italic leading-[.9] tracking-[-.04em] text-edv-gold">
              {item.value}
            </dt>
            <dd className="mb-0 ml-0 mr-0 mt-3 text-[.6rem] uppercase leading-[1.5] tracking-[.08em] text-[rgba(255,255,255,.7)]">
              {item.label}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
