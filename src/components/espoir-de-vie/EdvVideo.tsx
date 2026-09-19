import { edvVisitVideo } from "@/data/espoir-de-vie";
import { asset } from "@/lib/asset";
import { publicFileExists } from "@/lib/public-file";

import { VideoPlayer } from "../ui/VideoPlayer";

/**
 * Vidéo de la visite, hébergée sur le site : aucun lecteur extérieur, aucun traceur.
 * Rien n'est téléchargé tant que le visiteur n'a pas lancé la lecture (`preload="none"`) ;
 * seule l'image d'attente se charge. Le format d'origine est carré (368 × 368).
 *
 * Téléchargement : le bouton du lecteur, le clic droit et l'affichage depuis un autre
 * site (règle `.htaccess`) sont retirés. Un visiteur déterminé peut toujours récupérer
 * le fichier — un navigateur doit le télécharger pour le lire. Une vidéo réellement
 * confidentielle ne doit pas être publiée sur un site public.
 *
 * Sur grand écran : texte à gauche, vidéo à droite. Sur mobile, les deux se superposent
 * dans l'ordre de lecture (texte puis vidéo).
 */
export function EdvVideo() {
  if (!publicFileExists(edvVisitVideo.src)) return null;

  const poster = edvVisitVideo.poster && publicFileExists(edvVisitVideo.poster) ? edvVisitVideo.poster : undefined;

  return (
    <section
      id="visite"
      className="grid scroll-mt-[72px] grid-cols-2 items-center gap-[clamp(2.5rem,5vw,6rem)] bg-edv-ink px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] text-white max-tablet:grid-cols-1 max-tablet:gap-10 max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div className="reveal">
        <p className="edv-kicker edv-kicker-light">{edvVisitVideo.eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          {edvVisitVideo.title}
          <br />
          <em className="font-[inherit] text-edv-gold">{edvVisitVideo.emphasis}</em>
        </h2>
        <time
          dateTime={edvVisitVideo.date.iso}
          className="mt-8 block text-micro font-extrabold uppercase tracking-[.13em] text-edv-gold"
        >
          {edvVisitVideo.date.label}
        </time>
        <p className="mb-0 mt-[1.1rem] max-w-[560px] text-body leading-[1.8] text-[rgba(255,255,255,.7)]">
          {edvVisitVideo.text}
        </p>
      </div>
      <figure className="reveal m-0 w-full max-w-[560px] justify-self-center max-tablet:max-w-[460px] max-tablet:justify-self-start">
        <VideoPlayer
          src={asset(edvVisitVideo.src)}
          poster={poster ? asset(poster) : undefined}
          width={368}
          height={368}
          className="aspect-square"
        />
        <figcaption className="mt-[1.1rem] text-caption leading-[1.7] text-[rgba(255,255,255,.58)]">
          {edvVisitVideo.caption}
        </figcaption>
      </figure>
    </section>
  );
}
