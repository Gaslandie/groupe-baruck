import { presidentPortrait } from "@/data/media";
import { asset } from "@/lib/asset";

/**
 * Moitié gauche du hero : uniquement le portrait du président. Les textes qui
 * étaient posés dessus ont été déplacés dans le panneau clair de droite
 * (`HeroIntro`), donc plus de dégradé de lisibilité — seulement un voile très
 * léger en bas pour asseoir l'image.
 */
export function PresidentPanel() {
  return (
    <div id="president" className="relative min-h-[max(100svh,760px)] overflow-hidden bg-ink max-tablet:min-h-[64svh]">
      <img
        src={asset(presidentPortrait.src)}
        alt={presidentPortrait.alt}
        width={presidentPortrait.width}
        height={presidentPortrait.height}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[52%_24%] saturate-[.85] contrast-[1.04]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,transparent_62%,rgba(8,9,10,.34)_100%)]"
      />
    </div>
  );
}
