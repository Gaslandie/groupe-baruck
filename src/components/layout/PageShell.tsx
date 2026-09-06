import type { FooterVariant, RouteKey } from "@/data/site";

import { SiteAssistant } from "../assistant/SiteAssistant";
import { RevealObserver } from "../ui/RevealObserver";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader, type HeaderVariant } from "./SiteHeader";
import { SkipLink } from "./SkipLink";

type PageShellProps = {
  variant: HeaderVariant;
  current?: RouteKey;
  footer: FooterVariant;
  mainClassName?: string;
  children: React.ReactNode;
};

const pageStyles: Record<HeaderVariant, string> = {
  home: "bg-paper text-ink",
  about: "bg-paper text-ink",
  service: "bg-paper text-ink",
  jeca: "bg-jeca-paper text-jeca-ink [&_:focus-visible]:outline-jeca-red",
  edv: "bg-edv-paper text-edv-ink",
};

export function PageShell({ variant, current, footer, mainClassName, children }: PageShellProps) {
  return (
    <div id="top" className={pageStyles[variant]}>
      <SkipLink />
      <SiteHeader variant={variant} current={current} />
      <main id="main-content" className={mainClassName}>
        {children}
      </main>
      <SiteFooter variant={footer} />
      <SiteAssistant variant={variant} />
      <RevealObserver />
    </div>
  );
}
