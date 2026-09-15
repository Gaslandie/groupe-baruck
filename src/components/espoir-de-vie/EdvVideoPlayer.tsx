"use client";

type EdvVideoPlayerProps = {
  src: string;
  poster?: string;
  width: number;
  height: number;
};

/**
 * Lecteur de la vidéo de la visite. Les gestes de récupération les plus courants
 * sont retirés : bouton de téléchargement du lecteur, menu clic droit
 * (« Enregistrer la vidéo sous… »), image dans l'image. Voir `EdvVideo` pour la
 * limite réelle de cette protection.
 */
export function EdvVideoPlayer({ src, poster, width, height }: EdvVideoPlayerProps) {
  return (
    <video
      controls
      controlsList="nodownload noplaybackrate noremoteplayback"
      disablePictureInPicture
      onContextMenu={(event) => event.preventDefault()}
      preload="none"
      playsInline
      width={width}
      height={height}
      poster={poster}
      className="aspect-square h-auto w-full bg-black"
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne peut pas lire cette vidéo.
    </video>
  );
}
