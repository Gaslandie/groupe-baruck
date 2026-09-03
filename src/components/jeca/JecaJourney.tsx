export function JecaJourney() {
  return (
    <section className="grid grid-cols-[1.1fr_.9fr] bg-jeca-blue text-white max-tablet:block">
      <div className="px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,8vw,8rem)] max-[1080px]:px-12 max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="jeca-kicker light">De l’intention à l’action</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          Mobiliser, investir,
          <br />
          <em className="text-jeca-yellow">créer de l’activité.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[720px] text-[.9rem] leading-[1.8] text-[rgba(255,255,255,.72)]">
          Le président a d’abord mobilisé des Ivoiriens pour investir en Côte d’Ivoire. La démarche s’est ensuite
          poursuivie en Guinée Conakry, où 20 hectares de forêt ont été acquis avec le projet d’y planter du manioc
          et de créer une usine d’attiéké.
        </p>
        <p className="mb-0 mt-8 max-w-[720px] text-[.9rem] leading-[1.8] text-[rgba(255,255,255,.72)]">
          Cette démarche est présentée comme une façon de lutter contre le chômage et l’immigration clandestine.
        </p>
      </div>
      <div className="grid grid-rows-2 bg-white text-jeca-ink">
        <article className="relative flex min-h-[300px] flex-col justify-center overflow-hidden border-b border-jeca-line p-[clamp(2rem,5vw,5rem)] max-tablet:min-h-[260px] max-tablet:px-[1.3rem] max-tablet:py-10">
          <small className="relative text-[.5rem] font-extrabold uppercase tracking-[.15em] text-jeca-red">Première étape</small>
          <h3 className="relative mb-[.8rem] mt-4 font-display text-[clamp(2.4rem,3.7vw,4.2rem)] font-normal leading-[.92] tracking-[-.05em] text-jeca-blue">Côte d’Ivoire</h3>
          <p className="relative m-0 max-w-[400px] text-[.82rem] leading-[1.7] text-jeca-muted">Mobiliser des Ivoiriens pour investir en Côte d’Ivoire.</p>
        </article>
        <article className="relative flex min-h-[300px] flex-col justify-center overflow-hidden p-[clamp(2rem,5vw,5rem)] max-tablet:min-h-[260px] max-tablet:px-[1.3rem] max-tablet:py-10">
          <small className="relative text-[.5rem] font-extrabold uppercase tracking-[.15em] text-jeca-red">Étape suivante</small>
          <h3 className="relative mb-[.8rem] mt-4 font-display text-[clamp(2.4rem,3.7vw,4.2rem)] font-normal leading-[.92] tracking-[-.05em] text-jeca-blue">Guinée Conakry</h3>
          <p className="relative m-0 max-w-[400px] text-[.82rem] leading-[1.7] text-jeca-muted">20 hectares acquis pour un projet autour du manioc et d’une usine d’attiéké.</p>
        </article>
      </div>
    </section>
  );
}
