import { pageValue } from "@/lib/page-content";

export type Milestone = {
  /** Année affichée. */
  year: string;
  /** Valeur machine du <time>, reprise des dates déjà publiées quand elles existent. */
  dateTime: string;
  title: string;
  text: string;
  /** Ancre locale (#…) ou route interne du site. */
  href: string;
};

/** Repères documentés du dirigeant, de la JECA et d'Espoir de Vie. Aucune date du Groupe. */
export const milestones: Milestone[] = pageValue<Milestone[]>("groupe", "data.milestones");

/**
 * Les ambassadeurs de la marque Baruck, ajoutés à la page Le Groupe le
 * 2026-09-19. Le client a fourni ces photos sans date : elles sont donc
 * présentées comme une galerie, pas comme une actualité datée.
 *
 * Douze photos retenues sur les vingt-six reçues, pour ne pas alourdir la
 * page : la rencontre avec le PDG, l'équipe au complet, puis des passages de
 * la séance au Studio Photo Baruck.
 */
export type AmbassadorPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export const ambassadorPhotos: AmbassadorPhoto[] = pageValue<AmbassadorPhoto[]>("groupe", "data.ambassadorPhotos");

export type CommunicationService = {
  title: string;
  text: string;
  href: string;
  cta: string;
};

export type BaruckCommunication = {
  eyebrow: string;
  description: string;
  presence: string;
  servicesLabel: string;
  services: CommunicationService[];
};

/** Pôle opérationnel guinéen : uniquement ce qui est déjà publié sur le site. */
export const baruckCommunication: BaruckCommunication = pageValue<BaruckCommunication>("groupe", "data.baruckCommunication");

export type PresenceLink = {
  label: string;
  href: string;
};

export type PresenceCountry = {
  /** Rang affiché, dans l'ordre de la liste. */
  number: string;
  name: string;
  /** Nature de la présence, en une formule courte. */
  role: string;
  text: string;
  /** Pages du site consacrées à ce qui s'y passe ; absentes quand il n'y en a pas. */
  links?: PresenceLink[];
};

/**
 * Les cinq pays, au même niveau (2026-09-19).
 *
 * Le PDG a cité la France et le Cap-Vert en plus des trois pays déjà publiés,
 * dans une vidéo diffusée sur la page Facebook du groupe. La carte d'Afrique de
 * l'Ouest qui portait cette section ne pouvait pas les accueillir — la France
 * en sort, et le Cap-Vert est absent du fond de carte Natural Earth à cette
 * échelle — elle a donc été retirée au profit de cette liste.
 *
 * Ce qui est écrit de la France et du Cap-Vert s'arrête à ce qui est su : le
 * groupe y est représenté. Le détail des activités viendra du client.
 */
export const presenceCountries: PresenceCountry[] = pageValue<Omit<PresenceCountry, "number">[]>("groupe", "data.presenceCountries").map((country, index) => ({ ...country, number: String(index + 1).padStart(2, "0") }));
