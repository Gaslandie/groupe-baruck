import { presidentOnu1, presidentOnu2 } from "@/data/media";
import { asset } from "@/lib/asset";

export function AboutOnu() {
  return (
    <section
      id="experience-onu"
      tabIndex={-1}
      className="reveal-stagger grid scroll-mt-[110px] grid-cols-[.95fr_1.05fr] items-center gap-[clamp(3rem,7vw,7rem)] bg-ivory px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] focus:outline-none max-[1080px]:grid-cols-1"
    >
      <div className="reveal relative isolate h-[clamp(420px,44vw,600px)] max-[1080px]:h-[clamp(400px,70vw,540px)]">
        <figure className="absolute inset-[0_14%_34%_0] z-[1] m-0 overflow-hidden bg-[#cac5bb] shadow-[0_22px_55px_rgba(25,22,16,.16)]">
          <img
            src={asset(presidentOnu1.src)}
            alt="MR Djoro Joël Shaloom Krasso lors d’une séance de travail aux Nations Unies"
            width={presidentOnu1.width}
            height={presidentOnu1.height}
            loading="lazy"
            className="h-full w-full object-cover saturate-[.8] contrast-[1.04] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.03]"
          />
        </figure>
        <figure className="absolute inset-[44%_0_0_22%] z-[2] m-0 overflow-hidden border-[10px] border-ivory bg-[#cac5bb] shadow-[0_22px_55px_rgba(25,22,16,.16)] max-tablet:border-[7px]">
          <img
            src={asset(presidentOnu2.src)}
            alt="MR Djoro Joël Shaloom Krasso devant un portrait de Kofi Annan"
            width={presidentOnu2.width}
            height={presidentOnu2.height}
            loading="lazy"
            className="h-full w-full object-cover saturate-[.8] contrast-[1.04] transition-transform duration-700 ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.03]"
          />
        </figure>
        <span aria-hidden="true" className="absolute bottom-[4%] left-[-.6rem] z-[3] rotate-180 [writing-mode:vertical-rl] font-display text-[clamp(2.4rem,4vw,4.6rem)] italic leading-none tracking-[-.04em] text-accent">2016</span>
      </div>
      <div className="reveal">
        <p className="eyebrow">Nations Unies · 2016</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-[clamp(2.7rem,5vw,5.6rem)] font-normal leading-[.92] tracking-[-.05em]">
          La protection
          <em className="block font-normal text-accent">de l’enfant.</em>
        </h2>
        <p className="lead mb-[1.4rem] mt-6">En 2016, MR Djoro Joël Shaloom Krasso exerce la fonction d’agent de développement pour la protection de l’enfant au sein des Nations Unies.</p>
        <p className="m-0 max-w-[560px] text-[.92rem] leading-[1.8] text-[#64645f]">Cette expérience éclaire la manière dont il conduit aujourd’hui le Groupe Baruck : une attention constante portée à l’utilité sociale des projets, au-delà de leur seule performance économique.</p>
        <p className="content-disclaimer">Le détail de cette mission — pays, programme et durée — sera précisé après validation.</p>
      </div>
    </section>
  );
}
