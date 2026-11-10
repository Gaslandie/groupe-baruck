import { pageText } from "@/lib/page-content";

export function NewsHero() {
  return (
    <section className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <p className="eyebrow light">{pageText("actualites", "copy.NewsHero.1")}</p>
      <h1 className="text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("actualites", "copy.NewsHero.2")}<em className="block font-normal text-accent">{pageText("actualites", "copy.NewsHero.3")}</em>
      </h1>
      <p className="mt-7 max-w-[520px] text-lead leading-[1.75] text-[rgba(255,255,255,.7)]">{pageText("actualites", "copy.NewsHero.4")}</p>
    </section>
  );
}
