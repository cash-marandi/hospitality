"use client";
import { useState } from "react";
import Reveal from "./Reveal";

const FAQS = [
  {
    q: "What are check-in and check-out times?",
    a: "Check-in from 14:00, check-out at 10:00. Late checkout to 12:00 is available as a R250 extra when you book.",
  },
  {
    q: "How do quotations and payments work?",
    a: "Pick dates and get an instant quotation with a reference — no card needed. EFT the 50% deposit using your reference, then send proof on WhatsApp. Dates are held 48 hours on proof.",
  },
  {
    q: "How many guests can you host for conferences?",
    a: "Up to 800 in the Main Hall and 2 000+ on a full-property buyout across four detached venues — your event stays private either way.",
  },
  {
    q: "Do you host weddings?",
    a: "Yes — the terrace garden chapel and Edamini dam are made for weddings, with holding rooms, lawns for photos and sunset spots at Rali's Rock.",
  },
  {
    q: "Is there parking, WiFi and food?",
    a: "Secure guarded parking, high-speed WiFi, bar and buffet, plus a kitchen that caters for dietary needs. Kruger and KMIA airport shuttles can be arranged.",
  },
];

export function FaqSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export default function HomeFaq() {
  const [open, setOpen] = useState(0);
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Good to know</p>
        <h2 className="font-display mt-3 text-4xl md:text-5xl">Questions, answered.</h2>
      </Reveal>
      <div className="mt-8 divide-y divide-forest-800/10 rounded-3xl border border-forest-800/10 bg-white shadow-sm">
        {FAQS.map((f, i) => (
          <div key={f.q}>
            <button
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-semibold focus-visible:outline-2 focus-visible:outline-clay-500"
            >
              {f.q}
              <span className="text-clay-600" aria-hidden="true">
                {open === i ? "−" : "+"}
              </span>
            </button>
            {open === i && <p className="px-6 pb-6 leading-relaxed text-ink-600">{f.a}</p>}
          </div>
        ))}
      </div>
    </section>
  );
}
