import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { edvPhotos } from "@/data/espoir-de-vie";
import { contacts } from "@/data/site";
import { asset } from "@/lib/asset";
import { Icon } from "../ui/Icon";

const ctaPhoto = edvPhotos.kitsScolairesEleves;

export function EdvCta() {
  return (
    <section className="relative isolate flex min-h-[620px] flex-col items-center justify-center overflow-hidden bg-edv-ink px-6 py-28 text-center text-white max-tablet:min-h-[560px] max-tablet:px-[1.3rem] max-tablet:py-24">
      {/* Photo des enfants en fond, sous un voile sombre : le texte reste lisible. */}
      <span
        aria-hidden="true"
        style={{ backgroundImage: `url("${asset(ctaPhoto.src)}")` }}
        className="absolute inset-0 z-[-2] bg-cover bg-[center_38%] saturate-[.7]"
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[radial-gradient(circle_at_50%_115%,rgba(107,38,12,.8),transparent_45%),linear-gradient(180deg,rgba(24,14,9,.9),rgba(24,14,9,.82))]"
      />
      <p className="edv-kicker edv-kicker-light before:hidden">{pageText("espoir-de-vie", "EdvCta.1")}</p>
      <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.88] tracking-[-.055em]">{pageText("espoir-de-vie", "EdvCta.2")}<br />
        <em className="font-[inherit] text-edv-gold">{pageText("espoir-de-vie", "EdvCta.3")}</em>
      </h2>
      <p className="mb-[2.4rem] mt-8 max-w-[650px] text-body leading-[1.75] text-[rgba(255,255,255,.65)]">{pageText("espoir-de-vie", "EdvCta.4")}</p>
      <div className="edv-actions edv-actions-center">
        <Link href={pageValue<string>("espoir-de-vie", "EdvCta.link1")} className="edv-button edv-button-white">{pageText("espoir-de-vie", "EdvCta.5")}{" "}<span><Icon name={pageLinkIcon("espoir-de-vie", "EdvCta.link1")} /></span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="edv-button edv-button-outline"
        >{pageText("espoir-de-vie", "EdvCta.6")}</a>
      </div>
    </section>
  );
}
