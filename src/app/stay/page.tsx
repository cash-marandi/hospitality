import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ROOMS, zar } from "@/lib/data";

export const metadata = {
  title: "Stay · Rooms & rates from R950",
  description: "Standard, Executive and Family rooms in Mbombela with aircon, DSTV, WiFi and breakfast options. Instant EFT quotation, no card needed.",
  alternates: { canonical: "/stay" },
};

export default function Stay() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Stay</p>
        <h1 className="font-display mt-2 text-5xl">Rooms that feel like home.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">Aircon, DSTV, tea & coffee, mini fridge and WiFi in every room. Pick a room, pick dates, get an instant EFT quotation.</p>
      </Reveal>
      <div className="mt-10 grid gap-6">
        {ROOMS.map((r, i) => (
          <Reveal key={r.slug}>
            <div className={`grid overflow-hidden rounded-3xl bg-white shadow-lg md:grid-cols-2 ${i % 2 ? "md:[direction:rtl]" : ""}`}>
              <div className="img-zoom overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={r.image} alt={r.name} className="h-72 w-full object-cover md:h-full" />
              </div>
              <div className="p-8 [direction:ltr]">
                <p className="text-xs uppercase tracking-[0.25em] text-clay-600">Sleeps {r.sleeps} · {r.beds}</p>
                <h2 className="font-display mt-2 text-3xl">{r.name}</h2>
                <p className="mt-2 text-ink-600">{r.blurb}</p>
                <ul className="mt-4 flex flex-wrap gap-2 text-xs">
                  {r.perks.map((p) => (
                    <li key={p} className="rounded-full bg-stone-100 px-3 py-1">{p}</li>
                  ))}
                </ul>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
                  <p>From <strong className="font-display text-2xl">{zar(r.priceFrom)}</strong> / night</p>
                  <Link href={`/book?room=${r.slug}`} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-800">
                    Check dates →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
      <Reveal className="mt-10">
        <div className="overflow-hidden rounded-3xl">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/legacy/img/14a.jpg" alt="Pools and lawns" className="h-64 w-full object-cover" />
        </div>
      </Reveal>
    </div>
  );
}
