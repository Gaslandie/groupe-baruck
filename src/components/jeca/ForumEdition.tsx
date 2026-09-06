import type { JecaEdition, JecaGallery } from "@/data/jeca";

import { PhotoGrid } from "./PhotoGrid";

const toneStyles = {
  paper: "bg-jeca-paper",
  dark: "bg-[#07183f] text-white",
  white: "bg-white",
};

export function ForumEdition({
  edition,
  gallery,
  offset,
}: {
  edition: JecaEdition;
  gallery: JecaGallery;
  offset: number;
}) {
  const isDark = edition.tone === "dark";
  const number = String(edition.edition).padStart(2, "0");

  return (
    <section
      id={edition.id}
      className={`scroll-mt-[74px] px-[clamp(1.3rem,4.5vw,5.5rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:px-[1.3rem] max-tablet:py-20 ${toneStyles[edition.tone]}`}
    >
      <header
        className={`grid grid-cols-[130px_1fr_auto] items-end gap-10 border-b pb-[2.2rem] max-tablet:grid-cols-[78px_1fr] max-tablet:gap-[1.4rem] ${isDark ? "border-[rgba(255,255,255,.18)]" : "border-jeca-line"}`}
      >
        <div>
          <span
            className={`block text-micro font-extrabold uppercase tracking-[.17em] ${isDark ? "text-[rgba(255,255,255,.52)]" : "text-jeca-muted"}`}
          >
            Édition
          </span>
          <strong
            className={`mt-1 block font-display text-display-xl font-normal italic leading-[.85] ${isDark ? "text-jeca-yellow" : "text-jeca-red"}`}
          >
            {number}
          </strong>
        </div>
        <div>
          <p
            className={`mb-[.55rem] mt-0 text-micro font-extrabold uppercase tracking-[.17em] ${isDark ? "text-jeca-yellow" : "text-jeca-green"}`}
          >
            {edition.place}
          </p>
          <h2 className="m-0 font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
            {edition.title}
          </h2>
        </div>
        <time
          dateTime={edition.date.iso}
          className="self-center whitespace-nowrap border border-current px-4 py-3 text-micro font-extrabold uppercase tracking-[.12em] max-tablet:col-span-full max-tablet:justify-self-start"
        >
          {edition.date.label}
        </time>
      </header>
      {edition.story ? (
        <div className="mb-16 mt-12 grid grid-cols-[1fr_.75fr_.65fr] gap-[clamp(2rem,5vw,6rem)] max-[1080px]:grid-cols-2 max-[1080px]:[&_aside]:col-span-full max-tablet:mt-10 max-tablet:block max-tablet:[&>div]:my-8">
          <p className="m-0 font-display text-display-md font-normal leading-[1.35] text-jeca-blue">
            {edition.story.lead}
          </p>
          <div>
            {edition.story.paragraphs.map((paragraph) => (
              <p key={paragraph} className="mb-4 mt-0 text-small leading-[1.8] text-jeca-muted">
                {paragraph}
              </p>
            ))}
          </div>
          <aside className="bg-jeca-green p-6 text-white">
            <span className="mb-6 block text-micro font-extrabold uppercase tracking-[.15em] text-jeca-yellow">
              Thème
            </span>
            <strong className="font-display text-display-sm font-normal leading-[1.3]">
              {edition.story.theme}
            </strong>
          </aside>
        </div>
      ) : (
        <p
          className={`mb-16 mt-10 max-w-[740px] font-display text-display-xs font-normal leading-[1.5] ${isDark ? "text-[rgba(255,255,255,.68)]" : "text-jeca-muted"}`}
        >
          {edition.simpleLead}
        </p>
      )}
      <PhotoGrid gallery={gallery} offset={offset} grid={edition.grid} />
    </section>
  );
}
