import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://gaslandie.github.io/groupe-baruck/"),
  title: {
    default: "Groupe Baruck — Vision, excellence, impact",
    template: "%s — Groupe Baruck",
  },
  description:
    "Groupe Baruck — Un groupe multisectoriel porté par une vision entrepreneuriale, créative et engagée.",
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
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
