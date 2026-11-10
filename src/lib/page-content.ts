import pages from "@content/pages.json" with { type: "json" };

function localize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(localize);
  if (value && typeof value === "object") {
    const object = value as Record<string, unknown>;
    if (Object.keys(object).length === 2 && typeof object.fr === "string" && typeof object.en === "string") {
      return object[process.env.NEXT_PUBLIC_SITE_LANGUAGE === "en" ? "en" : "fr"];
    }
    return Object.fromEntries(Object.entries(object).map(([key, entry]) => [key, localize(entry)]));
  }
  return value;
}

type LinkField = { kind: string; fields?: Record<string, LinkField>; item?: LinkField };

/** Un lien historique vers une édition retirée revient à sa page, sans ancre morte. */
function resolvePageLinks(field: LinkField | undefined, value: unknown, page: string): unknown {
  if (!field) return value;
  if (field.kind === "list" && Array.isArray(value)) return value.map(item => resolvePageLinks(field.item, item, page));
  if (field.kind === "object" && value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolvePageLinks(field.fields?.[key], item, page)]));
  }
  if (field.kind === "link" && typeof value === "string") {
    const absolute = value.startsWith("#") ? pages[page].route + value : value;
    const edition = absolute.match(/^\/jeca\/#edition-(.+)$/);
    if (edition && !(pages.jeca.values["data.editions"] as {key:string}[]).some(item => item.key === edition[1])) {
      return value.startsWith("#") ? "#editions" : pages.jeca.route;
    }
  }
  return value;
}

/** Seuls les contenus validés sont fournis au site pendant sa construction. */
export function pageValue<T>(page: string, key: string): T {
  const value = pages[page]?.values[key];
  if (value === undefined) throw new Error(`Contenu de page absent : ${page}.${key}`);
  return resolvePageLinks(pages[page].fields?.[key], localize(value), page) as T;
}

export function pageText(page: string, key: string): string { return pageValue<string>(page, key); }

export function presidentName(): string {
  return ["honorific", "givenNames", "highlight", "surname"].map(key => pageText("groupe", "president." + key)).join(" ");
}

/** Une rubrique de la page courante garde une flèche vers le bas. */
export function pageLinkIcon(page: string, key: string): "arrow-down" | "arrow-up-right" {
  return pageHrefIcon(page, pageValue<string>(page, key));
}

export function pageHrefIcon(page: string, href: string): "arrow-down" | "arrow-up-right" {
  return href.startsWith("#") || href.startsWith(pages[page].route + "#") ? "arrow-down" : "arrow-up-right";
}
