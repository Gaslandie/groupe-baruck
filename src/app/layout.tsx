import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { Audience } from "@/components/layout/Audience";
import { NavigationTransitions } from "@/components/layout/NavigationTransitions";
import { brandLogo } from "@/data/media";
import { site } from "@/data/site";
import { socialMetadata } from "@/lib/metadata";

import "./globals.css";

/**
 * Police du corps de texte : Lato (licence SIL OFL), auto-hébergée. Sans-serif
 * humaniste retenue le 2026-09-16 à la place d'Inter pour une lecture plus
 * chaleureuse et plus institutionnelle. Lato n'existe pas en version variable :
 * quatre fichiers statiques, et seulement 400 et 700. Le navigateur rabat donc
 * les graisses intermédiaires du site — 500 sur 400, 600 et 800 sur 700.
 * Sous-ensemble latin (accents français, œ, apostrophe typo).
 */
const lato = localFont({
  src: [
    { path: "./fonts/lato-latin-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/lato-latin-400-italic.woff2", weight: "400", style: "italic" },
    { path: "./fonts/lato-latin-700.woff2", weight: "700", style: "normal" },
    { path: "./fonts/lato-latin-700-italic.woff2", weight: "700", style: "italic" },
  ],
  display: "swap",
  variable: "--font-lato",
});

/**
 * Police des titres : Montserrat (variable, licence SIL OFL), auto-hébergée
 * comme Lato. Elle remplace Fraunces le 2026-09-16 : le site passe à une
 * typographie entièrement sans-serif, plus lisible et plus sobre.
 */
const montserrat = localFont({
  src: [
    { path: "./fonts/montserrat-latin.woff2", weight: "300 800", style: "normal" },
    { path: "./fonts/montserrat-latin-italic.woff2", weight: "300 800", style: "italic" },
  ],
  display: "swap",
  variable: "--font-montserrat",
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
    <html lang="fr" className={`${lato.variable} ${montserrat.variable}`} data-scroll-behavior="smooth">
      <body>
        <NavigationTransitions />
        <Audience />
        {children}
      </body>
    </html>
  );
}
