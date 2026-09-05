import type { ReactNode } from "react";

import type { ServiceFaqItem } from "@/data/services";

type ServiceFaqProps = {
  eyebrow: string;
  title: ReactNode;
  emphasis: string;
  items: ServiceFaqItem[];
};

export function ServiceFaq({ eyebrow, title, emphasis, items }: ServiceFaqProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map(({ question, answer }) => ({
      "@type": "Question",
      name: question,
      acceptedAnswer: {
        "@type": "Answer",
        text: answer,
      },
    })),
  };

  return (
    <section id="questions" className="scroll-mt-[100px] bg-paper-deep px-[clamp(1.3rem,7vw,8rem)] py-[clamp(5rem,9vw,9rem)]">
      <div className="mb-[clamp(2.5rem,5vw,3.5rem)] grid grid-cols-[minmax(280px,.8fr)_1.2fr] items-end gap-[clamp(3rem,8vw,9rem)] max-tablet:grid-cols-1 max-tablet:gap-10">
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="mb-0 mt-2 font-display text-[clamp(3rem,5vw,6rem)] font-normal leading-[.92] tracking-[-.045em]">
            {title}
            <em className="font-normal text-accent">{emphasis}</em>
          </h2>
        </div>
      </div>
      <div>
        {items.map(({ question, answer }) => (
          <details key={question} className="border-t border-line last:border-b open:[&>summary>span]:rotate-45">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-[1.15rem] font-display text-[clamp(1.35rem,2vw,1.9rem)] leading-[1.2] [&::-webkit-details-marker]:hidden">
              {question}
              <span aria-hidden="true" className="shrink-0 text-accent">+</span>
            </summary>
            <p className="m-0 pb-[1.15rem] leading-[1.8] text-[#65645f]">{answer}</p>
          </details>
        ))}
      </div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
    </section>
  );
}
