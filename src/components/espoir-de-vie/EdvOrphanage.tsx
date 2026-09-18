import { edvPhotos, edvTimeline } from "@/data/espoir-de-vie";
import { asset } from "@/lib/asset";

const panelPhoto = edvPhotos.orphelinatVueAerienneCour;

/**
 * Deux lignes plutôt que deux colonnes : un bandeau de présentation pleine
 * largeur, puis la frise des étapes déroulée horizontalement.
 */
export function EdvOrphanage() {
  return (
    <section id="orphelinat" className="scroll-mt-[72px] bg-edv-cream">
      <div className="reveal relative isolate overflow-hidden bg-[linear-gradient(145deg,#24130b,#4a1e0d)] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4.5rem,8vw,8rem)] text-white max-tablet:px-[1.3rem] max-tablet:py-20">
        {/* Le bâtiment en fond, sous un voile sombre qui garde le texte lisible. */}
        <span
          aria-hidden="true"
          style={{ backgroundImage: `url("${asset(panelPhoto.src)}")` }}
          className="absolute inset-0 z-[-2] bg-cover bg-[center_38%] saturate-[.7]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 z-[-1] bg-[linear-gradient(145deg,rgba(36,19,11,.93),rgba(74,30,13,.86))]"
        />
        <div className="flex items-end justify-between gap-[clamp(2rem,5vw,5rem)] max-[1100px]:flex-col max-[1100px]:items-start max-[1100px]:gap-8">
          <div>
            <p className="edv-kicker">Un projet fondateur</p>
            <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
              Construire un lieu
              <br />
              <em className="font-[inherit] text-edv-gold">où grandir en sécurité.</em>
            </h2>
          </div>
          <p className="mb-0 mt-0 w-[min(600px,46%)] text-body leading-[1.8] text-[rgba(255,255,255,.7)] max-[1100px]:w-full">
            De la construction à l’accueil des premiers enfants, l’orphelinat Espoir de Vie est né d’une volonté simple
            : offrir protection, stabilité et attention.
          </p>
        </div>
      </div>
      <ol className="reveal-stagger m-0 grid list-none grid-cols-5 gap-[clamp(1rem,2vw,2rem)] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4rem,7vw,7rem)] max-[1100px]:grid-cols-3 max-tablet:grid-cols-2 max-tablet:px-[1.3rem] max-tablet:py-16 max-[430px]:grid-cols-1">
        {edvTimeline.map((item) => (
          <li
            key={item.title}
            className="reveal relative flex flex-col border-t border-edv-line pt-8 before:absolute before:left-0 before:top-[-6px] before:h-[11px] before:w-[11px] before:rounded-full before:bg-edv-ember before:shadow-[0_0_0_7px_var(--color-edv-cream)] max-tablet:pt-7"
          >
            {item.date ? (
              <time
                dateTime={item.date.iso}
                className="text-micro font-extrabold uppercase leading-[1.5] tracking-[.12em] text-edv-ember"
              >
                {item.date.label}
              </time>
            ) : (
              <span className="text-micro font-extrabold uppercase leading-[1.5] tracking-[.12em] text-edv-ember">
                {item.step}
              </span>
            )}
            <h3 className="mb-[.65rem] mt-[.9rem] text-balance font-display text-display-sm font-normal leading-[1.08] [overflow-wrap:anywhere]">
              {item.title}
            </h3>
            <p className="m-0 text-small leading-[1.7] text-edv-muted">{item.text}</p>
            {item.photo ? (
              // `mt-auto` aligne les photos entre elles, quelle que soit la longueur du texte.
              <div className="mt-auto pt-6">
                <img
                  src={asset(item.photo.src)}
                  alt={item.photo.alt}
                  width={item.photo.width}
                  height={item.photo.height}
                  loading="lazy"
                  className="aspect-[4/3] w-full bg-edv-paper-deep object-cover"
                />
              </div>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
