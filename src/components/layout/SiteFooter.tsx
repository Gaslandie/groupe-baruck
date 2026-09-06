import Link from "next/link";

import { facebookPages } from "@/data/contact";
import { footers, hqAddress, routes, site, type FooterLink, type FooterVariant } from "@/data/site";

import { Brand } from "./Brand";

type SiteFooterProps = {
  variant: FooterVariant;
};

const footerVariantStyles: Record<FooterVariant, { footer: string; title: string }> = {
  home: { footer: "", title: "text-[#bd9660]" },
  about: { footer: "", title: "text-[#bd9660]" },
  service: { footer: "", title: "text-[#bd9660]" },
  jeca: { footer: "border-t-[6px] border-jeca-yellow", title: "text-jeca-yellow" },
  edv: { footer: "border-t-[5px] border-edv-gold", title: "text-edv-gold" },
};

function FooterAnchor({ link }: { link: FooterLink }) {
  const className = "w-fit text-[rgba(255,255,255,.7)] hover:text-accent";

  if (link.href.startsWith("/")) {
    return (
      <Link href={link.href} className={className}>
        {link.label}
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      target={link.external ? "_blank" : undefined}
      rel={link.external ? "noreferrer" : undefined}
      className={className}
    >
      {link.label}
    </a>
  );
}

export function SiteFooter({ variant }: SiteFooterProps) {
  const content = footers[variant];
  const styles = footerVariantStyles[variant];
  const year = new Date().getFullYear();

  return (
    <footer
      className={[
        "grid grid-cols-[1.8fr_1fr_1fr_1.25fr] gap-x-8 gap-y-20 bg-[#08090a] px-[clamp(1.3rem,6vw,7.5rem)] pb-6 pt-20 text-ivory max-tablet:grid-cols-2 max-tablet:gap-x-6 max-tablet:gap-y-12 max-tablet:px-[1.3rem] max-tablet:pb-6 max-tablet:pt-16",
        styles.footer,
      ].join(" ")}
    >
      <div className="max-tablet:col-span-full">
        <Brand className="[--brand-width:200px] [--brand-mobile-width:175px]" />
        <p className="mt-6 max-w-[380px] text-body leading-[1.75] text-[rgba(255,255,255,.6)]">
          {content.blurb}
        </p>
        <span
          className={[
            "mt-8 block font-sans text-caption font-normal uppercase tracking-[.16em]",
            styles.title,
          ].join(" ")}
        >
          Siège du Groupe Baruck · Guinée
        </span>
        <p className="mt-[.85rem] max-w-[380px] text-body leading-[1.75] text-[rgba(255,255,255,.6)]">
          {hqAddress}
        </p>
        <div className="mt-[.85rem] flex flex-col gap-[.85rem] font-display text-body">
          {facebookPages.map((page) => (
            <FooterAnchor
              key={page.href}
              link={{ label: `Facebook · ${page.country}`, href: page.href, external: true }}
            />
          ))}
        </div>
      </div>

      {content.columns.map((column) => (
        <div key={column.title} className="flex flex-col gap-[.85rem] font-display text-body">
          <span
            className={[
              "mb-[.6rem] font-sans text-caption font-normal uppercase tracking-[.16em]",
              styles.title,
            ].join(" ")}
          >
            {column.title}
          </span>
          {column.links.map((link) => (
            <FooterAnchor key={link.href + link.label} link={link} />
          ))}
        </div>
      ))}

      <div className="col-span-full flex flex-wrap justify-between gap-x-6 gap-y-[.6rem] border-t border-[rgba(255,255,255,.12)] pt-[1.6rem] text-caption uppercase tracking-[.1em] text-[rgba(255,255,255,.6)] max-tablet:flex-col">
        <p>© {year} Groupe Baruck. Tous droits réservés.</p>
        <span>Site web conçu par {site.designer}</span>
        <Link href={routes.legal} className="hover:text-accent">
          Mentions légales
        </Link>
        <a href={content.backToTop}>Retour en haut ↑</a>
      </div>
    </footer>
  );
}
