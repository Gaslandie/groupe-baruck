import {
  westAfricaContextCountries,
  westAfricaMapViewBox,
  westAfricaPresenceCountries,
} from "@/data/west-africa-map";

/** Formulations déjà publiées dans la grille des trois pays, dans le même ordre. */
const presenceLegend = [
  { number: "01", country: "Guinée", role: "Point d’ancrage" },
  { number: "02", country: "Sénégal", role: "Présence régionale" },
  { number: "03", country: "Côte d’Ivoire", role: "Présence régionale" },
] as const;

const naturalEarthUrl = "https://www.naturalearthdata.com/";

export function WestAfricaPresenceMap() {
  return (
    <div className="reveal mb-[clamp(3rem,5vw,5rem)] grid grid-cols-[minmax(0,1.2fr)_minmax(280px,.8fr)] items-center gap-[clamp(2rem,5vw,5rem)] max-[1080px]:grid-cols-1">
      <div className="min-w-0">
        <svg
          viewBox={westAfricaMapViewBox}
          role="img"
          aria-labelledby="presence-map-title presence-map-description"
          className="block h-auto w-full"
        >
          <title id="presence-map-title">Présence du Groupe Baruck en Afrique de l’Ouest</title>
          <desc id="presence-map-description">
            La Guinée, le Sénégal et la Côte d’Ivoire sont mises en évidence.
          </desc>
          <g aria-hidden="true">
            {westAfricaContextCountries.map((country) => (
              <path
                key={country.code}
                data-country={country.code}
                d={country.d}
                vectorEffect="non-scaling-stroke"
                className="fill-[rgba(255,255,255,.06)] stroke-[rgba(255,255,255,.28)] stroke-1 [stroke-linejoin:round]"
              />
            ))}
            {westAfricaPresenceCountries.map((country) => (
              <path
                key={country.code}
                data-country={country.code}
                data-presence=""
                d={country.d}
                vectorEffect="non-scaling-stroke"
                className="fill-accent stroke-ivory stroke-[1.5] [stroke-linejoin:round]"
              />
            ))}
          </g>
        </svg>
        <p className="mb-0 mt-3 text-[.52rem] uppercase tracking-[.14em] text-[rgba(255,255,255,.38)]">
          Fond cartographique :{" "}
          <a
            href={naturalEarthUrl}
            target="_blank"
            rel="noreferrer"
            className="transition-colors duration-[220ms] hover:text-[rgba(255,255,255,.85)]"
          >
            Natural Earth
          </a>
          .
        </p>
      </div>
      <div>
        <p className="eyebrow light">Implantation régionale</p>
        <h3 className="m-0 font-display text-[clamp(1.8rem,2.6vw,2.4rem)] font-normal leading-[1.05] tracking-[-.035em]">
          Trois pays mis en lumière.
        </h3>
        <ol className="m-0 mt-8 list-none border-t border-[rgba(255,255,255,.16)] p-0">
          {presenceLegend.map((item) => (
            <li
              key={item.country}
              className="grid grid-cols-[auto_auto_1fr] items-baseline gap-x-4 border-b border-[rgba(255,255,255,.16)] py-[1.05rem]"
            >
              <span className="text-[.56rem] tracking-[.15em] text-accent">{item.number}</span>
              <span className="flex items-baseline gap-3 font-display text-[clamp(1.15rem,1.6vw,1.45rem)] leading-[1.2]">
                <i aria-hidden="true" className="inline-block h-[10px] w-[10px] shrink-0 self-center bg-accent" />
                {item.country}
              </span>
              <span className="text-right text-[.6rem] uppercase tracking-[.14em] text-[rgba(255,255,255,.6)]">
                {item.role}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
