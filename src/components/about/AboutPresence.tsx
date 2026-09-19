import Link from "next/link";

import { presenceCountries } from "@/data/about";

import { AboutSectionHead } from "./AboutSectionHead";

/**
 * Les pays où le Groupe Baruck est présent.
 *
 * La carte d'Afrique de l'Ouest a été retirée le 2026-09-19 : elle ne pouvait
 * pas porter les cinq pays cités par le PDG (voir `presenceCountries`). Une
 * liste les met tous au même rang, sans photo de ville — nous n'en avons ni
 * pour la France ni pour le Cap-Vert, et trois pays illustrés sur cinq
 * reviendrait à en hiérarchiser deux.
 *
 * Les liens de pays ne portent pas de flèche : c'est la règle du site pour les
 * liens qui se répètent dans une liste.
 */
export function AboutPresence() {
  return (
    <section
      id="presence"
      className="bg-ink px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-16"
    >
      <AboutSectionHead
        eyebrow="Présence internationale"
        title="Cinq pays,"
        emphasis="une même ambition."
        text="La Guinée comme point d’ancrage, le Sénégal et la Côte d’Ivoire comme horizon de développement, la France et le Cap-Vert où le groupe est représenté."
        tone="light"
      />

      <ol className="reveal-stagger m-0 list-none p-0">
        {presenceCountries.map((country) => (
          <li
            key={country.name}
            className="reveal grid grid-cols-[minmax(0,.8fr)_minmax(0,1.7fr)] gap-[clamp(1.5rem,4vw,4.5rem)] border-t border-[rgba(255,255,255,.16)] py-[clamp(1.9rem,3.2vw,2.8rem)] last:border-b max-[1080px]:grid-cols-1 max-[1080px]:gap-[1rem]"
          >
            <div>
              <span className="text-micro tracking-[.15em] text-accent">{country.number}</span>
              <h3 className="m-[.7rem_0_0] font-display text-display-md font-normal leading-[1.05]">
                {country.name}
              </h3>
              <p className="mb-0 mt-[.7rem] text-label uppercase tracking-[.14em] text-[rgba(255,255,255,.45)]">
                {country.role}
              </p>
            </div>
            <div>
              <p className="m-0 max-w-[580px] text-body leading-[1.75] text-[rgba(255,255,255,.62)]">
                {country.text}
              </p>
              {country.links ? (
                <div className="mt-[1.5rem] flex flex-wrap gap-2">
                  {country.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="border border-[rgba(255,255,255,.24)] px-[.8rem] py-[.6rem] text-label uppercase tracking-[.1em] transition-[background,color,border-color] duration-[250ms] hover:border-accent hover:bg-accent hover:text-ivory focus-visible:border-accent focus-visible:bg-accent focus-visible:text-ivory"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
