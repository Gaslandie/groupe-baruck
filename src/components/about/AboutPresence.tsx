import Link from "next/link";

import { routes } from "@/data/site";

import { AboutSectionHead } from "./AboutSectionHead";

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
      <div className="grid grid-cols-3 gap-px border border-[rgba(255,255,255,.16)] bg-[rgba(255,255,255,.16)] max-[1080px]:grid-cols-1">
        <article className="reveal flex min-h-[300px] flex-col bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)] transition-colors duration-300 hover:bg-[#131518]">
          <span className="text-[.56rem] tracking-[.15em] text-accent">01</span>
          <h3 className="mb-4 mt-6 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] font-normal">Guinée</h3>
          <p className="m-0 text-[.86rem] leading-[1.75] text-[rgba(255,255,255,.62)]">Point d’ancrage du groupe. Baruck Communication y opère le Studio Photo Baruck la Prospérité, à Kobayah (Conakry), ainsi que ses équipes d’hôtesses événementielles.</p>
          <div className="mb-0 mt-auto flex flex-wrap gap-2 pt-[1.8rem]">
            <Link href={routes.studio} className="border border-[rgba(255,255,255,.24)] px-[.8rem] py-[.6rem] text-[.6rem] uppercase tracking-[.1em] transition-[background,color,border-color] duration-[250ms] hover:border-accent hover:bg-accent hover:text-ivory">Studio photo ↗</Link>
            <Link href={routes.hostesses} className="border border-[rgba(255,255,255,.24)] px-[.8rem] py-[.6rem] text-[.6rem] uppercase tracking-[.1em] transition-[background,color,border-color] duration-[250ms] hover:border-accent hover:bg-accent hover:text-ivory">Hôtesses événementielles ↗</Link>
          </div>
        </article>
        <article className="reveal flex min-h-[300px] flex-col bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)] transition-colors duration-300 hover:bg-[#131518]">
          <span className="text-[.56rem] tracking-[.15em] text-accent">02</span>
          <h3 className="mb-4 mt-6 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] font-normal">Sénégal</h3>
          <p className="m-0 text-[.86rem] leading-[1.75] text-[rgba(255,255,255,.62)]">Présence validée par la direction du groupe. Les activités et implantations locales seront précisées prochainement.</p>
        </article>
        <article className="reveal flex min-h-[300px] flex-col bg-ink p-[clamp(1.8rem,2.6vw,2.6rem)] transition-colors duration-300 hover:bg-[#131518]">
          <span className="text-[.56rem] tracking-[.15em] text-accent">03</span>
          <h3 className="mb-4 mt-6 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] font-normal">Côte d’Ivoire</h3>
          <p className="m-0 text-[.86rem] leading-[1.75] text-[rgba(255,255,255,.62)]">Présence validée par la direction du groupe. Les activités et implantations locales seront précisées prochainement.</p>
        </article>
      </div>
    </section>
  );
}
