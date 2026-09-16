import Link from "next/link";

import { routes } from "@/data/site";

/**
 * Moitié droite du hero, sur fond clair : les textes qui étaient auparavant
 * posés sur le portrait. Les quatre fonctions restent des liens, sans flèche —
 * la puce accentuée et le décalage au survol (`.role-link`, globals.css)
 * suffisent à les signaler.
 */
const roleClassName = "role-link";

export function HeroIntro() {
  return (
    <div className="relative flex min-h-[clamp(640px,82svh,800px)] flex-col justify-center bg-paper px-[clamp(1.5rem,4vw,4.8rem)] py-[clamp(6rem,10vh,8rem)] text-ink max-tablet:min-h-0 max-tablet:px-[1.3rem] max-tablet:py-14">
      <div className="hero-in">
        <h1 className="m-0 max-w-[760px] text-balance font-display text-display-xl font-normal leading-[.9] tracking-[-.04em]">
          <span className="text-muted">MR</span> Djoro Joël
          <br />
          <em className="font-normal text-accent">Shaloom</em> Krasso
        </h1>
        <div className="mb-[1.6rem] mt-[1.6rem] grid gap-[.55rem] text-caption uppercase leading-[1.35] tracking-[.06em] text-[#4b4a46] max-tablet:max-w-[390px] max-tablet:gap-[.45rem] max-tablet:text-label">
          <Link href={routes.group} className={roleClassName}>
            PDG du Groupe Baruck
          </Link>
          <Link href={routes.jeca} className={roleClassName}>
            Président de la JECA
          </Link>
          <Link href={routes.edv} className={roleClassName}>
            Président de l’ONG Espoir de Vie
          </Link>
          <Link href={`${routes.group}#experience-onu`} className={roleClassName}>
            Agent de développement pour la protection de l’enfant au sein de l’ONU en 2016
          </Link>
        </div>
        <div className="flex flex-wrap items-center gap-[.8rem] max-tablet:gap-2">
          <Link href={routes.group} className="button button-dark">
            Découvrir le Groupe
          </Link>
          <Link href={routes.contact} className="button button-outline">
            Nous contacter
          </Link>
        </div>
      </div>
    </div>
  );
}
