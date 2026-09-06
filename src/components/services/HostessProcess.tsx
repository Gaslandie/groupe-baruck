import { hostessProcess, hostessTags } from "@/data/services";
import { ClientNote } from "@/components/ui/ClientNote";

export function HostessProcess() {
  return (
    <section
      id="deroulement"
      className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]"
    >
      <div className="reveal mb-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-[minmax(280px,.8fr)_1.2fr] items-end gap-[clamp(3rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
        <div>
          <p className="eyebrow">Réserver une équipe</p>
          <h2 className="mb-0 mt-2 font-display text-display-xl font-normal leading-[.92] tracking-[-.045em]">
            Comment ça
            <em className="font-normal text-accent"> se passe.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[430px] leading-[1.8] text-[#65645f]">
          Un parcours simple pour préparer la présence de l’équipe lors de votre événement.
        </p>
      </div>

      <ol className="reveal-stagger m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-tablet:grid-cols-1">
        {hostessProcess.map((step) => (
          <li
            key={step.number}
            className="reveal flex flex-col border border-line bg-ivory px-[1.7rem] pb-[1.8rem] pt-[1.7rem]"
          >
            <span aria-hidden="true" className="text-micro uppercase tracking-[.15em] text-accent">
              {step.number}
            </span>
            <h3 className="mb-[.9rem] mt-[1.4rem] font-display text-display-sm font-normal leading-[1.15]">
              {step.title}
            </h3>
            <p className="m-0 text-small leading-[1.7] text-[#65645f]">{step.text}</p>
          </li>
        ))}
      </ol>
      <ClientNote>Parcours de réservation à valider avec le client.</ClientNote>

      <div className="reveal mt-[clamp(2.5rem,5vw,3.5rem)] border-t border-line pt-[1.4rem]">
        <h3 className="m-0 text-micro uppercase tracking-[.15em] text-accent">Types d’événements</h3>
        <ul className="m-0 mt-[1.1rem] flex list-none flex-wrap gap-[.5rem] p-0">
          {hostessTags.map((tag) => (
            <li
              key={tag}
              className="border border-line px-[.9rem] py-[.5rem] text-caption leading-none text-[#5f5d57]"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
