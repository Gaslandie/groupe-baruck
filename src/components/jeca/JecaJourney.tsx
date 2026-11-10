import { pageText } from "@/lib/page-content";
export function JecaJourney() {
  return (
    <section className="grid grid-cols-[1.1fr_.9fr] bg-jeca-blue text-white max-tablet:block">
      <div className="px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,8vw,8rem)] max-[1080px]:px-12 max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="jeca-kicker light">{pageText("jeca", "JecaJourney.1")}</p>
        <h2 className="m-0 text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">{pageText("jeca", "JecaJourney.2")}<br />
          <em className="text-jeca-yellow">{pageText("jeca", "JecaJourney.3")}</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[720px] text-body leading-[1.8] text-[rgba(255,255,255,.72)]">{pageText("jeca", "JecaJourney.4")}</p>
        <p className="mb-0 mt-8 max-w-[720px] text-body leading-[1.8] text-[rgba(255,255,255,.72)]">{pageText("jeca", "JecaJourney.5")}</p>
      </div>
      <div className="grid grid-rows-2 bg-white text-jeca-ink">
        <article className="relative flex min-h-[300px] flex-col justify-center overflow-hidden border-b border-jeca-line p-[clamp(2rem,5vw,5rem)] max-tablet:min-h-[260px] max-tablet:px-[1.3rem] max-tablet:py-10">
          <small className="relative text-micro font-extrabold uppercase tracking-[.15em] text-jeca-red">{pageText("jeca", "JecaJourney.6")}</small>
          <h3 className="relative mb-[.8rem] mt-4 font-display text-display-lg font-normal leading-[.92] tracking-[-.05em] text-jeca-blue">{pageText("jeca", "JecaJourney.7")}</h3>
          <p className="relative m-0 max-w-[400px] text-small leading-[1.7] text-jeca-muted">{pageText("jeca", "JecaJourney.8")}</p>
        </article>
        <article className="relative flex min-h-[300px] flex-col justify-center overflow-hidden p-[clamp(2rem,5vw,5rem)] max-tablet:min-h-[260px] max-tablet:px-[1.3rem] max-tablet:py-10">
          <small className="relative text-micro font-extrabold uppercase tracking-[.15em] text-jeca-red">{pageText("jeca", "JecaJourney.9")}</small>
          <h3 className="relative mb-[.8rem] mt-4 font-display text-display-lg font-normal leading-[.92] tracking-[-.05em] text-jeca-blue">{pageText("jeca", "JecaJourney.10")}</h3>
          <p className="relative m-0 max-w-[400px] text-small leading-[1.7] text-jeca-muted">{pageText("jeca", "JecaJourney.11")}</p>
        </article>
      </div>
    </section>
  );
}
