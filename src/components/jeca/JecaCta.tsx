import Link from "next/link";

import { contacts, routes } from "@/data/site";

export function JecaCta() {
  return (
    <section className="flex min-h-[540px] flex-col items-center justify-center bg-jeca-blue px-6 py-24 text-center text-white max-tablet:min-h-[520px]">
      <p className="jeca-kicker light">JECA</p>
      <h2 className="mb-[2.3rem] mt-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
        La diaspora et l’Afrique,
        <br />
        <em className="text-jeca-yellow">réunies pour agir.</em>
      </h2>
      <div className="jeca-actions">
        <Link href={routes.contact} className="jeca-button jeca-button-white">
          Nous contacter <span>↗</span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="jeca-button jeca-button-outline"
        >
          Écrire sur WhatsApp
        </a>
      </div>
    </section>
  );
}
