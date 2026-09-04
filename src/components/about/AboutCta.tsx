import Link from "next/link";

import { placeholderPhotos } from "@/data/media";
import { routes } from "@/data/site";
import { PhotoCredits } from "@/components/ui/PhotoCredits";

export function AboutCta() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-soft px-[clamp(1.3rem,7vw,8rem)] py-[clamp(6rem,10vw,10rem)] text-center text-ivory">
      <span
        aria-hidden="true"
        style={{
          backgroundImage: `url("${placeholderPhotos.madina.src}")`,
          backgroundPosition: placeholderPhotos.madina.position,
        }}
        className="absolute inset-0 z-[-2] scale-[1.035] bg-cover saturate-[.5]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(13,14,16,.86),rgba(13,14,16,.92))]"
      />
      <p className="eyebrow light justify-center before:hidden">Une ambition en commun ?</p>
      <h2 className="mx-auto mb-[1.6rem] mt-0 max-w-[900px] text-balance font-display text-[clamp(2.7rem,5vw,5.6rem)] font-normal leading-[.92] tracking-[-.05em]">
        Échangeons sur
        <em className="block font-normal text-accent">vos projets.</em>
      </h2>
      <p className="mx-auto my-0 max-w-[540px] text-[.92rem] leading-[1.75] text-[rgba(255,255,255,.62)]">Partenariat, collaboration ou simple demande d’information : l’équipe du Groupe Baruck vous répond.</p>
      <div className="mt-[2.2rem] flex flex-wrap justify-center gap-[.8rem] max-tablet:[&_.button]:w-full">
        <Link href={routes.contact} className="button button-accent">Nous contacter <span>↗</span></Link>
      </div>
      <PhotoCredits photos={[placeholderPhotos.madina]} tone="light" className="mt-10" />
    </section>
  );
}
