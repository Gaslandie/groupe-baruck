import type { ReactNode } from "react";

type ServiceIntroProps = {
  eyebrow: string;
  title: ReactNode;
  emphasis: string;
  text: string;
  tags: string[];
};

export function ServiceIntro({ eyebrow, title, emphasis, text, tags }: ServiceIntroProps) {
  return (
    <section className="grid grid-cols-[minmax(280px,.8fr)_1.2fr] gap-[clamp(3rem,8vw,9rem)] px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mb-0 mt-2 font-display text-[clamp(3rem,5vw,6rem)] font-normal leading-[.92] tracking-[-.045em]">
          {title}
          <em className="font-normal text-accent">{emphasis}</em>
        </h2>
      </div>
      <div className="max-w-[720px]">
        <p className="mb-[2.3rem] mt-0 text-base leading-[1.8] text-[#65645f]">{text}</p>
        <div className="flex flex-wrap gap-[.6rem]">
          {tags.map((tag) => (
            <span
              key={tag}
              className="border border-line px-[.85rem] py-[.7rem] text-[.66rem] uppercase tracking-[.08em] text-[#55534e]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
