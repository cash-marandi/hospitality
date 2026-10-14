"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";

const ROLES = ["Front desk", "Housekeeping", "Kitchen", "Bar", "Grounds & maintenance"];

export default function RotaPage() {
  return (
    <AdminGate>
      {(key) => <Tabs adminKey={key} />}
    </AdminGate>
  );
}

function Tabs({ adminKey }: { adminKey: string }) {
  const [tab, setTab] = useState<"shifts" | "leave" | "clock">("shifts");
  const H = { "x-admin-key": adminKey };

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">People</p>
      <h1 className="font-display mt-2 text-4xl">Rota, leave & clock-in.</h1>
      <div className="mt-4 flex gap-2">
        {(["shifts", "leave", "clock"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`rounded-full px-5 py-2 text-sm font-semibold ${tab === t ? "bg-forest-900 text-white" : "bg-white"}`}
          >
            {t === "shifts" ? "Shifts" : t === "leave" ? "Leave" : "Clock-in"}
          </button>
        ))}
      </div>
      <div className="mt-6">{tab === "shifts" ? <Shifts H={H} /> : tab === "leave" ? <Leave H={H} /> : <Clock H={H} />}</div>
    </div>
  );
}

function Shifts({ H }: { H: HeadersInit }) {
  const [items, setItems] = useState<{ _id: string; date: string; role: string; staffName: string; shift: string }[]>([]);
  const [f, setF] = useState({ date: new Date().toISOString().slice(0, 10), role: ROLES[0], staffName: "", shift: "" });
  const load = () =>
    fetch("/api/admin/rota?type=shifts", { headers: H })
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/rota", { method: "POST", headers: { "Content-Type": "application/json", ...H }, body: JSON.stringify({ type: "shift", ...f }) });
    setF({ ...f, staffName: "", shift: "" });
    void load();
  }
  async function del(id: string) {
    await fetch(`/api/admin/rota?id=${id}`, { method: "DELETE", headers: H });
    void load();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={add} className="grid h-fit gap-2 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Add shift</h2>
        <input type="date" value={f.date} onChange={(e) => setF({ ...f, date: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
        <select value={f.role} onChange={(e) => setF({ ...f, role: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>
        <input value={f.staffName} onChange={(e) => setF({ ...f, staffName: e.target.value })} placeholder="Staff name" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.shift} onChange={(e) => setF({ ...f, shift: e.target.value })} placeholder="Hours, e.g. 06:00–14:00" className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white">Add →</button>
      </form>
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Upcoming ({items.length})</h2>
        <ul className="mt-3 divide-y text-sm">
          {items.map((s) => (
            <li key={s._id} className="flex items-center justify-between gap-2 py-2">
              <span>
                <strong>{s.date}</strong> · {s.role} · {s.staffName}
                <span className="block text-xs text-ink-600">{s.shift}</span>
              </span>
              <button onClick={() => void del(s._id)} className="text-xs font-semibold text-red-700 underline">Remove</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Leave({ H }: { H: HeadersInit }) {
  const [items, setItems] = useState<{ _id: string; staffName: string; from: string; to: string; reason: string; status: string }[]>([]);
  const [f, setF] = useState({ staffName: "", from: "", to: "", reason: "" });
  const load = () =>
    fetch("/api/admin/rota?type=leave", { headers: H })
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function add(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/admin/rota", { method: "POST", headers: { "Content-Type": "application/json", ...H }, body: JSON.stringify({ type: "leave", ...f }) });
    setF({ staffName: "", from: "", to: "", reason: "" });
    void load();
  }
  async function decide(id: string, status: string) {
    await fetch("/api/admin/rota", { method: "PATCH", headers: { "Content-Type": "application/json", ...H }, body: JSON.stringify({ type: "leave", id, status }) });
    void load();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form onSubmit={add} className="grid h-fit gap-2 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Request leave</h2>
        <input value={f.staffName} onChange={(e) => setF({ ...f, staffName: e.target.value })} placeholder="Staff name" className="rounded-xl border px-3 py-2 text-sm" />
        <input type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
        <input type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.reason} onChange={(e) => setF({ ...f, reason: e.target.value })} placeholder="Reason (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white">Request →</button>
      </form>
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Requests</h2>
        <ul className="mt-3 divide-y text-sm">
          {items.map((l) => (
            <li key={l._id} className="flex items-center justify-between gap-2 py-2">
              <span>
                <strong>{l.staffName}</strong> · {l.from} → {l.to} · {l.status}
                {l.reason && <span className="block text-xs text-ink-600">{l.reason}</span>}
              </span>
              {l.status === "pending" && (
                <span className="flex gap-2 text-xs font-semibold">
                  <button onClick={() => void decide(l._id, "approved")} className="rounded-full bg-green-700 px-3 py-1 text-white">Approve</button>
                  <button onClick={() => void decide(l._id, "declined")} className="rounded-full bg-red-700 px-3 py-1 text-white">Decline</button>
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Clock({ H }: { H: HeadersInit }) {
  const [items, setItems] = useState<{ staffName: string; date: string; clockIn: string; clockOut: string }[]>([]);
  const [name, setName] = useState("");
  const load = () =>
    fetch("/api/admin/rota?type=clock", { headers: H })
      .then((r) => r.json())
      .then((d) => d.ok && setItems(d.items));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  async function punch(action: "in" | "out") {
    if (!name.trim()) return;
    await fetch("/api/admin/rota", { method: "POST", headers: { "Content-Type": "application/json", ...H }, body: JSON.stringify({ type: "clock", staffName: name.trim(), action }) });
    void load();
  }
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="h-fit rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Clock in / out</h2>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" className="mt-3 w-full rounded-xl border px-3 py-2 text-sm" />
        <div className="mt-3 flex gap-2">
          <button onClick={() => void punch("in")} className="rounded-full bg-green-700 px-6 py-2.5 text-sm font-semibold text-white">Clock in</button>
          <button onClick={() => void punch("out")} className="rounded-full bg-forest-900 px-6 py-2.5 text-sm font-semibold text-white">Clock out</button>
        </div>
        <a href="/api/admin/rota?type=clock&format=csv" className="mt-4 inline-block text-sm font-semibold text-clay-600 underline">
          Download hours (CSV) →
        </a>
        <p className="mt-1 text-xs text-ink-600">CSV uses the staff key from this browser session — if it downloads empty, open it via the unlocked page.</p>
      </div>
      <div className="rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Latest punches</h2>
        <ul className="mt-3 divide-y text-sm">
          {items.slice(0, 20).map((c, i) => (
            <li key={i} className="flex justify-between py-2">
              <span><strong>{c.staffName}</strong> · {c.date}</span>
              <span>{c.clockIn || "—"} → {c.clockOut || "—"}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
