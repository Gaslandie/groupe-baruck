import { edvCountries } from "@/data/espoir-de-vie";

import { EdvSectionHead } from "./EdvSectionHead";

export function EdvPresence() {
  return (
    <section
      id="presence"
      className="scroll-mt-[72px] bg-edv-ink px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] text-white max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <EdvSectionHead
        eyebrow="Notre présence"
        title="Trois territoires,"
        emphasis="un même engagement."
        text="De la Côte d’Ivoire à la Guinée et au Burkina Faso, nos actions portent une même volonté de protection et de solidarité."
        tone="light"
      />
      <div className="reveal-stagger grid grid-cols-3 border border-[rgba(255,255,255,.15)] max-tablet:grid-cols-1">
        {edvCountries.map((country) => (
          <article
            key={country.code}
            className="reveal flex min-h-[430px] flex-col justify-end border-r border-[rgba(255,255,255,.15)] bg-[linear-gradient(145deg,rgba(255,255,255,.025),transparent)] p-[clamp(1.7rem,3.5vw,4rem)] last:border-r-0 max-tablet:min-h-[350px] max-tablet:border-b max-tablet:border-r-0 max-tablet:last:border-b-0"
          >
            <small className="text-[.55rem] font-extrabold tracking-[.15em] text-edv-gold">{country.number}</small>
            <h3 className="mb-4 mt-[1.1rem] font-display text-[clamp(2.5rem,4vw,4.6rem)] font-normal leading-[.9] tracking-[-.05em]">
              {country.title}
            </h3>
            <p className="m-0 max-w-[390px] text-[.8rem] leading-[1.75] text-[rgba(255,255,255,.62)]">
              {country.text}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
