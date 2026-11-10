import { pageText } from "@/lib/page-content";

import type { BrandProduct } from "@/data/marque-baruck";
import { contacts, routes, site } from "@/data/site";

/** Le lien prépare une demande ; seul le visiteur l’envoie depuis WhatsApp. */
export function brandOrderHref(product?: BrandProduct, preferences = ""): string {
  const pageUrl = site.url + routes.brand.slice(1);
  const message = product
    ? [
        `${pageText("marque-baruck", "copy.brand-order.1")} ${product.name}.`,
        `${pageText("marque-baruck", "copy.brand-order.2")} ${pageUrl}#produit-${product.id}`,
        `${pageText("marque-baruck", "copy.brand-order.3")} ${site.url}${product.images[0].src.slice(1)}`,
        preferences.trim() ? `${pageText("marque-baruck", "copy.brand-order.4")} ${preferences.trim()}` : "",
        pageText("marque-baruck", "copy.brand-order.5"),
      ].filter(Boolean).join("\n\n")
    : `${pageText("marque-baruck", "copy.brand-order.6")}\n\n${pageUrl}`;

  return `${contacts.whatsappHq.href}?text=${encodeURIComponent(message)}`;
}
