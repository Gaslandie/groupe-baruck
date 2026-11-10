import { pageText } from "@/lib/page-content";
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
          <span className="mb-[.7rem] block text-micro font-bold uppercase tracking-[.18em] text-jeca-yellow">{pageText("jeca", "JecaGoree.1")}</span>
          <strong className="font-display text-display-xl font-normal italic leading-[.9] tracking-[-.05em]">{pageText("jeca", "JecaGoree.2")}</strong>
        </figcaption>
      </figure>
      <div className="relative w-auto max-w-[900px] self-center p-[clamp(5rem,8vw,9rem)] max-tablet:w-full max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="jeca-kicker">{pageText("jeca", "JecaGoree.3")}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("jeca", "JecaGoree.4")}{" "}<em className="text-jeca-red">{pageText("jeca", "JecaGoree.5")}</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[680px] text-body leading-[1.85] text-jeca-muted">{pageText("jeca", "JecaGoree.6")}</p>
        <p className="mb-0 mt-8 max-w-[680px] text-body leading-[1.85] text-jeca-muted">{pageText("jeca", "JecaGoree.7")}</p>
      </div>
    </section>
  );
}
