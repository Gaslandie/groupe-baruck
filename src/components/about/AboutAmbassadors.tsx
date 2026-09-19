import Link from "next/link";

import { ambassadorPhotos } from "@/data/about";
import { routes } from "@/data/site";
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
        eyebrow="La marque en représentation"
        title="Les ambassadeurs"
        emphasis="de la marque Baruck."
        text="Vêtus de noir des pieds à la tête, les ambassadeurs portent l’image de la marque lors de ses sorties et de ses campagnes. Reçus par le PDG au siège de Baruck Communication, ils posent ensuite devant l’objectif du Studio Photo Baruck la Prospérité."
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
        <Link href={routes.brand} className="button button-primary">
          Découvrir la marque Baruck <span><Icon name="arrow-up-right" /></span>
        </Link>
        <Link href={routes.studio} className="button button-ghost">
          Le Studio Photo Baruck
        </Link>
      </div>
    </section>
  );
}
