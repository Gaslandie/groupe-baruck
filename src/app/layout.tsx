import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

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
    <html lang="fr" className={inter.variable} data-scroll-behavior="smooth">
      <body>
        <NavigationTransitions />
        {children}
      </body>
    </html>
  );
}
