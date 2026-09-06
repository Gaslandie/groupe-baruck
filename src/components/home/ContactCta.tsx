import Link from "next/link";

import { placeholderImages, unsplashCredit } from "@/data/media";
import { contacts, routes } from "@/data/site";
import { imageUrl } from "@/lib/asset";
import { PhotoCredits } from "@/components/ui/PhotoCredits";

const ctaImage = placeholderImages.contactEquipe.src;

export function ContactCta() {
  return (
    <section className="relative isolate flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-ink-soft px-6 py-32 text-center text-ivory max-tablet:min-h-[650px] max-tablet:px-[1.3rem] max-tablet:py-20">
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-2] scale-[1.035] bg-cover bg-[center_46%] saturate-[.55]"
        style={{ backgroundImage: `url("${imageUrl(ctaImage)}")` }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(13,14,16,.84),rgba(13,14,16,.9)),radial-gradient(circle_at_center,rgba(220,91,43,.13),transparent_56%)]"
      />
      <div
        aria-hidden="true"
        className="absolute aspect-square w-[min(70vw,800px)] rounded-full border border-[rgba(255,255,255,.07)]"
      >
        <span className="absolute inset-[13%] rounded-full border border-[rgba(255,255,255,.07)]" />
        <span className="absolute inset-[27%] rounded-full border border-[rgba(255,255,255,.07)] bg-[radial-gradient(circle,rgba(220,91,43,.13),transparent_68%)]" />
      </div>
      <p className="eyebrow light before:hidden">Une ambition en commun ?</p>
      <h2 className="relative z-[1] mx-auto mb-[1.6rem] mt-2 max-w-[1100px] font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
        Construisons ensemble
        <br />
        des projets qui ont <em className="font-normal text-accent">de l’impact.</em>
      </h2>
      <p className="relative z-[1] mx-auto mb-[2.2rem] max-w-[560px] text-small leading-[1.7] text-[rgba(255,255,255,.62)]">
        Pour une collaboration, un partenariat ou plus d’informations sur nos activités, échangeons.
      </p>
      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-[.8rem]">
        <Link href={routes.contact} className="button button-accent">
          Contacter le Groupe <span>↘</span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="button button-ghost"
        >
          WhatsApp Baruck
        </a>
      </div>
      <PhotoCredits
        source={unsplashCredit}
        tone="light"
        className="absolute bottom-3 right-[clamp(1.3rem,6vw,7.5rem)] z-[1] max-tablet:static max-tablet:mt-8"
      />
    </section>
  );
}
