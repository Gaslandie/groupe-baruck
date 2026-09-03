import Link from "next/link";

import { edvLogo, jecaLogo } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

import { AboutSectionHead } from "./AboutSectionHead";

export function AboutCommitments() {
  return (
    <section className="bg-paper px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <AboutSectionHead
        eyebrow="Engagements"
        title="Au-delà"
        emphasis="de l’entreprise."
        text="Deux structures présidées par le dirigeant du Groupe Baruck, chacune avec sa propre page."
        tone="dark"
      />
      <div className="grid grid-cols-2 gap-[1.2rem] max-tablet:grid-cols-1">
        <Link href={routes.jeca} className="group reveal flex flex-col border border-line bg-ivory transition-[transform,box-shadow] duration-[350ms] hover:translate-y-[-8px] hover:shadow-[0_24px_60px_rgba(23,21,16,.12)]">
          <div className="flex h-[300px] items-center justify-center overflow-hidden p-6 max-tablet:h-[240px]">
            <img src={asset(jecaLogo.src)} alt="Logo de la JECA, Jeunes Entrepreneurs Chrétiens Africains" width={jecaLogo.width} height={jecaLogo.height} loading="lazy" className="h-auto max-h-full w-auto max-w-full object-contain mix-blend-multiply" />
          </div>
          <div className="relative flex-1 border-t border-line p-[1.8rem]">
            <span className="text-[.56rem] uppercase tracking-[.15em] text-accent">Entrepreneuriat</span>
            <h3 className="mb-[.8rem] mt-[1.2rem] font-display text-[2.2rem] font-normal">JECA</h3>
            <p className="m-0 max-w-[380px] text-[.85rem] leading-[1.7] text-[#676661]">Une initiative consacrée à l’entrepreneuriat chrétien africain et à la mise en réseau des jeunes entrepreneurs.</p>
            <i aria-hidden="true" className="absolute bottom-[1.6rem] right-[1.6rem] grid h-[42px] w-[42px] place-items-center border border-line not-italic transition-[background,color] duration-[250ms] group-hover:bg-ink group-hover:text-ivory">↗</i>
          </div>
        </Link>
        <Link href={routes.edv} className="group reveal flex flex-col border border-line bg-ivory transition-[transform,box-shadow] duration-[350ms] hover:translate-y-[-8px] hover:shadow-[0_24px_60px_rgba(23,21,16,.12)]">
          <div className="flex h-[300px] items-center justify-center overflow-hidden bg-[#090909] p-4 max-tablet:h-[240px]">
            <img src={asset(edvLogo.src)} alt="Logo de l’ONG Espoir de Vie" width={edvLogo.width} height={edvLogo.height} loading="lazy" className="h-auto max-h-full w-auto max-w-full object-contain mix-blend-normal" />
          </div>
          <div className="relative flex-1 border-t border-line p-[1.8rem]">
            <span className="text-[.56rem] uppercase tracking-[.15em] text-accent">Engagement social</span>
            <h3 className="mb-[.8rem] mt-[1.2rem] font-display text-[2.2rem] font-normal">Espoir de Vie</h3>
            <p className="m-0 max-w-[380px] text-[.85rem] leading-[1.7] text-[#676661]">Protéger les enfants, accompagner les familles et apporter une aide concrète aux personnes vulnérables.</p>
            <i aria-hidden="true" className="absolute bottom-[1.6rem] right-[1.6rem] grid h-[42px] w-[42px] place-items-center border border-line not-italic transition-[background,color] duration-[250ms] group-hover:bg-ink group-hover:text-ivory">↗</i>
          </div>
        </Link>
      </div>
    </section>
  );
}
