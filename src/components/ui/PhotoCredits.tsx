import type { RemotePhoto } from "@/data/media";

type PhotoCreditsProps = { photos: RemotePhoto[]; tone?: "light" | "dark"; className?: string };

export function PhotoCredits({ photos, tone = "dark", className = "" }: PhotoCreditsProps) {
  const text = tone === "light" ? "text-[rgba(255,255,255,.38)]" : "text-[#9a978f]";
  const link = tone === "light" ? "hover:text-[rgba(255,255,255,.85)]" : "hover:text-ink";

  return (
    <p className={`m-0 text-[.52rem] uppercase tracking-[.14em] ${text} ${className}`}>
      Photos provisoires · Wikimedia Commons
      {photos.map((photo) => (
        <span key={photo.href}>
          {" · "}
          <a
            href={photo.href}
            target="_blank"
            rel="noreferrer"
            className={`transition-colors duration-[220ms] ${link}`}
          >
            {photo.author} ({photo.licence})
          </a>
        </span>
      ))}
    </p>
  );
}
