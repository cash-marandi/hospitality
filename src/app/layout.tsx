import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Concierge from "@/components/Concierge";

const display = Fraunces({ variable: "--font-display", subsets: ["latin"] });
const body = Manrope({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nutting House · A serene home away from home | Mbombela",
  description:
    "3-star lodge & 4-star conference venue in Mbombela, Mpumalanga. Family rooms, weddings at the dam, conferences to 2000+ delegates. Instant quotations, no card needed.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className="min-h-screen">
        <Navbar />
        <main className="pt-20">{children}</main>
        <Footer />
        <Concierge />
      </body>
    </html>
  );
}
