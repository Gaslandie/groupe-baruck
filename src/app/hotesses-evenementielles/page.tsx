import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { HostessOffers } from "@/components/services/HostessOffers";
import { ServiceContact } from "@/components/services/ServiceContact";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { hostessesHero } from "@/data/media";
import { hostessTags } from "@/data/services";
import { contacts, hqAddress, whatsappRequests } from "@/data/site";

export const metadata: Metadata = {
  title: "Hôtesses événementielles",
  description:
    "Hôtesses événementielles Baruck Communication Guinée — une équipe élégante, professionnelle et dynamique pour vos événements.",
};

const contactDetails = [
  {
    label: "Adresse",
    text: hqAddress,
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

export default function HostessesPage() {
  return (
    <PageShell variant="service" current="hostesses" footer="service">
      <ServiceHero
        image={hostessesHero}
        position="center 38%"
        size="hostesses"
        eyebrow="Baruck Communication · Guinée"
        title="Hôtesses"
        emphasis="événementielles."
        text="Une équipe élégante, professionnelle et dynamique à votre service pour la couverture de vos différents événements."
        actions={
          <>
            <a
              href={whatsappRequests.hostessBooking}
              target="_blank"
              rel="noreferrer"
              className="button button-accent"
            >
              Réserver une équipe <span>↗</span>
            </a>
            <a href={contacts.landline.href} className="button button-ghost">
              Nous appeler
            </a>
          </>
        }
      />
      <ServiceIntro
        eyebrow="Votre événement"
        title={
          <>
            Un accueil
            <br />
          </>
        }
        emphasis="à la hauteur."
        text="Les hôtesses de Baruck Communication Guinée assurent l’accueil, l’orientation et l’accompagnement de vos invités avec professionnalisme et distinction."
        tags={hostessTags}
      />
      <HostessOffers />
      <ServiceContact
        eyebrow="Réservation"
        title={
          <>
            Préparons votre
            <br />
          </>
        }
        emphasis="événement."
        details={contactDetails}
      />
    </PageShell>
  );
}
