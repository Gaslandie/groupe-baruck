import { edvCollaborations } from "@/data/espoir-de-vie";

import { EdvSectionHead } from "./EdvSectionHead";

export function EdvCollaborations() {
  return (
    <section className="bg-edv-paper-deep px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20">
      <EdvSectionHead
        eyebrow="À nos côtés"
        title="Faire ensemble,"
        emphasis="pour aller plus loin."
        text="Espoir de Vie crée des liens avec des fondations, des communautés religieuses et des organisations associatives qui partagent son engagement."
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-3 border-t border-edv-line max-tablet:grid-cols-1">
        {edvCollaborations.map((collaboration) => (
          <article
            key={collaboration.number}
            className="reveal min-h-[280px] border-r border-edv-line px-[clamp(1.2rem,2.6vw,3rem)] py-8 first:pl-0 last:border-r-0 max-tablet:min-h-0 max-tablet:border-b max-tablet:border-r-0 max-tablet:px-0 max-tablet:pb-[2.3rem] max-tablet:pt-[1.8rem] max-tablet:last:border-b-0"
          >
            <span className="text-micro font-extrabold tracking-[.15em] text-edv-ember">
              {collaboration.number}
            </span>
            <h3 className="mb-[.8rem] mt-16 font-display text-display-md font-normal leading-none max-tablet:mt-8">
              {collaboration.title}
            </h3>
            <p className="m-0 max-w-[400px] text-small leading-[1.7] text-edv-muted">{collaboration.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
