"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";

type Person = { reference: string; room?: string; input?: { name?: string; checkIn?: string; checkOut?: string; adults?: number; kids?: number; phone?: string } };

export default function ArrivalsPage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [data, setData] = useState<{ arrivals: Person[]; departures: Person[]; date: string } | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/briefing", { headers: { "x-admin-key": adminKey } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.ok) throw new Error(d.error || "Load failed");
        setData(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, [adminKey]);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!data) return <p className="text-sm text-ink-600">Loading today&apos;s board…</p>;

  const col = (title: string, list: Person[], empty: string, when: (p: Person) => string | undefined) => (
    <div className="rounded-3xl bg-white p-6 shadow-lg">
      <h2 className="font-display text-2xl">
        {title} <span className="text-base text-ink-600">({list.length})</span>
      </h2>
      <p className="text-xs text-ink-600">{data.date}</p>
      {list.length === 0 && <p className="mt-3 text-sm text-ink-600">{empty}</p>}
      <ul className="mt-4 divide-y text-sm">
        {list.map((p) => (
          <li key={p.reference} className="py-2">
            <strong>{p.input?.name}</strong> · {p.room}
            <span className="block text-xs text-ink-600">
              {p.reference} · {when(p)} · {(p.input?.adults ?? 0) + (p.input?.kids ?? 0)} pax · {p.input?.phone}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Front desk</p>
      <h1 className="font-display mt-2 text-4xl">Arrivals & departures.</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        {col("Checking in", data.arrivals, "No arrivals today.", (p) => p.input?.checkIn)}
        {col("Checking out", data.departures, "No departures today.", (p) => p.input?.checkOut)}
      </div>
    </div>
  );
}
