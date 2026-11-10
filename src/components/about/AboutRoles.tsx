import { pageText, pageValue } from "@/lib/page-content";
import Link from "next/link";

import { AboutSectionHead } from "./AboutSectionHead";
const sharedCardStyles =
  "reveal flex flex-col border px-[1.7rem] pb-[1.7rem] pt-[1.8rem] transition-[transform,box-shadow] duration-[320ms] hover:translate-y-[-6px] hover:shadow-[0_22px_55px_rgba(23,21,16,.12)]";

export function AboutRoles() {
  return (
    <section id="fonctions" className="bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <AboutSectionHead
        eyebrow={pageText("groupe", "AboutRoles.1")}
        title={pageText("groupe", "AboutRoles.2")}
        emphasis={pageText("groupe", "AboutRoles.3")}
        text={pageText("groupe", "AboutRoles.4")}
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-4 gap-[1.1rem] max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
        <Link href={pageValue<string>("groupe", "AboutRoles.5")} className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">01</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">{pageText("groupe", "AboutRoles.6")}</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">{pageText("groupe", "AboutRoles.7")}</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">{pageText("groupe", "AboutRoles.8")}</i>
        </Link>
        <Link href={pageValue<string>("groupe", "AboutRoles.9")} className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">02</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">{pageText("groupe", "AboutRoles.10")}</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">{pageText("groupe", "AboutRoles.11")}</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">{pageText("groupe", "AboutRoles.12")}</i>
        </Link>
        <Link href={pageValue<string>("groupe", "AboutRoles.13")} className={`${sharedCardStyles} border-line bg-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">03</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">{pageText("groupe", "AboutRoles.14")}</h3>
          <p className="m-0 text-small leading-[1.7] text-[#65645f]">{pageText("groupe", "AboutRoles.15")}</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">{pageText("groupe", "AboutRoles.16")}</i>
        </Link>
        <a href={pageValue<string>("groupe", "AboutRoles.17")} className={`${sharedCardStyles} border-ink bg-ink text-ivory`}>
          <span className="text-micro tracking-[.15em] text-accent">04</span>
          <h3 className="mb-[.9rem] mt-[1.6rem] font-display text-display-sm font-normal leading-[1.15]">{pageText("groupe", "AboutRoles.18")}</h3>
          <p className="m-0 text-small leading-[1.7] text-[rgba(255,255,255,.68)]">{pageText("groupe", "AboutRoles.19")}</p>
          <i aria-hidden="true" className="mb-0 mt-auto pt-[1.6rem] text-label not-italic uppercase tracking-[.12em] text-accent">{pageText("groupe", "AboutRoles.20")}</i>
        </a>
      </div>
    </section>
  );
}
