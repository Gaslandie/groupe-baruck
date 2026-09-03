import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";

import { site } from "@/data/site";

import "./globals.css";

const inter = localFont({
  src: "./fonts/inter-latin.woff2",
  weight: "100 900",
  style: "normal",
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://gaslandie.github.io/groupe-baruck/"),
  title: {
    default: "Groupe Baruck — Vision, excellence, impact",
    template: "%s — Groupe Baruck",
  },
  description:
    "Groupe Baruck — Un groupe multisectoriel porté par une vision entrepreneuriale, créative et engagée.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Groupe Baruck",
    images: [
      {
        url: site.url + "images/brand/baruck-logo.jpg",
        width: 1170,
        height: 634,
        alt: "Groupe Baruck",
      },
    ],
  },
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
    <html lang="fr" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
