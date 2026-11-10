import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { placeholderPhotos } from "@/data/media";
import { asset } from "@/lib/asset";

import { Icon } from "../ui/Icon";

export function AboutCta() {
  const background = pageValue<string>("groupe", "contact.background");
  return (
    <section className="relative isolate overflow-hidden bg-ink-soft px-[clamp(1.3rem,7vw,8rem)] py-[clamp(6rem,10vw,10rem)] text-center text-ivory">
      <span
        aria-hidden="true"
        style={{
          backgroundImage: `url("${background.startsWith("/") ? asset(background as `/${string}`) : background}")`,
          backgroundPosition: placeholderPhotos.madina.position,
        }}
        className="absolute inset-0 z-[-2] scale-[1.035] bg-cover saturate-[.5]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(13,14,16,.86),rgba(13,14,16,.92))]"
      />
      <p className="eyebrow light justify-center before:hidden">{pageText("groupe", "AboutCta.1")}</p>
      <h2 className="mx-auto mb-[1.6rem] mt-0 max-w-[900px] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("groupe", "AboutCta.2")}<em className="block font-normal text-accent">{pageText("groupe", "AboutCta.3")}</em>
      </h2>
      <p className="mx-auto my-0 max-w-[540px] text-body leading-[1.75] text-[rgba(255,255,255,.62)]">{pageText("groupe", "AboutCta.4")}</p>
      <div className="mt-[2.2rem] flex flex-wrap justify-center gap-[.8rem] max-tablet:[&_.button]:w-full">
        <Link href={pageValue<string>("groupe", "AboutCta.5")} className="button button-accent">{pageText("groupe", "AboutCta.6") + " "}<span><Icon name={pageLinkIcon("groupe", "AboutCta.5")} /></span></Link>
      </div>
    </section>
  );
}
