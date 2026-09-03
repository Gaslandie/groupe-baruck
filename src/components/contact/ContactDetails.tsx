import { contacts } from "@/data/site";

import { ContactForm } from "./ContactForm";

type ChannelRowProps = {
  label: string;
  value: string;
  href: string;
  external?: boolean;
  withBorderBottom?: boolean;
};

function ChannelRow({ label, value, href, external = false, withBorderBottom = false }: ChannelRowProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noreferrer" : undefined}
      className={`group grid grid-cols-[1fr_auto] items-center gap-4 border-t border-line py-[1.15rem] transition-[padding,color] duration-[220ms] hover:pl-[.5rem] hover:text-accent focus-visible:pl-[.5rem] focus-visible:text-accent${
        withBorderBottom ? " border-b" : ""
      }`}
    >
      <span>
        <small className="mb-[.35rem] block text-[.5rem] uppercase tracking-[.16em] text-accent">{label}</small>
        <span className="font-display text-[clamp(1.35rem,2vw,1.9rem)] leading-none">{value}</span>
      </span>
      <i aria-hidden="true" className="text-[.85rem] not-italic text-accent transition-transform duration-[220ms] group-hover:translate-x-1">
        ↗
      </i>
    </a>
  );
}

export function ContactDetails() {
  return (
    <section id="coordonnees" className="grid grid-cols-[40%_60%] bg-paper max-tablet:grid-cols-1">
      <div className="reveal flex flex-col justify-center border-r border-line px-[clamp(2rem,5vw,6rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:border-r-0 max-tablet:px-[1.3rem] max-tablet:py-16">
        <p className="eyebrow">Nous joindre</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Un message,
          <br />
          <em className="font-normal text-accent">une réponse.</em>
        </h2>
        <p className="mb-12 mt-6 max-w-[380px] text-[.88rem] leading-[1.7] text-[#686762]">
          Choisissez le canal qui vous convient : nous vous répondons par celui-ci.
        </p>

        <ChannelRow label="WhatsApp · Baruck Siège Guinée" value={contacts.whatsappHq.value} href={contacts.whatsappHq.href} external />
        <ChannelRow label="Téléphone fixe · Siège Guinée" value={contacts.landline.value} href={contacts.landline.href} />
        <ChannelRow label="E-mail" value={contacts.email.value} href={contacts.email.href} withBorderBottom />

        <details className="group/more mt-6">
          <summary className="text-link w-fit cursor-pointer list-none [&::-webkit-details-marker]:hidden">
            Autres lignes directes{" "}
            <span className="transition-transform duration-[220ms] group-open/more:rotate-180">↓</span>
          </summary>
          <div className="mt-4">
            <ChannelRow label="Téléphone mobile" value={contacts.mobile.value} href={contacts.mobile.href} />
            <ChannelRow label="WhatsApp · PDG" value={contacts.whatsappCeo.value} href={contacts.whatsappCeo.href} external withBorderBottom />
          </div>
        </details>
      </div>
      <ContactForm id="formulaire" showTitle className="scroll-mt-[92px]" />
    </section>
  );
}
