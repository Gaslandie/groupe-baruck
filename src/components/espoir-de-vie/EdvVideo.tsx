import { edvVisitVideo } from "@/data/espoir-de-vie";
import { asset } from "@/lib/asset";
import { publicFileExists } from "@/lib/public-file";

import { EdvSectionHead } from "./EdvSectionHead";

/**
 * Vidéo de la visite, hébergée sur le site : aucun lecteur extérieur, aucun traceur.
 * Rien n'est téléchargé tant que le visiteur n'a pas lancé la lecture (`preload="none"`) ;
 * seule l'image d'attente se charge. Le format d'origine est carré (368 × 368).
 */
export function EdvVideo() {
  if (!publicFileExists(edvVisitVideo.src)) return null;

  const poster = edvVisitVideo.poster && publicFileExists(edvVisitVideo.poster) ? edvVisitVideo.poster : undefined;

  return (
    <section
      id="visite"
      className="scroll-mt-[72px] bg-edv-ink px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] text-white max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <EdvSectionHead
        eyebrow={edvVisitVideo.eyebrow}
        title={edvVisitVideo.title}
        emphasis={edvVisitVideo.emphasis}
        text={edvVisitVideo.text}
        tone="light"
      />
      <figure className="reveal mx-auto my-0 w-full max-w-[460px]">
        <time
          dateTime={edvVisitVideo.date.iso}
          className="mb-[1.1rem] block text-micro font-extrabold uppercase tracking-[.13em] text-edv-gold"
        >
          {edvVisitVideo.date.label}
        </time>
        <video
          controls
          preload="none"
          playsInline
          width={368}
          height={368}
          poster={poster ? asset(poster) : undefined}
          className="aspect-square h-auto w-full bg-black"
        >
          <source src={asset(edvVisitVideo.src)} type="video/mp4" />
          Votre navigateur ne peut pas lire cette vidéo.
        </video>
        <figcaption className="mt-[1.1rem] text-caption leading-[1.7] text-[rgba(255,255,255,.58)]">
          {edvVisitVideo.caption}
        </figcaption>
      </figure>
    </section>
  );
}
