import { facebookPages, hqHours, hqMap } from "@/data/contact";
import { hqAddress } from "@/data/site";
import { ContactMapEmbed } from "@/components/contact/ContactMapEmbed";
import { ClientNote } from "@/components/ui/ClientNote";

export function ContactMap() {
  return (
    <section
      id="carte"
      aria-label="Plan d’accès"
      className="scroll-mt-[92px] grid grid-cols-[38%_62%] gap-x-[clamp(2rem,5vw,5rem)] bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(3.5rem,6vw,6rem)] max-tablet:grid-cols-1 max-tablet:gap-y-10 max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <div className="reveal flex flex-col justify-center">
        <p className="eyebrow">Nous trouver</p>
        <h2 className="m-0 text-balance font-display text-[clamp(2.4rem,4vw,4.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.4rem,11vw,3.6rem)]">
          Le siège,
          <br />
          <em className="font-normal text-accent">à Kobayah.</em>
        </h2>
        <p className="mb-0 mt-6 max-w-[420px] text-[.88rem] leading-[1.7] text-[#686762]">{hqAddress}</p>
        <ClientNote>Carte approximative centrée sur le quartier de Kobayah — emplacement exact à valider avec le client.</ClientNote>
        <span className="mb-[.35rem] mt-6 block text-[.52rem] uppercase tracking-[.15em] text-accent">
          Horaires · Siège
        </span>
        <dl className="mt-3 border-t border-line">
          {hqHours.map(({ days, hours }) => (
            <div key={days} className="grid grid-cols-[130px_1fr] gap-4 border-b border-line py-[.5rem]">
              <dt className="self-center text-[.58rem] uppercase tracking-[.14em] text-[#77746e]">{days}</dt>
              <dd className="m-0 font-display text-[clamp(1.05rem,1.4vw,1.25rem)]">{hours}</dd>
            </div>
          ))}
        </dl>
        <a
          href={hqMap.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="button button-accent mt-6 w-fit max-tablet:w-full"
        >
          Itinéraire Google Maps <span>↗</span>
        </a>
        <div className="mt-8 grid grid-cols-2 gap-6 max-[430px]:grid-cols-1">
          <div>
            <span className="mb-[.35rem] block text-[.52rem] uppercase tracking-[.15em] text-accent">Présence</span>
            <p className="m-0 font-display text-[clamp(1.05rem,1.4vw,1.25rem)]">
              Guinée · Sénégal · Côte d’Ivoire
            </p>
          </div>
          <div>
            <span className="mb-[.35rem] block text-[.52rem] uppercase tracking-[.15em] text-accent">Réseaux</span>
            <ul className="m-0 flex list-none flex-col gap-[.35rem] p-0">
              {facebookPages.map(({ country, href }) => (
                <li key={country}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-[.6rem] font-display text-[clamp(1.05rem,1.4vw,1.25rem)] transition-colors duration-[220ms] hover:text-accent focus-visible:text-accent"
                  >
                    Facebook · {country} <span className="text-accent">↗</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ContactMapEmbed embedUrl={hqMap.embedUrl} />
    </section>
  );
}
