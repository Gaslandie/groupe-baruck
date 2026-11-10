import { pageText, pageValue, pageLinkIcon } from "@/lib/page-content";
import Link from "next/link";

import { ambassadorPhotos } from "@/data/about";

import { asset } from "@/lib/asset";

import { Icon } from "../ui/Icon";
import { AboutSectionHead } from "./AboutSectionHead";

/**
 * Les ambassadeurs de la marque Baruck, ajoutés le 2026-09-19.
 *
 * Le client a fourni ces photos sans date : d'où une galerie sur la page du
 * Groupe plutôt qu'une actualité, qui aurait exigé une date que personne
 * n'avait. Les photos parlent d'elles-mêmes, le texte reste court.
 *
 * Fond sombre volontaire : la séance du studio est elle-même très sombre, et
 * la section s'intercale entre deux sections crème sans les répéter.
 *
 * Une seule flèche, sur le lien de bas de section (règle des flèches du site).
 */
export function AboutAmbassadors() {
  if (ambassadorPhotos.length === 0) return null;

  return (
    <section
      id="ambassadeurs"
      className="scroll-mt-[92px] bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow={pageText("groupe", "AboutAmbassadors.1")}
        title={pageText("groupe", "AboutAmbassadors.2")}
        emphasis={pageText("groupe", "AboutAmbassadors.3")}
        text={pageText("groupe", "AboutAmbassadors.4")}
        tone="light"
      />

      <ul className="reveal-stagger m-0 grid list-none grid-cols-4 gap-[.7rem] p-0 max-[1100px]:grid-cols-3 max-tablet:grid-cols-2 max-tablet:gap-[.45rem]">
        {ambassadorPhotos.map((photo) => (
          <li key={photo.src} className="reveal-media m-0">
            <img
              src={asset(photo.src as `/${string}`)}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              loading="lazy"
              decoding="async"
              className="aspect-[4/5] w-full bg-ink-soft object-cover"
            />
          </li>
        ))}
      </ul>

      <div className="reveal mt-[clamp(2rem,4vw,3rem)] flex flex-wrap items-center gap-[.8rem]">
        <Link href={pageValue<string>("groupe", "AboutAmbassadors.5")} className="button button-primary">{pageText("groupe", "AboutAmbassadors.6") + " "}<span><Icon name={pageLinkIcon("groupe", "AboutAmbassadors.5")} /></span>
        </Link>
        <Link href={pageValue<string>("groupe", "AboutAmbassadors.7")} className="button button-ghost">{pageText("groupe", "AboutAmbassadors.8")}</Link>
      </div>
    </section>
  );
}
