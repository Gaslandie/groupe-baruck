import english from "../data/en.json" with { type: "json" };

export const language = process.env.NEXT_PUBLIC_SITE_LANGUAGE === "en" ? "en" : "fr";
export const isEnglish = language === "en";
const dictionary: Record<string, string> = english;
const key = (value: string) => value.replace(/\s+/g, " ").trim();

/** Traductions relues, sans service externe ni envoi des contenus du client. */
export function translate<T extends string>(value: T): T {
  if (!isEnglish) return value;
  const translated = dictionary[key(value)];
  if (translated === undefined) return value;
  return ((value.match(/^\s+/)?.[0] ?? "") + translated + (value.match(/\s+$/)?.[0] ?? "")) as T;
}

/** Les identifiants, dates, coordonnées et chemins ne sont jamais traduits. */
export function translateContent<T>(value: T, field = ""): T {
  if (!isEnglish || ["id", "slug", "date", "category", "src", "href", "iso", "email", "mapQuery"].includes(field)) return value;
  if (typeof value === "string") return translate(value) as T;
  if (value instanceof Date) return value;
  if (Array.isArray(value)) return value.map((item) => translateContent(item)) as T;
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([name, item]) => [name, translateContent(item, name)])) as T;
  }
  return value;
}

export function translateMarkdown(value: string): string {
  if (!isEnglish) return value;
  return value.split(/(\n\s*\n)/).map((block) => {
    if (/^\s*$/.test(block)) return block;
    if (/^#{1,6} /.test(block)) return block.replace(/^(#{1,6} )(.+)$/, (_, prefix, title) => prefix + translate(title));
    return translate(block).replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `[${translate(label)}](${href})`);
  }).join("");
}

/** Une publication nouvelle reste explicitement en français jusqu'à traduction. */
export function hasEnglishMarkdown(value: string): boolean {
  return value.trim().split(/\n\s*\n/).every((block) => {
    const heading = block.match(/^#{1,6} (.+)$/);
    const link = block.match(/^\[([^\]]+)\]\([^)]+\)$/);
    return dictionary[key(heading?.[1] ?? link?.[1] ?? block)] !== undefined;
  });
}

/** L'autre langue conserve le chemin de la page. Le lien est un vrai rechargement. */
export function otherLanguagePath(pathname: string): string {
  const base = process.env.NEXT_PUBLIC_SITE_BASE_PATH ?? "";
  const route = pathname.startsWith("/") && !pathname.startsWith("//") ? pathname : "/";
  return `${base}${isEnglish ? "" : "/en"}${route}`;
}
