import Reveal from "@/components/Reveal";

export const metadata = { title: "Explore Mbombela & the Lowveld | Nutting House" };

const CARDS = [
  { img: "/legacy/img/att.jpg", t: "Kruger National Park", d: "Big-five day trips — we pack breakfast and arrange shuttles." },
  { img: "/legacy/img/att2.jpg", t: "Blyde River Canyon", d: "God's Window, Bourke's Luck, Three Rondavels — rugged escarpment views." },
  { img: "/legacy/img/att3.jpg", t: "Macadamia orchards", d: "Walk the farm edges at golden hour, right by Rali's Rock." },
  { img: "/legacy/img/horse.jpg", t: "On-site activities", d: "Pools, lawns, team-building fields, birdlife at the dam." },
  { img: "/legacy/img/local_amenities_1a.jpg", t: "Mbombela city", d: "Restaurants, malls and KMIA airport minutes away." },
  { img: "/legacy/img/local_amenities_2a.jpg", t: "Slow afternoons", d: "Ducks, geese and swans on Edamini. Bench, book, breathe." },
];

export default function Explore() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Explore</p>
        <h1 className="font-display mt-2 text-5xl">The Lowveld is the after-party.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">Stay a night before your Kruger safari or add a slow day after your conference. This is why guests call it home.</p>
      </Reveal>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CARDS.map((c) => (
          <Reveal key={c.t}>
            <div className="img-zoom overflow-hidden rounded-3xl bg-white shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.img} alt={c.t} className="h-52 w-full object-cover" />
              <div className="p-5">
                <p className="font-display text-xl">{c.t}</p>
                <p className="mt-1 text-sm text-ink-600">{c.d}</p>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
