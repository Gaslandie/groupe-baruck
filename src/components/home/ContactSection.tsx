import { contacts } from "@/data/site";

import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section id="contact" className="grid grid-cols-[42%_58%] bg-paper max-tablet:grid-cols-1">
      <div className="reveal border-r border-line px-[clamp(2rem,6vw,7rem)] py-[clamp(5rem,8vw,9rem)] max-tablet:border-r-0 max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="eyebrow">Contact</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Parlons de votre
          <br />
          <em className="font-normal text-accent">prochain projet.</em>
        </h2>
        <p className="mb-14 mt-8 max-w-[470px] text-[.88rem] leading-[1.7] text-[#686762]">
          Notre équipe est à votre écoute pour répondre à vos questions et étudier vos propositions.
        </p>

        <div className="flex flex-col gap-[.35rem] border-t border-line py-[1.2rem]">
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
      </div>
      <ContactForm />
    </section>
  );
}
