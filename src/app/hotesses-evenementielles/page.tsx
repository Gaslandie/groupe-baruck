import { translate as t } from "../../lib/language.ts";

import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { HostessOffers } from "@/components/services/HostessOffers";
import { HostessProcess } from "@/components/services/HostessProcess";
import { ServiceContact } from "@/components/services/ServiceContact";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { hostessesHero } from "@/data/media";
import { hostessTags } from "@/data/services";
import { contacts, hqAddress, routes, site, whatsappRequests } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: t("Hôtesses événementielles"),
  description:
    t("Hôtesses événementielles Baruck Communication Guinée — une équipe élégante, professionnelle et dynamique pour vos événements."),
  alternates: pageAlternates(site.url + routes.hostesses.slice(1)),
  openGraph: socialMetadata(hostessesHero),
};

const contactDetails = [
  {
    label: t("Adresse"),
    text: hqAddress,
  },
  {
    label: t("Téléphone fixe Baruck Siège Guinée"),
    text: contacts.landline.value,
    href: contacts.landline.href,
  },
  {
    label: t("WhatsApp Baruck Siège Guinée"),
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
        eyebrow={t("Baruck Communication · Guinée")}
        title={t("Hôtesses")}
        emphasis={t("événementielles.")}
        text={t("Une équipe élégante, professionnelle et dynamique à votre service pour la couverture de vos différents événements.")}
        actions={
          <>
            <a
              href={whatsappRequests.hostessBooking}
              target="_blank"
              rel="noreferrer"
              className="button button-accent"
            >{t("Réserver une équipe ")}<span><Icon name="arrow-up-right" /></span>
            </a>
            <a href={contacts.landline.href} className="button button-ghost">{t("Nous appeler")}</a>
          </>
        }
      />
      <ServiceIntro
        eyebrow={t("Votre événement")}
        title={
          <>{t("Un accueil")}<br />
          </>
        }
        emphasis={t("à la hauteur.")}
        text={t("Les hôtesses de Baruck Communication Guinée assurent l’accueil, l’orientation et l’accompagnement de vos invités avec professionnalisme et distinction.")}
        tags={hostessTags}
      />
      <HostessOffers />
      <HostessProcess />
      <ServiceContact
        eyebrow={t("Réservation")}
        title={
          <>{t("Préparons votre")}<br />
          </>
        }
        emphasis={t("événement.")}
        details={contactDetails}
      />
    </PageShell>
  );
}
