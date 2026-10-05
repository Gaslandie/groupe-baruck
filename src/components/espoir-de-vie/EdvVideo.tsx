import { edvFieldVideos, type EdvVideo as EdvVideoData } from "@/data/espoir-de-vie";
import { asset } from "@/lib/asset";
import { publicFileExists } from "@/lib/public-file";

import { VideoPlayer } from "../ui/VideoPlayer";

/**
 * Vidéos de terrain, hébergées sur le site : aucun lecteur extérieur, aucun traceur.
 * Rien n'est téléchargé tant que le visiteur n'a pas lancé la lecture (`preload="none"`) ;
 * seule l'image d'attente se charge lorsqu'elle est disponible.
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
  return edvFieldVideos.map((video) => <EdvVideoSection key={video.id} video={video} />);
}

function EdvVideoSection({ video }: { video: EdvVideoData }) {
  if (!publicFileExists(video.src)) return null;

  const poster = video.poster && publicFileExists(video.poster) ? video.poster : undefined;

  return (
    <section
      id={video.id}
      className="grid scroll-mt-[72px] grid-cols-2 items-center gap-[clamp(2.5rem,5vw,6rem)] bg-edv-ink px-[clamp(1.3rem,5vw,6rem)] py-[clamp(6rem,10vw,10rem)] text-white max-tablet:grid-cols-1 max-tablet:gap-10 max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div className="reveal">
        <p className="edv-kicker edv-kicker-light">{video.eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">
          {video.title}
          <br />
          <em className="font-[inherit] text-edv-gold">{video.emphasis}</em>
        </h2>
        <time
          dateTime={video.date.iso}
          className="mt-8 block text-micro font-bold uppercase tracking-[.13em] text-edv-gold"
        >
          {video.date.label}
        </time>
        <p className="mb-0 mt-[1.1rem] max-w-[560px] text-body leading-[1.8] text-[rgba(255,255,255,.7)]">
          {video.text}
        </p>
      </div>
      <figure className="reveal m-0 w-full max-w-[560px] justify-self-center max-tablet:max-w-[460px] max-tablet:justify-self-start">
        <VideoPlayer
          src={asset(video.src)}
          poster={poster ? asset(poster) : undefined}
          width={video.width}
          height={video.height}
          label={video.caption}
        />
        <figcaption className="mt-[1.1rem] text-caption leading-[1.7] text-[rgba(255,255,255,.58)]">
          {video.caption}
        </figcaption>
      </figure>
    </section>
  );
}
