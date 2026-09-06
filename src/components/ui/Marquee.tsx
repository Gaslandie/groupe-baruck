import { Fragment } from "react";

type MarqueeProps = {
  items: string[];
  label: string;
};

function MarqueeItems({ items, hidden = false }: { items: string[]; hidden?: boolean }) {
  return items.map((item) => (
    <Fragment key={item}>
      <span
        aria-hidden={hidden || undefined}
        className="whitespace-nowrap font-display text-body italic"
      >
        {item}
      </span>
      <i
        aria-hidden={hidden || undefined}
        className="mx-[2.4rem] font-sans text-micro not-italic"
      >
        ◆
      </i>
    </Fragment>
  ));
}

export function Marquee({ items, label }: MarqueeProps) {
  return (
    <section aria-label={label} className="overflow-hidden bg-accent py-[.86rem] text-ivory">
      <div className="flex w-max animate-marquee items-center">
        <MarqueeItems items={items} />
        <MarqueeItems items={items} hidden />
      </div>
    </section>
  );
}
