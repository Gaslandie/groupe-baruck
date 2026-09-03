import type { Metadata } from "next";

import { ContactDetails } from "@/components/contact/ContactDetails";
import { ContactHero } from "@/components/contact/ContactHero";
import { ContactMap } from "@/components/contact/ContactMap";
import { PageShell } from "@/components/layout/PageShell";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez le Groupe Baruck — WhatsApp, téléphone, e-mail et formulaire : Studio photo, Hôtesses événementielles, JECA, Espoir de Vie, partenariats.",
};

export default function ContactPage() {
  return (
    <PageShell variant="about" current="contact" footer="about">
      <ContactHero />
      <ContactDetails />
      <ContactMap />
    </PageShell>
  );
}
