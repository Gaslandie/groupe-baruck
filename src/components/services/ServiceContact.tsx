import type { ReactNode } from "react";

type ContactDetail = {
  label: string;
  text: string;
  href?: string;
  external?: boolean;
};

type ServiceContactProps = {
  eyebrow: string;
  title: ReactNode;
  emphasis: string;
  details: ContactDetail[];
};

const detailStyles = "m-0 border-t border-line pt-4 leading-[1.55] text-[#5f5d57]";

function DetailContent({ detail }: { detail: ContactDetail }) {
  return (
    <>
      <strong className="mb-1 block text-micro uppercase tracking-[.14em] text-accent">{detail.label}</strong>
      {detail.text}
    </>
  );
}

export function ServiceContact({ eyebrow, title, emphasis, details }: ServiceContactProps) {
  return (
    <section className="grid grid-cols-2 items-end gap-[clamp(3rem,8vw,9rem)] px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mb-0 mt-2 font-display text-display-xl font-normal leading-[.92] tracking-[-.045em]">
          {title}
          <em className="font-normal text-accent">{emphasis}</em>
        </h2>
      </div>
      <div className="grid gap-[1.2rem]">
        {details.map((detail) =>
          detail.href ? (
            <a
              key={detail.label}
              href={detail.href}
              target={detail.external ? "_blank" : undefined}
              rel={detail.external ? "noreferrer" : undefined}
              className={detailStyles}
            >
              <DetailContent detail={detail} />
            </a>
          ) : (
            <p key={detail.label} className={detailStyles}>
              <DetailContent detail={detail} />
            </p>
          ),
        )}
      </div>
    </section>
  );
}
