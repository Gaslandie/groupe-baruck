/** Identité publique unique, y compris quand une copie de secours est construite. */
export const primarySiteUrl = "https://groupebaruck.com/";

/** Une construction locale ou de secours n'est jamais indexable par défaut. */
export function seoConfiguration(
  mode = process.env.BARUCK_SEO_MODE ?? "preview",
  siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gaslandie.github.io/groupe-baruck/",
) {
  if (mode !== "production" && mode !== "preview") {
    throw new Error("BARUCK_SEO_MODE doit valoir production ou preview.");
  }
  const url = new URL(siteUrl);
  if (mode === "production" && (
    url.origin !== new URL(primarySiteUrl).origin ||
    !["/", "/en/"].includes(url.pathname) ||
    url.username || url.password || url.search || url.hash
  )) {
    throw new Error("Seul https://groupebaruck.com/ peut être indexé en production.");
  }
  return { indexable: mode === "production" };
}
