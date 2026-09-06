"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Le navigateur anime les vues ; Next conserve le routage et le préchargement. */
export function NavigationTransitions() {
  const router = useRouter();
  const pathname = usePathname();
  const committed = useRef<(() => void) | null>(null);
  const previousPath = useRef(pathname);

  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    if (committed.current) {
      committed.current();
      committed.current = null;
      return;
    }
    // Repli CSS pour les autres navigations et les navigateurs sans cette API.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.pageEnter = "true";
    const timer = window.setTimeout(() => delete document.documentElement.dataset.pageEnter, 360);
    return () => {
      window.clearTimeout(timer);
      delete document.documentElement.dataset.pageEnter;
    };
  }, [pathname]);

  useEffect(() => {
    let active: ViewTransition | undefined;
    let timeout: number | undefined;
    let generation = 0;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const cancel = () => {
      generation++;
      active?.skipTransition();
      active = undefined;
      committed.current?.();
      committed.current = null;
      window.clearTimeout(timeout);
      delete document.documentElement.dataset.navigationTransition;
    };

    const navigate = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      if (reducedMotion.matches || typeof document.startViewTransition !== "function") return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("#site-header a[href], #side-nav a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href);
      if (destination.origin !== window.location.origin) return;
      if (destination.pathname === window.location.pathname) return;
      if (basePath && destination.pathname !== basePath && !destination.pathname.startsWith(basePath + "/")) return;

      event.preventDefault();
      cancel();
      const current = generation;
      const href = (destination.pathname.slice(basePath.length) || "/") + destination.search + destination.hash;
      document.documentElement.dataset.navigationTransition = "true";
      active = document.startViewTransition(() => {
        if (current !== generation) return;
        return new Promise<void>((resolve) => {
          committed.current = () => { window.clearTimeout(timeout); resolve(); };
          router.push(href);
          // Une route lente ou interrompue ne doit jamais figer l’interface.
          timeout = window.setTimeout(cancel, 3500);
        });
      });
      void active.ready.catch(() => {});
      void active.finished.catch(() => {}).finally(() => {
        if (current === generation) {
          active = undefined;
          delete document.documentElement.dataset.navigationTransition;
        }
      });
    };

    document.addEventListener("click", navigate, true);
    window.addEventListener("popstate", cancel);
    reducedMotion.addEventListener("change", cancel);
    return () => {
      document.removeEventListener("click", navigate, true);
      window.removeEventListener("popstate", cancel);
      reducedMotion.removeEventListener("change", cancel);
      cancel();
    };
  }, [router]);

  return null;
}
