import { pageText } from "@/lib/page-content";
import { pageMetadata } from "@/lib/page-metadata";


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
  title: pageMetadata("contact").title,
  description:
    pageMetadata("contact").description,
  alternates: pageAlternates(site.url + routes.contact.slice(1)),
};

export default function ContactPage() {
  return (
    <PageShell variant="about" current="contact" footer="about">
      <ContactHero />
      <ContactDetails />
      <ServiceFaq
        id="questions-frequentes"
        eyebrow={pageText("contact", "copy.page.1")}
        title={<>{pageText("contact", "copy.page.2")}<br /></>}
        emphasis={pageText("contact", "copy.page.3")}
        items={contactFaq}
      />
      <ContactMap />
    </PageShell>
  );
}
