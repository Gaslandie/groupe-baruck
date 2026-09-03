import Link from "next/link";

import { brandLogo } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

type BrandProps = {
  className?: string;
};

export function Brand({ className = "" }: BrandProps) {
  return (
    <Link
      href={routes.home}
      aria-label="Groupe Baruck — Accueil"
      className={[
        "relative z-[2] inline-flex w-[var(--brand-width,180px)] origin-left flex-col items-stretch gap-[.3rem] uppercase transition-transform duration-[350ms] ease-[cubic-bezier(.2,.7,.2,1)] hover:scale-[1.15] focus-visible:scale-[1.15] max-tablet:w-[var(--brand-mobile-width,142px)] max-tablet:gap-[.24rem]",
        className,
      ].join(" ")}
    >
      <span className="h-[48px] w-full overflow-hidden bg-white max-tablet:h-[39px]">
        <img
          src={asset(brandLogo.src)}
          alt={brandLogo.alt}
          width={brandLogo.width}
          height={brandLogo.height}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </span>
      <span className="flex items-center justify-center gap-[.55rem] whitespace-nowrap text-[.47rem] leading-none tracking-[.24em] max-tablet:gap-[.35rem] max-tablet:text-[.4rem] max-tablet:tracking-[.18em]">
        <span
          aria-hidden="true"
          className="block h-px w-[27px] bg-current opacity-[.58] max-tablet:w-[18px]"
        />
        Groupe Baruck
      </span>
    </Link>
  );
}
