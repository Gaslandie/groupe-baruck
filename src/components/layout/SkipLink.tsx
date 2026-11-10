import { pageText } from "@/lib/page-content";

export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="fixed left-4 top-[-5rem] z-[999] bg-ivory px-4 py-[.8rem] text-ink focus:top-4"
    >{pageText("home", "common.SkipLink.1")}</a>
  );
}
