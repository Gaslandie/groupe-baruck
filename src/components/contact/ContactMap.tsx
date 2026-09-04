import { facebookPages, hqHours, hqMap } from "@/data/contact";
import { hqAddress } from "@/data/site";
import { ClientNote } from "@/components/ui/ClientNote";

export function ContactMap() {
  return (
    <section aria-label="Plan d’accès" className="grid grid-cols-[38%_62%] bg-paper-deep max-tablet:grid-cols-1">
      <div className="reveal flex flex-col justify-center px-[clamp(2rem,6vw,7rem)] py-[clamp(4rem,7vw,7rem)] max-tablet:px-[1.3rem] max-tablet:py-16">
        <p className="eyebrow">Nous trouver</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Le siège,
          <br />
          <em className="font-normal text-accent">à Kobayah.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[420px] text-[.88rem] leading-[1.7] text-[#686762]">{hqAddress}</p>
        <ClientNote>Carte approximative centrée sur le quartier de Kobayah — emplacement exact à valider avec le client.</ClientNote>
        <span className="mb-[.35rem] mt-8 block text-[.52rem] uppercase tracking-[.15em] text-accent">
          Horaires · Siège
        </span>
        <dl className="mt-8 border-t border-line">
          {hqHours.map(({ days, hours }) => (
            <div key={days} className="grid grid-cols-[130px_1fr] gap-4 border-b border-line py-[.6rem]">
              <dt className="self-center text-[.58rem] uppercase tracking-[.14em] text-[#77746e]">{days}</dt>
              <dd className="m-0 font-display text-[clamp(1.05rem,1.4vw,1.25rem)]">{hours}</dd>
            </div>
          ))}
        </dl>
        <ClientNote>Horaires provisoires, à valider avec le client.</ClientNote>
        <a
          href={hqMap.directionsUrl}
          target="_blank"
          rel="noreferrer"
          className="button button-accent mt-8 w-fit max-tablet:w-full"
        >
          Itinéraire Google Maps <span>↗</span>
        </a>
        <div className="mt-10">
          <span className="mb-[.35rem] block text-[.52rem] uppercase tracking-[.15em] text-accent">Présence</span>
          <p className="m-0 font-display text-[clamp(1.05rem,1.4vw,1.25rem)]">Guinée · Sénégal · Côte d’Ivoire</p>
        </div>
        <div className="mt-6">
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
      <div className="h-full min-h-[460px] bg-[#cac5bb] max-tablet:min-h-[340px]">
        <iframe
          title="Carte Google Maps du siège du Groupe Baruck, Kobayah, Conakry"
          src={hqMap.embedUrl}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
          className="h-full min-h-[460px] w-full border-0 max-tablet:min-h-[340px]"
        />
      </div>
    </section>
  );
}
