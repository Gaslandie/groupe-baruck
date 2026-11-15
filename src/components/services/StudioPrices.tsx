import { pageText } from "@/lib/page-content";

import { studioPriceGroups } from "@/data/services";
import { translate as t } from "@/lib/language";
import { Icon } from "@/components/ui/Icon";

export function StudioPrices() {
  return (
    <section
      id="tarifs"
      className="scroll-mt-[100px] bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory"
    >
      <div className="mb-14 flex items-end justify-between gap-12 max-tablet:block">
        <div>
          <p className="eyebrow light">{pageText("studio-photo", "copy.StudioPrices.1")}</p>
          <h2 className="m-0 font-display text-display-xl font-normal leading-[.9] tracking-[-.045em]">{pageText("studio-photo", "copy.StudioPrices.2")}<br />{pageText("studio-photo", "copy.StudioPrices.3")}</h2>
        </div>
        <p className="my-[1em] max-w-[430px] leading-[1.7] text-[rgba(255,255,255,.6)] max-tablet:mt-6">{pageText("studio-photo", "copy.StudioPrices.4")}</p>
      </div>
      <div className="grid grid-cols-3 border-l border-t border-[rgba(255,255,255,.16)] max-[1080px]:grid-cols-2 max-tablet:grid-cols-1">
        {studioPriceGroups.map((group) => (
          <article
            key={group.number}
            className="border-b border-r border-[rgba(255,255,255,.16)] px-[1.8rem] py-8"
          >
            <h3 className="mb-[1.8rem] mt-0 flex items-baseline gap-[.75rem] font-display text-title font-normal leading-[1.1]">
              <span className="font-sans text-micro font-bold leading-none tracking-[.14em] text-accent">
                {group.number}
              </span>
              {group.title}
            </h3>
            <ul className="m-0 grid list-none gap-[1.1rem] p-0">
              {group.items.map((item) => (
                <li
                  key={item.label}
                  className="grid grid-cols-[1fr_auto] items-baseline gap-x-[1.2rem] gap-y-[.35rem] border-b border-[rgba(255,255,255,.1)] pb-[1.1rem] last:border-b-0 last:pb-0"
                >
                  <strong className="text-small font-medium leading-[1.4] text-[rgba(255,255,255,.92)]">
                    {item.label}
                  </strong>
                  <b className="whitespace-nowrap font-display text-body font-normal leading-none text-accent">
                    {item.price}
                  </b>
                  {item.note ? (
                    <small className="col-span-full text-caption leading-[1.5] text-[rgba(255,255,255,.48)]">
                      {item.note}
                    </small>
                  ) : null}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>
      <p className="mb-0 mt-[2.2rem] max-w-[620px] text-caption leading-[1.7] text-[rgba(255,255,255,.5)]">{pageText("studio-photo", "copy.StudioPrices.5")}</p>
      <a href="#reservation" className="button button-accent mt-6">
        {t("Préparer ma demande")}<span><Icon name="arrow-down" /></span>
      </a>
    </section>
  );
}
