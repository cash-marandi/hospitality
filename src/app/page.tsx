import Image from "next/image";
import Link from "next/link";
import HeroSlideshow from "@/components/HeroSlideshow";
import HomeFaq, { FaqSchema } from "@/components/HomeFaq";
import Reviews from "@/components/Reviews";
import Reveal from "@/components/Reveal";
import { ROOMS, VENUES, zar } from "@/lib/data";
import { SITE } from "@/lib/site";

function Stat({ n, label, light = false }: { n: string; label: string; light?: boolean }) {
  return (
    <div className="text-center">
      <p className={`font-display text-4xl md:text-5xl ${light ? "text-forest-950" : "text-stone-100"}`}>{n}</p>
      <p className={`mt-1 text-xs uppercase tracking-[0.25em] ${light ? "text-ink-600" : "text-stone-300"}`}>{label}</p>
    </div>
  );
}

const GALLERY = [
  { src: "/legacy/img/14a.jpg", alt: "Pools and lawns at Nutting House", span: "md:col-span-2" },
  { src: "/legacy/img/horse.jpg", alt: "Horse riding near Nutting House", span: "" },
  { src: "/legacy/img/att3.jpg", alt: "Macadamia orchards at golden hour", span: "" },
  { src: "/legacy/img/local_amenities_1a.jpg", alt: "Mbombela city minutes away", span: "" },
  { src: "/legacy/img/rooms/opt_16.jpg", alt: "Guest room detail at Nutting House", span: "md:col-span-2" },
];

