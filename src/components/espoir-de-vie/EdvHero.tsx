import { edvLogo } from "@/data/media";
import { asset } from "@/lib/asset";

export function EdvHero() {
  return (
    <section
      id="accueil"
      aria-label="Présentation d’Espoir de Vie"
      className="relative isolate flex min-h-[min(92svh,900px)] flex-col justify-center overflow-hidden scroll-mt-[72px] bg-[radial-gradient(circle_at_10%_88%,rgba(199,70,28,.35),transparent_31%),linear-gradient(135deg,#180e09_0%,#2d160d_52%,#190e09_100%)] px-[clamp(1.3rem,7vw,8.5rem)] pb-20 pt-36 text-white max-tablet:min-h-0 max-tablet:pb-16 max-tablet:pt-[6.5rem]"
    >
      <span
        aria-hidden="true"
        className="absolute right-[-18%] top-[-10%] z-[-1] aspect-square w-[min(52vw,760px)] rounded-full border border-[rgba(240,165,29,.15)] shadow-[0_0_0_85px_rgba(240,165,29,.025),0_0_0_170px_rgba(240,165,29,.018)] max-tablet:right-[-50%] max-tablet:w-[90vw]"
      />
      <div className="grid grid-cols-[minmax(0,900px)_auto] items-center justify-between gap-[clamp(2rem,6vw,6rem)] max-[1100px]:grid-cols-1 max-[1100px]:justify-items-start">
        <div className="hero-in">
          <p className="edv-kicker edv-kicker-light">Engagement humanitaire · Afrique de l’Ouest</p>
          <h1 className="m-0 max-w-[900px] text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
            Espoir de Vie.
            <br />
            <em className="font-[inherit] text-edv-gold">Agir pour les plus vulnérables.</em>
          </h1>
          <p className="mb-5 mt-[1.8rem] max-w-[640px] text-lead leading-[1.7] text-[rgba(255,255,255,.7)] max-tablet:mt-[1.4rem] max-tablet:text-small">
            Protéger les enfants, accompagner les familles et apporter une aide concrète là où elle est nécessaire.
          </p>
          <blockquote className="mb-8 mt-0 font-display text-base italic leading-[1.5] text-[rgba(255,255,255,.82)] max-tablet:text-body">
            « Avec Dieu, nous ferons des exploits. »
          </blockquote>
          <div className="edv-actions">
            <a href="#actions" className="edv-button edv-button-primary">
              Découvrir les actions <span>↓</span>
            </a>
            <a href="#orphelinat" className="edv-button edv-button-line">
              L’orphelinat <span>↘</span>
            </a>
          </div>
        </div>
        <img
          src={asset(edvLogo.src)}
          alt="Logo Espoir de Vie"
          width={edvLogo.width}
          height={edvLogo.height}
          fetchPriority="high"
          className="h-auto w-[clamp(170px,17vw,280px)] mix-blend-screen drop-shadow-[0_18px_30px_rgba(0,0,0,.35)] max-[1100px]:order-first max-[1100px]:mb-8 max-[1100px]:w-[140px] max-tablet:mb-6 max-tablet:w-[120px]"
        />
      </div>
    </section>
  );
}
