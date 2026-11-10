import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { contacts } from "@/data/site";
import { asset } from "@/lib/asset";
import { Icon } from "../ui/Icon";

const ctaImage = pageValue<{ src: `/${string}`; width: number; height: number }>("home", "media.contact");

export function ContactCta() {
  return (
    <section className="relative isolate flex min-h-[720px] flex-col items-center justify-center overflow-hidden bg-ink-soft px-6 py-32 text-center text-ivory max-tablet:min-h-[650px] max-tablet:px-[1.3rem] max-tablet:py-20">
      <img
        src={asset(ctaImage.src)}
        alt=""
        width={ctaImage.width}
        height={ctaImage.height}
        loading="lazy"
        aria-hidden="true"
        className="absolute inset-0 z-[-2] h-full w-full scale-[1.035] object-cover object-[center_46%] saturate-[.55]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(13,14,16,.84),rgba(13,14,16,.9)),radial-gradient(circle_at_center,rgba(220,91,43,.13),transparent_56%)]"
      />
      <p className="eyebrow light before:hidden">{pageText("home", "ContactCta.1")}</p>
      <h2 className="relative z-[1] mx-auto mb-[1.6rem] mt-2 max-w-[1100px] font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("home", "ContactCta.2")}<br />{pageText("home", "ContactCta.3") + " "}<em className="font-normal text-accent">{pageText("home", "ContactCta.4")}</em>
      </h2>
      <p className="relative z-[1] mx-auto mb-[2.2rem] max-w-[560px] text-small leading-[1.7] text-[rgba(255,255,255,.62)]">{pageText("home", "ContactCta.5")}</p>
      <div className="relative z-[1] flex flex-wrap items-center justify-center gap-[.8rem]">
        <Link href={pageValue<string>("home", "ContactCta.6")} className="button button-accent">{pageText("home", "ContactCta.7") + " "}<span><Icon name={pageLinkIcon("home", "ContactCta.6")} /></span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="button button-ghost"
        >{pageText("home", "ContactCta.8")}</a>
      </div>
    </section>
  );
}
