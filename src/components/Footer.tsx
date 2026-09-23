import Link from "next/link";
import { SITE } from "@/lib/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-forest-950 text-stone-200">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-4">
        <div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/legacy/img/logo.png" alt="Nutting House nut mark" className="logo-glow h-12 w-auto" />
          <p className="font-display mt-3 text-xl text-white">Nutting House</p>
          <p className="mt-2 text-sm leading-relaxed text-stone-300">
            {SITE.tagline}. {SITE.grading}. Sprawling lawns, mountain sunsets and a dam that slows time — 21 years in the making.
          </p>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">Visit</h4>
          <p className="mt-3 text-sm">{SITE.location}</p>
          <a href={SITE.mapsPin} target="_blank" className="mt-2 inline-block text-sm text-clay-500 underline">Google Maps pin →</a>
          <p className="mt-3 text-sm">{SITE.phone}</p>
          <p className="text-sm">{SITE.email}</p>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">Explore</h4>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link href="/stay" className="hover:text-white">Accommodation</Link></li>
            <li><Link href="/venues" className="hover:text-white">Venues</Link></li>
            <li><Link href="/conference" className="hover:text-white">Conferencing</Link></li>
            <li><Link href="/weddings" className="hover:text-white">Weddings</Link></li>
            <li><Link href="/book" className="hover:text-white">Book / Get quotation</Link></li>
            <li><Link href="/track" className="hover:text-white">Find my booking</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-lg text-white">Good to know</h4>
          <ul className="mt-3 space-y-2 text-sm text-stone-300">
            <li>Check-in 14:00 · Check-out 10:00</li>
            <li>Secure parking · High-speed WiFi</li>
            <li>Bar, buffet & pools</li>
            <li>Manual EFT quotations — pay later</li>
          </ul>
          <Link href="/admin" className="no-print mt-4 inline-block rounded-full border border-white/20 px-4 py-2 text-xs hover:bg-white/10">
            Staff login →
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-stone-300">
        © {new Date().getFullYear()} Nutting House · Rebuilt with care in Mbombela
      </div>
    </footer>
  );
}
