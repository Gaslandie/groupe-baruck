export function NewsHero() {
  return (
    <section className="hero-in bg-ink px-[clamp(1.3rem,7vw,8rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] text-ivory">
      <p className="eyebrow light">Actualités · Groupe Baruck</p>
      <h1 className="text-balance font-display text-display-xl font-normal leading-[.92] tracking-[-.05em]">
        Les dernières nouvelles
        <em className="block font-normal text-accent">du Groupe.</em>
      </h1>
      <p className="mt-7 max-w-[520px] text-lead leading-[1.75] text-[rgba(255,255,255,.7)]">
        Annonces, événements et communiqués du Groupe Baruck, de la JECA et d’Espoir de Vie.
      </p>
    </section>
  );
}
