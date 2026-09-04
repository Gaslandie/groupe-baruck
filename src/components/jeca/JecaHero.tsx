import { jecaLogo } from "@/data/media";
import { jecaPortrait } from "@/data/jeca";
import { asset } from "@/lib/asset";

export function JecaHero() {
  return (
    <section
      id="accueil"
      className="grid min-h-[clamp(640px,82svh,800px)] scroll-mt-[74px] grid-cols-[58%_42%] overflow-hidden bg-jeca-paper text-jeca-ink max-[1080px]:grid-cols-[55%_45%] max-tablet:relative max-tablet:flex max-tablet:h-auto max-tablet:min-h-0 max-tablet:flex-col max-tablet:bg-jeca-blue max-tablet:text-white"
    >
      <div className="relative col-start-2 row-start-1 min-h-0 overflow-hidden bg-[#111a2f] max-tablet:relative max-tablet:h-[clamp(600px,100svh,860px)] max-tablet:min-h-0 max-tablet:w-full max-tablet:flex-none">
        <img
          src={asset(jecaPortrait.src)}
          alt={jecaPortrait.alt}
          width={jecaPortrait.width}
          height={jecaPortrait.height}
          fetchPriority="high"
          className="h-full w-full object-cover object-[center_26%] saturate-[.98] contrast-[1.01] max-tablet:absolute max-tablet:inset-0 max-tablet:object-[center_38%] max-tablet:opacity-100"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,transparent_56%,rgba(3,12,37,.1)_72%,rgba(3,12,37,.84))] max-tablet:bg-[linear-gradient(180deg,rgba(3,12,37,.08)_48%,rgba(3,12,37,.82)_100%)]"
        />
        <p className="absolute bottom-[clamp(2rem,5vh,4rem)] left-[clamp(1.4rem,3.5vw,4rem)] right-6 z-[2] m-0 font-display text-[clamp(1.25rem,1.8vw,1.8rem)] font-normal leading-[1.1] text-white [text-shadow:0_2px_18px_rgba(0,0,0,.35)] max-tablet:bottom-8 max-tablet:left-[1.3rem] max-tablet:right-[1.3rem]">
          <span className="mb-[.65rem] block font-sans text-[.52rem] font-extrabold uppercase leading-none tracking-[.18em] text-jeca-yellow">
            Président fondateur
          </span>
          Djoro Joël Shaloom Krasso
        </p>
      </div>
      <div className="hero-in relative isolate col-start-1 row-start-1 flex flex-col justify-center pb-12 pl-[clamp(2rem,6vw,7.5rem)] pr-[clamp(2rem,6vw,7.5rem)] pt-[calc(92px+2rem)] max-[1080px]:px-10 max-tablet:z-[2] max-tablet:h-auto max-tablet:min-h-0 max-tablet:w-full max-tablet:px-[1.3rem] max-tablet:pb-14 max-tablet:pt-16">
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[-1] bg-[linear-gradient(rgba(7,21,55,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(7,21,55,.06)_1px,transparent_1px)] bg-[size:70px_70px] opacity-[.38] [mask-image:linear-gradient(135deg,#000,transparent_75%)] max-tablet:hidden"
        />
        <img
          src={asset(jecaLogo.src)}
          alt="JECA — Jeunes Entrepreneurs Chrétiens Africains"
          width={jecaLogo.width}
          height={jecaLogo.height}
          fetchPriority="high"
          className="mb-6 h-16 w-24 bg-white p-1 object-contain max-tablet:mb-5 max-tablet:h-[59px] max-tablet:w-[88px] [@media(max-width:760px)_and_(max-height:700px)]:mb-[.8rem] [@media(max-width:760px)_and_(max-height:700px)]:h-[51px] [@media(max-width:760px)_and_(max-height:700px)]:w-[76px]"
        />
        <p className="jeca-kicker max-tablet:text-[rgba(255,255,255,.72)] max-tablet:before:bg-jeca-yellow [@media(max-width:760px)_and_(max-height:700px)]:mb-[.8rem]">
          Créée en 2019
        </p>
        <h1 className="m-0 max-w-[760px] text-balance font-display text-[clamp(2.7rem,4.4vw,5.2rem)] font-normal leading-[.88] tracking-[-.045em] max-tablet:max-w-[470px] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)] max-tablet:text-white [@media(max-width:760px)_and_(max-height:700px)]:text-[clamp(2.5rem,11.5vw,3.6rem)]">
          Réunir la diaspora.
          <br />
          <em className="font-normal text-jeca-red max-tablet:text-jeca-yellow">Investir en Afrique.</em>
        </h1>
        <p className="mb-[1.6rem] mt-[1.4rem] max-w-[560px] text-[.9rem] leading-[1.7] text-jeca-muted max-tablet:mb-6 max-tablet:mt-[1.3rem] max-tablet:max-w-[520px] max-tablet:text-[.86rem] max-tablet:text-[rgba(255,255,255,.74)] [@media(max-width:760px)_and_(max-height:700px)]:mb-[1.1rem] [@media(max-width:760px)_and_(max-height:700px)]:mt-4 [@media(max-width:760px)_and_(max-height:700px)]:leading-[1.6]">
          La JECA sensibilise la diaspora africaine à l’investissement sur le continent et veut se placer comme un
          lien entre la diaspora et l’Afrique.
        </p>
        <div className="jeca-actions">
          <a href="#editions" className="jeca-button jeca-button-primary">
            Voir les éditions <span>↓</span>
          </a>
          <a href="#vision" className="jeca-button jeca-button-line">
            Notre vision <span>↘</span>
          </a>
        </div>
        <dl className="mb-0 mt-[clamp(2rem,4vh,3.2rem)] grid max-w-[420px] grid-cols-[repeat(2,minmax(0,150px))] border-t border-jeca-line pt-[1.1rem] max-tablet:mt-8 max-tablet:border-[rgba(255,255,255,.22)] [@media(max-width:760px)_and_(max-height:700px)]:mt-[1.2rem]">
          <div className="pr-[.8rem]">
            <dt className="font-display text-[clamp(1.25rem,1.8vw,1.7rem)] font-normal leading-none text-jeca-blue max-tablet:text-[1.25rem] max-tablet:text-white">2019</dt>
            <dd className="mb-0 ml-0 mr-0 mt-[.4rem] text-[.48rem] uppercase leading-[1.4] tracking-[.13em] text-jeca-muted max-tablet:text-[.43rem] max-tablet:text-[rgba(255,255,255,.5)]">Création de la JECA</dd>
          </div>
          <div className="pr-[.8rem]">
            <dt className="font-display text-[clamp(1.25rem,1.8vw,1.7rem)] font-normal leading-none text-jeca-blue max-tablet:text-[1.25rem] max-tablet:text-white">03</dt>
            <dd className="mb-0 ml-0 mr-0 mt-[.4rem] text-[.48rem] uppercase leading-[1.4] tracking-[.13em] text-jeca-muted max-tablet:text-[.43rem] max-tablet:text-[rgba(255,255,255,.5)]">Éditions du forum</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
