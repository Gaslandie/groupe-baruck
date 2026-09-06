import { hostessOffers } from "@/data/services";

export function HostessOffers() {
  return (
    <section className="scroll-mt-[100px] bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory">
      <div className="mb-14 flex items-end justify-between gap-12 max-tablet:block">
        <h2 className="m-0 font-display text-display-xl font-normal leading-[.9] tracking-[-.045em]">
          Élégance,
          <br />
          présence et service
        </h2>
        <p className="my-[1em] max-w-[430px] leading-[1.7] text-[rgba(255,255,255,.6)] max-tablet:mt-6">
          Une équipe préparée pour représenter votre événement et contribuer à une expérience fluide pour chaque
          invité.
        </p>
      </div>
      <div className="grid grid-cols-3 border-l border-t border-[rgba(255,255,255,.16)] max-tablet:grid-cols-1">
        {hostessOffers.map((offer) => (
          <article
            key={offer.number}
            className="flex min-h-[210px] flex-col justify-between border-b border-r border-[rgba(255,255,255,.16)] p-[1.8rem] max-tablet:min-h-[170px]"
          >
            <span className="text-micro uppercase tracking-[.14em] text-accent">{offer.number}</span>
            <div>
              <h3 className="mb-2 mt-6 font-display text-display-md font-normal leading-none">
                {offer.title}
              </h3>
              <p className="m-0 text-small leading-[1.5] text-[rgba(255,255,255,.62)]">{offer.text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
