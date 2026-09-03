/** Préfixe un chemin public ("/images/…") par le basePath GitHub Pages. */
export function asset(path: `/${string}`): string {
  return `${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}${path}`;
}
