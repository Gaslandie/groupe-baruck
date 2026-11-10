import { translate as t } from "../lib/language.ts";
import { formatPageText } from "@/lib/page-format";
import { pageValue } from "@/lib/page-content";

import { facebookPages, hqHours, hqMap } from "./coordonnees";
import { contacts, hqAddress, whatsappRequests } from "./site";

export { facebookPages, hqHours, hqMap };

export const contactSubjects = [
  t("Studio photo"),
  t("Hôtesses événementielles"),
  "JECA",
  "Espoir de Vie",
  t("Partenariat ou collaboration"),
  t("Autre demande"),
] as const;

export const contactNeeds = pageValue<{key:string;title:string;text:string;target:"studio-prices"|"hostesses"|"jeca-mail"|"edv-mail"|"contact-form"}[]>("contact", "data.contactNeeds").map((value,index) => ({...value,number:String(index+1).padStart(2,"0"),...contactTarget(value.target)}));

type ContactFaqItem = {
  question: string;
  answer: string;
};

/** FAQ de la page Contact : uniquement des informations déjà publiées sur le site. */
export const contactFaq: ContactFaqItem[] = pageValue<ContactFaqItem[]>("contact", "data.contactFaq").map(value=>({...value,answer:formatPageText(value.answer,{adresse:hqAddress,horaires:hqHours.map(({days,hours})=>`${days} : ${hours}`).join(" ; "),whatsapp:contacts.whatsappHq.value,email:contacts.email.value})}));

function contactTarget(target:string):{href:string;external?:boolean} {
 switch(target){
 case "studio-prices":return{href:whatsappRequests.studioPrices,external:true};
 case "hostesses":return{href:whatsappRequests.hostessBooking,external:true};
 case "jeca-mail":return{href:contacts.email.href+"?subject=JECA"};
 case "edv-mail":return{href:contacts.email.href+"?subject="+encodeURIComponent("Espoir de Vie")};
 default:return{href:"#formulaire"};
 }
}

export const contactSubjectLabels = Object.values(pageValue<Record<string,string>>("contact", "data.subjectLabels"));
