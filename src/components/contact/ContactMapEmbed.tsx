"use client";

import { useEffect, useRef, useState } from "react";

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
        <p className="m-0 font-display text-display-sm leading-[1.1]">Kobayah, Conakry</p>
        <p id="map-privacy-info" className="mb-0 mt-3 max-w-[420px] text-small leading-[1.7] text-ink-soft">
          Cette carte est fournie par Google Maps. En l’autorisant, vous permettez à Google de
          recevoir des données techniques, dont votre adresse IP, et d’utiliser ses propres
          cookies ou traceurs. La carte reste bloquée tant que vous ne l’autorisez pas.
        </p>
        <a href="https://policies.google.com/privacy?hl=fr" target="_blank" rel="noreferrer" className="mt-3 text-caption underline underline-offset-4">Politique de confidentialité de Google ↗</a>
        <div className="mt-6 flex flex-wrap justify-center gap-3 max-tablet:w-full">
          <button ref={allowRef} type="button" aria-describedby="map-privacy-info" onClick={() => setChoice("allowed")} className="button button-outline max-tablet:w-full">Autoriser Google Maps</button>
          {choice === "pending" ? <button type="button" onClick={() => setChoice("declined")} className="button button-outline max-tablet:w-full">Ne pas afficher</button> : null}
        </div>
        <p role="status" className="mt-4 max-w-[420px] text-caption leading-[1.5] text-ink-soft">
          {choice === "declined" ? "La carte reste désactivée. L’adresse du siège est disponible à côté." : "Vous pouvez continuer sans afficher la carte. Ce choix vaut pour cette page uniquement."}
        </p>
      </div>
    );
  }

  return (
    <div ref={mapRef} tabIndex={-1} role="group" aria-label="Carte du siège, Kobayah, Conakry" className={frameClass}>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-paper px-4 py-3">
        <p className="m-0 text-caption">Google Maps est autorisé sur cette page.</p>
        <button type="button" onClick={() => setChoice("declined")} className="text-caption underline underline-offset-4">Retirer l’autorisation et masquer la carte</button>
      </div>
      <iframe title="Carte Google Maps du siège du Groupe Baruck, Kobayah, Conakry" src={embedUrl} referrerPolicy="no-referrer" allowFullScreen className="h-full min-h-[420px] w-full border-0 max-tablet:min-h-[320px]" />
    </div>
  );
}
