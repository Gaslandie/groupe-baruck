import type { CreditSource, RemotePhoto } from "@/data/media";

type PhotoCreditsProps = {
  /** Photos Wikimedia créditées une à une (rendu historique, inchangé). */
  photos?: RemotePhoto[];
  /** Source collective sans photographes identifiés (ex. Unsplash). */
  source?: CreditSource;
  tone?: "light" | "dark";
  className?: string;
};

export function PhotoCredits({ photos, source, tone = "dark", className = "" }: PhotoCreditsProps) {
  const text = tone === "light" ? "text-[rgba(255,255,255,.38)]" : "text-[#9a978f]";
  const link = tone === "light" ? "hover:text-[rgba(255,255,255,.85)]" : "hover:text-ink";
  const linkClassName = `transition-colors duration-[220ms] ${link}`;

  if (source) {
    return (
      <p className={`m-0 text-micro uppercase tracking-[.14em] ${text} ${className}`}>
        Photos provisoires ·{" "}
        <a href={source.href} target="_blank" rel="noreferrer" className={linkClassName}>
          {source.label}
        </a>
      </p>
    );
  }

  return (
    <p className={`m-0 text-micro uppercase tracking-[.14em] ${text} ${className}`}>
      Photos provisoires · Wikimedia Commons
      {(photos ?? []).map((photo) => (
        <span key={photo.href}>
          {" · "}
          <a
            href={photo.href}
            target="_blank"
            rel="noreferrer"
            className={linkClassName}
          >
            {photo.author} ({photo.licence})
          </a>
        </span>
      ))}
    </p>
  );
}
