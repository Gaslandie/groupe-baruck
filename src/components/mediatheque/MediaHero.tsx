import { translate as t } from "../../lib/language.ts";

export function MediaHero() {
  return (
    <section className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <p className="eyebrow light">{t("Médiathèque · Groupe Baruck")}</p>
      <h1 className="max-w-[1100px] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{t("Des images, des rencontres, des histoires.")}</h1>
      <p className="mt-7 max-w-[520px] text-lead leading-[1.75] text-[rgba(255,255,255,.7)]">{t("Retrouvez les galeries des éditions de la JECA et du Studio Photo Baruck.")}</p>
    </section>
  );
}
