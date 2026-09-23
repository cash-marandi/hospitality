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
