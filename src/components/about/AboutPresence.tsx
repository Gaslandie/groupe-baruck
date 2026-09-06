import Link from "next/link";

import { placeholderPhotos } from "@/data/media";
import { routes } from "@/data/site";
import { PhotoCredits } from "@/components/ui/PhotoCredits";

import { AboutSectionHead } from "./AboutSectionHead";
import { WestAfricaPresenceMap } from "./WestAfricaPresenceMap";

export function AboutPresence() {
  return (
    <section id="presence" className="bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory">
      <AboutSectionHead
        eyebrow="Présence régionale"
        title="Trois pays,"
        emphasis="une même ambition."
        text="La Guinée comme point d’ancrage, le Sénégal et la Côte d’Ivoire comme horizon de développement."
        tone="light"
      />
      <WestAfricaPresenceMap />
      <div className="reveal-stagger grid grid-cols-3 gap-px border border-[rgba(255,255,255,.16)] bg-[rgba(255,255,255,.16)] max-[1080px]:grid-cols-1">
        <article className="group reveal relative isolate flex min-h-[380px] flex-col overflow-hidden bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)]">
          <span
            aria-hidden="true"
            style={{
              backgroundImage: `url("${placeholderPhotos.conakry.src}")`,
              backgroundPosition: placeholderPhotos.conakry.position,
            }}
            className="absolute inset-0 z-[-2] bg-cover saturate-[.6] transition-transform duration-[600ms] group-hover:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(11,12,14,.35),rgba(11,12,14,.92)_72%)]"
          />
          <span className="text-micro tracking-[.15em] text-accent">01</span>
          <h3 className="mb-4 mt-6 font-display text-display-md font-normal">Guinée</h3>
          <p className="m-0 text-small leading-[1.75] text-[rgba(255,255,255,.62)]">Point d’ancrage du groupe. Baruck Communication y opère le Studio Photo Baruck la Prospérité, à Kobayah (Conakry), ainsi que ses équipes d’hôtesses événementielles.</p>
          <div className="mb-0 mt-auto flex flex-wrap gap-2 pt-[1.8rem]">
            <Link href={routes.studio} className="border border-[rgba(255,255,255,.24)] px-[.8rem] py-[.6rem] text-label uppercase tracking-[.1em] transition-[background,color,border-color] duration-[250ms] hover:border-accent hover:bg-accent hover:text-ivory">Studio photo ↗</Link>
            <Link href={routes.hostesses} className="border border-[rgba(255,255,255,.24)] px-[.8rem] py-[.6rem] text-label uppercase tracking-[.1em] transition-[background,color,border-color] duration-[250ms] hover:border-accent hover:bg-accent hover:text-ivory">Hôtesses événementielles ↗</Link>
          </div>
        </article>
        <article className="group reveal relative isolate flex min-h-[380px] flex-col overflow-hidden bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)]">
          <span
            aria-hidden="true"
            style={{
              backgroundImage: `url("${placeholderPhotos.dakar.src}")`,
              backgroundPosition: placeholderPhotos.dakar.position,
            }}
            className="absolute inset-0 z-[-2] bg-cover saturate-[.6] transition-transform duration-[600ms] group-hover:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(11,12,14,.35),rgba(11,12,14,.92)_72%)]"
          />
          <span className="text-micro tracking-[.15em] text-accent">02</span>
          <h3 className="mb-4 mt-6 font-display text-display-md font-normal">Sénégal</h3>
          <p className="m-0 text-small leading-[1.75] text-[rgba(255,255,255,.62)]">Présence validée par la direction du groupe. Les activités et implantations locales seront précisées prochainement.</p>
        </article>
        <article className="group reveal relative isolate flex min-h-[380px] flex-col overflow-hidden bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)]">
          <span
            aria-hidden="true"
            style={{
              backgroundImage: `url("${placeholderPhotos.abidjan.src}")`,
              backgroundPosition: placeholderPhotos.abidjan.position,
            }}
            className="absolute inset-0 z-[-2] bg-cover saturate-[.6] transition-transform duration-[600ms] group-hover:scale-[1.04]"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(11,12,14,.35),rgba(11,12,14,.92)_72%)]"
          />
          <span className="text-micro tracking-[.15em] text-accent">03</span>
          <h3 className="mb-4 mt-6 font-display text-display-md font-normal">Côte d’Ivoire</h3>
          <p className="m-0 text-small leading-[1.75] text-[rgba(255,255,255,.62)]">Présence validée par la direction du groupe. Les activités et implantations locales seront précisées prochainement.</p>
        </article>
      </div>
      <PhotoCredits
        photos={[placeholderPhotos.conakry, placeholderPhotos.dakar, placeholderPhotos.abidjan]}
        tone="light"
        className="mt-4"
      />
    </section>
  );
}
