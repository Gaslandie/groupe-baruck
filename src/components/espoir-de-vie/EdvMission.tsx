import { edvPillars } from "@/data/espoir-de-vie";

const headingClass =
  "m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]";

export function EdvMission() {
  return (
    <section
      id="mission"
      className="reveal-stagger grid scroll-mt-[72px] grid-cols-[1fr_.8fr] gap-[clamp(3rem,7vw,8rem)] bg-edv-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(6rem,10vw,11rem)] max-[1100px]:grid-cols-[1fr_.9fr] max-[1100px]:gap-12 max-tablet:block max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div className="reveal">
        <p className="edv-kicker">Notre mission</p>
        <h2 className={headingClass}>
          Chaque enfant mérite
          <br />
          <em className="font-[inherit] text-edv-ember">protection et avenir.</em>
        </h2>
      </div>
      <div className="reveal max-w-[650px] self-end max-tablet:mt-10">
        <p className="mb-6 mt-0 font-display text-display-xs font-normal leading-[1.5]">
          Espoir de Vie s’engage auprès des enfants orphelins, des familles fragilisées, des femmes et des personnes
          sans-abri.
        </p>
        <p className="m-0 text-body leading-[1.8] text-edv-muted">
          L’action de la fondation s’inscrit dans l’esprit de la Déclaration des droits de l’enfant : le droit à la
          vie, à l’éducation, à la santé, à une alimentation suffisante et à la protection.
        </p>
        <aside className="mt-8 grid grid-cols-[110px_1fr] gap-6 border-y border-edv-line py-6 max-tablet:grid-cols-1 max-tablet:gap-[.8rem]">
          <span className="text-micro font-extrabold uppercase tracking-[.14em] text-edv-ember">
            Notre conviction
          </span>
          <p className="m-0 font-display text-base italic leading-[1.5]">
            Répondre aux besoins immédiats tout en créant les conditions d’un avenir plus digne.
          </p>
        </aside>
      </div>
      <div
        aria-label="Les cinq piliers d’Espoir de Vie"
        className="reveal-stagger col-span-full mt-12 grid grid-cols-5 border-t border-edv-line max-[1100px]:grid-cols-3 max-[1100px]:[&>article:nth-child(3)]:border-r-0 max-[1100px]:[&>article:nth-child(n+4)]:border-t max-[1100px]:[&>article:nth-child(n+4)]:border-edv-line max-tablet:mt-12 max-tablet:grid-cols-1 max-tablet:[&>article:nth-child(n+4)]:border-t-0"
      >
        {edvPillars.map((pillar) => (
          <article
            key={pillar.number}
            className="reveal min-h-[270px] border-r border-edv-line px-[clamp(1rem,1.7vw,1.8rem)] py-8 first:pl-0 last:border-r-0 max-tablet:min-h-0 max-tablet:border-b max-tablet:border-r-0 max-tablet:px-0 max-tablet:pb-[2.2rem] max-tablet:pt-[1.7rem] max-tablet:last:border-b-0"
          >
            <span className="text-micro font-extrabold tracking-[.16em] text-edv-ember">{pillar.number}</span>
            <h3 className="mb-[.8rem] mt-[4.5rem] font-display text-display-md font-normal leading-none tracking-[-.035em] max-tablet:mt-[1.8rem]">
              {pillar.title}
            </h3>
            <p className="m-0 max-w-[260px] text-caption leading-[1.65] text-edv-muted">{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
