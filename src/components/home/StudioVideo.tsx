import { studioVideo } from "@/data/home";
import { siteTexts } from "@/data/textes";
import { asset } from "@/lib/asset";
import { publicFileExists } from "@/lib/public-file";

import { VideoPlayer } from "../ui/VideoPlayer";

/**
 * Visite du studio, juste sous le hero (2026-10-01) : la même vidéo reste aussi
 * dans la section du studio plus bas. Rien n'est téléchargé avant la lecture,
 * et la section disparaît si le fichier manque.
 */
export function StudioVideo() {
  if (!publicFileExists(studioVideo.src)) return null;

  return (
    <section
      id="video-studio"
      className="scroll-mt-[92px] bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(3.5rem,6vw,6rem)] text-ink max-tablet:px-[1.3rem] max-tablet:py-14"
    >
      <div className="reveal mx-auto w-full max-w-[1100px]">
        <p className="eyebrow">{siteTexts.heroSlides["studio-photo"].title}</p>
        <VideoPlayer
          src={asset(studioVideo.src)}
          poster={asset(studioVideo.poster)}
          width={studioVideo.width}
          height={studioVideo.height}
          label={studioVideo.label}
          className="aspect-video"
        />
      </div>
    </section>
  );
}
