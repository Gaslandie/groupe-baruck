import type { BrandProduct } from "@/data/marque-baruck";
import { contacts, routes, site } from "@/data/site";

/** Le lien prépare une demande ; seul le visiteur l’envoie depuis WhatsApp. */
export function brandOrderHref(product?: BrandProduct, preferences = ""): string {
  const pageUrl = site.url + routes.brand.slice(1);
  const message = product
    ? [
        `Bonjour, je souhaite commander cet article de la marque Baruck : ${product.name}.`,
        `Article : ${pageUrl}#produit-${product.id}`,
        `Visuel : ${site.url}${product.images[0].src.slice(1)}`,
        preferences.trim() ? `Ma demande : ${preferences.trim()}` : "",
        "Pouvez-vous me confirmer le prix, la disponibilité et les modalités de commande ?",
      ].filter(Boolean).join("\n\n")
    : `Bonjour, je souhaite passer commande auprès de la marque Baruck. Pouvez-vous me renseigner sur vos articles ?\n\n${pageUrl}`;

  return `${contacts.whatsappHq.href}?text=${encodeURIComponent(message)}`;
}
