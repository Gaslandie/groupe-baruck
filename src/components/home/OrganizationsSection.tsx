import Link from "next/link";

import { brandLogo, edvLogo, jecaLogo, type ImageAsset } from "@/data/media";
import { routes } from "@/data/site";
import { asset } from "@/lib/asset";

import { SectionHead } from "../ui/SectionHead";

type Organization = {
  id?: string;
  href: string;
  ariaLabel: string;
  image: ImageAsset;
  imageAlt: string;
  kicker: string;
  title: string;
  text: string;
  darkLogo?: boolean;
};

const organizations: Organization[] = [
  {
    href: routes.group,
    ariaLabel: "Découvrir le Groupe Baruck",
    image: brandLogo,
    imageAlt: "Logo Baruck Communication",
    kicker: "01 — Pôle économique",
    title: "Groupe Baruck",
    text: "Le pôle économique et entrepreneurial regroupant les différentes activités du groupe.",
  },
  {
    id: "jeca",
    href: routes.jeca,
    ariaLabel: "En savoir plus sur la JECA",
    image: jecaLogo,
    imageAlt: "Logo JECA, Jeunes Entrepreneurs Chrétiens Africains",
    kicker: "02 — Entrepreneuriat",
    title: "JECA",
    text: "Une initiative consacrée à l’entrepreneuriat chrétien africain et à la mise en réseau des jeunes entrepreneurs.",
  },
  {
    id: "espoir-de-vie",
    href: routes.edv,
    ariaLabel: "En savoir plus sur Espoir de Vie",
    image: edvLogo,
    imageAlt: "Logo de la Fondation Espoir de Vie",
    kicker: "03 — Engagement social",
    title: "Espoir de Vie",
    text: "Protéger les enfants, accompagner les familles et apporter une aide concrète aux personnes vulnérables.",
    darkLogo: true,
  },
];

export function OrganizationsSection() {
  return (
    <section className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20">
      <SectionHead
        eyebrow="Entités & engagements"
        title={
          <>
            Entrepreneuriat
            <br />
            et impact social
          </>
        }
        text="Trois expressions d’une même volonté : entreprendre, fédérer et contribuer positivement à la société."
        tone="dark"
      />
      <div className="grid grid-cols-3 gap-5 max-desktop:grid-cols-2 max-tablet:grid-cols-1">
        {organizations.map((organization) => (
          <Link
            key={organization.title}
            id={organization.id}
            href={organization.href}
            aria-label={organization.ariaLabel}
            className="group reveal flex min-h-[580px] flex-col border border-line bg-ivory transition-[transform,box-shadow] duration-[350ms] hover:translate-y-[-8px] hover:shadow-[0_24px_60px_rgba(23,21,16,.12)] max-desktop:last:col-span-full max-tablet:min-h-[530px] max-tablet:last:col-span-1"
          >
            <div
              className={[
                "flex h-[320px] items-center justify-center overflow-hidden",
                organization.darkLogo ? "bg-[#090909] p-4" : "p-6",
              ].join(" ")}
            >
              <img
                src={asset(organization.image.src)}
                alt={organization.imageAlt}
                width={organization.image.width}
                height={organization.image.height}
                loading="lazy"
                className={[
                  "h-auto max-h-full w-auto max-w-full object-contain",
                  organization.darkLogo ? "mix-blend-normal" : "mix-blend-multiply",
                ].join(" ")}
              />
            </div>
            <div className="relative flex-1 border-t border-line p-[1.8rem]">
              <span className="text-[.54rem] uppercase tracking-[.14em] text-accent">{organization.kicker}</span>
              <h3 className="mb-[.8rem] mt-5 font-display text-[2.3rem] font-normal">{organization.title}</h3>
              <p className="max-w-[340px] text-[.82rem] leading-[1.65] text-[#676661]">{organization.text}</p>
              <i
                aria-hidden="true"
                className="absolute bottom-[1.6rem] right-[1.6rem] grid h-[42px] w-[42px] place-items-center border border-line not-italic transition-[background,color] duration-[250ms] group-hover:bg-ink group-hover:text-ivory group-focus-visible:bg-ink group-focus-visible:text-ivory"
              >
                ↗
              </i>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
