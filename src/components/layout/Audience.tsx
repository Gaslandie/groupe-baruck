"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

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
    const sent = navigator.sendBeacon?.(endpoint, new Blob([payload], { type: "text/plain" }));
    if (!sent) {
      fetch(endpoint, { method: "POST", body: payload, mode: "cors", credentials: "omit", keepalive: true }).catch(() => undefined);
    }
  }, [pathname]);

  return null;
}
