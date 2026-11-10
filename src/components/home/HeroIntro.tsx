import { pageText, pageValue } from "@/lib/page-content";
import Link from "next/link";

/**
 * Textes du hero. Sur grand écran ils occupent la moitié droite, sur fond clair.
 * Sur mobile (2026-09-17) le hero redevient un seul bloc : ces mêmes textes
 * repassent par-dessus le portrait, en bas de l'image, comme avant le
 * 2026-09-16. D'où les variantes `max-tablet:` de couleur sur fond sombre.
 *
 * Les quatre fonctions restent des liens, sans flèche — la puce accentuée et le
 * décalage au survol (`.role-link`, globals.css) suffisent à les signaler.
 *
 * Le sur-titre « Direction du Groupe Baruck » et la ligne « Leadership ·
 * Entrepreneuriat · Engagement » ont été retirés (2026-09-16 et 2026-09-17) :
 * le bloc commence directement par le nom. Le haut de colonne reste plus
 * généreux que le bas (`pt` > `pb`), ce qui descend légèrement l'ensemble du
 * texte. Cet écart, fixé à 20 vh le 2026-09-17, est ramené à 15 vh le
 * 2026-09-19 : sur grand écran le bloc tombait trop bas. Le bas de la colonne
 * réserve en plus une bande d'environ 9 % de la hauteur de l'écran : c'est la
 * place du repère de défilement, qui sans elle venait toucher le texte
 * (corrigé le 2026-09-18).
 */
const roleClassName = "role-link";

export function HeroIntro() {
  return (
    <div className="relative z-10 flex flex-col bg-paper px-[clamp(1.5rem,4vw,4.8rem)] pb-[clamp(5.5rem,9vh,7.5rem)] pt-[clamp(7.5rem,15vh,11.5rem)] text-ink max-tablet:min-h-[100svh] max-tablet:bg-transparent max-tablet:px-[1.3rem] max-tablet:pb-[clamp(5.5rem,13vh,7.5rem)] max-tablet:pt-[8rem] max-tablet:text-ivory">
      <div className="hero-in flex flex-1 flex-col justify-center max-tablet:justify-end">
        <h1 className="m-0 max-w-[760px] text-balance font-display text-display-xl font-normal leading-[.9] tracking-[-.04em]">
          <span className="text-muted max-tablet:text-[#d8c8aa]">{pageText("groupe", "president.honorific")}</span>{" "}{pageText("groupe", "president.givenNames")}<br />
          <em className="font-normal text-accent">{pageText("groupe", "president.highlight")}</em>{" "}{pageText("groupe", "president.surname")}</h1>
        <div className="mb-[1.6rem] mt-[1.6rem] grid gap-[.55rem] text-caption uppercase leading-[1.35] tracking-[.06em] text-[#4b4a46] max-tablet:mb-[1.2rem] max-tablet:mt-[1.2rem] max-tablet:max-w-[390px] max-tablet:gap-[.45rem] max-tablet:text-label max-tablet:text-[rgba(255,253,248,.84)]">
          <Link prefetch={false} href={pageValue<string>("home", "HeroIntro.5")} className={roleClassName}>{pageText("home", "HeroIntro.6")}</Link>
          <Link prefetch={false} href={pageValue<string>("home", "HeroIntro.7")} className={roleClassName}>{pageText("home", "HeroIntro.8")}</Link>
          <Link prefetch={false} href={pageValue<string>("home", "HeroIntro.9")} className={roleClassName}>{pageText("home", "HeroIntro.10")}</Link>
          <Link prefetch={false} href={pageValue<string>("home", "HeroIntro.11")} className={roleClassName}>{pageText("home", "HeroIntro.12")}</Link>
        </div>
        <div className="flex flex-wrap items-center gap-[.8rem] max-tablet:gap-2">
          <Link
            prefetch={false}
            href={pageValue<string>("home", "HeroIntro.13")}
            className="button button-dark max-tablet:border-ivory max-tablet:bg-ivory max-tablet:text-ink"
          >{pageText("home", "HeroIntro.14")}</Link>
          <Link
            prefetch={false}
            href={pageValue<string>("home", "HeroIntro.15")}
            className="button button-outline max-tablet:border-[rgba(255,255,255,.34)] max-tablet:text-ivory"
          >{pageText("home", "HeroIntro.16")}</Link>
        </div>
      </div>
    </div>
  );
}
