import { contactNeeds } from "@/data/contact";
import { placeholderPhotos } from "@/data/media";
import { contacts } from "@/data/site";
import { PhotoCredits } from "@/components/ui/PhotoCredits";

export function ContactHero() {
  return (
    <section className="relative isolate grid min-h-[92svh] grid-cols-[1.05fr_.95fr] overflow-hidden bg-ink text-ivory max-[1080px]:grid-cols-1">
      <div
        aria-hidden="true"
        style={{
          backgroundImage: `url("${placeholderPhotos.conakryHero.src}")`,
          backgroundPosition: placeholderPhotos.conakryHero.position,
        }}
        className="absolute inset-0 z-[-2] scale-[1.025] bg-cover saturate-[.7]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 z-[-1] bg-[linear-gradient(90deg,rgba(8,9,10,.94),rgba(8,9,10,.72)_50%,rgba(8,9,10,.55)),linear-gradient(180deg,rgba(8,9,10,.2),rgba(8,9,10,.85))]"
      />
      <div className="hero-in flex flex-col justify-center px-[clamp(1.3rem,5vw,5.5rem)] pb-[clamp(3.5rem,6vw,5rem)] pl-[clamp(1.3rem,7vw,8rem)] pt-[clamp(8rem,11vw,11rem)] max-[1080px]:px-[clamp(1.3rem,6vw,4rem)] max-[1080px]:pb-[clamp(3.5rem,7vw,5rem)] max-[1080px]:pt-[clamp(2.5rem,6vw,4rem)]">
        <p className="eyebrow light">Contact · Groupe Baruck</p>
        <h1 className="mb-[1.6rem] mt-0 text-balance font-display text-[clamp(2.9rem,5.2vw,5.4rem)] font-normal leading-[.92] tracking-[-.05em]">
          Parlons de votre
          <em className="block font-normal text-accent">prochain projet.</em>
        </h1>
        <p className="mb-[2.2rem] mt-0 max-w-[520px] text-[clamp(.9rem,1.15vw,1.02rem)] leading-[1.75] text-[rgba(255,255,255,.7)]">
          Notre équipe est à votre écoute pour répondre à vos questions et étudier vos propositions.
        </p>
        <div className="flex flex-wrap gap-[.8rem] max-tablet:[&_.button]:w-full">
          <a href={contacts.whatsappHq.href} target="_blank" rel="noreferrer" className="button button-accent">
            WhatsApp Baruck Siège <span>↗</span>
          </a>
          <a href={contacts.landline.href} className="button button-ghost">
            Appeler le siège
          </a>
          <a href={contacts.email.href} className="button button-ghost">
            Écrire un e-mail
          </a>
        </div>
      </div>
      <div className="flex flex-col justify-center bg-[rgba(8,9,10,.62)] px-[clamp(1.3rem,5vw,5.5rem)] pb-[clamp(3.5rem,6vw,5rem)] pt-[clamp(8rem,11vw,11rem)] max-[1080px]:pt-[2rem]">
        <p className="eyebrow light">Selon votre besoin</p>
        <div className="border-t border-[rgba(255,255,255,.16)]">
          {contactNeeds.map((need) => (
            <a
              key={need.number}
              href={need.href}
              {...("external" in need && need.external ? { target: "_blank", rel: "noreferrer" } : {})}
              className="grid grid-cols-[40px_1fr_auto] items-baseline gap-4 border-b border-[rgba(255,255,255,.16)] py-[.95rem] text-[rgba(255,255,255,.8)] transition-[color,padding,background] duration-[220ms] hover:bg-[rgba(255,255,255,.05)] hover:px-[.65rem] hover:text-ivory focus-visible:bg-[rgba(255,255,255,.05)] focus-visible:px-[.65rem] focus-visible:text-ivory max-tablet:grid-cols-[32px_1fr_auto] max-tablet:gap-[.7rem]"
            >
              <span className="text-[.58rem] tracking-[.14em] text-accent">{need.number}</span>
              <p className="m-0 text-[.84rem] leading-[1.5]">
                <strong className="font-semibold text-ivory">{need.title}</strong>
                <small className="mt-1 block text-[.68rem] text-[rgba(255,255,255,.45)]">{need.text}</small>
              </p>
              <i aria-hidden="true" className="text-[.8rem] not-italic text-accent">
                {need.href === "#formulaire" ? "↓" : "↗"}
              </i>
            </a>
          ))}
        </div>
      </div>
      <PhotoCredits
        photos={[placeholderPhotos.conakryHero]}
        tone="light"
        className="absolute bottom-3 right-[clamp(1.3rem,5vw,5.5rem)] z-[1] max-tablet:static max-tablet:col-span-full max-tablet:px-[1.3rem] max-tablet:pb-4"
      />
    </section>
  );
}
