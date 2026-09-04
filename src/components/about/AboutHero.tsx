import Link from "next/link";

import { placeholderPhotos } from "@/data/media";
import { routes } from "@/data/site";
import { PhotoCredits } from "@/components/ui/PhotoCredits";

export function AboutHero() {
  return (
    <section
      aria-label="Présentation du Groupe Baruck"
      className="relative isolate flex min-h-[max(100svh,760px)] flex-col justify-center overflow-hidden bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory max-tablet:min-h-[84svh] max-tablet:pb-[clamp(3.5rem,7vw,5rem)] max-tablet:pt-[6.5rem]"
    >
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url("${placeholderPhotos.dakarHorizon.src}")`,
          backgroundPosition: placeholderPhotos.dakarHorizon.position,
        }}
        className="absolute inset-0 z-[-2] scale-[1.025] bg-cover saturate-[.7]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(8,9,10,.88),rgba(8,9,10,.5)_55%,rgba(8,9,10,.3)),linear-gradient(180deg,rgba(8,9,10,.55),rgba(8,9,10,.35)_45%,rgba(8,9,10,.92))]"
      />
      <div className="hero-in">
        <p className="eyebrow light">Le Groupe · Vision, excellence, impact</p>
        <h1 className="mb-[1.6rem] mt-0 max-w-[830px] text-balance font-display text-[clamp(3.3rem,6vw,7rem)] font-normal leading-[.88] tracking-[-.05em] max-desktop:text-[clamp(3rem,6vw,5.2rem)] max-tablet:text-[clamp(3.2rem,15vw,5.4rem)]">
          Un homme, une vision,
          <em className="block font-normal text-accent">un groupe.</em>
        </h1>
        <p className="mb-[2.2rem] mt-0 max-w-[560px] text-[clamp(.9rem,1.15vw,1.02rem)] leading-[1.75] text-[rgba(255,255,255,.7)]">
          Un groupe ancré en Guinée, porté par une vision fondée sur l’entrepreneuriat, la création de valeur et
          l’engagement au service de la société.
        </p>
        <div className="flex flex-wrap gap-[.8rem] max-tablet:[&_.button]:w-full">
          <a href="#identite" className="button button-primary">
            Notre identité <span>↓</span>
          </a>
          <Link href={routes.contact} className="button button-ghost">
            Nous contacter
          </Link>
        </div>
      </div>
      <PhotoCredits
        photos={[placeholderPhotos.dakarHorizon]}
        tone="light"
        className="absolute bottom-3 right-[clamp(1.3rem,7vw,8rem)] z-[1] max-tablet:static max-tablet:mt-8"
      />
    </section>
  );
}
