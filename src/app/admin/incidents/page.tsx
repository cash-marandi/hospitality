"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";

type I = { _id: string; type: string; title: string; detail?: string; reference?: string; photoUrl?: string; status: string; reportedBy?: string };
const TYPES = ["complaint", "incident", "lost", "found"];

export default function IncidentsPage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<I[]>([]);
  const [f, setF] = useState({ type: "incident", title: "", detail: "", reference: "", reportedBy: "" });

  const load = () =>
    fetch("/api/admin/incidents", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) return;
    await fetch("/api/admin/incidents", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(f) });
    setF({ type: "incident", title: "", detail: "", reference: "", reportedBy: "" });
    void load();
  }

  async function resolve(id: string, status: string) {
    await fetch("/api/admin/incidents", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id, status }) });
    void load();
  }

  const open = items.filter((i) => i.status === "open");

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Trust & safety</p>
      <h1 className="font-display mt-2 text-4xl">Incidents & lost property ({open.length} open).</h1>
      <form onSubmit={add} className="mt-6 grid gap-2 rounded-3xl bg-white p-6 shadow-lg sm:grid-cols-2">
        <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          {TYPES.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
        <input value={f.reportedBy} onChange={(e) => setF({ ...f, reportedBy: e.target.value })} placeholder="Reported by" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Title, e.g. Noise complaint Block B" className="rounded-xl border px-3 py-2 text-sm sm:col-span-2" />
        <input value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} placeholder="Detail (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.reference} onChange={(e) => setF({ ...f, reference: e.target.value })} placeholder="Booking ref (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">Log →</button>
      </form>
      <ul className="mt-6 grid gap-3">
        {items.map((i) => (
          <li key={i._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-5 py-3 shadow">
            <span>
              <strong>[{i.type}] {i.title}</strong>
              {i.detail && <span className="block text-xs text-ink-600">{i.detail}</span>}
              <span className="block text-xs text-ink-600">{i.reference} · {i.reportedBy} · {i.status}</span>
            </span>
            {i.status === "open" ? (
              <button onClick={() => void resolve(i._id, "resolved")} className="rounded-full bg-green-700 px-4 py-1.5 text-xs font-semibold text-white">Resolve</button>
            ) : (
              <button onClick={() => void resolve(i._id, "open")} className="text-xs font-semibold text-clay-600 underline">Reopen</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
