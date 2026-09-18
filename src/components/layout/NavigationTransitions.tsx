"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** "/groupe/" et "/groupe" désignent la même page ; le basePath n'est pas dans usePathname. */
function normalize(pathname: string) {
  const withoutBase = basePath && pathname.startsWith(basePath) ? pathname.slice(basePath.length) : pathname;
  return (withoutBase.replace(/\/+$/, "") || "/").toLowerCase();
}

/**
 * Passage d'une page à l'autre en douceur, et barre d'attente.
 *
 * Trois temps (2026-09-17) : au clic le contenu s'estompe sans disparaître
 * (`data-page-leave`), la barre d'attente avance pendant le chargement, puis la
 * page d'arrivée revient en fondu avec une petite montée (`data-page-enter`).
 * Aucun clic n'est intercepté : la page reste réactive dès le premier clic,
 * même quand l'hébergement met plusieurs secondes à répondre. Sans animations
 * (réglage système « moins d'animations »), il ne reste que la barre.
 */
export function NavigationTransitions() {
  const pathname = usePathname();
  const previousPath = useRef(pathname);
  const [pendingPath, setPendingPath] = useState<string | null>(null);
  const isPending = pendingPath !== null && pendingPath !== normalize(pathname);

  // Un lien interne a été cliqué : on montre la barre, sans toucher au clic lui-même.
  useEffect(() => {
    const start = (event: MouseEvent) => {
      if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>("a[href]") : null;
      if (!link || link.hasAttribute("download") || (link.target && link.target !== "_self")) return;
      const destination = new URL(link.href, window.location.href);
      if (destination.origin !== window.location.origin) return;
      const target = normalize(destination.pathname);
      if (target === normalize(window.location.pathname)) return;
      setPendingPath(target);
    };

    // Phase de capture : next/link appelle preventDefault sur le clic avant que
    // l'événement ne remonte jusqu'ici.
    document.addEventListener("click", start, true);
    return () => document.removeEventListener("click", start, true);
  }, []);

  // Une navigation qui n'aboutit pas ne doit pas laisser la barre à l'écran.
  useEffect(() => {
    if (!isPending) return;
    const timer = window.setTimeout(() => setPendingPath(null), 15000);
    return () => window.clearTimeout(timer);
  }, [isPending]);

  // Le départ : le contenu s'estompe tant que la page suivante n'est pas là.
  useEffect(() => {
    if (!isPending || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.pageLeave = "true";
    return () => {
      delete document.documentElement.dataset.pageLeave;
    };
  }, [isPending]);

  // La page d'arrivée est montée : son contenu revient en fondu.
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    delete document.documentElement.dataset.pageLeave;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.dataset.pageEnter = "true";
    const timer = window.setTimeout(() => delete document.documentElement.dataset.pageEnter, 560);
    return () => {
      window.clearTimeout(timer);
      delete document.documentElement.dataset.pageEnter;
    };
  }, [pathname]);

  if (!isPending) return null;

  return <div className="nav-progress" role="presentation" aria-hidden="true" />;
}
