import { edvHeroPhoto } from "@/data/espoir-de-vie";
import { edvLogo } from "@/data/media";
import { asset } from "@/lib/asset";
import { Icon } from "../ui/Icon";

/**
 * Hero repris sur la logique du hero JECA le 2026-09-16 : logo et textes dans
 * le panneau de gauche, photo pleine hauteur à droite légendée en bas. Le
 * fond reste celui d'Espoir de Vie (ink et texte blanc) — seule la
 * structure change.
 */
export function EdvHero() {
  return (
    <section
      id="accueil"
      aria-label="Présentation d’Espoir de Vie"
      className="grid min-h-[clamp(640px,82svh,800px)] scroll-mt-[72px] grid-cols-[58%_42%] overflow-hidden bg-edv-ink text-white max-[1100px]:grid-cols-[55%_45%] max-tablet:flex max-tablet:h-auto max-tablet:min-h-0 max-tablet:flex-col"
    >
      <div className="relative col-start-2 row-start-1 min-h-0 overflow-hidden bg-edv-ink-soft max-tablet:h-[clamp(600px,100svh,860px)] max-tablet:min-h-0 max-tablet:w-full max-tablet:flex-none">
        <img
          src={asset(edvHeroPhoto.src)}
          alt={edvHeroPhoto.alt}
          width={edvHeroPhoto.width}
          height={edvHeroPhoto.height}
          fetchPriority="high"
          style={{ objectPosition: edvHeroPhoto.position }}
          className="absolute inset-0 h-full w-full object-cover saturate-[.92] contrast-[1.02]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(26,16,11,.12)_72%,rgba(26,16,11,.86))] max-tablet:bg-[linear-gradient(180deg,rgba(26,16,11,.1)_48%,rgba(26,16,11,.86)_100%)]"
        />
        <p className="absolute bottom-[clamp(2rem,5vh,4rem)] left-[clamp(1.4rem,3.5vw,4rem)] right-6 z-[2] m-0 font-display text-display-sm font-normal leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.35)] max-tablet:bottom-8 max-tablet:left-[1.3rem] max-tablet:right-[1.3rem]">
          <span className="mb-[.65rem] block font-sans text-micro font-extrabold uppercase leading-none tracking-[.18em] text-edv-gold">
            Depuis 2017
          </span>
          L’orphelinat Espoir de Vie
        </p>
      </div>
      <div className="hero-in relative isolate col-start-1 row-start-1 flex flex-col justify-center pb-12 pl-[clamp(1.3rem,6vw,7.5rem)] pr-[clamp(1.3rem,6vw,7.5rem)] pt-[calc(92px+2rem)] max-[1100px]:px-10 max-tablet:z-[2] max-tablet:h-auto max-tablet:min-h-0 max-tablet:w-full max-tablet:px-[1.3rem] max-tablet:pb-14 max-tablet:pt-16">
        {/* Lueur ember conservée du hero précédent. Aucun motif en fond. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_10%_88%,rgba(199,70,28,.32),transparent_36%)]"
        />
        <img
          src={asset(edvLogo.src)}
          alt="Logo Espoir de Vie"
          width={edvLogo.width}
          height={edvLogo.height}
          fetchPriority="high"
          className="mb-6 h-20 w-auto object-contain mix-blend-screen drop-shadow-[0_18px_30px_rgba(0,0,0,.35)] max-tablet:mb-5 max-tablet:h-16"
        />
        <p className="edv-kicker edv-kicker-light">Engagement humanitaire · Afrique de l’Ouest</p>
        <h1 className="m-0 max-w-[760px] text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          Espoir de Vie.
          <br />
          <em className="font-[inherit] text-edv-gold">Agir pour les plus vulnérables.</em>
        </h1>
        <p className="mb-5 mt-[1.6rem] max-w-[560px] text-lead leading-[1.7] text-[rgba(255,255,255,.7)] max-tablet:mt-[1.4rem] max-tablet:text-small">
          Protéger les enfants, accompagner les familles et apporter une aide concrète là où elle est nécessaire.
        </p>
        <blockquote className="mb-8 mt-0 font-display text-base italic leading-[1.5] text-[rgba(255,255,255,.82)] max-tablet:mb-7 max-tablet:text-body">
          « Avec Dieu, nous ferons des exploits. »
        </blockquote>
        <div className="edv-actions">
          <a href="#actions" className="edv-button edv-button-primary">
            Découvrir les actions <span><Icon name="arrow-down" /></span>
          </a>
          <a href="#orphelinat" className="edv-button edv-button-line">
            L’orphelinat <span><Icon name="arrow-down-right" /></span>
          </a>
        </div>
      </div>
    </section>
  );
}
