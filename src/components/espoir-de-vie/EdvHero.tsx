import { edvLogo, presidentPortrait } from "@/data/media";
import { asset } from "@/lib/asset";

export function EdvHero() {
  return (
    <section
      id="accueil"
      aria-label="Présentation d’Espoir de Vie"
      className="grid min-h-svh scroll-mt-[72px] grid-cols-[56%_44%] bg-edv-ink text-white max-[1100px]:grid-cols-[54%_46%] max-tablet:flex max-tablet:min-h-0 max-tablet:flex-col"
    >
      <div className="relative isolate flex flex-col justify-center overflow-hidden bg-[radial-gradient(circle_at_10%_88%,rgba(199,70,28,.35),transparent_31%),linear-gradient(135deg,#180e09_0%,#2d160d_52%,#190e09_100%)] px-[clamp(2rem,7vw,8.5rem)] pb-20 pt-36 max-[1100px]:px-12 max-tablet:min-h-0 max-tablet:px-[1.3rem] max-tablet:pb-16 max-tablet:pt-[4.5rem]">
        <span
          aria-hidden="true"
          className="absolute right-[-26%] top-[5%] z-[-1] aspect-square w-[min(46vw,700px)] rounded-full border border-[rgba(240,165,29,.15)] shadow-[0_0_0_85px_rgba(240,165,29,.025),0_0_0_170px_rgba(240,165,29,.018)] max-tablet:right-[-50%] max-tablet:w-[90vw]"
        />
        <p className="edv-kicker edv-kicker-light">Engagement humanitaire · Afrique de l’Ouest</p>
        <h1 className="m-0 max-w-[900px] text-balance font-display text-[clamp(3.4rem,6.2vw,7.4rem)] font-normal leading-[.88] tracking-[-.055em] max-tablet:text-[clamp(3rem,14vw,4.7rem)]">
          Espoir de Vie.
          <br />
          <em className="font-[inherit] text-edv-gold">Agir pour les plus vulnérables.</em>
        </h1>
        <p className="mb-5 mt-[1.8rem] max-w-[640px] text-[clamp(.92rem,1.25vw,1.15rem)] leading-[1.7] text-[rgba(255,255,255,.7)] max-tablet:mt-[1.4rem] max-tablet:text-[.85rem]">
          Protéger les enfants, accompagner les familles et apporter une aide concrète là où elle est nécessaire.
        </p>
        <blockquote className="mb-8 mt-0 font-display text-base italic leading-[1.5] text-[rgba(255,255,255,.82)] max-tablet:text-[.9rem]">
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
      <div className="relative min-h-svh min-w-0 overflow-hidden bg-[#22130d] max-tablet:order-[-1] max-tablet:h-[min(68svh,670px)] max-tablet:min-h-0">
        <img
          src={asset(presidentPortrait.src)}
          alt="Djoro Joël Shaloom Krasso, président fondateur d’Espoir de Vie"
          width={presidentPortrait.width}
          height={presidentPortrait.height}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[center_24%] saturate-[.75] contrast-[1.05] max-tablet:object-[center_25%]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,10,5,.06)_35%,rgba(20,10,5,.4)_66%,rgba(20,10,5,.94)_100%),linear-gradient(90deg,rgba(26,16,11,.26),transparent_45%)]"
        />
        <img
          src={asset(edvLogo.src)}
          alt="Logo Espoir de Vie"
          width={edvLogo.width}
          height={edvLogo.height}
          className="absolute bottom-[clamp(5.5rem,9vh,8rem)] right-[clamp(1rem,3vw,3.5rem)] h-auto w-[clamp(130px,15vw,245px)] mix-blend-screen drop-shadow-[0_18px_30px_rgba(0,0,0,.35)] max-tablet:bottom-[4.5rem] max-tablet:right-4 max-tablet:w-[130px]"
        />
        <p className="absolute bottom-[clamp(2rem,4vw,4rem)] left-[clamp(1.4rem,3vw,3.5rem)] m-0 font-display text-[clamp(1.1rem,1.7vw,1.65rem)] italic leading-[1.15] max-tablet:bottom-[1.6rem] max-tablet:left-[1.3rem] max-tablet:max-w-[58%] max-tablet:text-[1.05rem]">
          <span className="mb-[.45rem] block font-sans text-[.5rem] font-bold uppercase leading-none tracking-[.18em] text-edv-gold">
            Président fondateur
          </span>
          Djoro Joël Shaloom Krasso
        </p>
      </div>
    </section>
  );
}
