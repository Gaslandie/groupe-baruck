import { edvTimeline } from "@/data/espoir-de-vie";
import { edvLogo } from "@/data/media";
import { asset } from "@/lib/asset";

export function EdvOrphanage() {
  return (
    <section
      id="orphelinat"
      className="grid scroll-mt-[72px] grid-cols-[43%_57%] bg-edv-cream max-[1100px]:grid-cols-[46%_54%] max-tablet:block"
    >
      <div className="reveal relative isolate flex min-h-[760px] flex-col justify-center overflow-hidden bg-[linear-gradient(145deg,#24130b,#4a1e0d)] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,8vw,9rem)] text-white max-tablet:min-h-[580px] max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="edv-kicker">Un projet fondateur</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.3vw,6.2rem)] font-normal leading-[.88] tracking-[-.055em] max-tablet:text-[clamp(2.8rem,13vw,4.25rem)]">
          Construire un lieu
          <br />
          <em className="font-[inherit] text-edv-gold">où grandir en sécurité.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[600px] text-[.9rem] leading-[1.8] text-[rgba(255,255,255,.7)]">
          De la construction à l’accueil des premiers enfants, l’orphelinat Espoir de Vie est né d’une volonté simple
          : offrir protection, stabilité et attention.
        </p>
        <div
          aria-hidden="true"
          className="absolute bottom-[-18%] right-[-12%] z-[-1] w-[min(33vw,500px)] rotate-[-8deg] opacity-10 mix-blend-screen max-tablet:w-[75vw]"
        >
          <img
            src={asset(edvLogo.src)}
            alt=""
            width={edvLogo.width}
            height={edvLogo.height}
            loading="lazy"
          />
        </div>
      </div>
      <ol className="m-0 list-none p-[clamp(4rem,7vw,7rem)] max-[1100px]:px-12 max-tablet:px-[1.3rem] max-tablet:pb-16 max-tablet:pl-8 max-tablet:pt-16">
        {edvTimeline.map((item) => (
          <li
            key={item.title}
            className="reveal relative grid min-h-[150px] grid-cols-[145px_1fr] gap-8 border-l border-edv-line pb-[2.8rem] pl-[2.2rem] before:absolute before:left-[-6px] before:top-1 before:h-[11px] before:w-[11px] before:rounded-full before:bg-edv-ember before:shadow-[0_0_0_7px_var(--color-edv-cream)] last:min-h-0 last:pb-0 max-[1100px]:grid-cols-[120px_1fr] max-tablet:min-h-[170px] max-tablet:grid-cols-1 max-tablet:gap-[.7rem] max-tablet:pl-6"
          >
            {item.date ? (
              <time
                dateTime={item.date.iso}
                className="text-[.56rem] font-extrabold uppercase leading-[1.5] tracking-[.12em] text-edv-ember"
              >
                {item.date.label}
              </time>
            ) : (
              <span className="text-[.56rem] font-extrabold uppercase leading-[1.5] tracking-[.12em] text-edv-ember">
                {item.step}
              </span>
            )}
            <div>
              <h3 className="mb-[.65rem] mt-0 font-display text-[clamp(1.55rem,2.3vw,2.5rem)] font-normal leading-none">
                {item.title}
              </h3>
              <p className="m-0 max-w-[520px] text-[.8rem] leading-[1.7] text-edv-muted">{item.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
