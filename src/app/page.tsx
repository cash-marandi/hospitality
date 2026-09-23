import Link from "next/link";
import Reveal from "@/components/Reveal";
import { ROOMS, VENUES, zar } from "@/lib/data";
import { SITE } from "@/lib/site";

function Stat({ n, label }: { n: string; label: string }) {
  return (
    <div className="text-center">
      <p className="font-display text-4xl text-stone-100 md:text-5xl">{n}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.25em] text-stone-300">{label}</p>
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* HERO — story chapter 1 */}
      <section className="hero-grain relative flex min-h-[92vh] items-end overflow-hidden bg-forest-950 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/legacy/img/hero_home_1.jpg" alt="Nutting House lawns" className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/30 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-16 pt-40">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-300">Mbombela · Mpumalanga · Est. 21 years</p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
              A serene home, <em className="text-stone-200">away</em> from home.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-200">
              Sprawling lawns, Lowveld sunsets, a dam that slows time. Sleep over, marry here, or bring 800 delegates in one hall — 2 000+ on a full-property buyout. You only have to arrive.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="rounded-full bg-clay-500 px-7 py-3.5 font-semibold text-white shadow-xl hover:bg-clay-600">
                Check availability →
              </Link>
              <Link href="/venues" className="rounded-full border border-white/40 px-7 py-3.5 font-semibold text-white backdrop-blur hover:bg-white/10">
                Wander the venues
              </Link>
            </div>
            <p className="mt-4 text-xs text-stone-300">Instant quotation · Pay by EFT · No card needed · {SITE.grading}</p>
          </Reveal>
        </div>
      </section>

      {/* marquee */}
      <div className="overflow-hidden border-y border-forest-800/10 bg-stone-200 py-3">
        <div className="marquee-track flex w-max gap-10 text-sm uppercase tracking-[0.3em] text-forest-800">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Family rooms", "Weddings at the dam", "800 in one hall", "Rali's Rock sunsets", "Pools & lawns", "Bar & buffet"].map((t, i) => (
              <span key={`${k}-${i}`}>✦ {t}</span>
            ))
          )}
        </div>
      </div>

      {/* chapter 2 — story */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="img-zoom overflow-hidden rounded-3xl shadow-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/legacy/img/13.jpg" alt="Nutting House experience" className="h-[420px] w-full object-cover" />
            </div>
          </Reveal>
          <Reveal slow>
            <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Chapter 01 — The place</p>
            <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">You have to see it to believe it.</h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              Nutting House grew over 21 years from a quiet lodge into Mpumalanga&apos;s market leader for stays, conferences and
              celebrations. Multiple detached venues mean your event is always private — even when the whole property is alive.
            </p>
            <div className="mt-6 grid grid-cols-3 gap-4 rounded-2xl bg-forest-900 p-6 text-white">
              <Stat n="21+" label="Years" />
              <Stat n="800+" label="One hall" />
              <Stat n="4" label="Venues" />
            </div>
            <Link href="/stay" className="mt-6 inline-block font-semibold text-clay-600 underline">Sleep here first →</Link>
          </Reveal>
        </div>
      </section>

      {/* chapter 3 — rooms */}
      <section className="bg-forest-950 py-20 text-stone-100">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-300">Chapter 02 — The rooms</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl">Standard. Executive. Family.</h2>
              <Link href="/book" className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-forest-950">Get instant quote →</Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ROOMS.map((r, i) => (
              <Reveal key={r.slug} className={i === 1 ? "md:-translate-y-4" : ""}>
                <div className="img-zoom group overflow-hidden rounded-3xl bg-forest-900 ring-1 ring-white/10">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.name} className="h-56 w-full object-cover" />
                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.25em] text-stone-300">Sleeps {r.sleeps} · {r.beds}</p>
                    <h3 className="font-display mt-2 text-2xl">{r.name}</h3>
                    <p className="mt-2 text-sm text-stone-300">{r.blurb}</p>
                    <p className="mt-4 text-sm">From <strong className="text-lg">{zar(r.priceFrom)}</strong> / night</p>
                    <Link href={`/book?room=${r.slug}`} className="mt-4 inline-block rounded-full bg-clay-500 px-5 py-2.5 text-sm font-semibold text-white group-hover:bg-clay-600">
                      Book {r.name} →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* chapter 4 — venues */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Chapter 03 — The venues</p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl md:text-5xl">Four worlds. One property. All yours.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {VENUES.map((v) => (
            <Reveal key={v.slug}>
              <Link href="/conference" className="img-zoom relative block overflow-hidden rounded-3xl shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.image} alt={v.name} className="h-80 w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-forest-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-0 p-6 text-white">
                  <span className="rounded-full bg-white/15 px-3 py-1 text-xs uppercase tracking-widest backdrop-blur">{v.tag}</span>
                  <h3 className="font-display mt-2 text-3xl">{v.name}</h3>
                  <p className="text-sm text-stone-200">{v.capacity} · from {zar(v.priceFrom)}/day</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* chapter 5 — wedding CTA */}
      <section className="relative overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/legacy/img/hero_home_1a.jpg" alt="Wedding" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center text-white">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-300">Chapter 04 — The vows</p>
            <h2 className="font-display mt-3 text-4xl md:text-6xl">All the bride needs to do is arrive.</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-200">Terrace garden chapel or the dam at golden hour — in-house team or your planner. Milestone EFT payments, no stress.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/weddings" className="rounded-full bg-stone-100 px-7 py-3.5 font-semibold text-forest-950">Plan a wedding →</Link>
              <Link href="/conference" className="rounded-full border border-white/40 px-7 py-3.5 font-semibold">Price your event →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* facilities strip */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-4 text-center md:grid-cols-4">
          {[
            ["Secure parking", "Gated, guarded, easy coaches"],
            ["High-speed WiFi", "Work from the lawn if you must"],
            ["Bar & buffet", "Kitchen for every diet"],
            ["Pools & gardens", "Child-friendly, sunset-ready"],
          ].map(([t, d]) => (
            <Reveal key={t}>
              <div className="rounded-2xl border border-forest-800/10 bg-white p-6 shadow-sm">
                <p className="font-display text-xl">{t}</p>
                <p className="mt-1 text-sm text-ink-600">{d}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-10 text-center">
          <Link href="/book" className="inline-block rounded-full bg-forest-900 px-8 py-4 font-semibold text-white hover:bg-forest-800">
            Start with dates — get a quotation in 30 seconds →
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
