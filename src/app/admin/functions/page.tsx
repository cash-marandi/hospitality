"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import AdminGate from "@/components/AdminGate";
import { zar } from "@/lib/data";

type Ev = {
  reference: string;
  venue?: string;
  room?: string;
  eventDate?: string;
  checkIn?: string;
  checkOut?: string;
  total: number;
  status: string;
  input?: { name?: string; pax?: number; layout?: string; catering?: string; phone?: string; date?: string };
};

export default function FunctionsPage() {
  return (
    <AdminGate>
      {(key) => <List adminKey={key} />}
    </AdminGate>
  );
}

function List({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<{ events: Ev[]; stays: Ev[] } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/functions", { headers: { "x-admin-key": adminKey } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.ok) throw new Error(d.error || "Load failed");
        setData(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, [adminKey]);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="text-sm text-ink-600">Loading function sheets…</p>;

  const row = (q: Ev) => (
    <li key={q.reference} className="flex flex-wrap items-center justify-between gap-3 py-3">
      <span>
        <strong>{q.venue ?? q.room}</strong> · {q.input?.name}
        <span className="block text-xs text-ink-600">
          {q.reference} · {q.eventDate ?? q.checkIn} · {q.input?.pax ? `${q.input.pax} pax` : ""} {q.status}
        </span>
      </span>
      <span className="flex items-center gap-3">
        <span className="font-semibold">{zar(q.total)}</span>
        <Link href={`/admin/functions/${q.reference}`} className="rounded-full bg-forest-900 px-4 py-1.5 text-xs font-semibold text-white">
          Open sheet →
        </Link>
      </span>
    </li>
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Events</p>
      <h1 className="font-display mt-2 text-4xl">Function sheets.</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Upcoming events ({data.events.length})</h2>
          <ul className="mt-2 divide-y text-sm">{data.events.map(row)}</ul>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Group stays ({data.stays.length})</h2>
          <ul className="mt-2 divide-y text-sm">{data.stays.map(row)}</ul>
        </div>
      </div>
    </div>
  );
}
