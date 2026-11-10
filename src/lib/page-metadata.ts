import pages from "@content/pages.json" with { type: "json" };

/** Données validées résolues au build ; les brouillons restent dans le back-office. */
export function pageMetadata(id: string): { title: string; description: string } {
  const page = pages[id];
  if (!page) throw new Error("Page éditoriale inconnue.");
  const language = process.env.NEXT_PUBLIC_SITE_LANGUAGE === "en" ? "en" : "fr";
  return { title: page.values["meta.title"][language], description: page.values["meta.description"][language] };
}
