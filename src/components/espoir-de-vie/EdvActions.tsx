import { edvActions } from "@/data/espoir-de-vie";

import { EdvSectionHead } from "./EdvSectionHead";

const cardTones = {
  featured: "bg-edv-ember text-white",
  dark: "bg-edv-ink text-white",
} as const;

export function EdvActions() {
  return (
    <section
      id="actions"
      className="scroll-mt-[72px] bg-edv-paper px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <EdvSectionHead
        eyebrow="Agir sur le terrain"
        title="Une solidarité"
        emphasis="qui prend plusieurs formes."
        text="Au fil des années, Espoir de Vie a multiplié les initiatives en faveur des enfants, des familles et des communautés les plus fragiles."
        tone="dark"
      />
      <div className="grid grid-cols-3 border-l border-t border-edv-line max-tablet:grid-cols-1">
        {edvActions.map((action) => {
          const isColored = action.tone !== undefined;

          return (
            <article
              key={action.number}
              className={`reveal relative flex min-h-[420px] flex-col overflow-hidden border-b border-r border-edv-line p-[clamp(1.5rem,3vw,3rem)] max-[1100px]:min-h-[390px] max-tablet:min-h-[370px] max-tablet:p-[1.7rem] ${action.tone ? cardTones[action.tone] : "bg-edv-cream"}`}
            >
              <div
                className={`flex justify-between gap-4 text-[.51rem] font-extrabold uppercase tracking-[.12em] ${isColored ? "text-edv-gold" : "text-edv-ember"}`}
              >
                <span>{action.number}</span>
                {action.date ? (
                  <time dateTime={action.date.iso} className="text-[inherit] font-[inherit] tracking-[inherit]">
                    {action.date.label}
                  </time>
                ) : (
                  <span className="text-[inherit] font-[inherit] tracking-[inherit]">{action.period}</span>
                )}
              </div>
              <p
                className={`mb-[.9rem] mt-auto text-[.53rem] font-extrabold uppercase tracking-[.13em] ${isColored ? "text-edv-gold" : "text-edv-ember"}`}
              >
                {action.place}
              </p>
              <h3 className="mb-4 mt-0 max-w-[430px] font-display text-[clamp(2rem,3.2vw,3.7rem)] font-normal leading-[.92] tracking-[-.045em]">
                {action.title}
              </h3>
              <p
                className={`relative z-[1] m-0 max-w-[430px] text-[.78rem] leading-[1.7] ${isColored ? "text-[rgba(255,255,255,.72)]" : "text-edv-muted"}`}
              >
                {action.text}
              </p>
              {action.highlight ? (
                <strong className="mt-[1.8rem] font-display text-[1.15rem] font-normal italic text-edv-gold">
                  {action.highlight}
                </strong>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}
