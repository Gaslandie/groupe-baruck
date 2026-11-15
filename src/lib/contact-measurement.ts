export type ContactAction = "whatsapp" | "phone" | "email";

/** Le lien est reconnu localement ; ni son adresse ni ses paramètres ne sont envoyés. */
export function contactAction(href: string): ContactAction | null {
  try {
    const url = new URL(href);
    if (url.protocol === "tel:") return "phone";
    if (url.protocol === "mailto:") return "email";
    if (url.protocol === "https:" && ["wa.me", "api.whatsapp.com", "web.whatsapp.com"].includes(url.hostname)) return "whatsapp";
  } catch { /* Un lien interne n'est pas une prise de contact. */ }
  return null;
}

export function contactPage(pathname: string, base = ""): string | null {
  let path = pathname;
  if (base && (path === base || path.startsWith(base + "/"))) path = path.slice(base.length) || "/";
  path = path.replace(/^\/en(?=\/|$)/, "") || "/";
  if (!path.endsWith("/")) path += "/";
  return path.length <= 255 && /^\/(?:[a-z0-9-]+\/)*$/.test(path) ? path : null;
}

/** Contexte de la page, sans prétendre connaître le besoin réel du visiteur. */
export function contactActivity(path: string): string {
  const page = path.split("/")[1];
  return ["studio-photo", "hotesses-evenementielles", "jeca", "espoir-de-vie", "marque-baruck"].includes(page) ? page : "groupe";
}
