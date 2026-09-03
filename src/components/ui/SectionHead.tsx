import type { ReactNode } from "react";

type SectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  text: string;
  tone: "light" | "dark";
};

export function SectionHead({ eyebrow, title, text, tone }: SectionHeadProps) {
  return (
    <div className="reveal mb-[clamp(3rem,6vw,6rem)] flex items-end justify-between gap-12 max-tablet:mb-[2.8rem] max-tablet:block">
      <div>
        <p className={tone === "light" ? "eyebrow light" : "eyebrow"}>{eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          {title}
        </h2>
      </div>
      <p
        className={[
          "mb-[.8rem] mt-0 w-[min(410px,37%)] text-[.9rem] leading-[1.7] max-tablet:mt-6 max-tablet:w-full",
          tone === "light" ? "text-[rgba(255,255,255,.58)]" : "text-[#696963]",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
