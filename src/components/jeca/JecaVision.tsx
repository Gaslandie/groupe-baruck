const pillars = [
  { title: "Sensibiliser", text: "Encourager la diaspora africaine à investir sur le continent." },
  { title: "Créer un lien", text: "Placer la JECA entre la diaspora et l’Afrique." },
  {
    title: "Agir localement",
    text: "Lutter contre le chômage et l’immigration clandestine par l’investissement.",
  },
];

export function JecaVision() {
  return (
    <section
      id="vision"
      className="grid scroll-mt-[74px] grid-cols-[minmax(0,1.05fr)_minmax(320px,.7fr)] gap-x-24 gap-y-12 bg-jeca-paper px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] max-[1080px]:grid-cols-[1fr_.8fr] max-[1080px]:gap-12 max-tablet:block max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <div>
        <p className="jeca-kicker">La vision</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.6vw,6.6rem)] font-normal leading-[.92] tracking-[-.05em] max-tablet:text-[clamp(2.8rem,13vw,4.2rem)]">
          « Ne pas voir l’Afrique <em className="text-jeca-red">sombrer.</em> »
        </h2>
      </div>
      <div className="max-w-[560px] self-end max-tablet:mt-[2.3rem]">
        <p className="mb-6 mt-0 font-display text-[clamp(1.15rem,1.6vw,1.55rem)] font-normal leading-[1.5] text-jeca-blue">
          Pour son président, les États ne peuvent pas tout faire : il faut se réunir pour s’occuper de l’Afrique.
        </p>
        <p className="m-0 text-[.9rem] leading-[1.8] text-jeca-muted">
          Selon son président, beaucoup de personnes ont peur d’investir après des expériences qui n’ont pas
          fonctionné. La réponse de la JECA est de sensibiliser au maximum la diaspora africaine afin qu’elle
          investisse en Afrique.
        </p>
      </div>
      <div className="col-span-full mt-8 grid grid-cols-3 border-t border-jeca-line max-tablet:mt-12 max-tablet:grid-cols-1">
        {pillars.map((pillar) => (
          <article
            key={pillar.title}
            className="min-h-[230px] border-r border-jeca-line px-[clamp(1rem,2.5vw,2.8rem)] pb-4 pt-8 first:pl-0 last:border-r-0 max-tablet:min-h-0 max-tablet:border-b max-tablet:border-r-0 max-tablet:px-0 max-tablet:pb-[2.3rem] max-tablet:pt-[1.8rem] max-tablet:first:pt-[1.8rem] max-tablet:last:border-b-0"
          >
            <h3 className="mb-[.8rem] mt-[2.8rem] font-display text-[clamp(1.8rem,2.7vw,3rem)] font-normal leading-none text-jeca-blue max-tablet:mt-[1.8rem]">
              {pillar.title}
            </h3>
            <p className="m-0 max-w-[330px] text-[.82rem] leading-[1.7] text-jeca-muted">{pillar.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
