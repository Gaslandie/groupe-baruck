import { presidentPortrait } from "@/data/media";
import { asset } from "@/lib/asset";

/**
 * Portrait du président : colonne gauche du hero sur grand écran, image de fond
 * du hero sur mobile.
 *
 * Le fichier source est un portrait très serré (683 × 1024). Deux cadrages
 * selon la place disponible, parce qu'aucun des deux ne marche partout :
 *
 * - À partir de 1200 px (`wide:`), la colonne est assez large : la photo est
 *   posée en entier, hauteur limitée à 82 % (dézoom d'environ 20 %), et le
 *   panneau reprend exactement le gris-bleu du fond de studio (#525667, relevé
 *   sur le rendu, filtres compris) pour que ses bords ne se voient pas.
 * - En dessous (tablette et mobile), la colonne est trop étroite pour afficher
 *   la photo entière sans laisser un grand vide : elle remplit le cadre
 *   (`object-cover`). Le dézoom vient alors de la hauteur du hero, plus courte
 *   à ces tailles (voir `HeroSection`).
 *
 * Mobile : le portrait passe en fond du hero et les textes repassent par-dessus,
 * comme avant le 2026-09-16.
 */
export function PresidentPanel() {
  return (
    <div
      id="president"
      className="relative overflow-hidden bg-[#525667] max-tablet:absolute max-tablet:inset-0 max-tablet:z-0 max-tablet:bg-ink"
    >
      <img
        src={asset(presidentPortrait.src)}
        alt={presidentPortrait.alt}
        width={presidentPortrait.width}
        height={presidentPortrait.height}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[50%_26%] saturate-[.85] contrast-[1.04] wide:inset-auto wide:bottom-0 wide:left-1/2 wide:h-[82%] wide:w-auto wide:max-w-none wide:-translate-x-1/2 wide:object-contain wide:object-bottom"
      />
      {/* Grand écran et tablette : le bas du portrait se fond dans le noir. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,12,14,.26)_0%,rgba(11,12,14,0)_18%,rgba(11,12,14,0)_52%,rgba(11,12,14,.5)_76%,rgba(11,12,14,.93)_92%,#0b0c0e_100%)] max-tablet:hidden"
      />
      {/* Mobile : voile de lisibilité pour les textes posés sur la photo. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden bg-[linear-gradient(180deg,rgba(8,9,10,.2)_14%,rgba(8,9,10,.52)_52%,rgba(8,9,10,.94)_100%)] max-tablet:block"
      />
    </div>
  );
}
