import { studioGallery } from "@/data/services";
import { asset } from "@/lib/asset";

const layoutStyles = {
  tall: "row-span-2 max-tablet:row-span-1",
  wide: "col-span-2",
  standard: "",
};

export function StudioGallery() {
  return (
    <section className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <div className="mb-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-[minmax(280px,.8fr)_1.2fr] items-end gap-[clamp(3rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
        <div>
          <p className="eyebrow">En images</p>
          <h2 className="mb-0 mt-2 font-display text-[clamp(3rem,5vw,6rem)] font-normal leading-[.92] tracking-[-.045em]">
            Le studio
            <br />
            <em className="font-normal text-accent">en quelques photos.</em>
          </h2>
        </div>
        <p className="m-0 max-w-[520px] leading-[1.8] text-[#65645f]">
          Un aperçu des séances réalisées au studio et sur vos événements.
        </p>
      </div>
      <div className="grid auto-rows-[clamp(150px,15vw,225px)] grid-cols-4 gap-[.8rem] max-[1080px]:grid-cols-3 max-tablet:auto-rows-[150px] max-tablet:grid-cols-2 max-tablet:gap-2">
        {studioGallery.map((item) => (
          <figure
            key={item.image.src}
            className={`group relative m-0 overflow-hidden bg-ink ${layoutStyles[item.layout]}`}
          >
            <img
              src={asset(item.image.src)}
              alt={item.image.alt}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-[600ms] ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.06]"
            />
            <figcaption className="absolute inset-x-0 bottom-0 bg-[linear-gradient(transparent,rgba(5,6,7,.82))] px-[1.1rem] pb-[.95rem] pt-[2.4rem] text-[.6rem] uppercase tracking-[.14em] text-ivory">
              {item.caption}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
