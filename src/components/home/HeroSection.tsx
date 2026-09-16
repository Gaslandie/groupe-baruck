import { HeroIntro } from "./HeroIntro";
import { PresidentPanel } from "./PresidentPanel";

/**
 * Hero de l'accueil : portrait du président à gauche, textes sur fond clair à
 * droite. Le carrousel qui occupait la moitié droite a été retiré le
 * 2026-09-16 ; ses trois volets sont devenus des sections à part entière
 * (`MainActivities`), juste sous le hero.
 */
export function HeroSection() {
  return (
    <section
      id="accueil"
      aria-label="Présentation du Groupe Baruck"
      className="grid min-h-[clamp(640px,82svh,800px)] grid-cols-[46%_54%] border-b border-line bg-paper text-ink max-desktop:grid-cols-[44%_56%] max-tablet:block"
    >
      <PresidentPanel />
      <HeroIntro />
    </section>
  );
}
