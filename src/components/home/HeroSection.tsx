import { heroSlides } from "@/data/home";

import { HeroCarousel } from "./HeroCarousel";
import { PresidentPanel } from "./PresidentPanel";

export function HeroSection() {
  return (
    <section
      id="accueil"
      aria-label="Présentation du Groupe Baruck"
      className="grid min-h-svh grid-cols-[46%_54%] bg-ink text-ivory max-desktop:grid-cols-[48%_52%] max-tablet:block"
    >
      <PresidentPanel />
      <HeroCarousel slides={heroSlides} />
    </section>
  );
}
