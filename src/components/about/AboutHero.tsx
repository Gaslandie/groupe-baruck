import Link from "next/link";

import { presidentPortrait } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

export function AboutHero() {
  return (
    <section
      aria-label="Présentation du président du Groupe Baruck"
      className="grid min-h-[92svh] grid-cols-[1.05fr_.95fr] items-stretch bg-ink text-ivory max-[1080px]:grid-cols-1"
    >
      <div className="flex flex-col justify-center px-[clamp(1.3rem,5vw,5.5rem)] pb-[clamp(3.5rem,6vw,5rem)] pl-[clamp(1.3rem,7vw,8rem)] pt-[clamp(8rem,11vw,11rem)] max-[1080px]:px-[clamp(1.3rem,6vw,4rem)] max-[1080px]:pb-[clamp(3.5rem,7vw,5rem)] max-[1080px]:pt-[clamp(2.5rem,6vw,4rem)]">
        <p className="eyebrow light">Le Groupe · Vision, excellence, impact</p>
        <h1 className="mb-[1.6rem] mt-0 text-balance font-display text-[clamp(2.9rem,5.2vw,5.4rem)] font-normal leading-[.92] tracking-[-.05em]">
          Un homme, une vision,
          <em className="block font-normal text-accent">un groupe.</em>
        </h1>
        <p className="mb-[1.1rem] mt-0 font-display text-[clamp(1.05rem,1.5vw,1.35rem)] font-normal tracking-[.02em] text-[rgba(255,255,255,.94)]">
          <span className="mr-[.45rem] text-[.68em] uppercase tracking-[.18em] text-accent">MR</span>
          Djoro Joël Shaloom Krasso
        </p>
        <p className="mb-[2.2rem] mt-0 max-w-[520px] text-[clamp(.9rem,1.15vw,1.02rem)] leading-[1.75] text-[rgba(255,255,255,.7)]">
          À la tête du Groupe Baruck, il porte une vision fondée sur l’entrepreneuriat, la création de valeur et
          l’engagement au service de la société.
        </p>
        <div className="max-w-[620px] border-t border-[rgba(255,255,255,.16)]">
          <a
            href="#fonctions"
            className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-[rgba(255,255,255,.16)] py-[.95rem] text-[rgba(255,255,255,.8)] transition-[color,padding,background] duration-[220ms] hover:bg-[rgba(255,255,255,.05)] hover:px-[.65rem] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.05)] focus-visible:px-[.65rem] focus-visible:text-ivory max-tablet:grid-cols-[32px_1fr_auto] max-tablet:gap-[.7rem]"
          >
            <span className="text-[.58rem] tracking-[.14em] text-accent">01</span>
            <p className="m-0 text-[.84rem] leading-[1.5]">
              <strong className="font-semibold text-ivory">PDG</strong> du Groupe Baruck
            </p>
            <i aria-hidden="true" className="text-[.8rem] not-italic text-accent">↓</i>
          </a>
          <Link
            href={routes.jeca}
            className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-[rgba(255,255,255,.16)] py-[.95rem] text-[rgba(255,255,255,.8)] transition-[color,padding,background] duration-[220ms] hover:bg-[rgba(255,255,255,.05)] hover:px-[.65rem] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.05)] focus-visible:px-[.65rem] focus-visible:text-ivory max-tablet:grid-cols-[32px_1fr_auto] max-tablet:gap-[.7rem]"
          >
            <span className="text-[.58rem] tracking-[.14em] text-accent">02</span>
            <p className="m-0 text-[.84rem] leading-[1.5]">
              <strong className="font-semibold text-ivory">Président</strong> de la JECA
              <small className="mt-1 block text-[.68rem] text-[rgba(255,255,255,.45)]">
                (Jeunes Entrepreneurs Chrétiens Africains)
              </small>
            </p>
            <i aria-hidden="true" className="text-[.8rem] not-italic text-accent">↗</i>
          </Link>
          <Link
            href={routes.edv}
            className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-[rgba(255,255,255,.16)] py-[.95rem] text-[rgba(255,255,255,.8)] transition-[color,padding,background] duration-[220ms] hover:bg-[rgba(255,255,255,.05)] hover:px-[.65rem] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.05)] focus-visible:px-[.65rem] focus-visible:text-ivory max-tablet:grid-cols-[32px_1fr_auto] max-tablet:gap-[.7rem]"
          >
            <span className="text-[.58rem] tracking-[.14em] text-accent">03</span>
            <p className="m-0 text-[.84rem] leading-[1.5]">
              <strong className="font-semibold text-ivory">Président</strong> de l’ONG Espoir de Vie
            </p>
            <i aria-hidden="true" className="text-[.8rem] not-italic text-accent">↗</i>
          </Link>
          <a
            href="#experience-onu"
            className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-[rgba(255,255,255,.16)] py-[.95rem] text-[rgba(255,255,255,.8)] transition-[color,padding,background] duration-[220ms] hover:bg-[rgba(255,255,255,.05)] hover:px-[.65rem] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.05)] focus-visible:px-[.65rem] focus-visible:text-ivory max-tablet:grid-cols-[32px_1fr_auto] max-tablet:gap-[.7rem]"
          >
            <span className="text-[.58rem] tracking-[.14em] text-accent">04</span>
            <p className="m-0 text-[.84rem] leading-[1.5]">
              <strong className="font-semibold text-ivory">Agent de développement</strong> pour la protection de
              l’enfant au sein de l’ONU en 2016
            </p>
            <i aria-hidden="true" className="text-[.8rem] not-italic text-accent">↓</i>
          </a>
        </div>
        <div className="mt-[2.2rem] flex flex-wrap gap-[.8rem] max-tablet:[&_.button]:w-full">
          <a href="#fonctions" className="button button-accent">
            Découvrir ses fonctions <span>↓</span>
          </a>
          <Link href={routes.contact} className="button button-ghost">Nous contacter</Link>
        </div>
      </div>
      <figure className="relative m-0 overflow-hidden bg-[#101112] after:absolute after:inset-0 after:bg-[linear-gradient(90deg,rgba(11,12,14,.85),rgba(11,12,14,.05)_42%),linear-gradient(0deg,rgba(11,12,14,.55),transparent_42%)] after:content-[''] max-[1080px]:order-first max-[1080px]:h-[clamp(380px,62svh,560px)] max-[1080px]:after:bg-[linear-gradient(0deg,rgba(11,12,14,.9),rgba(11,12,14,.12)_55%)] max-tablet:h-[58svh]">
        <img
          src={asset(presidentPortrait.src)}
          alt={presidentPortrait.alt}
          width={presidentPortrait.width}
          height={presidentPortrait.height}
          fetchPriority="high"
          className="h-full w-full object-cover object-[52%_22%] saturate-[.85] contrast-[1.03]"
        />
        <figcaption className="absolute bottom-[2.2rem] right-[1.6rem] z-[1] [writing-mode:vertical-rl] text-[.55rem] uppercase tracking-[.24em] text-[rgba(255,255,255,.6)]">
          Présidence du Groupe Baruck
        </figcaption>
      </figure>
    </section>
  );
}
