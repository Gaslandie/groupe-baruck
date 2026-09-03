import { studioGear, studioSpaces } from "@/data/services";
import { asset } from "@/lib/asset";

export function StudioSpaces() {
  return (
    <section className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <div className="mb-[clamp(2.5rem,5vw,4rem)] grid grid-cols-[minmax(280px,.8fr)_1.2fr] gap-[clamp(3rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
        <div>
          <p className="eyebrow">Nos espaces</p>
          <h2 className="mb-0 mt-2 font-display text-[clamp(3rem,5vw,6rem)] font-normal leading-[.92] tracking-[-.045em]">
            Deux studios,
            <br />
            <em className="font-normal text-accent">une même exigence.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[640px] self-end leading-[1.8] text-[#65645f]">
          Un studio classique pour les séances du quotidien, un studio VIP pour les prises de vue haut de gamme,
          et un espace entièrement dédié aux anniversaires des enfants.
        </p>
      </div>
      <div className="grid grid-cols-3 gap-[1.1rem] max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
        {studioSpaces.map((space) => (
          <article
            key={space.number}
            className={[
              "flex flex-col overflow-hidden border",
              space.vip ? "border-ink bg-ink text-ivory" : "border-line bg-ivory",
            ].join(" ")}
          >
            <img
              src={asset(space.image.src)}
              alt={space.image.alt}
              loading="lazy"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="flex flex-1 flex-col gap-[1.4rem] px-[1.8rem] pb-[1.9rem] pt-[1.7rem]">
              <span
                className={`text-[.56rem] uppercase tracking-[.14em] ${space.vip ? "text-gold" : "text-accent"}`}
              >
                {space.number}
              </span>
              <div>
                <h3 className="mb-[.8rem] mt-0 font-display text-[clamp(1.6rem,2.2vw,2.2rem)] font-normal leading-[1.04]">
                  {space.title}
                </h3>
                <p
                  className={`m-0 text-[.86rem] leading-[1.7] ${space.vip ? "text-[rgba(255,255,255,.66)]" : "text-[#65645f]"}`}
                >
                  {space.text}
                </p>
              </div>
              <ul
                className={`mb-0 mt-auto grid list-none gap-[.6rem] border-t pt-[1.3rem] ${space.vip ? "border-[rgba(255,255,255,.18)]" : "border-line"}`}
              >
                {space.items.map((item) => (
                  <li
                    key={item}
                    className={`relative pl-[1.05rem] text-[.78rem] leading-[1.5] before:absolute before:left-0 before:top-[.6em] before:h-px before:w-[6px] before:content-[''] ${space.vip ? "text-[rgba(255,255,255,.72)] before:bg-gold" : "text-[#55534e] before:bg-accent"}`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
      <div className="mt-[clamp(2rem,4vw,3rem)]">
        <p className="mb-[1.4rem] mt-0 flex items-center gap-[.75rem] text-[.56rem] uppercase tracking-[.14em] text-accent before:h-px before:w-7 before:bg-current before:content-['']">
          Le matériel du studio
        </p>
        <ul className="m-0 grid list-none grid-cols-3 gap-[1.1rem] p-0 max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
          {studioGear.map((item) => (
            <li key={item.title} className="overflow-hidden border border-line bg-ivory">
              <img
                src={asset(item.image.src)}
                alt={item.image.alt}
                loading="lazy"
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="px-[1.4rem] pb-6 pt-[1.3rem]">
                <strong className="mb-[.45rem] block font-display text-[1.25rem] font-normal leading-[1.2] text-ink">
                  {item.title}
                </strong>
                <span className="text-[.82rem] leading-[1.65] text-[#65645f]">{item.text}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
