import { pageText, pageValue } from "@/lib/page-content";
import Link from "next/link";

import { edvLogo, jecaLogo } from "@/data/media";

import { asset } from "@/lib/asset";

import { AboutSectionHead } from "./AboutSectionHead";
export function AboutCommitments() {
  return (
    <section className="bg-paper px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <AboutSectionHead
        eyebrow={pageText("groupe", "AboutCommitments.1")}
        title={pageText("groupe", "AboutCommitments.2")}
        emphasis={pageText("groupe", "AboutCommitments.3")}
        text={pageText("groupe", "AboutCommitments.4")}
        tone="dark"
      />
      <div className="reveal-stagger grid grid-cols-2 gap-[1.2rem] max-tablet:grid-cols-1">
        <Link href={pageValue<string>("groupe", "AboutCommitments.5")} className="group reveal flex flex-col border border-line bg-ivory transition-[transform,box-shadow] duration-[350ms] hover:translate-y-[-8px] hover:shadow-[0_24px_60px_rgba(23,21,16,.12)]">
          <div className="flex h-[300px] items-center justify-center overflow-hidden p-6 max-tablet:h-[240px]">
            <img src={asset(jecaLogo.src)} alt={pageText("groupe", "AboutCommitments.6")} width={jecaLogo.width} height={jecaLogo.height} loading="lazy" className="h-auto max-h-full w-auto max-w-full object-contain mix-blend-multiply" />
          </div>
          <div className="relative flex-1 border-t border-line p-[1.8rem]">
            <span className="text-micro uppercase tracking-[.15em] text-accent">{pageText("groupe", "AboutCommitments.7")}</span>
            <h3 className="mb-[.8rem] mt-[1.2rem] font-display text-title-lg font-normal">{pageText("groupe", "AboutCommitments.8")}</h3>
            <p className="m-0 max-w-[380px] text-small leading-[1.7] text-[#676661]">{pageText("groupe", "AboutCommitments.9")}</p>
          </div>
        </Link>
        <Link href={pageValue<string>("groupe", "AboutCommitments.10")} className="group reveal flex flex-col border border-line bg-ivory transition-[transform,box-shadow] duration-[350ms] hover:translate-y-[-8px] hover:shadow-[0_24px_60px_rgba(23,21,16,.12)]">
          <div className="flex h-[300px] items-center justify-center overflow-hidden bg-[#090909] p-4 max-tablet:h-[240px]">
            <img src={asset(edvLogo.src)} alt={pageText("groupe", "AboutCommitments.11")} width={edvLogo.width} height={edvLogo.height} loading="lazy" className="h-auto max-h-full w-auto max-w-full object-contain mix-blend-normal" />
          </div>
          <div className="relative flex-1 border-t border-line p-[1.8rem]">
            <span className="text-micro uppercase tracking-[.15em] text-accent">{pageText("groupe", "AboutCommitments.12")}</span>
            <h3 className="mb-[.8rem] mt-[1.2rem] font-display text-title-lg font-normal">{pageText("groupe", "AboutCommitments.13")}</h3>
            <p className="m-0 max-w-[380px] text-small leading-[1.7] text-[#676661]">{pageText("groupe", "AboutCommitments.14")}</p>
          </div>
        </Link>
      </div>
    </section>
  );
}
