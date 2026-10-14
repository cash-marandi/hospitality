"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import { zar } from "@/lib/data";

type Brief = {
  date: string;
  arrivals: { reference: string; room?: string; input?: { name?: string } }[];
  departures: { reference: string; room?: string; input?: { name?: string } }[];
  events: { reference: string; venue?: string; eventDate?: string; input?: { name?: string; pax?: number }; status: string }[];
  money: { _id: string; total: number; deposit: number; count: number }[];
  housekeepingAttention: { room: string; state: string; note?: string }[];
  maintenanceOpen: { title: string; location?: string; priority: string; status: string }[];
};

export default function BriefingPage() {
  return (
    <AdminGate>
      {(key) => <Digest adminKey={key} />}
    </AdminGate>
  );
}

function Digest({ adminKey }: { adminKey: string }) {
  const [b, setB] = useState<Brief | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/briefing", { headers: { "x-admin-key": adminKey } })
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok || !d.ok) throw new Error(d.error || "Load failed");
        setB(d);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Load failed"));
  }, [adminKey]);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!b) return <p className="text-sm text-ink-600">Brewing the morning briefing…</p>;

  const moneyTotal = b.money.reduce((t, m) => t + m.total, 0);
  const depositTotal = b.money.reduce((t, m) => t + m.deposit, 0);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">06:00 digest</p>
      <h1 className="font-display mt-2 text-4xl">Good morning — {b.date}.</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-4">
        {[
          ["Arrivals", String(b.arrivals.length)],
          ["Departures", String(b.departures.length)],
          ["Events ahead", String(b.events.length)],
          ["Pipeline", zar(moneyTotal)],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-forest-950 p-5 text-stone-100">
            <p className="text-xs uppercase tracking-widest text-stone-300">{l}</p>
            <p className="font-display mt-1 text-3xl">{v}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Today&apos;s movement</h2>
          <p className="mt-2 text-sm font-semibold">In ({b.arrivals.length})</p>
          <ul className="text-sm">{b.arrivals.map((a) => <li key={a.reference}>• {a.input?.name} → {a.room} ({a.reference})</li>)}</ul>
          <p className="mt-3 text-sm font-semibold">Out ({b.departures.length})</p>
          <ul className="text-sm">{b.departures.map((a) => <li key={a.reference}>• {a.input?.name} ← {a.room} ({a.reference})</li>)}</ul>
          <h2 className="font-display mt-5 text-2xl">Upcoming events</h2>
          <ul className="mt-2 text-sm">{b.events.map((e) => <li key={e.reference}>• {e.eventDate} — {e.venue} ({e.input?.pax} pax) [{e.status}]</li>)}</ul>
        </div>
        <div className="grid h-fit gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Money watch</h2>
            <ul className="mt-2 text-sm">
              {b.money.map((m) => (
                <li key={m._id}>• {m._id}: {m.count} quotes · {zar(m.total)} (deposits {zar(m.deposit)})</li>
              ))}
            </ul>
            <p className="mt-2 text-sm font-semibold">Deposits outstanding ≈ {zar(depositTotal)}</p>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Needs attention</h2>
            <p className="mt-2 text-sm font-semibold">Housekeeping ({b.housekeepingAttention.length})</p>
            <ul className="text-sm">{b.housekeepingAttention.map((h) => <li key={h.room}>• {h.room} — {h.state}</li>)}</ul>
            <p className="mt-3 text-sm font-semibold">Maintenance ({b.maintenanceOpen.length})</p>
            <ul className="text-sm">{b.maintenanceOpen.map((m, i) => <li key={i}>• [{m.priority}] {m.title} ({m.status})</li>)}</ul>
          </div>
        </div>
      </div>
      <button onClick={() => window.print()} className="no-print mt-6 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white">Print briefing</button>
    </div>
  );
}
