export function EdvArchives() {
  return (
    <section className="grid grid-cols-[1.35fr_.65fr] bg-edv-cream max-tablet:block">
      <div className="reveal px-[clamp(1.3rem,7vw,8rem)] py-[clamp(6rem,10vw,10rem)] max-tablet:px-[1.3rem] max-tablet:py-20">
        <p className="edv-kicker">Mémoire d’actions</p>
        <h2 className="m-0 text-balance font-display text-[clamp(3rem,5.3vw,6.2rem)] font-normal leading-[.88] tracking-[-.055em] max-tablet:text-[clamp(2.8rem,13vw,4.25rem)]">
          Une histoire écrite
          <br />
          <em className="font-[inherit] text-edv-ember">sur le terrain.</em>
        </h2>
        <p className="mb-0 mt-8 max-w-[700px] text-[.9rem] leading-[1.8] text-edv-muted">
          Chaque initiative est une rencontre : un enfant qui retrouve le chemin de l’école, une famille soutenue,
          une communauté rassemblée autour d’un même élan.
        </p>
      </div>
      <div className="reveal flex flex-col justify-between bg-edv-ember p-[clamp(3rem,6vw,6rem)] text-white max-tablet:min-h-[360px] max-tablet:px-[1.3rem] max-tablet:py-8">
        <span aria-hidden="true" className="self-end font-sans text-5xl font-light">
          ↗
        </span>
        <p className="mb-0 mt-20 max-w-[450px] font-display text-[clamp(1.2rem,2.2vw,2rem)] font-normal leading-[1.45]">
          De Grôh à N’Zérékoré, chaque action rappelle qu’un geste concret peut rendre confiance et ouvrir de nouvelles
          perspectives.
        </p>
      </div>
    </section>
  );
}
