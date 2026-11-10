"use client";

import { pageText } from "@/lib/page-content";


import { useEffect, useRef, useState } from "react";
import { Icon } from "../ui/Icon";

type ContactMapEmbedProps = { embedUrl: string };
const frameClass = "min-h-[420px] border border-line bg-[#cac5bb] max-tablet:min-h-[320px]";

export function ContactMapEmbed({ embedUrl }: ContactMapEmbedProps) {
  const [choice, setChoice] = useState<"pending" | "allowed" | "declined">("pending");
  const mapRef = useRef<HTMLDivElement>(null);
  const allowRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (choice === "allowed") mapRef.current?.focus({ preventScroll: true });
    else if (choice === "declined") allowRef.current?.focus({ preventScroll: true });
  }, [choice]);

  if (choice !== "allowed") {
    return (
      <div className={`${frameClass} flex flex-col items-center justify-center px-[1.3rem] py-12 text-center max-tablet:py-14`}>
        <p className="m-0 font-display text-display-sm leading-[1.1]">{pageText("contact", "copy.ContactMapEmbed.1")}</p>
        <p id="map-privacy-info" className="mb-0 mt-3 max-w-[420px] text-small leading-[1.7] text-ink-soft">{pageText("contact", "copy.ContactMapEmbed.2")}</p>
        <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noreferrer" className="mt-3 text-caption underline underline-offset-4">{(pageText("contact", "copy.ContactMapEmbed.3") + " ")}<Icon name="arrow-up-right" /></a>
        <div className="mt-6 flex flex-wrap justify-center gap-3 max-tablet:w-full">
          <button ref={allowRef} type="button" aria-describedby="map-privacy-info" onClick={() => setChoice("allowed")} className="button button-outline max-tablet:w-full">{pageText("contact", "copy.ContactMapEmbed.4")}</button>
          {choice === "pending" ? <button type="button" onClick={() => setChoice("declined")} className="button button-outline max-tablet:w-full">{pageText("contact", "copy.ContactMapEmbed.5")}</button> : null}
        </div>
        <p role="status" className="mt-4 max-w-[420px] text-caption leading-[1.5] text-ink-soft">
          {choice === "declined" ? pageText("contact", "copy.ContactMapEmbed.6") : pageText("contact", "copy.ContactMapEmbed.7")}
        </p>
      </div>
    );
  }

  return (
    <div ref={mapRef} tabIndex={-1} role="group" aria-label={pageText("contact", "copy.ContactMapEmbed.8")} className={frameClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper px-4 py-3">
        <p className="m-0 text-caption">{pageText("contact", "copy.ContactMapEmbed.9")}</p>
        <button type="button" onClick={() => setChoice("declined")} className="text-caption underline underline-offset-4">{pageText("contact", "copy.ContactMapEmbed.10")}</button>
      </div>
      <iframe title={pageText("contact", "copy.ContactMapEmbed.11")} src={embedUrl} referrerPolicy="no-referrer" allowFullScreen className="h-full min-h-[420px] w-full border-0 max-tablet:min-h-[320px]" />
    </div>
  );
}
