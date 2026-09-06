import type { ReactNode } from "react";

type EdvSectionHeadProps = {
  eyebrow: string;
  title: ReactNode;
  emphasis: string;
  text: string;
  tone: "light" | "dark";
};

export function EdvSectionHead({ eyebrow, title, emphasis, text, tone }: EdvSectionHeadProps) {
  const isLight = tone === "light";

  return (
    <header className="reveal mb-[clamp(3rem,6vw,6rem)] flex items-end justify-between gap-16 max-tablet:mb-12 max-tablet:block">
      <div>
        <p className={`edv-kicker${isLight ? " edv-kicker-light" : ""}`}>{eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          {title}
          <br />
          <em className={`font-[inherit] ${isLight ? "text-edv-gold" : "text-edv-ember"}`}>{emphasis}</em>
        </h2>
      </div>
      <p
        className={`mb-[.6rem] mt-0 w-[min(410px,35%)] text-small leading-[1.75] max-tablet:mt-8 max-tablet:w-full ${isLight ? "text-[rgba(255,255,255,.58)]" : "text-edv-muted"}`}
      >
        {text}
      </p>
    </header>
  );
}
