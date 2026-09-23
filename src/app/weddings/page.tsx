import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = { title: "Weddings | Nutting House" };

export default function Weddings() {
  return (
    <div>
      <section className="relative overflow-hidden bg-forest-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/legacy/img/blog-3.jpg" alt="Dam wedding venue" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/40 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-6 py-28 text-center">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-300">Weddings</p>
            <h1 className="font-display mt-3 text-5xl md:text-6xl">Arrive. Marry. Remember.</h1>
            <p className="mx-auto mt-4 max-w-xl text-stone-200">Terrace garden chapel or the dam at golden hour. In-house team or your planner — milestone EFT payments, zero chaos.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/conference?venue=edamini-dam" className="rounded-full bg-clay-500 px-7 py-3.5 font-semibold text-white">Price the Dam venue →</Link>
              <Link href="/contact" className="rounded-full border border-white/40 px-7 py-3.5 font-semibold">Book a site visit</Link>
            </div>
          </Reveal>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            ["1 · Tell us the dream", "Date, pax, chapel or dam, dinner style. Get an instant estimate with EFT deposit plan."],
            ["2 · Design it together", "Menu tasting, décor, seating, suppliers. One coordinator, one WhatsApp thread."],
            ["3 · Just arrive", "Holding rooms, lawns for photos, sunset at Rali's Rock. Family rooms for the night."],
          ].map(([t, d]) => (
            <Reveal key={t}>
              <div className="rounded-3xl bg-white p-7 shadow-lg">
                <p className="font-display text-2xl">{t}</p>
                <p className="mt-2 text-sm text-ink-600">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10">
          <div className="grid gap-4 md:grid-cols-3">
            {["/legacy/img/hero_home_1a.jpg", "/legacy/img/local_amenities_3aa.jpg", "/legacy/img/16.jpg"].map((s) => (
              <div key={s} className="img-zoom overflow-hidden rounded-3xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s} alt="Wedding at Nutting House" className="h-64 w-full object-cover" />
              </div>
            ))}
          </div>
        </Reveal>
      </section>
    </div>
  );
}
