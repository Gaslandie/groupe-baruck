import { hqHours, hqMap, socialNetworks } from "@/data/contact";
import { contacts, hqAddress } from "@/data/site";
import { ClientNote } from "@/components/ui/ClientNote";

import { ContactForm } from "./ContactForm";

export function ContactDetails() {
  return (
    <section id="coordonnees" className="grid grid-cols-[42%_58%] bg-paper max-tablet:grid-cols-1">
      <div className="reveal border-r border-line px-[clamp(2rem,6vw,7rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:border-r-0 max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="eyebrow">Coordonnées</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Toutes nos
          <br />
          <em className="font-normal text-accent">lignes directes.</em>
        </h2>

        <div className="mt-14 flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">
            Téléphones · Guinée
          </span>
          <a
            href={contacts.landline.href}
            className="w-fit font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal hover:text-accent"
          >
            <small className="mr-[.7rem] inline-block min-w-[125px] align-middle font-sans text-[.48rem] font-medium uppercase tracking-[.12em] text-[#77746e]">
              Téléphone fixe Baruck Siège Guinée :
            </small>
            {contacts.landline.value}
          </a>
          <a
            href={contacts.mobile.href}
            className="w-fit font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal hover:text-accent"
          >
            <small className="mr-[.7rem] inline-block min-w-[125px] align-middle font-sans text-[.48rem] font-medium uppercase tracking-[.12em] text-[#77746e]">
              Mobile
            </small>
            {contacts.mobile.value}
          </a>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">WhatsApp</span>
          <a
            href={contacts.whatsappHq.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal hover:text-accent"
          >
            <small className="mr-[.7rem] inline-block min-w-[125px] align-middle font-sans text-[.48rem] font-medium uppercase tracking-[.12em] text-[#77746e]">
              WhatsApp Baruck Siège Guinée :
            </small>
            {contacts.whatsappHq.value}
          </a>
          <a
            href={contacts.whatsappCeo.href}
            target="_blank"
            rel="noreferrer"
            className="w-fit font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal hover:text-accent"
          >
            <small className="mr-[.7rem] inline-block min-w-[125px] align-middle font-sans text-[.48rem] font-medium uppercase tracking-[.12em] text-[#77746e]">
              WhatsApp PDG
            </small>
            {contacts.whatsappCeo.value}
          </a>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">E-mail</span>
          <a
            href={contacts.email.href}
            className="w-fit font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal hover:text-accent"
          >
            {contacts.email.value}
          </a>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">Siège</span>
          <p className="m-0 max-w-[470px] text-[.86rem] leading-[1.7] text-[#686762]">{hqAddress}</p>
          <a href={hqMap.directionsUrl} target="_blank" rel="noreferrer" className="text-link mt-4 w-fit">
            Ouvrir dans Google Maps <span>↗</span>
          </a>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">Horaires · Siège</span>
          <dl className="m-0">
            {hqHours.map(({ days, hours }) => (
              <div key={days} className="grid grid-cols-[150px_1fr] gap-4 py-[.3rem]">
                <dt className="text-[.6rem] uppercase tracking-[.12em] text-[#77746e]">{days}</dt>
                <dd className="m-0 font-display text-[clamp(1.05rem,1.4vw,1.3rem)]">{hours}</dd>
              </div>
            ))}
          </dl>
          <ClientNote>Horaires provisoires, à valider avec le client.</ClientNote>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">Présence</span>
          <p className="m-0 font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal">
            Guinée · Sénégal · Côte d’Ivoire
          </p>
        </div>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
          <span className="mb-[.35rem] text-[.52rem] uppercase tracking-[.15em] text-accent">Réseaux</span>
          <p className="m-0 font-display text-[clamp(1.2rem,1.8vw,1.65rem)] font-normal">
            {socialNetworks.join(" · ")}
          </p>
          <ClientNote>Liens à valider avec le client.</ClientNote>
        </div>
      </div>
      <ContactForm id="formulaire" showTitle className="scroll-mt-[92px]" />
    </section>
  );
}
