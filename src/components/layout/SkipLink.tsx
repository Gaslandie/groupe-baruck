import { translate as t } from "../../lib/language.ts";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-[-5rem] z-[999] bg-ivory px-4 py-[.8rem] text-ink focus:top-4"
    >{t("Aller au contenu principal")}</a>
  );
}
