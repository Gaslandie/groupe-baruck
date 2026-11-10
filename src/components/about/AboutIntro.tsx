import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";
import { Icon } from "../ui/Icon";

const values = pageValue<{ title: string; text: string }[]>("groupe", "AboutIntro.list").map((item, index) => ({ ...item, number: String(index + 1).padStart(2, "0") }));

export function AboutIntro() {
  return (
    <section
      id="identite"
      className="reveal-stagger grid grid-cols-[minmax(260px,.85fr)_1.15fr] gap-x-[clamp(3rem,8vw,9rem)] gap-y-[clamp(2.5rem,6vw,6rem)] px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-[1080px]:grid-cols-1"
    >
      <div className="reveal">
        <p className="eyebrow">{pageText("groupe", "AboutIntro.1")}</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("groupe", "AboutIntro.2")}<em className="block font-normal text-accent">{pageText("groupe", "AboutIntro.3")}</em>
        </h2>
      </div>
      <div className="reveal max-w-[640px]">
        <p className="lead mb-6 mt-0">{pageText("groupe", "AboutIntro.4")}</p>
        <p className="mb-[1.4rem] mt-0 text-body leading-[1.8] text-[#64645f]">{pageText("groupe", "AboutIntro.5")}</p>
        <p className="mb-[1.4rem] mt-0 text-body leading-[1.8] text-[#64645f]">{pageText("groupe", "AboutIntro.6")}</p>
        <Link href={pageValue<string>("groupe", "AboutIntro.7")} className="text-link mt-[.8rem]">{pageText("groupe", "AboutIntro.8") + " "}<span><Icon name={pageLinkIcon("groupe", "AboutIntro.7")} /></span>
        </Link>
      </div>
      <div
        aria-label={pageText("groupe", "AboutIntro.9")}
        className="reveal-stagger col-span-full grid grid-cols-3 border-t border-line max-tablet:grid-cols-1"
      >
        {values.map((value) => (
          <article
            key={value.number}
            className="reveal border-r border-line px-[clamp(1rem,2vw,2.2rem)] pt-[2.2rem] first:pl-0 last:border-r-0 max-tablet:border-r-0 max-tablet:border-t max-tablet:px-0 max-tablet:pt-[1.7rem] max-tablet:first:border-t-0 max-tablet:first:pt-8"
          >
            <span className="text-label tracking-[.15em] text-accent">{value.number}</span>
            <h3 className="mb-[.7rem] mt-8 font-display text-title-lg font-normal max-tablet:mb-[.6rem] max-tablet:mt-[1.2rem]">
              {value.title}
            </h3>
            <p className="m-0 max-w-[260px] text-small leading-[1.65] text-[#6b6a65]">{value.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
