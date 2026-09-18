export type IconName =
  | "arrow-up-right"
  | "arrow-down-right"
  | "arrow-up-left"
  | "arrow-up"
  | "arrow-down"
  | "arrow-left"
  | "arrow-right"
  | "chevron-down"
  | "close";

/**
 * Icônes dessinées en SVG plutôt qu'en caractères (↗, ←, ×…).
 * Les flèches Unicode ont une variante emoji : iOS les affiche en couleur et
 * décalées. Le tracé suit la taille du texte (`1em`) et sa couleur
 * (`currentColor`), donc les styles existants continuent de s'appliquer.
 */
const paths: Record<IconName, string> = {
  "arrow-up-right": "M6.5 17.5 17.5 6.5M8.6 6.5h8.9v8.9",
  "arrow-down-right": "M6.5 6.5l11 11M17.5 8.6v8.9H8.6",
  "arrow-up-left": "M17.5 17.5 6.5 6.5M15.4 6.5H6.5v8.9",
  "arrow-up": "M12 19V5.6M5.8 11.8 12 5.6l6.2 6.2",
  "arrow-down": "M12 5v13.4M5.8 12.2 12 18.4l6.2-6.2",
  "arrow-left": "M19 12H5.6M11.8 5.8 5.6 12l6.2 6.2",
  "arrow-right": "M5 12h13.4M12.2 5.8 18.4 12l-6.2 6.2",
  "chevron-down": "M5.8 9.2 12 15.4l6.2-6.2",
  close: "M6 6l12 12M18 6 6 18",
};

export function Icon({ name, className }: { name: IconName; className?: string }) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={["inline-block shrink-0 align-[-.14em]", className].filter(Boolean).join(" ")}
    >
      <path d={paths[name]} />
    </svg>
  );
}
