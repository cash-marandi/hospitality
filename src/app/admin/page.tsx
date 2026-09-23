"use client";
import { useEffect, useState } from "react";
import { zar } from "@/lib/data";

type Q = {
  kind: string;
  reference: string;
  total: number;
  room?: string;
  venue?: string;
  createdAt: string;
  input: { name?: string; phone?: string; email?: string; checkIn?: string; checkOut?: string; date?: string; pax?: number };
};

const HOUSEKEEPING = [
  { room: "Standard 1–6", state: "Ready", color: "bg-green-100 text-green-800" },
  { room: "Executive 1–4", state: "Cleaning", color: "bg-amber-100 text-amber-800" },
  { room: "Family 1–3", state: "Inspection", color: "bg-blue-100 text-blue-800" },
];

const SHIFTS = [
  { who: "Front desk ×2", when: "06:00–14:00 / 14:00–22:00" },
  { who: "Housekeeping ×4", when: "08:00–16:00" },
  { who: "Kitchen ×5 + bar ×2", when: "Split: breakfast + functions" },
  { who: "Grounds & maintenance", when: "07:00–15:00" },
];

export default function Admin() {
  const [quotes, setQuotes] = useState<Q[]>([]);
  useEffect(() => {
    try {
      setQuotes(JSON.parse(localStorage.getItem("nh-quotes") ?? "[]"));
    } catch {}
  }, []);
  const revenue = quotes.reduce((t, q) => t + (q.total || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Staff · CRM lite</p>
      <h1 className="font-display mt-2 text-4xl">Today at Nutting House.</h1>
      <p className="mt-2 text-sm text-ink-600">
        Demo CRM: quotations made on <em>this device</em> appear here. Server copies append to <code>data/quotes.jsonl</code>. Wire to Postgres/Supabase + Resend + WhatsApp API next.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Quotations (this device)", String(quotes.length)],
          ["Pipeline value", zar(revenue)],
          ["Deposit due (50%)", zar(Math.round(revenue / 2))],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-forest-950 p-6 text-stone-100">
            <p className="text-xs uppercase tracking-widest text-stone-300">{l}</p>
            <p className="font-display mt-1 text-3xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Latest quotations</h2>
          {quotes.length === 0 && <p className="mt-3 text-sm text-ink-600">None yet — <a href="/book" className="underline">create one</a> and it will land here.</p>}
          <ul className="mt-4 divide-y text-sm">
            {quotes.slice(0, 10).map((q) => (
              <li key={q.reference} className="flex items-center justify-between gap-3 py-2">
                <span>
                  <strong>{q.reference}</strong> · {q.room ?? q.venue} · {q.input?.name}
                  <span className="block text-xs text-ink-600">{q.input?.checkIn ? `${q.input.checkIn} → ${q.input.checkOut}` : `${q.input?.date} · ${q.input?.pax} pax`} · {q.input?.phone}</span>
                </span>
                <span className="font-semibold">{zar(q.total)}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Housekeeping board</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {HOUSEKEEPING.map((h) => (
                <li key={h.room} className="flex items-center justify-between rounded-xl bg-stone-100 px-4 py-2">
                  {h.room}
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${h.color}`}>{h.state}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Shifts today</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SHIFTS.map((s) => (
                <li key={s.who} className="flex items-center justify-between gap-3 rounded-xl bg-stone-100 px-4 py-2">
                  <strong>{s.who}</strong><span className="text-xs">{s.when}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-600">Next: rota builder, leave, clock-in, maintenance tickets with photos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
