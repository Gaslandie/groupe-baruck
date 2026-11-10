import { pageText } from "@/lib/page-content";

export function LegalHero() {
  return (
    <section className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <p className="eyebrow light">{pageText("mentions-legales", "copy.LegalHero.1")}</p>
      <h1 className="max-w-[1100px] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("mentions-legales", "copy.LegalHero.2")}</h1>
      <p className="mt-7 max-w-[560px] text-lead leading-[1.75] text-[rgba(255,255,255,.7)]">{pageText("mentions-legales", "copy.LegalHero.3")}</p>
    </section>
  );
}
