import Link from "next/link";
import Reveal from "@/components/Reveal";
import { VENUES, zar } from "@/lib/data";

export const metadata = {
  title: "Venues · Main Hall, Rali's Rock & the Dam",
  description: "4 detached private venues in Mbombela: Main Hall to 800, Rali's Rock sunsets, Edamini dam weddings, boardrooms. Instant event estimates.",
  alternates: { canonical: "/venues" },
};

export default function Venues() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Venues</p>
        <h1 className="font-display mt-2 text-5xl">Detached. Private. Unmistakably Nutting House.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">Every venue runs independently — your conference or wedding never shares the spotlight, even at full capacity.</p>
      </Reveal>
      <div className="mt-10 grid gap-6 md:grid-cols-2">
        {VENUES.map((v) => (
          <Reveal key={v.slug}>
            <div className="overflow-hidden rounded-3xl bg-white shadow-lg">
              <div className="img-zoom overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={v.image} alt={v.name} className="h-64 w-full object-cover" />
              </div>
              <div className="p-7">
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs uppercase tracking-widest">{v.tag}</span>
                <h2 className="font-display mt-2 text-3xl">{v.name}</h2>
                <p className="mt-2 text-ink-600">{v.blurb}</p>
                <p className="mt-3 text-sm"><strong>{v.capacity}</strong> · Layouts: {v.layouts.join(" · ")}</p>
                <p className="mt-1 text-sm">Best for: {v.bestFor.join(", ")}</p>
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm">From <strong className="font-display text-xl">{zar(v.priceFrom)}</strong>/day</p>
                  <Link href={`/conference?venue=${v.slug}`} className="rounded-full bg-clay-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-clay-600">
                    Price this venue →
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
