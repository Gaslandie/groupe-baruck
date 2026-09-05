import { jecaEditionNav } from "@/data/jeca";

export function EditionNav() {
  return (
    <nav
      aria-label="Éditions passées de la JECA"
      className="border-b border-jeca-line bg-white text-jeca-ink"
    >
      <p className="jeca-kicker mb-0 border-b border-jeca-line px-[clamp(1.2rem,3vw,3rem)] py-[.9rem]">
        Éditions passées
      </p>
      <div className="grid grid-cols-3 max-tablet:block">
        {jecaEditionNav.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="grid grid-cols-[auto_1fr] items-center gap-x-[1.1rem] gap-y-[.1rem] border-r border-[rgba(7,21,55,.2)] px-[clamp(1.2rem,3vw,3rem)] py-[1.35rem] transition-[background,color] duration-[250ms] last:border-r-0 hover:bg-jeca-blue hover:text-white max-tablet:border-b max-tablet:border-r-0 max-tablet:last:border-b-0"
          >
            <span className="row-[1/3] font-display text-[1.2rem] font-bold italic">{item.number}</span>
            <strong className="font-display text-[1.25rem] font-normal">{item.city}</strong>
            <small className="text-[.48rem] uppercase tracking-[.12em]">{item.dates}</small>
          </a>
        ))}
      </div>
    </nav>
  );
}
