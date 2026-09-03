import Link from "next/link";

const values = [
  { number: "01", title: "Vision", text: "Voir plus loin et ouvrir de nouvelles perspectives." },
  { number: "02", title: "Excellence", text: "Placer la qualité au centre de chaque initiative." },
  { number: "03", title: "Impact", text: "Créer une valeur durable pour la société." },
];

export function AboutIntro() {
  return (
    <section
      id="identite"
      className="grid grid-cols-[minmax(260px,.85fr)_1.15fr] gap-x-[clamp(3rem,8vw,9rem)] gap-y-[clamp(2.5rem,6vw,6rem)] px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-[1080px]:grid-cols-1"
    >
      <div className="reveal">
        <p className="eyebrow">Notre identité</p>
        <h2 className="m-[.4rem_0_0] text-balance font-display text-[clamp(2.7rem,5vw,5.6rem)] font-normal leading-[.92] tracking-[-.05em]">
          Entreprendre,
          <em className="block font-normal text-accent">et créer de l’impact.</em>
        </h2>
      </div>
      <div className="reveal max-w-[640px]">
        <p className="lead mb-6 mt-0">
          Le Groupe Baruck réunit des activités complémentaires dans l’hôtellerie, la restauration,
          l’agro-business, la mobilité, la communication digitale et les industries créatives.
        </p>
        <p className="mb-[1.4rem] mt-0 text-[.92rem] leading-[1.8] text-[#64645f]">
          La Guinée en constitue le point d’ancrage : c’est là que le groupe opère aujourd’hui ses services au
          quotidien, à travers Baruck Communication. Le Sénégal et la Côte d’Ivoire complètent une ambition
          régionale assumée — bâtir des projets solides, modernes et créateurs de valeur.
        </p>
        <p className="mb-[1.4rem] mt-0 text-[.92rem] leading-[1.8] text-[#64645f]">
          À cette activité économique répond une seconde dimension, indissociable du parcours de son dirigeant :
          l’engagement, porté par la JECA auprès des jeunes entrepreneurs et par l’ONG Espoir de Vie auprès des plus
          vulnérables.
        </p>
        <Link href="/#activites" className="text-link mt-[.8rem]">
          Explorer nos domaines <span>↘</span>
        </Link>
      </div>
      <div
        aria-label="Valeurs du Groupe Baruck"
        className="col-span-full grid grid-cols-3 border-t border-line max-tablet:grid-cols-1"
      >
        {values.map((value) => (
          <article
            key={value.number}
            className="reveal border-r border-line px-[clamp(1rem,2vw,2.2rem)] pt-[2.2rem] first:pl-0 last:border-r-0 max-tablet:border-r-0 max-tablet:border-t max-tablet:px-0 max-tablet:pt-[1.7rem] max-tablet:first:border-t-0 max-tablet:first:pt-8"
          >
            <span className="text-[.6rem] tracking-[.15em] text-accent">{value.number}</span>
            <h3 className="mb-[.7rem] mt-8 font-display text-[2rem] font-normal max-tablet:mb-[.6rem] max-tablet:mt-[1.2rem]">
              {value.title}
            </h3>
            <p className="m-0 max-w-[260px] text-[.84rem] leading-[1.65] text-[#6b6a65]">{value.text}</p>
          </article>
        ))}
      </div>
      <p className="content-disclaimer col-span-full m-0">
        Présentation éditoriale provisoire. L’histoire du groupe, sa date de création et ses chiffres clés seront
        intégrés dès leur validation.
      </p>
    </section>
  );
}
