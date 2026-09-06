import { jecaNextEdition } from "@/data/jeca";

export function JecaNextEdition() {
  return (
    <section
      id="prochaine-edition"
      className="reveal-stagger bg-jeca-blue px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3.5rem,6vw,6rem)] text-white"
    >
      <div className="reveal grid grid-cols-[minmax(0,1fr)_auto] items-end gap-[clamp(2rem,5vw,5rem)] max-[1080px]:grid-cols-1 max-[1080px]:items-start">
        <div>
          <p className="jeca-kicker light">Prochaine édition</p>
          <h2 className="m-0 text-balance font-display text-display-lg font-normal leading-[.95] tracking-[-.045em]">
            La quatrième édition,
            <em className="block font-normal text-jeca-yellow">à venir.</em>
          </h2>
          <p className="mb-0 mt-[1.2rem] max-w-[520px] text-body leading-[1.7] text-[rgba(255,255,255,.72)]">
            La date et le lieu de la 4e édition seront annoncés ici.
          </p>
        </div>
        <div className="jeca-actions">
          <a
            href={jecaNextEdition.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="jeca-button jeca-button-white"
          >
            Être informé sur WhatsApp <span>↗</span>
          </a>
          <a href={jecaNextEdition.emailHref} className="jeca-button jeca-button-outline">
            Être informé par e-mail
          </a>
        </div>
      </div>
    </section>
  );
}
