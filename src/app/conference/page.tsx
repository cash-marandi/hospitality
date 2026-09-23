"use client";
import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import QuoteCard from "@/components/QuoteCard";
import Reveal from "@/components/Reveal";
import { VENUES, zar } from "@/lib/data";
import type { VenueQuote } from "@/lib/quote";

function ConfForm() {
  const params = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const [venueSlug, setVenueSlug] = useState(params.get("venue") ?? "main-hall");
  const [date, setDate] = useState("");
  const [days, setDays] = useState(1);
  const [pax, setPax] = useState(50);
  const [layout, setLayout] = useState("Theatre");
  const [catering, setCatering] = useState<"none" | "half" | "full">("full");
  const [av, setAv] = useState(true);
  const [decor, setDecor] = useState(false);
  const [bar, setBar] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<VenueQuote | null>(null);
  const [error, setError] = useState("");

  const venue = useMemo(() => VENUES.find((v) => v.slug === venueSlug) ?? VENUES[0], [venueSlug]);
  const valid = date && date >= today && pax > 0 && name && (email || phone);
  const [avail, setAvail] = useState<{ key: string; msg: string } | null>(null);
  const availKey = `${venueSlug}|${date}|${days}`;
  const liveAvail = avail && avail.key === availKey ? avail.msg : "";
  useEffect(() => {
    if (!(venueSlug && date && date >= today)) return;
    const key = `${venueSlug}|${date}|${days}`;
    let dead = false;
    fetch(`/api/availability?kind=venue&venueSlug=${venueSlug}&date=${date}&days=${days}`)
      .then((r) => r.json())
      .then((d) => {
        if (dead) return;
        if (d.ok && !d.available) setAvail({ key, msg: "Already held — try another date or venue." });
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [venueSlug, date, days, today]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError("Add event date, pax, your name and email or phone.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "venue", input: { venueSlug, date, days, pax, layout, catering, extras: { av, decor, bar }, name, email, phone, notes } }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const issues = data?.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors).flat().join(" ")
          : "";
        setError((data.error || "Could not generate estimate.") + (issues ? ` ${issues}` : ""));
        return;
      }
      setQuote(data.quote);
      try {
        const key = "nh-quotes";
        const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
        localStorage.setItem(key, JSON.stringify([{ kind: "venue", ...data.quote }, ...prev].slice(0, 50)));
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not generate estimate. Please WhatsApp us instead.");
    } finally {
      setLoading(false);
    }
  }

  if (quote) {
    const waText = `Hello Nutting House! Event ${quote.reference} — ${quote.venue}, ${quote.input.date} (${quote.input.days}d), ${quote.input.pax} pax, ${quote.input.layout}, catering: ${quote.input.catering}. Total ${zar(quote.total)}. Name: ${quote.input.name}. I will EFT with reference ${quote.reference}.`;
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Estimate ready ✓</p>
          <h1 className="font-display mt-2 text-4xl">Your event estimate is here.</h1>
          <p className="mt-2 text-ink-600">A coordinator confirms availability within one working day. Pay the 50% deposit by EFT to lock your date.</p>
        </Reveal>
        <div className="mt-8">
          <QuoteCard title="Conference / event estimate · EFT" reference={quote.reference} lines={quote.lines} total={quote.total} depositDue={quote.depositDue} meta={[quote.venue, quote.input.date, `${quote.input.pax} pax · ${quote.input.layout}`]} whatsappText={waText} />
        </div>
        <button onClick={() => setQuote(null)} className="no-print mt-6 text-sm font-semibold text-clay-600 underline">← New estimate</button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Conferences & events</p>
        <h1 className="font-display mt-2 text-5xl">Price your conference in a minute.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">Pick a detached private venue, pax, layout and catering — get an instant estimate with EFT details. Site visits welcome.</p>
      </Reveal>
      <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-5 rounded-3xl bg-white p-7 shadow-lg">
          <div>
            <label className="text-sm font-semibold">Venue</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {VENUES.map((v) => (
                <button type="button" key={v.slug} onClick={() => setVenueSlug(v.slug)} className={`rounded-2xl border p-4 text-left ${venueSlug === v.slug ? "border-clay-500 bg-stone-100" : "border-black/10"}`}>
                  <p className="font-semibold">{v.name}</p>
                  <p className="text-xs">{v.capacity} · {zar(v.priceFrom)}/day</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <label className="text-sm font-semibold">Date*<input type="date" required min={today} value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold">Days
              <select value={days} onChange={(e) => setDays(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2.5">
                {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Delegates*<input type="number" min={5} max={2000} value={pax} onChange={(e) => setPax(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Layout
              <select value={layout} onChange={(e) => setLayout(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5">
                {venue.layouts.map((l) => <option key={l}>{l}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Catering
              <select value={catering} onChange={(e) => setCatering(e.target.value as typeof catering)} className="mt-1 w-full rounded-xl border px-3 py-2.5">
                <option value="none">Venue only</option>
                <option value="half">Half-day (R420 pp/day)</option>
                <option value="full">Full-day (R580 pp/day)</option>
              </select>
            </label>
          </div>
          <div className="grid gap-2 text-sm">
            {[
              ["AV + sound + projector", av, setAv],
              ["Décor & styling", decor, setDecor],
              ["Cash bar service", bar, setBar],
            ].map(([label, val, set]) => (
              <label key={label as string} className="flex items-center gap-3 rounded-xl bg-stone-100 px-4 py-3">
                <input type="checkbox" checked={val as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} className="h-4 w-4" />
                {label as string}
              </label>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Full name*<input required value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold">Phone*<input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Work email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Notes (dietary, programme, breakaways)<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {liveAvail && <p className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{liveAvail}</p>}
          <button disabled={loading || !!liveAvail} className="rounded-full bg-clay-500 px-8 py-4 font-semibold text-white hover:bg-clay-600 disabled:opacity-50">
            {loading ? "Calculating…" : "Generate event estimate →"}
          </button>
        </div>
        <aside className="h-fit rounded-3xl bg-forest-950 p-6 text-stone-100 shadow-lg lg:sticky lg:top-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={venue.image} alt={venue.name} className="h-44 w-full rounded-2xl object-cover" />
          <h3 className="font-display mt-4 text-2xl">{venue.name}</h3>
          <p className="text-sm text-stone-300">{venue.blurb}</p>
          <p className="mt-3 text-sm"><strong>{venue.capacity}</strong> · from {zar(venue.priceFrom)}/day</p>
        </aside>
      </form>
    </div>
  );
}

export default function ConferencePage() {
  return (
    <Suspense>
      <ConfForm />
    </Suspense>
  );
}
