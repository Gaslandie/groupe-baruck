import type { ReactNode } from "react";
import Link from "next/link";

import { milestones } from "@/data/about";
import { ClientNote } from "@/components/ui/ClientNote";

import { AboutSectionHead } from "./AboutSectionHead";

const linkStyles =
  "group grid grid-cols-[1fr_auto] items-start gap-4 transition-[transform,color] duration-[250ms] hover:translate-x-[.4rem] focus-visible:translate-x-[.4rem]";

function MilestoneLink({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className={linkStyles}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={linkStyles}>
      {children}
    </Link>
  );
}

export function AboutMilestones() {
  return (
    <section
      id="reperes"
      className="bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory"
    >
      <AboutSectionHead
        eyebrow="Repères"
        title="Des initiatives,"
        emphasis="dans le temps."
        text="Cette chronologie rassemble les dates déjà documentées pour le dirigeant, la JECA et Espoir de Vie. L’histoire propre du Groupe sera complétée après validation."
        tone="light"
      />

      <ol className="reveal-stagger m-0 list-none p-0">
        {milestones.map((milestone) => (
          <li
            key={milestone.title}
            className="reveal relative grid grid-cols-[130px_1fr] gap-8 border-l border-[rgba(255,255,255,.18)] pb-[2.6rem] pl-[2.2rem] before:absolute before:left-[-5px] before:top-[.45rem] before:h-[9px] before:w-[9px] before:rounded-full before:bg-accent before:content-[''] last:pb-0 max-[1080px]:grid-cols-[110px_1fr] max-[1080px]:gap-5 max-tablet:grid-cols-1 max-tablet:gap-[.6rem] max-tablet:pb-[2.2rem] max-tablet:pl-6"
          >
            <time
              dateTime={milestone.dateTime}
              className="font-display text-display-md leading-none text-accent"
            >
              {milestone.year}
            </time>
            <MilestoneLink href={milestone.href}>
              <span>
                <h3 className="m-0 font-display text-display-sm font-normal leading-[1.15]">
                  {milestone.title}
                </h3>
                <p className="mb-0 mt-[.7rem] max-w-[540px] text-small leading-[1.7] text-[rgba(255,255,255,.66)]">
                  {milestone.text}
                </p>
              </span>
              <i
                aria-hidden="true"
                className="mt-[.35rem] text-small not-italic text-accent transition-transform duration-[250ms] group-hover:translate-x-1 group-hover:translate-y-[-2px]"
              >
                ↗
              </i>
            </MilestoneLink>
          </li>
        ))}
      </ol>

      <div className="reveal mt-[clamp(3rem,5vw,4.5rem)] max-w-[540px] border-t border-[rgba(255,255,255,.18)] pt-[1.4rem]">
        <p className="m-0 text-label uppercase tracking-[.15em] text-[rgba(255,255,255,.75)]">
          Création du Groupe Baruck
        </p>
        <ClientNote>Date à confirmer avec le client.</ClientNote>
      </div>
    </section>
  );
}
