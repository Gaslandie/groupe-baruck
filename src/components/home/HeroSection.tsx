import { HeroIntro } from "./HeroIntro";
import { HeroScrollCue } from "./HeroScrollCue";
import { PresidentPanel } from "./PresidentPanel";

/**
 * Hero de l'accueil : portrait du président à gauche, textes sur fond clair à
 * droite. Le carrousel qui occupait la moitié droite a été retiré le
 * 2026-09-16 ; ses trois volets sont devenus des sections à part entière
 * (`MainActivities`), juste sous le hero.
 *
 * Hauteurs (2026-09-17, plancher revu le 2026-09-18) :
 * - à partir de 1200 px, le hero fait 104 % de la fenêtre, pour donner de l'air
 *   au portrait dézoomé ;
 * - entre 761 et 1199 px, la colonne image est étroite et haute ; un hero trop
 *   haut y obligerait à zoomer dans la photo, donc il est volontairement plus
 *   court (72 % de la fenêtre, 640 px au minimum) ;
 * - en dessous de 761 px, le hero redevient un seul bloc : le portrait en fond,
 *   les textes par-dessus (voir `PresidentPanel` et `HeroIntro`).
 *
 * Le plancher en pixels a été abaissé le 2026-09-18 : un hero beaucoup plus haut
 * que la fenêtre ramenait le repère de défilement, collé au bas de l'écran, au
 * milieu du texte. Avec un dépassement limité à 4 % de la fenêtre, la bande
 * réservée en bas de `HeroIntro` suffit à les séparer.
 *
 * Le repère de défilement est le dernier enfant de la section, sans marge sous
 * lui : c'est ce qui permet à son `position: sticky` de le garder au bas de
 * l'écran tant que le hero est visible.
 */
export function HeroSection() {
  return (
    <section
      id="accueil"
      aria-label="Présentation du Groupe Baruck"
      className="relative border-b border-line bg-paper text-ink max-tablet:border-0 max-tablet:bg-ink"
    >
      <div className="grid min-h-[max(72svh,640px)] grid-cols-[46%_54%] max-desktop:grid-cols-[44%_56%] wide:min-h-[104svh] max-tablet:block max-tablet:min-h-0">
        <PresidentPanel />
        <HeroIntro />
      </div>
      <HeroScrollCue />
    </section>
  );
}
