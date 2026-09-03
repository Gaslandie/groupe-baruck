import Link from "next/link";

import { routes } from "@/data/site";
import { imageUrl } from "@/lib/asset";

import { SectionHead } from "../ui/SectionHead";

const projects = [
  {
    kicker: "Hôtellerie · Agro-business",
    title: (
      <>
        Une nouvelle histoire
        <br />
        prend forme.
      </>
    ),
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1800&q=82",
    gradient: "linear-gradient(145deg, rgba(12,31,23,.18), rgba(24,17,10,.38))",
  },
  {
    kicker: "Création · Production",
    title: (
      <>
        Créer, produire,
        <br />
        faire rayonner.
      </>
    ),
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1800&q=82",
    gradient: "linear-gradient(145deg, rgba(20,9,15,.18), rgba(38,10,6,.46))",
  },
];

export function ProjectsSection() {
  return (
    <section
      id="projets"
      className="bg-[#111315] px-[clamp(1.3rem,6vw,7.5rem)] py-[clamp(5rem,10vw,10rem)] text-ivory max-tablet:px-[1.3rem] max-tablet:py-20"
    >
      <SectionHead
        eyebrow="Projets & Réalisations"
        title={
          <>
            Des idées transformées
            <br />
            en réalisations
          </>
        }
        text="Cette structure accueillera bientôt les projets, productions et collaborations du Groupe Baruck."
        tone="light"
      />
      <div className="grid grid-cols-[1.1fr_.9fr] gap-4 max-tablet:grid-cols-1">
        {projects.map((project) => (
          <Link
            key={project.kicker}
            href={routes.projects}
            className="group reveal relative isolate flex min-h-[590px] flex-col justify-between overflow-hidden p-8 max-tablet:min-h-[480px]"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[-2] bg-cover bg-center transition-transform duration-700 group-hover:scale-[1.05]"
              style={{ backgroundImage: `${project.gradient}, url("${imageUrl(project.image)}")` }}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 z-[-1] bg-[linear-gradient(180deg,rgba(0,0,0,.05),rgba(0,0,0,.76))]"
            />
            <span className="text-[.54rem] uppercase tracking-[.15em]">{project.kicker}</span>
            <div>
              <p className="text-[.57rem] uppercase tracking-[.14em] text-[#e4c58d]">Projet à venir</p>
              <h3 className="my-4 font-display text-[clamp(2.5rem,4vw,5rem)] font-normal leading-[.95] tracking-[-.045em]">
                {project.title}
              </h3>
            </div>
            <i className="self-end text-[.54rem] not-italic uppercase tracking-[.15em] text-[rgba(255,255,255,.55)]">
              Voir la page ↗
            </i>
          </Link>
        ))}
      </div>
    </section>
  );
}
