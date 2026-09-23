import Reveal from "./Reveal";

// TODO: Replace with real Google reviews before launch (keep names + event types).
const REVIEWS = [
  {
    quote: "The dam at sunset did half our wedding speeches for us. Guests still talk about that evening.",
    name: "Lerato & Sipho",
    detail: "Wedding · Edamini Dam",
  },
  {
    quote: "Four hundred delegates, three breakaways, zero chaos. The detached venues make all the difference.",
    name: "Naledi M.",
    detail: "Conference organiser · Main Hall",
  },
  {
    quote: "Felt like family by breakfast on day two. The family room gave the kids space and us quiet.",
    name: "The van Wyk family",
    detail: "Stay · Family Room",
  },
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Word of mouth</p>
        <h2 className="font-display mx-auto mt-3 max-w-2xl text-4xl leading-tight md:text-5xl">
          Guests arrive curious. They leave family.
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {REVIEWS.map((r) => (
          <Reveal key={r.name}>
            <figure className="flex h-full flex-col rounded-3xl border border-forest-800/10 bg-white p-7 shadow-sm">
              <div className="text-clay-500" aria-label="5 out of 5 stars">
                ★★★★★
              </div>
              <blockquote className="mt-3 flex-1 leading-relaxed text-ink-600">“{r.quote}”</blockquote>
              <figcaption className="mt-5">
                <p className="font-semibold">{r.name}</p>
                <p className="text-xs uppercase tracking-widest text-ink-600">{r.detail}</p>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
