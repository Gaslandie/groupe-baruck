import Link from "next/link";
import type { ReactNode } from "react";

import { ClientNote } from "@/components/ui/ClientNote";
import { placeholderPhotos, unsplashCredit, type RemotePhoto } from "@/data/media";
import { contacts, hqAddress, routes, site } from "@/data/site";

const paragraphClass = "m-0 text-body leading-[1.75] text-[#65645f]";
const inlineLinkClass =
  "underline decoration-[rgba(11,12,14,.3)] underline-offset-4 transition-colors duration-[220ms] hover:text-accent";
const termClass = "text-micro uppercase tracking-[.14em] text-accent";

const githubPagesDocs =
  "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages";
const web3formsDocs = "https://docs.web3forms.com/getting-started/faq";
const googlePrivacy = "https://policies.google.com/privacy?hl=fr";

/** Photographies Wikimedia créditées une fois par fichier (conakryHero et conakry partagent la même). */
const wikimediaPhotos: RemotePhoto[] = Object.values(placeholderPhotos).filter(
  (photo, index, all) => all.findIndex((item) => item.href === photo.href) === index,
);

type LegalSectionProps = {
  id: string;
  number: string;
  title: string;
  children: ReactNode;
};

function LegalSection({ id, number, title, children }: LegalSectionProps) {
  return (
    <section
      id={id}
      className="reveal grid grid-cols-[minmax(220px,.55fr)_1fr] gap-x-[clamp(2rem,5vw,5rem)] gap-y-6 border-t border-line py-[clamp(2.5rem,4vw,4rem)] max-[1080px]:grid-cols-1"
    >
      <div>
        <span className="text-micro tracking-[.15em] text-accent">{number}</span>
        <h2 className="mb-0 mt-3 font-display text-display-md font-normal leading-[1.05] tracking-[-.035em]">
          {title}
        </h2>
      </div>
      <div className="flex max-w-[720px] flex-col gap-5">{children}</div>
    </section>
  );
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="text-link w-fit">
      {children} <span>↗</span>
    </a>
  );
}

function EmailLink() {
  return (
    <a href={contacts.email.href} className={inlineLinkClass}>
      {contacts.email.value}
    </a>
  );
}

