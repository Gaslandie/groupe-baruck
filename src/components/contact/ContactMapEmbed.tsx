"use client";

import { useEffect, useRef, useState } from "react";

type ContactMapEmbedProps = {
  embedUrl: string;
};

const frameClass = "min-h-[420px] border border-line bg-[#cac5bb] max-tablet:min-h-[320px]";

export function ContactMapEmbed({ embedUrl }: ContactMapEmbedProps) {
  const [mapShown, setMapShown] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mapShown) mapRef.current?.focus({ preventScroll: true });
  }, [mapShown]);

  if (!mapShown) {
    return (
      <div
        className={`${frameClass} flex flex-col items-center justify-center px-[1.3rem] py-12 text-center max-tablet:py-14`}
      >
        <p className="m-0 font-display text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.1]">Kobayah, Conakry</p>
        <p className="mb-0 mt-3 max-w-[320px] text-[.88rem] leading-[1.7] text-ink-soft">
          Affichez la carte pour situer le quartier.
        </p>
        <button
          type="button"
          onClick={() => setMapShown(true)}
          className="button button-accent mt-6 w-fit max-tablet:w-full"
        >
          Afficher la carte
        </button>
        <small className="mt-[.9rem] block max-w-[320px] text-[.6rem] italic leading-[1.5] text-ink-soft/70">
          La carte est fournie par Google et se charge lorsque vous cliquez.
        </small>
      </div>
    );
  }

  return (
    <div
      ref={mapRef}
      tabIndex={-1}
      role="group"
      aria-label="Carte du siège, Kobayah, Conakry"
      className={frameClass}
    >
      <iframe
        title="Carte Google Maps du siège du Groupe Baruck, Kobayah, Conakry"
        src={embedUrl}
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
        className="h-full min-h-[420px] w-full border-0 max-tablet:min-h-[320px]"
      />
    </div>
  );
}
