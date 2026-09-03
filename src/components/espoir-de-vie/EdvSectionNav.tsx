import { edvSectionNav } from "@/data/espoir-de-vie";

export function EdvSectionNav() {
  return (
    <nav
      aria-label="Accès direct au contenu"
      className="grid grid-cols-4 border-b border-edv-line bg-edv-cream max-tablet:block"
    >
      {edvSectionNav.map((item) => (
        <a
          key={item.href}
          href={item.href}
          className="group relative grid min-h-[130px] grid-cols-[38px_1fr] content-center border-r border-edv-line px-[clamp(1rem,2.5vw,2.8rem)] py-[1.7rem] transition-[color,background] duration-[250ms] last:border-r-0 hover:bg-edv-ember hover:text-white max-tablet:min-h-[105px] max-tablet:border-b max-tablet:border-r-0 max-tablet:last:border-b-0"
        >
          <span className="row-span-2 font-display text-[.78rem] italic text-edv-ember transition-colors duration-[250ms] group-hover:text-edv-gold">
            {item.number}
          </span>
          <strong className="font-display text-[clamp(1.25rem,1.8vw,1.7rem)] font-normal">{item.title}</strong>
          <small className="mt-[.35rem] text-[.57rem] tracking-[.07em] text-edv-muted transition-colors duration-[250ms] group-hover:text-[rgba(255,255,255,.7)]">
            {item.subtitle}
          </small>
        </a>
      ))}
    </nav>
  );
}
