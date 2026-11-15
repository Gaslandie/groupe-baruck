import { formatPageText } from "@/lib/page-format";
import { pageValue, pageText } from "@/lib/page-content";

import { hqAddress, whatsappRequests } from "./site";
import { translate as t } from "../lib/language.ts";

// Les visuels temp-*.jpg seront remplacés par les photos réelles du studio.

export type ServiceImage = {
  src: `/${string}`;
  alt: string;
  width: number;
  height: number;
};

export type StudioSpace = {
  number: string;
  title: string;
  text: string;
  items: string[];
  image: ServiceImage;
  vip?: true;
};

export type StudioGearItem = {
  image: ServiceImage;
  title: string;
  text: string;
};

export type StudioEvent = {
  number: string;
  title: string;
  text: string;
};

export type StudioGalleryItem = {
  /** Dimensions réelles requises : réutilisées par la médiathèque. */
  image: ServiceImage & { width: number; height: number };
  caption: string;
  layout: "tall" | "wide" | "standard";
};

export type StudioPriceGroup = {
  number: string;
  title: string;
  items: {
    label: string;
    price: string;
    note?: string;
  }[];
};

export type HostessOffer = {
  number: string;
  title: string;
  text: string;
};

export const studioTags: string[] = pageValue<string[]>("studio-photo", "data.studioTags");

export const hostessTags: string[] = pageValue<string[]>("hotesses-evenementielles", "data.hostessTags");

export const studioSpaces: StudioSpace[] = pageValue<Omit<StudioSpace, "number" | "vip">[]>("studio-photo", "data.studioSpaces").map((value,index) => ({...value, number: pageText("studio-photo", "data.spacePrefix") + " " + String(index + 1).padStart(2,"0"), ...(index === 1 ? {vip:true as const} : {})}));

export const studioGear: StudioGearItem[] = pageValue<StudioGearItem[]>("studio-photo", "data.studioGear");

export const studioEvents: StudioEvent[] = pageValue<Omit<StudioEvent, "number">[]>("studio-photo", "data.studioEvents").map((value,index) => ({...value,number:String(index+1).padStart(2,"0")}));

export const studioGallery: StudioGalleryItem[] = pageValue<Omit<StudioGalleryItem,"layout">[]>("studio-photo", "data.studioGallery").map((value,index) => ({...value,layout:index === 0 ? "tall" as const : index === 1 ? "wide" as const : "standard" as const}));

export const studioPriceGroups: StudioPriceGroup[] = pageValue<Omit<StudioPriceGroup, "number">[]>("studio-photo", "data.studioPriceGroups").map((value,index) => ({...value,number:String(index+1).padStart(2,"0")}));

export const hostessOffers: HostessOffer[] = pageValue<Omit<HostessOffer, "number">[]>("hotesses-evenementielles", "data.hostessOffers").map((value,index) => ({...value,number:String(index+1).padStart(2,"0")}));

/** Complément extrait des affiches hôtesses fournies par le client. */
export const hostessServiceComplement = pageValue<{title:string;text:string}>("hotesses-evenementielles", "data.hostessServiceComplement");

export type ServiceFaqItem = { key?: string; question: string; answer: string };

export const studioFaq: ServiceFaqItem[] = pageValue<ServiceFaqItem[]>("studio-photo", "data.studioFaq").map(value=>({...value,answer:formatPageText(value.answer,{adresse:hqAddress})}));

export type HostessProcessStep = {
  number: string;
  title: string;
  text: string;
};

/** Parcours de réservation. */
export const hostessProcess: HostessProcessStep[] = pageValue<Omit<HostessProcessStep, "number">[]>("hotesses-evenementielles", "data.hostessProcess").map((value,index) => ({...value,number:String(index+1).padStart(2,"0")}));

/** Un message préparé, à compléter par le visiteur dans WhatsApp ; aucun envoi automatique. */
function requestWithDetails(href: string, details: string): string {
  const url = new URL(href);
  url.searchParams.set("text", `${url.searchParams.get("text") ?? ""}\n\n${details}`);
  return url.href;
}

export const serviceBookings = {
  "studio-photo": {
    label: t("Écrire au studio sur WhatsApp"),
    instructions: t("Pour préparer votre demande, indiquez la prestation souhaitée, la date et le lieu : au studio ou en extérieur."),
    href: requestWithDetails(whatsappRequests.studioPrices, t("Prestation souhaitée :\nDate :\nLieu (studio ou extérieur) :")),
  },
  hotesses: {
    label: t("Demander un devis sur WhatsApp"),
    instructions: hostessProcess[0]?.text ?? "",
    href: requestWithDetails(whatsappRequests.hostessBooking, t("Date de l’événement :\nLieu :\nNombre d’hôtesses souhaité :")),
  },
} as const;
