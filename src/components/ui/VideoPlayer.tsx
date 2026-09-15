"use client";

type VideoPlayerProps = {
  src: string;
  poster?: string;
  width: number;
  height: number;
  /** Rapport d'affichage du cadre, p. ex. "aspect-square" ou "aspect-video". */
  className?: string;
};

/**
 * Lecteur des vidéos du site, hébergées sur le domaine : aucun lecteur extérieur,
 * aucun traceur. Rien n'est téléchargé avant que le visiteur ne lance la lecture.
 * Le bouton de téléchargement du lecteur et le menu clic droit sont retirés ; la
 * protection reste partielle, un navigateur doit télécharger la vidéo pour la lire.
 */
export function VideoPlayer({ src, poster, width, height, className = "" }: VideoPlayerProps) {
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
      className={`h-auto w-full bg-black ${className}`}
    >
      <source src={src} type="video/mp4" />
      Votre navigateur ne peut pas lire cette vidéo.
    </video>
  );
}
