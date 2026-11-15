import { pageText } from "./page-content";
import type { Metadata } from "next";
import { hqMap } from "@/data/coordonnees";

/** Données validées résolues au build ; les brouillons restent dans le back-office. */
export function pageMetadata(id: string): { title: string; description: string } {
  return { title: pageText(id, "meta.title"), description: pageText(id, "meta.description") };
}

/** Conserver le texte validé et reprendre la localisation des coordonnées communes. */
export function servicePageMetadata(id: "studio-photo" | "hotesses-evenementielles"): Metadata {
  const metadata = pageMetadata(id);
  const title = metadata.title.includes(hqMap.label) ? metadata.title : `${metadata.title} — ${hqMap.label}`;
  return {
    title: { absolute: /baruck/i.test(title) ? title : `${title} — Groupe Baruck` },
    description: id === "hotesses-evenementielles" && !metadata.description.includes(hqMap.label)
      ? `${metadata.description} ${hqMap.label}.`
      : metadata.description,
  };
}
