import Link from "next/link";

import { presidentPortrait } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

const roleClassName =
  "flex w-fit items-center gap-[.65rem] transition-[color,transform] duration-[220ms] before:h-1 before:w-1 before:shrink-0 before:rounded-full before:bg-accent before:content-[''] after:text-accent after:opacity-[.55] after:transition-[opacity,transform] after:duration-[220ms] after:content-['↗'] hover:translate-x-[5px] hover:text-accent hover:after:translate-x-0.5 hover:after:translate-y-[-2px] hover:after:opacity-100 focus-visible:translate-x-[5px] focus-visible:text-accent focus-visible:after:translate-x-0.5 focus-visible:after:translate-y-[-2px] focus-visible:after:opacity-100 max-tablet:items-start max-tablet:before:mt-[.35em]";

export function PresidentPanel() {
  return (
    <div id="president" className="relative min-h-[max(100svh,760px)] overflow-hidden max-tablet:min-h-[84svh]">
      <img
        src={asset(presidentPortrait.src)}
        alt={presidentPortrait.alt}
        width={presidentPortrait.width}
        height={presidentPortrait.height}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[52%_28%] saturate-[.8] contrast-[1.04]"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,9,10,.08)_20%,rgba(8,9,10,.32)_56%,rgba(8,9,10,.94)_100%),linear-gradient(90deg,rgba(5,6,7,.18),transparent_65%)]" />
      <div className="hero-in absolute bottom-[clamp(4rem,8vh,7rem)] left-[clamp(1.5rem,4vw,4.8rem)] right-[clamp(1.2rem,3vw,3rem)] z-[2] max-tablet:bottom-[2.2rem] max-tablet:left-[1.3rem]">
        <p className="eyebrow light text-[.72rem] max-tablet:text-[.66rem]">Direction du Groupe Baruck</p>
        <h1 className="m-0 max-w-[760px] text-balance font-display text-[clamp(2.7rem,4.4vw,5.2rem)] font-normal leading-[.88] tracking-[-.045em] max-desktop:text-[clamp(2.5rem,5vw,4.2rem)] max-tablet:text-[clamp(2.55rem,11vw,4rem)]">
          <span className="text-[#d8c8aa]">MR</span> Djoro Joël
          <br />
          <em className="font-normal text-accent">Shaloom</em> Krasso
        </h1>
        <div className="mb-[.8rem] mt-[1.3rem] grid gap-2 text-[.78rem] uppercase leading-[1.35] tracking-[.06em] max-tablet:max-w-[390px] max-tablet:gap-[.4rem] max-tablet:text-[.66rem]">
          <Link href={routes.group} className={roleClassName}>
            PDG du Groupe Baruck
          </Link>
          <Link href={routes.jeca} className={roleClassName}>
            Président de la JECA
          </Link>
          <Link href={routes.edv} className={roleClassName}>
            Président de l’ONG Espoir de Vie
          </Link>
          <a href="#experience-onu" className={roleClassName}>
            Agent de développement pour la protection de l’enfant au sein de l’ONU en 2016
          </a>
        </div>
        <div className="flex flex-wrap items-center gap-[.8rem] max-tablet:gap-2">
          <Link href={routes.group} className="button button-primary">
            Découvrir le Groupe <span>↘</span>
          </Link>
          <Link href={routes.contact} className="button button-ghost">
            Nous contacter
          </Link>
        </div>
      </div>
      <span className="absolute left-[1.4rem] top-1/2 z-[2] origin-left -rotate-90 translate-x-[-50%] text-[.53rem] uppercase tracking-[.18em] text-[rgba(255,255,255,.42)] max-tablet:hidden">
        Leadership · Entrepreneuriat · Engagement
      </span>
    </div>
  );
}
