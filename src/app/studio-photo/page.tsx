import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { ServiceContact } from "@/components/services/ServiceContact";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { StudioEvents } from "@/components/services/StudioEvents";
import { StudioGallery } from "@/components/services/StudioGallery";
import { StudioPrices } from "@/components/services/StudioPrices";
import { StudioSpaces } from "@/components/services/StudioSpaces";
import { studioHero } from "@/data/media";
import { studioFaq, studioTags } from "@/data/services";
import { contacts, hqAddress } from "@/data/site";

export const metadata: Metadata = {
  title: "Studio Photo Baruck la Prospérité",
  description:
    "Studio Photo Baruck la Prospérité à Kobayah, Conakry — deux studios équipés, ouverts à tous 24h/24 et 7j/7 : mariages, baptêmes, anniversaires, conférences, shootings, photos d’identité et spots publicitaires.",
};

const contactDetails = [
  {
    label: "Adresse",
    text: hqAddress,
  },
  {
    label: "Ouverture",
    text: "24h/24 et 7j/7 — le studio est ouvert à tout le monde.",
  },
  {
    label: "Téléphone fixe Baruck Siège Guinée",
    text: contacts.landline.value,
    href: contacts.landline.href,
  },
  {
    label: "WhatsApp Baruck Siège Guinée",
    text: contacts.whatsappHq.value,
    href: contacts.whatsappHq.href,
    external: true,
  },
];

export default function StudioPhotoPage() {
  return (
    <PageShell variant="service" current="studio" footer="service">
      <ServiceHero
        image={studioHero}
        position="center"
        size="studio"
        eyebrow="Baruck Communication · Guinée"
        title="Studio Photo Baruck"
        emphasis="la Prospérité."
        text="Ouvert à tout le monde, à Kobayah (Conakry). Deux studios équipés et une équipe qui se déplace : nous réalisons vos photos au studio comme en extérieur, à toute heure."
        badge="Ouvert 24h/24 · 7j/7"
        actions={
          <>
            <a href="#tarifs" className="button button-accent">
              Connaître les prix <span>↓</span>
            </a>
            <a href={contacts.landline.href} className="button button-ghost">
              Appeler le studio
            </a>
          </>
        }
      />
      <ServiceIntro
        eyebrow="Nos prestations"
        title={
          <>
            Chaque moment
            <br />
          </>
        }
        emphasis="mérite son image."
        text="Le Studio Photo Baruck la Prospérité est ouvert à tout le monde, 24 heures sur 24 et 7 jours sur 7. Particuliers, familles, entreprises et organisations y trouvent deux studios et tout l’équipement nécessaire aux séances photo. Les prises de vue se font au studio comme en extérieur : l’équipe se déplace sur vos événements, à Conakry comme à l’intérieur du pays."
        tags={studioTags}
      />
      <StudioSpaces />
      <StudioEvents />
      <StudioGallery />
      <StudioPrices />
      <ServiceFaq
        eyebrow="Vos questions"
        title={<>Les questions<br /></>}
        emphasis="les plus fréquentes."
        items={studioFaq}
      />
      <ServiceContact
        eyebrow="Nous trouver"
        title={
          <>
            Votre studio
            <br />
          </>
        }
        emphasis="à Kobayah."
        details={contactDetails}
      />
    </PageShell>
  );
}
