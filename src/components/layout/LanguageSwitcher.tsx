"use client";

import { usePathname } from "next/navigation";
import { isEnglish, otherLanguagePath } from "../../lib/language.ts";

export function LanguageSwitcher() {
  const pathname = usePathname() ?? "/";
  return (
    <a href={otherLanguagePath(pathname)} hrefLang={isEnglish ? "fr" : "en"}
      lang={isEnglish ? "fr" : "en"} aria-label={isEnglish ? "Voir cette page en français" : "View this page in English"}
      className="border border-current/30 px-3 py-2 text-label font-sans font-bold tracking-[.08em] transition-colors hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-4">
      {isEnglish ? "FR" : "EN"}
    </a>
  );
}
