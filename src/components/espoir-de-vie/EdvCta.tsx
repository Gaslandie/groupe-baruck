import Link from "next/link";

import { edvLogo } from "@/data/media";
import { contacts, routes } from "@/data/site";
import { asset } from "@/lib/asset";

export function EdvCta() {
  return (
    <section className="relative isolate flex min-h-[620px] flex-col items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_115%,#6b260c,transparent_45%)] bg-edv-ink px-6 py-28 text-center text-white max-tablet:min-h-[560px] max-tablet:px-[1.3rem] max-tablet:py-24">
      <img
        src={asset(edvLogo.src)}
        alt=""
        width={edvLogo.width}
        height={edvLogo.height}
        loading="lazy"
        className="absolute z-[-1] w-[min(44vw,620px)] opacity-[.09] mix-blend-screen max-tablet:w-[100vw]"
      />
      <p className="edv-kicker edv-kicker-light before:hidden">Espoir de Vie</p>
      <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.3vw,6.2rem)] font-normal leading-[.88] tracking-[-.055em] max-tablet:text-[clamp(2.8rem,13vw,4.25rem)]">
        Chaque soutien peut
        <br />
        <em className="font-[inherit] text-edv-gold">ouvrir un nouvel avenir.</em>
      </h2>
      <p className="mb-[2.4rem] mt-8 max-w-[650px] text-[.9rem] leading-[1.75] text-[rgba(255,255,255,.65)]">
        Vous souhaitez connaître les actions de la fondation, proposer un partenariat ou contribuer à une initiative ?
        Échangeons.
      </p>
      <div className="edv-actions edv-actions-center">
        <Link href={routes.contact} className="edv-button edv-button-white">
          Nous contacter <span>↗</span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="edv-button edv-button-outline"
        >
          Écrire sur WhatsApp
        </a>
      </div>
    </section>
  );
}
