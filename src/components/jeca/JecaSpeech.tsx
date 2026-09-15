import { jecaSpeechVideo } from "@/data/jeca";
import { asset } from "@/lib/asset";
import { publicFileExists } from "@/lib/public-file";
import { VideoPlayer } from "../ui/VideoPlayer";

/**
 * Discours du président, placé après la vision et le choix du Sénégal : le visiteur
 * vient de lire les idées, il les entend ici de sa voix. Les repères de droite
 * reprennent, dans l'ordre, ce que la page a déjà exposé.
 *
 * La section disparaît tant que la vidéo n'est pas dans `public/videos/`.
 */
export function JecaSpeech() {
  if (!publicFileExists(jecaSpeechVideo.src)) return null;

  const poster =
    jecaSpeechVideo.poster && publicFileExists(jecaSpeechVideo.poster) ? jecaSpeechVideo.poster : undefined;

  return (
    <section
      id="discours"
      className="scroll-mt-[74px] bg-jeca-blue px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,9vw,9rem)] text-white max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <header className="reveal mb-[clamp(2.5rem,5vw,4.5rem)] max-w-[760px]">
        <p className="jeca-kicker light">{jecaSpeechVideo.eyebrow}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
          {jecaSpeechVideo.title}
          <em className="block font-normal text-jeca-yellow">{jecaSpeechVideo.emphasis}</em>
        </h2>
      </header>

      <div className="grid grid-cols-[minmax(0,1.3fr)_minmax(280px,.8fr)] items-start gap-[clamp(2.5rem,4vw,5rem)] max-[1080px]:grid-cols-1 max-[1080px]:gap-10">
        <figure className="reveal m-0 w-full max-w-[760px]">
          <VideoPlayer
            src={asset(jecaSpeechVideo.src)}
            poster={poster ? asset(poster) : undefined}
            width={jecaSpeechVideo.width}
            height={jecaSpeechVideo.height}
            className="aspect-[640/368]"
          />
          <figcaption className="mt-[1.1rem] text-caption leading-[1.7] text-[rgba(255,255,255,.55)]">
            {jecaSpeechVideo.caption}
          </figcaption>
        </figure>

        <ol className="reveal-stagger m-0 list-none border-t border-[rgba(255,255,255,.18)] p-0">
          {jecaSpeechVideo.chapters.map((chapter) => (
            <li
              key={chapter.number}
              className="reveal border-b border-[rgba(255,255,255,.18)] py-[clamp(1.3rem,2vw,1.8rem)]"
            >
              <span className="text-micro font-extrabold tracking-[.15em] text-jeca-yellow">{chapter.number}</span>
              <h3 className="mb-[.6rem] mt-[.7rem] font-display text-display-md font-normal leading-none">
                {chapter.title}
              </h3>
              <p className="m-0 text-small leading-[1.7] text-[rgba(255,255,255,.68)]">{chapter.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
