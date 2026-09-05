import Link from "next/link";

import { baruckCommunication } from "@/data/about";
import { ClientNote } from "@/components/ui/ClientNote";

import { AboutSectionHead } from "./AboutSectionHead";

export function AboutCommunication() {
  const { eyebrow, description, presence, servicesLabel, services } = baruckCommunication;

  return (
    <section
      id="baruck-communication"
      className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]"
    >
      <AboutSectionHead
        eyebrow={eyebrow}
        title="Baruck"
        emphasis="Communication."
        text={description}
        tone="dark"
      />

      <div className="reveal-stagger grid grid-cols-[minmax(240px,.7fr)_1.3fr] gap-[clamp(2rem,4vw,3.5rem)] max-[1080px]:grid-cols-1">
        <div className="reveal">
          <dl className="m-0 border-t border-line">
            <div className="grid grid-cols-[130px_1fr] gap-4 border-b border-line py-[1.05rem] max-tablet:grid-cols-1 max-tablet:gap-[.3rem]">
              <dt className="self-center text-[.56rem] uppercase tracking-[.14em] text-accent">Présence</dt>
              <dd className="m-0 font-display text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.2]">{presence}</dd>
            </div>
            <div className="grid grid-cols-[130px_1fr] gap-4 border-b border-line py-[1.05rem] max-tablet:grid-cols-1 max-tablet:gap-[.3rem]">
              <dt className="self-center text-[.56rem] uppercase tracking-[.14em] text-accent">
                Services présentés
              </dt>
              <dd className="m-0 font-display text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.2]">
                {servicesLabel}
              </dd>
            </div>
          </dl>
          <ClientNote>Statut juridique et date de création à confirmer avec le client.</ClientNote>
        </div>

        <div className="grid grid-cols-2 gap-[1.1rem] max-tablet:grid-cols-1">
          {services.map((service) => (
            <Link
              key={service.href}
              href={service.href}
              className="reveal flex flex-col border border-line bg-ivory px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_22px_55px_rgba(23,21,16,.12)]"
            >
              <h3 className="mb-[.9rem] mt-0 font-display text-[clamp(1.35rem,1.8vw,1.7rem)] font-normal leading-[1.15]">
                {service.title}
              </h3>
              <p className="m-0 text-[.84rem] leading-[1.7] text-[#65645f]">{service.text}</p>
              <span className="mb-0 mt-auto pt-[1.6rem] text-[.6rem] uppercase tracking-[.12em] text-accent">
                {service.cta} <i aria-hidden="true" className="not-italic">↗</i>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
