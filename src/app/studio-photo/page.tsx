import { pageText, pageValue } from "@/lib/page-content";
import { pageMetadata } from "@/lib/page-metadata";


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
import { contacts, hqAddress, routes, site } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: pageMetadata("studio-photo").title,
  description:
    pageMetadata("studio-photo").description,
  alternates: pageAlternates(site.url + routes.studio.slice(1)),
  openGraph: socialMetadata(studioHero),
};

const contactDetails = [
  {
    label: pageText("studio-photo", "copy.page.1"),
    text: hqAddress,
  },
  {
    label: pageText("studio-photo", "copy.page.2"),
    text: pageText("studio-photo", "copy.page.3"),
  },
  {
    label: pageText("studio-photo", "copy.page.4"),
    text: contacts.landline.value,
    href: contacts.landline.href,
  },
  {
    label: pageText("studio-photo", "copy.page.5"),
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
        eyebrow={pageText("studio-photo", "copy.page.6")}
        title={pageText("studio-photo", "copy.page.7")}
        emphasis={pageText("studio-photo", "copy.page.8")}
        text={pageText("studio-photo", "copy.page.9")}
        badge={pageText("studio-photo", "copy.page.10")}
        actions={
          <>
            <a href={pageValue<string>("studio-photo","links.page.1")} className="button button-accent">{(pageText("studio-photo", "copy.page.11") + " ")}<span><Icon name="arrow-down" /></span>
            </a>
            <a href={contacts.landline.href} className="button button-ghost">{pageText("studio-photo", "copy.page.12")}</a>
          </>
        }
      />
      <ServiceIntro
        eyebrow={pageText("studio-photo", "copy.page.13")}
        title={
          <>{pageText("studio-photo", "copy.page.14")}<br />
          </>
        }
        emphasis={pageText("studio-photo", "copy.page.15")}
        text={pageText("studio-photo", "copy.page.16")}
        tags={studioTags}
      />
      <StudioSpaces />
      <StudioEvents />
      <StudioGallery />
      <StudioPrices />
      <ServiceFaq
        eyebrow={pageText("studio-photo", "copy.page.17")}
        title={<>{pageText("studio-photo", "copy.page.18")}<br /></>}
        emphasis={pageText("studio-photo", "copy.page.19")}
        items={studioFaq}
      />
      <ServiceContact
        eyebrow={pageText("studio-photo", "copy.page.20")}
        title={
          <>{pageText("studio-photo", "copy.page.21")}<br />
          </>
        }
        emphasis={pageText("studio-photo", "copy.page.22")}
        details={contactDetails}
      />
    </PageShell>
  );
}
