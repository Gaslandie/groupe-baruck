type AboutSectionHeadProps = {
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  tone: "light" | "dark";
};

export function AboutSectionHead({
  eyebrow,
  title,
  emphasis,
  text,
  tone,
}: AboutSectionHeadProps) {
  return (
    <div className="reveal mb-[clamp(2.5rem,5vw,4.5rem)] flex items-end justify-between gap-[clamp(2rem,5vw,5rem)] max-[1080px]:flex-col max-[1080px]:items-start">
      <div>
        <p className={tone === "light" ? "eyebrow light" : "eyebrow"}>{eyebrow}</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
          {title}
          <em className="block font-normal text-accent">{emphasis}</em>
        </h2>
      </div>
      <p
        className={[
          "mb-[.6rem] mt-0 w-[min(430px,40%)] text-body leading-[1.75] max-[1080px]:w-full max-[1080px]:max-w-[560px]",
          tone === "light" ? "text-[rgba(255,255,255,.6)]" : "text-[#65645f]",
        ].join(" ")}
      >
        {text}
      </p>
    </div>
  );
}
