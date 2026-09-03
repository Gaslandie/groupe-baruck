import Link from "next/link";

import { presidentOnu1, presidentOnu2 } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

const roleClassName =
  "grid grid-cols-[42px_1fr_auto] items-baseline gap-4 border-b border-line py-4 transition-[color,padding,background] duration-[220ms] hover:bg-[#f6f2eb] hover:px-[.65rem] hover:text-accent focus-visible:bg-[#f6f2eb] focus-visible:px-[.65rem] focus-visible:text-accent";

export function VisionSection() {
  return (
    <section
      id="president"
      className="grid min-h-[850px] grid-cols-[43%_57%] bg-paper-deep max-desktop:grid-cols-[46%_54%] max-tablet:block max-tablet:min-h-0"
    >
      <div className="reveal relative flex flex-col justify-center p-[clamp(3rem,6vw,7rem)] max-desktop:p-12 max-tablet:p-[1.3rem]">
        <div className="relative isolate h-[660px] max-tablet:h-[540px]">
          <figure className="absolute inset-[0_12%_37%_0] z-[1] m-0 overflow-hidden bg-[#cac5bb] shadow-[0_22px_55px_rgba(25,22,16,.14)] after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)] after:content-[''] max-tablet:inset-[0_8%_40%_0]">
            <img
              src={asset(presidentOnu1.src)}
              alt={presidentOnu1.alt}
              width={presidentOnu1.width}
              height={presidentOnu1.height}
              loading="lazy"
              className="h-full w-full object-cover saturate-[.78] contrast-[1.04] transition-[transform,filter] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.025] hover:saturate-[.95] hover:contrast-[1.02]"
            />
          </figure>
          <figure className="absolute inset-[46%_0_0_19%] z-[2] m-0 overflow-hidden border-[10px] border-paper-deep bg-[#cac5bb] shadow-[0_22px_55px_rgba(25,22,16,.14)] after:pointer-events-none after:absolute after:inset-0 after:shadow-[inset_0_0_0_1px_rgba(255,255,255,.2)] after:content-[''] max-tablet:inset-[43%_0_0_12%] max-tablet:border-[7px]">
            <img
              src={asset(presidentOnu2.src)}
              alt={presidentOnu2.alt}
              width={presidentOnu2.width}
              height={presidentOnu2.height}
              loading="lazy"
              className="h-full w-full object-cover saturate-[.78] contrast-[1.04] transition-[transform,filter] duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.025] hover:saturate-[.95] hover:contrast-[1.02]"
            />
          </figure>
          <span
            aria-hidden="true"
            className="absolute bottom-[4.8%] left-[-.7rem] z-[3] rotate-180 font-display text-[clamp(2.5rem,4vw,4.8rem)] italic leading-none tracking-[-.04em] text-accent [writing-mode:vertical-rl] max-tablet:bottom-[5%] max-tablet:left-[-.2rem]"
          >
            2016
          </span>
        </div>
        <span className="mt-4 text-[.55rem] uppercase tracking-[.17em] text-[#72716b]">
          Protection de l’enfant · Nations Unies · 2016
        </span>
      </div>

      <div className="reveal flex flex-col justify-center bg-ivory p-[clamp(4rem,8vw,9rem)] max-desktop:p-16 max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="eyebrow">Leadership & vision</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Un leadership
          <br />
          <em className="font-normal text-accent">tourné vers l’action.</em>
        </h2>
        <p className="mb-12 mt-[2.2rem] max-w-[670px] font-display text-[clamp(1.15rem,1.6vw,1.55rem)] font-normal leading-[1.5] max-tablet:mb-10 max-tablet:mt-[1.6rem]">
          À la tête du Groupe Baruck, MR Djoro Joël Shaloom Krasso porte une vision fondée sur l’entrepreneuriat,
          la création de valeur et l’engagement au service de la société.
        </p>
        <div className="border-t border-line">
          <Link href={routes.group} className={roleClassName}>
            <span className="text-[.58rem] text-accent">01</span>
            <p className="m-0 text-[.85rem]"><strong>PDG</strong> du Groupe Baruck</p>
            <i aria-hidden="true" className="font-sans text-[.85rem] not-italic text-accent">↗</i>
          </Link>
          <Link href={routes.jeca} className={roleClassName}>
            <span className="text-[.58rem] text-accent">02</span>
            <p className="m-0 text-[.85rem]"><strong>Président</strong> de la JECA</p>
            <i aria-hidden="true" className="font-sans text-[.85rem] not-italic text-accent">↗</i>
          </Link>
          <Link href={routes.edv} className={roleClassName}>
            <span className="text-[.58rem] text-accent">03</span>
            <p className="m-0 text-[.85rem]"><strong>Président</strong> de l’ONG Espoir de Vie</p>
            <i aria-hidden="true" className="font-sans text-[.85rem] not-italic text-accent">↗</i>
          </Link>
          <div
            id="experience-onu"
            tabIndex={-1}
            className="target:scroll-mt-[120px] target:bg-[#f6f2eb] target:px-[.65rem] grid grid-cols-[42px_1fr_auto] items-baseline gap-4 border-b border-line py-4 transition-[color,padding,background] duration-[220ms]"
          >
            <span className="text-[.58rem] text-accent">04</span>
            <p className="m-0 text-[.85rem]">
              <strong>Agent de développement</strong> pour la protection de l’enfant au sein de l’ONU en 2016
            </p>
            <i aria-hidden="true" className="font-sans text-[.85rem] not-italic text-accent">↓</i>
          </div>
        </div>
        <blockquote className="mb-0 ml-0 mr-0 mt-[3.4rem] border-l-2 border-accent pl-6">
          <p className="mb-[.7rem] font-display text-[clamp(1.25rem,2vw,1.8rem)] italic leading-[1.4]">
            « Construire, entreprendre et créer un impact durable. »
          </p>
          <cite className="text-[.48rem] not-italic uppercase tracking-[.14em] text-[#797872]">
            Formulation éditoriale provisoire
          </cite>
        </blockquote>
      </div>
    </section>
  );
}
