"use client";

import { useEffect } from "react";

import { revealWithin } from "@/lib/reveal";

export function RevealObserver() {
  useEffect(() => revealWithin(document), []);

  return null;
}
