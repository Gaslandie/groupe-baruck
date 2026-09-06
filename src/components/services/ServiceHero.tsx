import type { ReactNode } from "react";

import type { ImageAsset } from "@/data/media";
import { asset } from "@/lib/asset";

type ServiceHeroProps = {
  image: ImageAsset;
  position: string;
  size: "studio" | "hostesses";
  eyebrow: string;
  title: string;
  emphasis: string;
  text: string;
  badge?: string;
  actions: ReactNode;
};

export function ServiceHero({
  image,
  position,
  size,
  eyebrow,
  title,
  emphasis,
  text,
  badge,
  actions,
}: ServiceHeroProps) {
  const titleSize =
    size === "studio"
      ? "text-display-xl"
      : "text-display-xl";

  return (
    <section className="relative isolate flex min-h-[92svh] items-end overflow-hidden bg-[#161719] px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(4rem,8vw,7rem)] pt-[clamp(8rem,13vw,13rem)] text-ivory max-tablet:min-h-[86svh] max-tablet:pb-12">
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url("${asset(image.src)}")`,
          backgroundPosition: position,
        }}
        className="absolute inset-0 z-[-2] scale-[1.025] bg-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(5,6,7,.94),rgba(5,6,7,.58)_48%,rgba(5,6,7,.16)),linear-gradient(180deg,rgba(5,6,7,.1),rgba(5,6,7,.78))] max-tablet:bg-[linear-gradient(180deg,rgba(5,6,7,.12),rgba(5,6,7,.92)_70%)]"
      />
      <div className="hero-in max-w-[830px]">
        <p className="eyebrow light">{eyebrow}</p>
        <h1
          className={`${titleSize} mb-6 mt-[.7rem] text-balance font-display font-normal leading-[.85] tracking-[-.055em]`}
        >
          {title}
          <em className="block font-normal text-accent">{emphasis}</em>
        </h1>
        <p className="my-[1em] max-w-[670px] text-lead leading-[1.65] text-[rgba(255,255,255,.76)]">
          {text}
        </p>
        {badge ? (
          <p className="mb-0 mt-[1.6rem] inline-flex items-center gap-[.65rem] border border-[rgba(255,255,255,.3)] px-[.95rem] py-[.6rem] text-micro uppercase tracking-[.14em] text-[rgba(255,255,255,.88)]">
            <i
              aria-hidden="true"
              className="h-[7px] w-[7px] rounded-full bg-accent shadow-[0_0_0_4px_rgba(220,91,43,.22)]"
            />
            {badge}
          </p>
        ) : null}
        <div className="mt-8 flex flex-wrap gap-[.8rem]">{actions}</div>
      </div>
    </section>
  );
}
