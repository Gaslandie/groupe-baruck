import { Icon } from "@/components/ui/Icon";

/**
 * Invitation à descendre, à la fin du hero (2026-09-17). Uniquement un signe
 * dessiné, aucun texte visible : un filet vertical dans lequel un trait accent
 * glisse vers le bas, puis un chevron qui s'allume quand le trait arrive.
 *
 * Le repère est `sticky` et placé en tout dernier dans la section : tant que le
 * bas du hero est sous le bord de l'écran, il reste collé au bas de la fenêtre,
 * puis il s'en va avec le hero. Il est centré sur la colonne de texte pour ne
 * pas tomber à cheval sur la limite photo / fond clair.
 * Le libellé reste lisible par les lecteurs d'écran (`sr-only`).
 */
export function HeroScrollCue() {
  return (
    <div className="pointer-events-none sticky bottom-0 z-20 flex h-0 items-end justify-center pl-[46%] max-desktop:pl-[44%] max-tablet:pl-0">
      <a
        href="#activite-guinee"
        className="hero-cue pointer-events-auto mb-[clamp(1.3rem,3.5vh,2.2rem)] flex flex-col items-center gap-[.5rem] py-2 text-ink max-tablet:text-ivory"
      >
        <span className="sr-only">Descendre vers la suite de la page</span>
        <span aria-hidden="true" className="hero-cue-rail" />
        <Icon name="chevron-down" className="hero-cue-arrow text-[1.05rem] text-accent" />
      </a>
    </div>
  );
}
