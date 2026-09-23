import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Concierge from "@/components/Concierge";
import HotelSchema from "@/components/HotelSchema";
import { SITE } from "@/lib/site";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"], display: "swap" });
const body = Manrope({ variable: "--font-body", subsets: ["latin"], display: "swap" });

const siteUrl = SITE.url;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Nutting House · Lodge, Weddings & Conferences in Mbombela",
    template: "%s | Nutting House Mbombela",
  },
  description:
    "3-star lodge & 4-star conference venue in Mbombela, Mpumalanga. Family rooms from R950, weddings at the dam, conferences to 800 in one hall. Instant EFT quotations, no card needed.",
  keywords: [
    "Nutting House",
    "Mbombela accommodation",
    "Nelspruit lodge",
    "Mpumalanga conference venue",
    "wedding venue Lowveld",
    "family rooms Kruger",
    "Edamini dam weddings",
    "Rali's Rock conferences",
  ],
  authors: [{ name: "Nutting House" }],
  creator: "Nutting House",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Nutting House",
    title: "Nutting House · A serene home away from home | Mbombela",
    description:
      "3-star lodge & 4-star conference venue in Mbombela. Family rooms, weddings at the dam, conferences to 800 in one hall. Instant quotations.",
    images: [{ url: "/legacy/img/hero_home_1.jpg", width: 1200, height: 630, alt: "Nutting House lawns at sunset" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nutting House · Mbombela",
    description: "Lodge, weddings & conferences in the Lowveld. Instant EFT quotations.",
    images: ["/legacy/img/hero_home_1.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  other: {
    "geo.region": SITE.geo.region,
    "geo.placename": SITE.geo.placename,
    "geo.position": `${SITE.geo.lat};${SITE.geo.lng}`,
    ICBM: `${SITE.geo.lat}, ${SITE.geo.lng}`,
  },
};

export const viewport: Viewport = { themeColor: "#0e1f14", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-ZA" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <HotelSchema />
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <Concierge />
      </body>
    </html>
  );
}
