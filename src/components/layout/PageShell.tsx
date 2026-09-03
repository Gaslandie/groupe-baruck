import type { FooterVariant, RouteKey } from "@/data/site";

import { RevealObserver } from "../ui/RevealObserver";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderVariant } from "./SiteHeader";
import { SkipLink } from "./SkipLink";

type PageShellProps = {
  variant: HeaderVariant;
  current?: RouteKey;
  footer: FooterVariant;
  children: React.ReactNode;
};

const pageStyles: Record<HeaderVariant, string> = {
  home: "bg-paper text-ink",
  about: "bg-paper text-ink",
  service: "bg-paper text-ink",
  jeca: "bg-jeca-paper text-jeca-ink",
  edv: "bg-edv-paper text-edv-ink",
};

export function PageShell({ variant, current, footer, children }: PageShellProps) {
  return (
    <div id="top" className={pageStyles[variant]}>
      <SkipLink />
      <SiteHeader variant={variant} current={current} />
      <main id="main-content">{children}</main>
      <SiteFooter variant={footer} />
      <RevealObserver />
    </div>
  );
}
