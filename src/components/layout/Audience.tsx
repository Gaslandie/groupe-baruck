"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { contactAction, contactActivity, contactPage } from "@/lib/contact-measurement";

// Mesure d'audience du back-office : une requête par page vue, sans cookie.
// Inactive tant que NEXT_PUBLIC_AUDIENCE_URL n'est pas renseignée au build.
const endpoint = process.env.NEXT_PUBLIC_AUDIENCE_URL ?? "";
let firstView = true;

export function Audience() {
  const pathname = usePathname();

  useEffect(() => {
    if (!endpoint || !pathname) return;
    const referrer = firstView ? document.referrer : window.location.origin;
    firstView = false;
    const payload = JSON.stringify({ p: pathname, r: referrer, w: window.innerWidth });
    const send = (body: string) => {
      try {
        if (navigator.sendBeacon?.(endpoint, new Blob([body], { type: "text/plain" }))) return;
      } catch { /* La mesure ne doit jamais interrompre le parcours. */ }
      fetch(endpoint, { method: "POST", body, mode: "cors", credentials: "omit", keepalive: true }).catch(() => undefined);
    };
    send(payload);

    const page = contactPage(pathname, process.env.NEXT_PUBLIC_BASE_PATH ?? "");
    const recent = new Map<string, number>();
    const onContact = (event: MouseEvent) => {
      if (!page || event.defaultPrevented || !event.isTrusted || (event.type === "auxclick" && event.button !== 1)) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      const action = link ? contactAction((link as HTMLAnchorElement).href) : null;
      if (!action) return;
      const time = Date.now();
      if (time - (recent.get(action) ?? 0) < 10000) return;
      recent.set(action, time);
      send(JSON.stringify({ e: action, p: page, a: contactActivity(page) }));
    };
    document.addEventListener("click", onContact);
    document.addEventListener("auxclick", onContact);
    return () => {
      document.removeEventListener("click", onContact);
      document.removeEventListener("auxclick", onContact);
    };
  }, [pathname]);

  return null;
}
