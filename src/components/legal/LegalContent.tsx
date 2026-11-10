import { pageText } from "@/lib/page-content";

import Link from "next/link";
import type { ReactNode } from "react";

import { placeholderPhotos, unsplashCredit, type RemotePhoto } from "@/data/media";
import { contacts, hqAddress, routes, site } from "@/data/site";
import { Icon } from "../ui/Icon";

const paragraphClass = "m-0 text-body leading-[1.75] text-[#65645f]";
const inlineLinkClass =
  "underline decoration-[rgba(11,12,14,.3)] underline-offset-4 transition-colors duration-[220ms] hover:text-accent";
const termClass = "text-micro uppercase tracking-[.14em] text-accent";

const githubPagesDocs =
  "https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages";
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
      {children} <span><Icon name="arrow-up-right" /></span>
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
      <LegalSection id="editeur" number="01" title={pageText("mentions-legales", "copy.LegalContent.1")}>
        <dl className="m-0 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <dt className={termClass}>{pageText("mentions-legales", "copy.LegalContent.2")}</dt>
            <dd className={`${paragraphClass} text-ink`}>
              {pageText("mentions-legales", "copy.LegalContent.3")}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className={termClass}>{pageText("mentions-legales", "copy.LegalContent.4")}</dt>
            <dd className={paragraphClass}>{hqAddress}</dd>
          </div>
          <div className="flex flex-col gap-2">
            <dt className={termClass}>{pageText("mentions-legales", "copy.LegalContent.5")}</dt>
            <dd className={paragraphClass}>
              <EmailLink />
            </dd>
          </div>
        </dl>
      </LegalSection>

      <LegalSection id="conception-hebergement" number="02" title={pageText("mentions-legales", "copy.LegalContent.6")}>
        <p className={paragraphClass}>{(pageText("mentions-legales", "copy.LegalContent.7") + " ")}{site.designer}.</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.8")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.9")}</p>
        <ExternalLink href={githubPagesDocs}>{pageText("mentions-legales", "copy.LegalContent.10")}</ExternalLink>
      </LegalSection>

      <LegalSection id="formulaire-de-contact" number="03" title={pageText("mentions-legales", "copy.LegalContent.11")}>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.12")}{" "}
          <Link href={routes.contact} className={inlineLinkClass}>{pageText("mentions-legales", "copy.LegalContent.13")}</Link>{" "}{pageText("mentions-legales", "copy.LegalContent.14")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.15")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.16")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.17")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.18")}</p>
        <p className={paragraphClass}>
          {(pageText("mentions-legales", "copy.LegalContent.19") + " ")}<EmailLink />.
        </p>
      </LegalSection>

      <LegalSection id="cookies-services-externes" number="04" title={pageText("mentions-legales", "copy.LegalContent.20")}>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.21")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.22")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.23")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.24")}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.25")}</p>
        <ExternalLink href={googlePrivacy}>{pageText("mentions-legales", "copy.LegalContent.26")}</ExternalLink>
      </LegalSection>

      <LegalSection id="propriete-intellectuelle" number="05" title={pageText("mentions-legales", "copy.LegalContent.27")}>
        <p className={paragraphClass}>© {year}{(" " + pageText("mentions-legales", "copy.LegalContent.28"))}</p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.29")}</p>
      </LegalSection>

      <LegalSection id="credits-photographiques" number="06" title={pageText("mentions-legales", "copy.LegalContent.30")}>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.31")}{" "}
          <a href={unsplashCredit.href} target="_blank" rel="noreferrer" className={inlineLinkClass}>
            {unsplashCredit.label}
          </a>
          .
        </p>
        <p className={paragraphClass}>{pageText("mentions-legales", "copy.LegalContent.32")}</p>
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
