/** Préfixe un chemin public ("/images/…") par le basePath GitHub Pages. */
export function asset(path: `/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}

/** Préserve les URLs distantes et préfixe les médias publics locaux. */
export function imageUrl(src: string): string {
  return src.startsWith("http") ? src : asset(src as `/${string}`);
}
