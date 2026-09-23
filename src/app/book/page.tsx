"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import QuoteCard from "@/components/QuoteCard";
import Reveal from "@/components/Reveal";
import { ROOMS, zar } from "@/lib/data";
import type { StayQuote } from "@/lib/quote";
import { Suspense } from "react";

function BookForm() {
  const params = useSearchParams();
  const today = new Date().toISOString().slice(0, 10);
  const [roomSlug, setRoomSlug] = useState(params.get("room") ?? "standard");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [adults, setAdults] = useState(2);
  const [kids, setKids] = useState(0);
  const [breakfast, setBreakfast] = useState(true);
  const [lateCheckout, setLateCheckout] = useState(false);
  const [shuttle, setShuttle] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<StayQuote | null>(null);
  const [error, setError] = useState("");
  const [avail, setAvail] = useState<{ key: string; state: "checking" | "free" | "taken"; msg: string } | null>(null);

  const room = useMemo(() => ROOMS.find((r) => r.slug === roomSlug) ?? ROOMS[0], [roomSlug]);
  const datesValid = !!checkIn && !!checkOut && new Date(checkOut) > new Date(checkIn);
  const valid = datesValid && checkIn >= today && name && (email || phone);
  const availKey = `${roomSlug}|${checkIn}|${checkOut}`;
  // Only show availability for the currently-entered dates (ignores stale async results).
  const liveAvail = avail && avail.key === availKey ? avail : null;

  // Live availability check (server-backed when Mongo is configured).
  // Writes state only inside the async fetch callback — never synchronously.
  useEffect(() => {
    if (!datesValid) return;
    const key = `${roomSlug}|${checkIn}|${checkOut}`;
    let dead = false;
    fetch(`/api/availability?kind=stay&roomSlug=${roomSlug}&checkIn=${checkIn}&checkOut=${checkOut}`)
      .then((r) => r.json())
      .then((d) => {
        if (dead) return;
        if (d.ok && d.available) setAvail({ key, state: "free", msg: "Available for those dates ✓" });
        else if (d.ok) setAvail({ key, state: "taken", msg: "Already held — try nearby dates or WhatsApp us." });
      })
      .catch(() => {});
    return () => {
      dead = true;
    };
  }, [roomSlug, checkIn, checkOut, datesValid]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!valid) {
      setError("Add valid dates (checkout after check-in) plus your name and email or phone.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "stay",
          input: { roomSlug, checkIn, checkOut, adults, kids, extras: { breakfast, lateCheckout, shuttle }, name, email, phone, notes },
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        const issues = data?.issues?.fieldErrors
          ? Object.values(data.issues.fieldErrors).flat().join(" ")
          : "";
        setError(data.error || "Could not generate quotation." + (issues ? ` ${issues}` : ""));
        return;
      }
      setQuote(data.quote);
      try {
        const key = "nh-quotes";
        const prev = JSON.parse(localStorage.getItem(key) ?? "[]");
        localStorage.setItem(key, JSON.stringify([{ kind: "stay", ...data.quote }, ...prev].slice(0, 50)));
      } catch {}
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Could not generate quotation. Please try again or WhatsApp us.");
    } finally {
      setLoading(false);
    }
  }

  if (quote) {
    const waText = `Hello Nutting House! Booking ${quote.reference} — ${quote.room}, ${quote.input.checkIn} to ${quote.input.checkOut} (${quote.nights} nights), ${quote.input.adults} adults + ${quote.input.kids} kids. Total ${zar(quote.total)}. Name: ${quote.input.name}. I will EFT with reference ${quote.reference}.`;
    return (
      <div className="mx-auto max-w-3xl px-6 py-14">
        <Reveal>
          <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Thank you, {quote.input.name.split(" ")[0]} ✓</p>
          <h1 className="font-display mt-2 text-4xl">Your quotation is ready.</h1>
          <p className="mt-2 text-ink-600">No card needed — EFT the deposit with your reference, then send proof on WhatsApp. Dates held 48h on proof.</p>
        </Reveal>
        <div className="mt-8">
          <QuoteCard
            title="Stay quotation · manual EFT"
            reference={quote.reference}
            lines={quote.lines}
            total={quote.total}
            depositDue={quote.depositDue}
            meta={[quote.room, `${quote.input.checkIn} → ${quote.input.checkOut}`, `${quote.nights} night${quote.nights > 1 ? "s" : ""}`]}
            whatsappText={waText}
          />
        </div>
        <button onClick={() => setQuote(null)} className="no-print mt-6 text-sm font-semibold text-clay-600 underline">
          ← Make another quotation
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Book · manual EFT</p>
        <h1 className="font-display mt-2 text-5xl">Check availability, get a quote.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">30 seconds. Instant auto-generated quotation with banking details. Pay later by EFT — card payments (Paystack/Stripe) plug into this same reference later.</p>
      </Reveal>
      <form onSubmit={submit} className="mt-10 grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="grid gap-5 rounded-3xl bg-white p-7 shadow-lg">
          <div>
            <label className="text-sm font-semibold">Room</label>
            <div className="mt-2 grid gap-2 sm:grid-cols-3">
              {ROOMS.map((r) => (
                <button
                  type="button"
                  key={r.slug}
                  onClick={() => setRoomSlug(r.slug)}
                  className={`rounded-2xl border p-4 text-left ${roomSlug === r.slug ? "border-clay-500 bg-stone-100" : "border-black/10"}`}
                >
                  <p className="font-semibold">{r.name}</p>
                  <p className="text-xs">Sleeps {r.sleeps} · {zar(r.priceFrom)}/night</p>
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Check-in<input type="date" required min={today} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold">Check-out<input type="date" required min={today} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold">Adults
              <select value={adults} onChange={(e) => setAdults(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2.5">
                {[1, 2, 3, 4].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
            <label className="text-sm font-semibold">Kids
              <select value={kids} onChange={(e) => setKids(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2.5">
                {[0, 1, 2, 3].map((n) => <option key={n} value={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <div className="grid gap-2 text-sm">
            {[
              ["Breakfast (R180 pp/night)", breakfast, setBreakfast],
              ["Late checkout to 12:00 (R250)", lateCheckout, setLateCheckout],
              ["KMIA airport shuttle return (R900)", shuttle, setShuttle],
            ].map(([label, val, set]) => (
              <label key={label as string} className="flex items-center gap-3 rounded-xl bg-stone-100 px-4 py-3">
                <input type="checkbox" checked={val as boolean} onChange={(e) => (set as (v: boolean) => void)(e.target.checked)} className="h-4 w-4" />
                {label as string}
              </label>
            ))}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">Full name*<input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Thandi Mokoena" autoComplete="name" className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold">Phone (or email below)*<input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="072 000 0000" autoComplete="tel" className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Email (or phone above)*<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.co.za" autoComplete="email" className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
            <label className="text-sm font-semibold sm:col-span-2">Notes (dietary, cot, arrival time)<textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-xl border px-3 py-2.5" /></label>
          </div>
          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {liveAvail && (
            <p
              className={`rounded-xl px-4 py-3 text-sm ${
                liveAvail.state === "free" ? "bg-green-50 text-green-800" : "bg-amber-50 text-amber-800"
              }`}
            >
              {liveAvail.msg}
            </p>
          )}
          <button disabled={loading || liveAvail?.state === "taken"} className="rounded-full bg-forest-900 px-8 py-4 font-semibold text-white hover:bg-forest-800 disabled:opacity-50">
            {loading ? "Generating quotation…" : "Generate my quotation →"}
          </button>
          <p className="text-xs text-ink-600">No payment now. You&apos;ll get reference + EFT details next.</p>
        </div>
        <aside className="h-fit rounded-3xl bg-forest-950 p-6 text-stone-100 shadow-lg lg:sticky lg:top-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={room.image} alt={room.name} className="h-44 w-full rounded-2xl object-cover" />
          <h3 className="font-display mt-4 text-2xl">{room.name}</h3>
          <p className="text-sm text-stone-300">{room.blurb}</p>
          <p className="mt-3 text-sm">From <strong className="text-lg">{zar(room.priceFrom)}</strong>/night</p>
          <ul className="mt-3 space-y-1 text-xs text-stone-300">{room.perks.map((p) => <li key={p}>✓ {p}</li>)}</ul>
        </aside>
      </form>
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense>
      <BookForm />
    </Suspense>
  );
}
