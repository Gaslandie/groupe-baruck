import Link from "next/link";

import type { PageTeaser as PageTeaserProps } from "@/data/home";
import { asset } from "@/lib/asset";

const toneClasses = {
  paper: "bg-paper text-ink",
  ink: "bg-ink text-ivory",
  jeca: "bg-jeca-blue text-white",
  edv: "bg-edv-ink text-white",
} as const;

const eyebrowClasses = {
  paper: "eyebrow",
  ink: "eyebrow light",
  jeca: "jeca-kicker light",
  edv: "edv-kicker edv-kicker-light",
} as const;

const accentClasses = {
  paper: "text-accent",
  ink: "text-accent",
  jeca: "text-jeca-yellow",
  edv: "text-edv-gold",
} as const;

export function PageTeaser({
  id,
  tone,
  reverse = false,
  eyebrow,
  title,
  emphasis,
  text,
  href,
  linkLabel,
  image,
  logo,
}: PageTeaserProps) {
  return (
    <section id={id} className={`reveal-stagger grid min-h-[620px] grid-cols-2 max-tablet:grid-cols-1 ${toneClasses[tone]}`}>
      <figure
        className={`reveal-media relative m-0 min-h-[620px] overflow-hidden max-tablet:order-first max-tablet:min-h-0 max-tablet:aspect-[4/3] ${
          logo
            ? "grid place-items-center bg-[radial-gradient(circle_at_10%_88%,rgba(199,70,28,.35),transparent_31%),linear-gradient(135deg,#180e09_0%,#2d160d_52%,#190e09_100%)]"
            : "bg-[#cac5bb]"
        }`}
      >
        {image ? (
          <img
            src={asset(image.src)}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: image.position ?? "center" }}
          />
        ) : null}
        {logo ? (
          <img
            src={asset(logo.src)}
            alt={logo.alt}
            width={logo.width}
            height={logo.height}
            loading="lazy"
            className="h-auto w-[clamp(160px,42%,320px)] mix-blend-screen drop-shadow-[0_18px_30px_rgba(0,0,0,.35)]"
          />
        ) : null}
      </figure>
      <div
        className={`reveal flex flex-col justify-center px-[clamp(1.5rem,6vw,7rem)] py-[clamp(4rem,7vw,7rem)] max-tablet:px-[1.3rem] max-tablet:py-14 ${
          reverse ? "order-first max-tablet:order-none" : ""
        }`}
      >
        <p className={eyebrowClasses[tone]}>{eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-[clamp(2.8rem,4.8vw,5.6rem)] font-normal leading-[.9] tracking-[-.05em] max-tablet:text-[clamp(2.6rem,12vw,4rem)]">
          {title}
          <em className={`block font-normal ${accentClasses[tone]}`}>{emphasis}</em>
        </h2>
        <p
          className={`mb-10 mt-7 max-w-[520px] text-[clamp(.9rem,1.15vw,1.02rem)] leading-[1.75] ${
            tone === "paper" ? "text-[#64645f]" : "text-[rgba(255,255,255,.7)]"
          }`}
        >
          {text}
        </p>
        <Link href={href} className="text-link w-fit">
          {linkLabel}{" "}
          <span className={tone === "jeca" ? "text-jeca-yellow" : tone === "edv" ? "text-edv-gold" : ""}>
            ↗
          </span>
        </Link>
      </div>
    </section>
  );
}
