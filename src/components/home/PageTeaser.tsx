import Link from "next/link";

import type { PageTeaser as PageTeaserProps } from "@/data/home";
import { asset } from "@/lib/asset";
import { Icon } from "../ui/Icon";

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

/** Second lien d'une section : souligné discret, sans flèche (2026-09-16). */
function secondaryLinkClassName(tone: PageTeaserProps["tone"]) {
  return [
    "w-fit border-b pb-[.45rem] text-label uppercase tracking-[.13em] transition-colors duration-[250ms]",
    tone === "paper"
      ? "border-[rgba(11,12,14,.28)] text-[#64645f] hover:text-ink focus-visible:text-ink"
      : "border-[rgba(255,255,255,.34)] text-[rgba(255,255,255,.72)] hover:text-white focus-visible:text-white",
  ].join(" ");
}

export function PageTeaser({
  id,
  tone,
  reverse = false,
  band = false,
  eyebrow,
  title,
  emphasis,
  text,
  href,
  linkLabel,
  externalLink = false,
  secondary,
  image,
  logo,
}: PageTeaserProps) {
  const externalProps = { target: "_blank", rel: "noreferrer" } as const;

  const heading = (
    <>
      <p className={eyebrowClasses[tone]}>{eyebrow}</p>
      <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.9] tracking-[-.05em]">
        {title}
        {emphasis ? <em className={`block font-normal ${accentClasses[tone]}`}>{emphasis}</em> : null}
      </h2>
    </>
  );

  const actions = !href || !linkLabel ? null : (
    <div className="flex flex-wrap items-center gap-x-9 gap-y-4">
      {externalLink ? (
        <a href={href} {...externalProps} className="text-link w-fit">
          {linkLabel}{" "}
          <span className={tone === "jeca" ? "text-jeca-yellow" : tone === "edv" ? "text-edv-gold" : ""}>
            <Icon name="arrow-up-right" />
          </span>
        </a>
      ) : (
        <Link href={href} className="text-link w-fit">
          {linkLabel}{" "}
          <span className={tone === "jeca" ? "text-jeca-yellow" : tone === "edv" ? "text-edv-gold" : ""}>
            <Icon name="arrow-up-right" />
          </span>
        </Link>
      )}
      {secondary ? (
        secondary.external ? (
          <a href={secondary.href} {...externalProps} className={secondaryLinkClassName(tone)}>
            {secondary.label}
          </a>
        ) : (
          <Link href={secondary.href} className={secondaryLinkClassName(tone)}>
            {secondary.label}
          </Link>
        )
      ) : null}
    </div>
  );

  /*
   * Variante « bande » (2026-09-16) : aucune image, toute la largeur de l'écran,
   * et le texte posé horizontalement — le titre à gauche, le texte et les liens
   * à droite — au lieu d'une colonne étroite.
   */
  if (band) {
    return (
      <section
        id={id}
        className={`reveal-stagger scroll-mt-[92px] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(4.5rem,8vw,8rem)] max-tablet:px-[1.3rem] max-tablet:py-16 ${toneClasses[tone]}`}
      >
        <div className="grid grid-cols-2 items-end gap-x-[clamp(2.5rem,6vw,6rem)] gap-y-10 max-desktop:grid-cols-1 max-desktop:items-start">
          <div className="reveal">{heading}</div>
          <div className="reveal">
            <p
              className={`mb-0 mt-0 max-w-[560px] text-lead leading-[1.75] ${
                tone === "paper" ? "text-[#64645f]" : "text-[rgba(255,255,255,.7)]"
              }`}
            >
              {text}
            </p>
            {actions ? <div className="mt-9">{actions}</div> : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={id}
      className={`reveal-stagger grid min-h-[620px] scroll-mt-[92px] grid-cols-2 gap-[clamp(0px,3.5vw,4.5rem)] px-[clamp(0px,3vw,4rem)] py-[clamp(0px,2.5vw,3.5rem)] max-tablet:grid-cols-1 max-tablet:gap-0 max-tablet:p-0 ${toneClasses[tone]}`}
    >
      <figure
        className={`reveal-media relative m-0 min-h-[560px] overflow-hidden max-tablet:order-first max-tablet:min-h-0 max-tablet:aspect-[4/3] ${
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
        className={`reveal flex flex-col justify-center px-[clamp(1.5rem,4vw,4.5rem)] py-[clamp(4rem,6vw,6rem)] max-tablet:px-[1.3rem] max-tablet:py-14 ${
          reverse ? "order-first max-tablet:order-none" : ""
        }`}
      >
        {heading}
        <p
          className={`mb-10 mt-7 max-w-[520px] text-lead leading-[1.75] ${
            tone === "paper" ? "text-[#64645f]" : "text-[rgba(255,255,255,.7)]"
          }`}
        >
          {text}
        </p>
        {actions}
      </div>
    </section>
  );
}
