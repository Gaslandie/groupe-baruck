import { pageText } from "@/lib/page-content";
import { servicePageMetadata } from "@/lib/page-metadata";
import { hqMap } from "@/data/coordonnees";
import { ServiceBooking } from "@/components/services/ServiceBooking";
import { ServiceNews } from "@/components/services/ServiceNews";
import { StructuredData } from "@/components/ui/StructuredData";
import { serviceSchema } from "@/lib/structured-data";


import type { Metadata } from "next";

import { PageShell } from "@/components/layout/PageShell";
import { HostessOffers } from "@/components/services/HostessOffers";
import { HostessProcess } from "@/components/services/HostessProcess";
import { ServiceContact } from "@/components/services/ServiceContact";
import { ServiceHero } from "@/components/services/ServiceHero";
import { ServiceIntro } from "@/components/services/ServiceIntro";
import { hostessesHero } from "@/data/media";
import { hostessTags, serviceBookings } from "@/data/services";
import { contacts, hqAddress, routes, site } from "@/data/site";
import { pageAlternates, socialMetadata } from "@/lib/metadata";
import { Icon } from "@/components/ui/Icon";

export const metadata: Metadata = {
  ...servicePageMetadata("hotesses-evenementielles"),
  alternates: pageAlternates(site.url + routes.hostesses.slice(1)),
  openGraph: socialMetadata(hostessesHero),
};

const contactDetails = [
  {
    label: pageText("hotesses-evenementielles", "copy.page.1"),
    text: hqAddress,
  },
  {
    label: pageText("hotesses-evenementielles", "copy.page.2"),
    text: contacts.landline.value,
    href: contacts.landline.href,
  },
  {
    label: pageText("hotesses-evenementielles", "copy.page.3"),
    text: contacts.whatsappHq.value,
    href: contacts.whatsappHq.href,
    external: true,
  },
];

export default function HostessesPage() {
  return (
    <PageShell variant="service" current="hostesses" footer="service">
      <StructuredData data={serviceSchema("hotesses-evenementielles")} />
      <ServiceHero
        breadcrumbs={[
          { name: pageText("home", "common.site.9"), href: routes.home },
          { name: pageText("hotesses-evenementielles", "meta.title"), href: routes.hostesses },
        ]}
        image={hostessesHero}
        position="center 38%"
        size="hostesses"
        eyebrow={pageText("hotesses-evenementielles", "copy.page.4")}
        title={pageText("hotesses-evenementielles", "copy.page.5")}
        emphasis={pageText("hotesses-evenementielles", "copy.page.6")}
        location={hqMap.label}
        text={pageText("hotesses-evenementielles", "copy.page.7")}
        actions={
          <>
            <a
              href={serviceBookings.hotesses.href}
              target="_blank"
              rel="noreferrer"
              className="button button-accent"
            >{(pageText("hotesses-evenementielles", "copy.page.8") + " ")}<span><Icon name="arrow-up-right" /></span>
            </a>
            <a href={contacts.landline.href} className="button button-ghost">{pageText("hotesses-evenementielles", "copy.page.9")}</a>
          </>
        }
      />
      <ServiceIntro
        eyebrow={pageText("hotesses-evenementielles", "copy.page.10")}
        title={
          <>{pageText("hotesses-evenementielles", "copy.page.11")}<br />
          </>
        }
        emphasis={pageText("hotesses-evenementielles", "copy.page.12")}
        text={pageText("hotesses-evenementielles", "copy.page.13")}
        tags={hostessTags}
      />
      <HostessOffers />
      <HostessProcess />
      <ServiceContact
        eyebrow={pageText("hotesses-evenementielles", "copy.page.14")}
        title={
          <>{pageText("hotesses-evenementielles", "copy.page.15")}<br />
          </>
        }
        emphasis={pageText("hotesses-evenementielles", "copy.page.16")}
        details={contactDetails}
      >
        <ServiceBooking service="hotesses" />
        <ServiceNews category="hotesses" />
      </ServiceContact>
    </PageShell>
  );
}
