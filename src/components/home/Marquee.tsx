import { Fragment } from "react";

const items = [
  "Guinée",
  "Studio Photo",
  "Hôtesses événementielles",
  "Communication",
  "Entrepreneuriat",
  "Impact social",
];

function MarqueeItems({ hidden = false }: { hidden?: boolean }) {
  return items.map((item) => (
    <Fragment key={item}>
      <span
        aria-hidden={hidden || undefined}
        className="whitespace-nowrap font-display text-[1.08rem] italic"
      >
        {item}
      </span>
      <i
        aria-hidden={hidden || undefined}
        className="mx-[2.4rem] font-sans text-[.38rem] not-italic"
      >
        ◆
      </i>
    </Fragment>
  ));
}

export function Marquee() {
  return (
    <section aria-label="Domaines d’activité" className="overflow-hidden bg-accent py-[.86rem] text-ivory">
      <div className="flex w-max animate-marquee items-center">
        <MarqueeItems />
        <MarqueeItems hidden />
      </div>
    </section>
  );
}
