import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Audience } from "@/components/layout/Audience";
import { NavigationTransitions } from "@/components/layout/NavigationTransitions";
import { brandLogo } from "@/data/media";
import { site } from "@/data/site";
import { socialMetadata } from "@/lib/metadata";

import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

/**
 * Police des titres : Fraunces (variable, licence SIL OFL), auto-hébergée comme
 * Inter. Elle remplace Georgia, qui n'est pas installée partout et ne rendait
 * donc pas le même dessin d'un appareil à l'autre. L'axe `opsz` est piloté par
 * `font-optical-sizing: auto` : contrasté dans les grands titres, plus solide
 * dans les petits. Sous-ensemble latin (accents français, œ, apostrophe typo).
 */
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces-latin.woff2", weight: "300 700", style: "normal" },
    { path: "./fonts/fraunces-latin-italic.woff2", weight: "300 700", style: "italic" },
  ],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Groupe Baruck — Vision, excellence, impact",
    template: "%s — Groupe Baruck",
  },
  description:
    "Groupe Baruck — Un groupe multisectoriel porté par une vision entrepreneuriale, créative et engagée.",
  openGraph: socialMetadata(brandLogo, "Groupe Baruck"),
};

export const viewport: Viewport = {
  themeColor: "#0b0c0e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} ${fraunces.variable}`} data-scroll-behavior="smooth">
      <body>
        <NavigationTransitions />
        <Audience />
        {children}
      </body>
    </html>
  );
}
