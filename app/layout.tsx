import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://profile.engg.online"),
  title: "EN Profile | Digital Identity Card Studio — Every Nation GG",
  description:
    "Official standalone profile customization studio for the ENOS / Every Nation GG community ecosystem. Customize, preview in real time, and showcase your canonical 1200x675 digital identity card.",
  keywords: [
    "Every Nation GG",
    "ENOS",
    "Discord Profile Card",
    "Digital Identity",
    "Custom Profile",
    "Vault Coins",
    "RPG Progression",
  ],
  openGraph: {
    title: "EN Profile | Digital Identity Card Studio",
    description:
      "Customize and showcase your 1200x675 EN Profile digital identity card earned through active participation in ENOS.",
    url: "https://profile.engg.online",
    siteName: "Every Nation GG",
    images: [
      {
        url: "/assets/branding/en_logo.svg",
        width: 1200,
        height: 675,
        alt: "EN Profile Canonical Card",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "EN Profile | Digital Identity Card Studio",
    description:
      "Customize and showcase your 1200x675 EN Profile digital identity card.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
