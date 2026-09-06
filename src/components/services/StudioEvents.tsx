import { studioEvents } from "@/data/services";

export function StudioEvents() {
  return (
    <section className="px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <div className="mb-[clamp(2.5rem,5vw,3.5rem)] max-w-[760px]">
        <p className="eyebrow">Nos interventions</p>
        <h2 className="mb-[1.4rem] mt-2 font-display text-display-xl font-normal leading-[.92] tracking-[-.045em]">
          Les événements
          <br />
          <em className="font-normal text-accent">que nous couvrons.</em>
        </h2>
        <p className="m-0 leading-[1.8] text-[#65645f]">
          Au studio ou sur place, notre équipe se déplace pour couvrir vos cérémonies et vos rendez-vous
          professionnels.
        </p>
      </div>
      <div className="grid grid-cols-4 border-l border-t border-line max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
        {studioEvents.map((event) => (
          <article
            key={event.number}
            className="flex min-h-[180px] flex-col justify-between gap-[1.4rem] border-b border-r border-line p-[1.6rem] max-tablet:min-h-0 max-tablet:gap-[1.1rem]"
          >
            <span className="text-micro tracking-[.14em] text-accent">{event.number}</span>
            <div>
              <h3 className="mb-[.55rem] mt-0 font-display text-display-sm font-normal leading-[1.06]">
                {event.title}
              </h3>
              <p className="m-0 text-caption leading-[1.6] text-[#65645f]">{event.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
