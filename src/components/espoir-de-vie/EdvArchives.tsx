import { edvGallery } from "@/data/espoir-de-vie";
import { asset } from "@/lib/asset";
export function EdvArchives() {
  return (
    <section className="reveal-stagger grid grid-cols-[1.35fr_.65fr] bg-edv-cream max-tablet:block">
      <div className="reveal px-[clamp(1.3rem,7vw,8rem)] py-[clamp(6rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="edv-kicker">Mémoire d’actions</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          Une histoire écrite
          <br />
          <em className="font-[inherit] text-edv-ember">sur le terrain.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[700px] text-body leading-[1.8] text-edv-muted">
          Chaque initiative est une rencontre : un enfant qui retrouve le chemin de l’école, une famille soutenue,
          une communauté rassemblée autour d’un même élan.
        </p>
      </div>
      <div className="reveal flex flex-col justify-end bg-edv-ember p-[clamp(3rem,6vw,6rem)] text-white max-tablet:min-h-[360px] max-tablet:px-[1.3rem] max-tablet:py-8">
        <p className="mb-0 mt-20 max-w-[450px] font-display text-display-sm font-normal leading-[1.45]">
          De Grôh à N’Zérékoré, chaque action rappelle qu’un geste concret peut rendre confiance et ouvrir de nouvelles
          perspectives.
        </p>
      </div>
      <div
        id="galerie"
        className="col-span-2 scroll-mt-[72px] border-t border-edv-line px-[clamp(1.3rem,7vw,8rem)] py-[clamp(4rem,7vw,7rem)] max-tablet:col-span-1 max-tablet:px-[1.3rem] max-tablet:py-16"
      >
        <h3 className="reveal m-0 mb-[clamp(2rem,4vw,3rem)] font-display text-display-md font-normal leading-none tracking-[-.035em]">
          Les actions en images
        </h3>
        <div className="reveal-stagger grid grid-cols-4 gap-[.7rem] max-[1100px]:grid-cols-3 max-tablet:grid-cols-2 max-tablet:gap-[.45rem] max-[430px]:grid-cols-1">
          {edvGallery.map(({ photo, caption }) => (
            <figure key={photo.src} className="reveal reveal-media m-0">
              <img
                src={asset(photo.src)}
                alt={photo.alt}
                width={photo.width}
                height={photo.height}
                loading="lazy"
                className="aspect-[4/3] w-full bg-edv-paper-deep object-cover"
              />
              <figcaption className="mt-3 text-label uppercase tracking-[.14em] text-edv-muted">
                {caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
