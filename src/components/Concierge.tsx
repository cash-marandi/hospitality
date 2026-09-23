"use client";
import { useState } from "react";
import { SITE } from "@/lib/site";

const FAQS: { q: string[]; a: string }[] = [
  { q: ["price", "cost", "rate", "much"], a: "Standard rooms from R950/night, Executive from R1 250 and Family from R1 450. Use 'Check availability' and you'll get an instant quotation with EFT details — no card needed." },
  { q: ["wedding", "bride", "marry"], a: "Yes — our Dam venue (Edamini) and terrace garden chapel are made for weddings. Open the Weddings page and send a venue quote request; the team replies with availability and a tailored estimate." },
  { q: ["conference", "meeting", "delegate", "capacity", "2000"], a: "We host intimate boardrooms (1A & 1B) up to 2000+ delegates across 4 detached venues. Main Hall divides into 3. Try the Conference quote builder for an instant estimate." },
  { q: ["where", "location", "address", "directions", "map"], a: "Plot 6, Burnside Road, Mbombela, 1201 — close to KMIA airport and Kruger. Tap the Google Maps pin on the Contact page." },
  { q: ["check", "in", "out", "time"], a: "Check-in 14:00, check-out 10:00. Late checkout available as an extra when you book." },
  { q: ["pool", "swim", "kids", "child", "family"], a: "Multiple child-friendly pools, big lawns, DSTV, aircon and tea stations in every room. Families love the Family Room (sleeps 4)." },
  { q: ["wifi", "parking", "food", "bar", "breakfast"], a: "Secure parking, high-speed WiFi, bar + buffet, and a fully equipped kitchen for functions and dietary needs." },
  { q: ["book", "availab", "reserve", "quote"], a: "Hit 'Check availability' — pick dates and a room and you'll get an auto-generated quotation with banking details. Send proof of payment on WhatsApp to confirm." },
  { q: ["human", "call", "phone", "whatsapp"], a: `Call or WhatsApp us on ${SITE.phone} or email ${SITE.email} — a human always answers during the day.` },
];

function answer(input: string): string {
  const t = input.toLowerCase();
  for (const f of FAQS) if (f.q.some((k) => t.includes(k))) return f.a;
  return "Great question — I can help with rooms, venues, weddings, conferences, directions and quotations. Try asking about prices, availability or weddings — or WhatsApp the team directly.";
}

export default function Concierge() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<{ me: boolean; text: string }[]>([
    { me: false, text: "Hello, I'm Nala — Nutting House's concierge. Ask me about rooms, venues, weddings or directions." },
  ]);
  const [draft, setDraft] = useState("");
  const send = (text: string) => {
    const clean = text.trim();
    if (!clean) return;
    setMsgs((m) => [...m, { me: true, text: clean }, { me: false, text: answer(clean) }]);
    setDraft("");
  };
  return (
    <div className="no-print fixed bottom-5 right-5 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[320px] overflow-hidden rounded-2xl border border-forest-800/20 bg-white shadow-2xl">
          <div className="bg-forest-900 px-4 py-3 text-stone-100">
            <p className="font-display text-lg">Nala · Concierge</p>
            <p className="text-xs text-stone-300">Replies instantly · human on WhatsApp</p>
          </div>
          <div className="flex h-72 flex-col gap-2 overflow-y-auto p-3 text-sm">
            {msgs.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-xl px-3 py-2 ${m.me ? "self-end bg-clay-500 text-white" : "self-start bg-stone-200"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <form
            className="flex gap-2 border-t p-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(draft);
            }}
          >
            <input
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask about rooms, weddings…"
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:border-clay-500"
            />
            <button className="rounded-lg bg-forest-900 px-3 text-sm text-white">Send</button>
          </form>
          <a
            href={`https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent("Hello Nutting House! I have a question.")}`}
            target="_blank"
            className="block bg-[#25D366] px-4 py-2 text-center text-sm font-semibold text-white"
          >
            Continue on WhatsApp →
          </a>
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-forest-900 text-2xl text-white shadow-xl hover:bg-forest-800"
        aria-label="Chat"
      >
        {open ? "×" : "◍"}
      </button>
    </div>
  );
}