export function LegalContent() {
  const year = new Date().getFullYear();

  return (
    <div className="bg-paper px-[clamp(1.3rem,6vw,7.5rem)] pb-[clamp(4rem,8vw,8rem)] pt-[clamp(2rem,4vw,4rem)]">
      <LegalSection id="editeur" number="01" title="Identité de l’éditeur">
        <dl className="m-0 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <dt className={termClass}>Site</dt>
            <dd className={`${paragraphClass} text-ink`}>
              Groupe Baruck
              <ClientNote>
                Raison sociale, forme juridique, numéro RCCM, adresse du siège social et
                représentant légal à confirmer avec le client.
              </ClientNote>
            </dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className={termClass}>Adresse de contact publiée</dt>
            <dd className={paragraphClass}>{hqAddress}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className={termClass}>E-mail</dt>
            <dd className={paragraphClass}>
              <EmailLink />
            </dd>
          </div>
        </dl>
      </LegalSection>

      <LegalSection id="conception-hebergement" number="02" title="Conception et hébergement">
        <p className={paragraphClass}>Conception et réalisation technique : {site.designer}.</p>
        <p className={paragraphClass}>
          Hébergement : GitHub Pages, service d’hébergement statique exploité par GitHub.
        </p>
        <p className={paragraphClass}>
          GitHub indique que l’adresse IP des visiteurs d’un site GitHub Pages est journalisée et
          conservée à des fins de sécurité.
        </p>
        <ExternalLink href={githubPagesDocs}>Documentation GitHub Pages</ExternalLink>
      </LegalSection>

      <LegalSection id="formulaire-de-contact" number="03" title="Formulaire de contact">
        <p className={paragraphClass}>
          Le formulaire de la{" "}
          <Link href={routes.contact} className={inlineLinkClass}>
            page Contact
          </Link>{" "}
          recueille le nom, l’e-mail, le téléphone ou WhatsApp (facultatif), l’objet et le
          message. Ces informations servent à recevoir la demande et à y répondre.
        </p>
        <p className={paragraphClass}>
          Lorsque le service Web3Forms est configuré, elles sont envoyées à son API puis transmises
          par e-mail au Groupe Baruck. Le site ne possède pas de base de données propre pour ces
          messages.
        </p>
        <p className={paragraphClass}>
          Sans clé Web3Forms, la messagerie du visiteur s’ouvre avec le message prérempli et
          l’envoi reste sous son contrôle.
        </p>
        <p className={paragraphClass}>
          Toute demande relative à un message transmis peut être adressée à <EmailLink />.
        </p>
        <ExternalLink href={web3formsDocs}>Documentation Web3Forms</ExternalLink>
      </LegalSection>

      <LegalSection id="cookies-services-externes" number="04" title="Cookies et services externes">
        <p className={paragraphClass}>
          Le code du site ne dépose aucun cookie propre et n’intègre aucun outil d’analyse.
        </p>
        <p className={paragraphClass}>
          L’assistant automatique du site répond avec des textes prédéfinis, sans intelligence
          artificielle ni service tiers ; la recherche sur une question saisie se fait dans le
          navigateur. Lorsqu’il est ouvert, le fil de la conversation (sujets choisis, questions
          saisies) reste dans le stockage de session du navigateur, n’est transmis à personne et
          est effacé à la fermeture de l’onglet. Le message prérempli proposé pour WhatsApp ou
          l’e-mail reste modifiable avant tout envoi.
        </p>
        <p className={paragraphClass}>
          Sur la page Contact, la carte Google Maps reste bloquée jusqu’au clic sur « Autoriser
          Google Maps ». Vous pouvez choisir « Ne pas afficher » et continuer à consulter le
          site. L’autorisation vaut uniquement pour la page en cours. Une fois la carte chargée,
          Google reçoit des données techniques, dont l’adresse IP, et peut utiliser ses propres
          cookies ou traceurs conformément à sa politique.
        </p>
        <p className={paragraphClass}>
          Le bouton « Retirer l’autorisation et masquer la carte » décharge la carte. Il ne
          supprime pas les données déjà reçues par Google ni les cookies éventuellement déjà
          déposés, qui peuvent être gérés dans les réglages du navigateur.
        </p>
        <p className={paragraphClass}>
          Les liens externes conduisent vers les services concernés, dont les politiques propres
          s’appliquent.
        </p>
        <ExternalLink href={googlePrivacy}>Politique de confidentialité de Google</ExternalLink>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" number="05" title="Propriété intellectuelle">
        <p className={paragraphClass}>© {year} Groupe Baruck. Tous droits réservés.</p>
        <p className={paragraphClass}>
          Les contenus propres au site restent la propriété de leurs titulaires et ne peuvent pas
          être réutilisés sans autorisation, hors exceptions prévues par la loi.
        </p>
      </LegalSection>

      <LegalSection id="credits-photographiques" number="06" title="Crédits photographiques">
        <p className={paragraphClass}>
          Visuels d’ambiance provisoires :{" "}
          <a href={unsplashCredit.href} target="_blank" rel="noreferrer" className={inlineLinkClass}>
            {unsplashCredit.label}
          </a>
          .
        </p>
        <p className={paragraphClass}>Photographies provisoires issues de Wikimedia Commons :</p>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {wikimediaPhotos.map((photo) => (
            <li key={photo.href} className={`${paragraphClass} flex flex-wrap items-baseline gap-x-3`}>
              <a href={photo.href} target="_blank" rel="noreferrer" className={inlineLinkClass}>
                {photo.author}
              </a>
              <span className="text-label uppercase tracking-[.14em] text-[#77746e]">
                {photo.licence}
              </span>
            </li>
          ))}
        </ul>
      </LegalSection>
    </div>
  );
}
