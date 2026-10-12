"use client";

import { translate as t } from "../../lib/language.ts";

import { useState } from "react";

type ArticleShareProps = {
  title: string;
  /** URL canonique de l’article, calculée côté serveur. */
  url: string;
};

const actionClass =
  "inline-flex min-h-12 cursor-pointer items-center border border-line px-5 text-label uppercase tracking-[.14em] transition-[background,color] duration-[250ms] hover:bg-ink hover:text-ivory";

export function ArticleShare({ title, url }: ArticleShareProps) {
  const [feedback, setFeedback] = useState("");
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(`${title} — ${url}`)}`;
  const facebookHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setFeedback(t("Lien copié"));
    } catch {
      setFeedback(t("Copie impossible"));
    }
  };

  return (
    <div className="mx-auto mt-[clamp(3rem,5vw,5rem)] max-w-[1100px] border-t border-line pt-8">
      <h2 className="eyebrow">{t("Partager cet article")}</h2>
      <div className="flex flex-wrap gap-3">
        <a href={whatsappHref} target="_blank" rel="noreferrer" className={actionClass}>{t("Partager sur WhatsApp")}</a>
        <a href={facebookHref} target="_blank" rel="noreferrer" className={actionClass}>{t("Partager sur Facebook")}</a>
        <button type="button" onClick={copyLink} className={actionClass}>{t("Copier le lien")}</button>
      </div>
      <p
        aria-live="polite"
        className="mt-4 min-h-[1.4em] font-display text-small italic text-[#77746e]"
      >
        {feedback}
      </p>
    </div>
  );
}
