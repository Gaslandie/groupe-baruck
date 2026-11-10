import { pageValue } from "@/lib/page-content";
import { pageText } from "@/lib/page-content";
const pillars = pageValue<{title:string;text:string}[]>("jeca", "data.pillars");

export function JecaVision() {
  return (
    <section
      id="vision"
      className="grid scroll-mt-[74px] grid-cols-[minmax(0,1.05fr)_minmax(320px,.7fr)] gap-x-24 gap-y-12 bg-jeca-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-[1080px]:grid-cols-[1fr_.8fr] max-[1080px]:gap-12 max-tablet:block max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div>
        <p className="jeca-kicker">{pageText("jeca", "JecaVision.7")}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("jeca", "JecaVision.8")}{" "}<em className="text-jeca-red">{pageText("jeca", "JecaVision.9")}</em> {pageText("jeca", "JecaVision.10")}</h2>
      </div>
      <div className="max-w-[560px] self-end max-tablet:mt-[2.3rem]">
        <p className="mb-6 mt-0 font-display text-display-xs font-normal leading-[1.5] text-jeca-blue">{pageText("jeca", "JecaVision.11")}</p>
        <p className="m-0 text-body leading-[1.8] text-jeca-muted">{pageText("jeca", "JecaVision.12")}</p>
      </div>
      <div className="col-span-full mt-8 grid grid-cols-3 border-t border-jeca-line max-tablet:mt-12 max-tablet:grid-cols-1">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="min-h-[230px] border-r border-jeca-line px-[clamp(1rem,2.5vw,2.8rem)] pb-4 pt-8 first:pl-0 last:border-r-0 max-tablet:min-h-0 max-tablet:border-b max-tablet:border-r-0 max-tablet:px-0 max-tablet:pb-[2.3rem] max-tablet:pt-[1.8rem] max-tablet:first:pt-[1.8rem] max-tablet:last:border-b-0"
          >
            <h3 className="mb-[.8rem] mt-[2.8rem] font-display text-display-md font-normal leading-none text-jeca-blue max-tablet:mt-[1.8rem]">
              {pillar.title}
            </h3>
            <p className="m-0 max-w-[330px] text-small leading-[1.7] text-jeca-muted">{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
