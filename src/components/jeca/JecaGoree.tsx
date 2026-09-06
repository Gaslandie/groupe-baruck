import { goreeImage } from "@/data/jeca";
import { asset } from "@/lib/asset";

export function JecaGoree() {
  return (
    <section
      id="senegal"
      className="grid min-h-[620px] scroll-mt-[74px] grid-cols-[38%_62%] overflow-hidden bg-white max-tablet:block max-tablet:min-h-0"
    >
      <figure className="group reveal-media relative m-0 min-h-[620px] min-w-0 overflow-hidden bg-jeca-blue after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(4,16,49,.03)_38%,rgba(4,16,49,.82))] after:content-[''] max-tablet:h-[44svh] max-tablet:min-h-[340px] max-tablet:max-h-[460px]">
        <img
          src={asset(goreeImage.src)}
          alt={goreeImage.alt}
          width={goreeImage.width}
          height={goreeImage.height}
          loading="lazy"
          className="h-full w-full object-cover object-center saturate-[.86] contrast-[1.03] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.025]"
        />
        <figcaption className="absolute bottom-[clamp(2rem,4vw,4rem)] left-[clamp(1.5rem,4vw,4rem)] right-6 z-[2] text-white">
          <span className="mb-[.7rem] block text-micro font-bold uppercase tracking-[.18em] text-jeca-yellow">Sénégal</span>
          <strong className="font-display text-display-xl font-normal italic leading-[.9] tracking-[-.05em]">Île de Gorée</strong>
        </figcaption>
      </figure>
      <div className="relative w-auto max-w-[900px] self-center p-[clamp(5rem,8vw,9rem)] max-tablet:w-full max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="jeca-kicker">Pourquoi le Sénégal ?</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
          Une raison d’abord <em className="text-jeca-red">spirituelle.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[680px] text-body leading-[1.85] text-jeca-muted">
          Pour le président, le choix du Sénégal est lié à l’histoire de l’île de Gorée et au voyage de non-retour :
          des hommes arrachés à leur terre pour aller développer d’autres terres et d’autres nations.
        </p>
        <p className="mb-0 mt-8 max-w-[680px] text-body leading-[1.85] text-jeca-muted">
          La JECA a compris que, pour pérenniser son action, elle devait aussi venir au Sénégal.
        </p>
      </div>
    </section>
  );
}
