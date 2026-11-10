import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { contacts } from "@/data/site";
import { Icon } from "../ui/Icon";

export function JecaCta() {
  return (
    <section className="flex min-h-[540px] flex-col items-center justify-center bg-jeca-blue px-6 py-24 text-center text-white max-tablet:min-h-[520px]">
      <p className="jeca-kicker light">{pageText("jeca", "JecaCta.1")}</p>
      <h2 className="mb-[2.3rem] mt-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("jeca", "JecaCta.2")}<br />
        <em className="text-jeca-yellow">{pageText("jeca", "JecaCta.3")}</em>
      </h2>
      <div className="jeca-actions">
        <Link href={pageValue<string>("jeca", "JecaCta.link1")} className="jeca-button jeca-button-white">{pageText("jeca", "JecaCta.4")}{" "}<span><Icon name={pageLinkIcon("jeca", "JecaCta.link1")} /></span>
        </Link>
        <a
          href={contacts.whatsappHq.href}
          target="_blank"
          rel="noreferrer"
          className="jeca-button jeca-button-outline"
        >{pageText("jeca", "JecaCta.5")}</a>
      </div>
    </section>
  );
}
