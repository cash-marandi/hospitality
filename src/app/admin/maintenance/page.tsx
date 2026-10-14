"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import ImageUpload from "@/components/ImageUpload";

type T = { _id: string; title: string; location?: string; priority: string; status: string; detail?: string; photoUrl?: string; assignedTo?: string };

export default function MaintenancePage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [items, setItems] = useState<T[]>([]);
  const [f, setF] = useState({ title: "", location: "", priority: "routine", detail: "", photoUrl: "", assignedTo: "" });

  const load = () =>
    fetch("/api/admin/maintenance", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) return;
    await fetch("/api/admin/maintenance", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(f) });
    setF({ title: "", location: "", priority: "routine", detail: "", photoUrl: "", assignedTo: "" });
    void load();
  }

  async function patch(id: string, body: Record<string, string>) {
    await fetch("/api/admin/maintenance", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id, ...body }) });
    void load();
  }

  const open = items.filter((i) => i.status !== "done");

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Fix it fast</p>
      <h1 className="font-display mt-2 text-4xl">Maintenance ({open.length} open).</h1>
      <form onSubmit={add} className="mt-6 grid gap-2 rounded-3xl bg-white p-6 shadow-lg sm:grid-cols-2">
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="What broke? e.g. Leaking tap" className="rounded-xl border px-3 py-2 text-sm sm:col-span-2" />
        <input value={f.location} onChange={(e) => setF({ ...f, location: e.target.value })} placeholder="Where? e.g. Family 2 bathroom" className="rounded-xl border px-3 py-2 text-sm" />
        <select value={f.priority} onChange={(e) => setF({ ...f, priority: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          <option value="urgent">Urgent</option>
          <option value="routine">Routine</option>
          <option value="low">Low</option>
        </select>
        <input value={f.detail} onChange={(e) => setF({ ...f, detail: e.target.value })} placeholder="Detail (optional)" className="rounded-xl border px-3 py-2 text-sm sm:col-span-2" />
        <input value={f.assignedTo} onChange={(e) => setF({ ...f, assignedTo: e.target.value })} placeholder="Assign to (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <div className="sm:col-span-2">
          <ImageUpload folder="maintenance" adminKey={adminKey} onUploaded={(url) => setF((p) => ({ ...p, photoUrl: url }))} />
          {f.photoUrl && <p className="mt-1 text-xs font-semibold text-green-700">Photo attached ✓</p>}
        </div>
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">Log ticket →</button>
      </form>
      <ul className="mt-6 grid gap-3">
        {items.map((t) => (
          <li key={t._id} className="rounded-2xl bg-white px-5 py-4 shadow">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong>{t.title}</strong> <span className="text-xs text-ink-600">· {t.location}</span>
                {t.detail && <span className="block text-xs text-ink-600">{t.detail}</span>}
                <span className="block text-xs text-ink-600">
                  {t.priority} · {t.status} {t.assignedTo && `· → ${t.assignedTo}`}
                </span>
              </span>
              <span className="flex gap-2 text-xs font-semibold">
                <select value={t.status} onChange={(e) => void patch(t._id, { status: e.target.value })} className="rounded-full bg-stone-100 px-3 py-1.5">
                  <option value="open">Open</option>
                  <option value="in_progress">In progress</option>
                  <option value="done">Done</option>
                </select>
              </span>
            </div>
            {t.photoUrl && (
              <a href={t.photoUrl} target="_blank" className="mt-1 inline-block text-xs font-semibold text-clay-600 underline">View photo →</a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