export default function Home() {
  const wa = `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Nutting House! I'd like to check availability.")}`;
  return (
    <div>
      <FaqSchema />
      {/* HERO */}
      <section className="hero-grain relative flex min-h-[92vh] items-end overflow-hidden bg-forest-950 text-white">
        <HeroSlideshow />
        <div className="absolute inset-0 bg-gradient-to-t from-forest-950/95 via-forest-950/35 to-forest-950/20" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-40">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.35em] text-stone-300">Mbombela · Mpumalanga · Est. 21 years</p>
            <h1 className="font-display mt-4 max-w-3xl text-5xl leading-[1.02] md:text-7xl">
              A serene home, <em className="text-stone-200">away</em> from home.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-stone-200">
              Sleep over, marry here, or host 800 delegates in one hall — on lawns that slow time down.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/book"
                className="rounded-full bg-clay-500 px-8 py-4 font-semibold text-white shadow-xl transition hover:bg-clay-600 focus-visible:outline-2 focus-visible:outline-white"
              >
                Check availability →
              </Link>
              <Link
                href="/venues"
                className="rounded-full border border-white/40 px-7 py-3.5 font-medium text-white backdrop-blur transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
              >
                Wander the venues
              </Link>
            </div>
            <p className="mt-3 text-sm text-stone-200">30-second quote · No card needed</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-white/15 pt-5 text-xs uppercase tracking-[0.2em] text-stone-300">
              <li>21 years in the Lowveld</li>
              <li>4 private venues</li>
              <li>Weddings · Conferences · Family stays</li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="bg-forest-900 text-stone-100">
        <div className="mx-auto grid max-w-6xl grid-cols-3 gap-4 px-6 py-10">
          <Stat n="21+" label="Years" />
          <Stat n="800+" label="In one hall" />
          <Stat n="4" label="Venues" />
        </div>
      </section>

      {/* marquee */}
      <div className="overflow-hidden border-b border-forest-800/10 bg-stone-200 py-3">
        <div className="marquee-track flex w-max gap-10 text-sm uppercase tracking-[0.3em] text-forest-800">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Family rooms", "Weddings at the dam", "800 in one hall", "Rali's Rock sunsets", "Pools & lawns", "Bar & buffet"].map((t, i) => (
              <span key={`${k}-${i}`}>✦ {t}</span>
            ))
          )}
        </div>
      </div>

      {/* chapter 1 — story */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <div className="img-zoom relative h-[420px] overflow-hidden rounded-3xl shadow-xl">
              <Image
                src="/legacy/img/13.jpg"
                alt="Sunlit gardens and walkways at Nutting House"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          <Reveal slow>
            <p className="text-xs uppercase tracking-[0.3em] text-clay-600">The place</p>
            <h2 className="font-display mt-3 text-4xl leading-tight md:text-5xl">You have to see it to believe it.</h2>
            <p className="mt-4 leading-relaxed text-ink-600">
              Nutting House grew over 21 years from a quiet lodge into Mpumalanga&apos;s market leader for stays, conferences and
              celebrations. Multiple detached venues mean your event is always private — even when the whole property is alive.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href="/stay" className="rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white hover:bg-forest-800">
                Sleep here first →
              </Link>
              <Link href="/explore" className="rounded-full border border-forest-900/20 px-6 py-3 text-sm font-semibold text-forest-900 hover:bg-forest-900/5">
                Explore the Lowveld
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* chapter 2 — rooms */}
      <section className="bg-forest-950 py-20 text-stone-100">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-300">The rooms</p>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <h2 className="font-display text-4xl md:text-5xl">Standard. Executive. Family.</h2>
              <Link href="/book" className="rounded-full bg-stone-100 px-6 py-3 text-sm font-semibold text-forest-950">Get instant quote →</Link>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ROOMS.map((r, i) => (
              <Reveal key={r.slug} className={i === 1 ? "md:-translate-y-4" : ""}>
                <div className="img-zoom group overflow-hidden rounded-3xl bg-forest-900 ring-1 ring-white/10">
                  <div className="relative h-56 w-full">
                    <Image src={r.image} alt={`${r.name} — sleeps ${r.sleeps}`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                  </div>
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

      {/* gallery band */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Postcards</p>
            <h2 className="font-display mt-3 text-4xl md:text-5xl">Slow afternoons, golden hours.</h2>
          </div>
          <Link href="/explore" className="font-semibold text-clay-600 underline">See the surroundings →</Link>
        </Reveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {GALLERY.map((g) => (
            <Reveal key={g.src} className={g.span}>
              <div className="img-zoom relative h-64 overflow-hidden rounded-3xl shadow-lg">
                <Image src={g.src} alt={g.alt} fill sizes="(max-width: 768px) 100vw, 25vw" className="object-cover" />
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* chapter 3 — venues */}
      <section className="mx-auto max-w-6xl px-6 pb-20">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600">The venues</p>
          <h2 className="font-display mt-3 max-w-2xl text-4xl md:text-5xl">Four worlds. One property. All yours.</h2>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {VENUES.map((v) => (
            <Reveal key={v.slug}>
              <Link href="/conference" className="img-zoom relative block overflow-hidden rounded-3xl shadow-lg">
                <div className="relative h-80 w-full">
                  <Image src={v.image} alt={`${v.name} — ${v.capacity}`} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                </div>
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

      {/* chapter 4 — wedding CTA */}
      <section className="relative overflow-hidden">
        <Image src="/legacy/img/hero_home_1a.jpg" alt="Couple celebrating at golden hour at Nutting House" fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-forest-950/70" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center text-white">
          <Reveal>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-300">The vows</p>
            <h2 className="font-display mt-3 text-4xl md:text-6xl">All the bride needs to do is arrive.</h2>
            <p className="mx-auto mt-4 max-w-xl text-stone-200">Terrace garden chapel or the dam at golden hour — in-house team or your planner. Milestone EFT payments, no stress.</p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/weddings" className="rounded-full bg-stone-100 px-7 py-3.5 font-semibold text-forest-950">Plan a wedding →</Link>
              <Link href="/conference" className="rounded-full border border-white/40 px-7 py-3.5 font-semibold">Price your event →</Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Reviews />

      {/* facilities strip */}
      <section className="mx-auto max-w-6xl px-6 pb-4">
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
      </section>

      <HomeFaq />

      {/* final CTA */}
      <section className="mx-auto max-w-6xl px-6 pb-24">
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl bg-forest-950 px-6 py-16 text-center text-white shadow-xl">
            <div className="hero-grain absolute inset-0" aria-hidden="true" />
            <div className="relative">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-300">{SITE.grading}</p>
              <h2 className="font-display mx-auto mt-3 max-w-2xl text-4xl md:text-5xl">Your date is waiting.</h2>
              <p className="mx-auto mt-4 max-w-xl text-stone-200">
                Get an instant quotation in 30 seconds — or say hello on WhatsApp and a human will help.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                <Link href="/book" className="rounded-full bg-clay-500 px-8 py-4 font-semibold text-white shadow-xl hover:bg-clay-600">
                  Check availability →
                </Link>
                <a href={wa} target="_blank" className="rounded-full bg-[#25D366] px-8 py-4 font-semibold text-white">
                  WhatsApp us
                </a>
              </div>
              <p className="mt-4 text-sm text-stone-300">{SITE.phone} · {SITE.email}</p>
            </div>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
