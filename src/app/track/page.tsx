"use client";
import { Suspense, useState } from "react";
import QuoteCard from "@/components/QuoteCard";
import { zar } from "@/lib/data";

type Quote = {
  reference: string;
  room?: string;
  venue?: string;
  nights?: number;
  lines: { label: string; amount: number }[];
  total: number;
  depositDue: number;
  input: {
    name: string;
    checkIn?: string;
    checkOut?: string;
    date?: string;
    days?: number;
    pax?: number;
    layout?: string;
    adults?: number;
    kids?: number;
  };
};

function TrackForm() {
  const [ref, setRef] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function lookup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setQuote(null);
    const clean = ref.trim().toUpperCase();
    if (clean.length < 6) {
      setError("Enter your full reference, e.g. NH-STAY-2026-ABC123.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/quote/${encodeURIComponent(clean)}`);
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Quotation not found");
      setQuote(data.quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Lookup failed. WhatsApp us with your reference.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">My booking</p>
      <h1 className="font-display mt-2 text-4xl">Find your quotation.</h1>
      <form onSubmit={lookup} className="mt-6 flex flex-wrap gap-2">
        <input
          value={ref}
          onChange={(e) => setRef(e.target.value)}
          placeholder="NH-STAY-2026-XXXXXX"
          className="w-full max-w-sm rounded-xl border px-4 py-3 uppercase"
        />
        <button disabled={busy} className="rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Looking up…" : "Look up →"}
        </button>
      </form>
      {error && <p className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {quote && (
        <div className="mt-8">
          <QuoteCard
            title={quote.room ? "Stay quotation · manual EFT" : "Event estimate · EFT"}
            reference={quote.reference}
            lines={quote.lines}
            total={quote.total}
            depositDue={quote.depositDue}
            meta={[
              quote.room ?? quote.venue ?? "",
              quote.input.checkIn ? `${quote.input.checkIn} → ${quote.input.checkOut}` : `${quote.input.date} · ${quote.input.pax} pax`,
              quote.nights ? `${quote.nights} nights` : `${quote.input.days ?? 1} days`,
              `Total ${zar(quote.total)}`,
            ]}
            whatsappText={`Hello Nutting House! Following up on ${quote.reference}. Name: ${quote.input.name}.`}
          />
          <GuestMessage reference={quote.reference} />
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  return (
    <Suspense>
      <TrackForm />
    </Suspense>
  );
}

function GuestMessage({ reference }: { reference: string }) {
  const [name, setName] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);

  async function send(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    if (!name.trim() || !text.trim()) {
      setStatus("Add your name and message.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference, name: name.trim(), text: text.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Send failed");
      setText("");
      setStatus("Message sent — the team will reply on WhatsApp or email. ✓");
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Send failed. Please WhatsApp us instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-6 rounded-3xl border border-forest-800/15 bg-white p-6 shadow-lg">
      <h2 className="font-display text-2xl">Message the team</h2>
      <p className="mt-1 text-sm text-ink-600">Questions about {reference}? Write here — it lands in the staff inbox.</p>
      <form onSubmit={send} className="mt-4 grid gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className="w-full rounded-xl border px-3 py-2.5 text-sm" />
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={1000} placeholder="e.g. Can we add one more night?" className="w-full rounded-xl border px-3 py-2.5 text-sm" />
        <button disabled={busy} className="w-fit rounded-full bg-forest-900 px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {busy ? "Sending…" : "Send message →"}
        </button>
      </form>
      {status && <p className="mt-3 text-sm font-medium">{status}</p>}
    </div>
  );
}
