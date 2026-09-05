import type { Metadata } from "next";

import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import { PageShell } from "@/components/layout/PageShell";
import { ServiceFaq } from "@/components/services/ServiceFaq";
import { contactFaq } from "@/data/contact";
import { routes, site } from "@/data/site";
import { pageAlternates } from "@/lib/metadata";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Groupe Baruck — WhatsApp, téléphone, e-mail et formulaire : Studio photo, Hôtesses événementielles, JECA, Espoir de Vie, partenariats.",
  alternates: pageAlternates(site.url + routes.contact.slice(1)),
};

export default function ContactPage() {
  return (
    <PageShell variant="about" current="contact" footer="about">
      <ContactHero />
      <ContactDetails />
      <ServiceFaq
        id="questions-frequentes"
        eyebrow="Informations pratiques"
        title={<>Vos questions,<br /></>}
        emphasis="nos réponses."
        items={contactFaq}
      />
      <ContactMap />
    </PageShell>
  );
}
