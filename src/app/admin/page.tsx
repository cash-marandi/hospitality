"use client";
import { useEffect, useState } from "react";
import { zar } from "@/lib/data";

type Q = {
  kind: string;
  reference: string;
  total: number;
  room?: string;
  venue?: string;
  status?: string;
  proofUrl?: string;
  createdAt: string;
  input: { name?: string; phone?: string; email?: string; checkIn?: string; checkOut?: string; date?: string; pax?: number };
};

const DEFAULT_HOUSE = [
  { room: "Standard 1–6", state: "Ready" },
  { room: "Executive 1–4", state: "Cleaning" },
  { room: "Family 1–3", state: "Inspection" },
];
const STATES = ["Ready", "Cleaning", "Inspection", "Out of order"];
const stateColor = (s: string) =>
  s === "Ready"
    ? "bg-green-100 text-green-800"
    : s === "Cleaning"
      ? "bg-amber-100 text-amber-800"
      : s === "Inspection"
        ? "bg-blue-100 text-blue-800"
        : "bg-red-100 text-red-800";

const SHIFTS = [
  { who: "Front desk ×2", when: "06:00–14:00 / 14:00–22:00" },
  { who: "Housekeeping ×4", when: "08:00–16:00" },
  { who: "Kitchen ×5 + bar ×2", when: "Split: breakfast + functions" },
  { who: "Grounds & maintenance", when: "07:00–15:00" },
];

function readLocal<T>(k: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(k);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function Admin() {
  const [quotes] = useState<Q[]>(() => readLocal<Q[]>("nh-quotes", []));
  const [house, setHouse] = useState(() => readLocal("nh-house", DEFAULT_HOUSE));
  const [key, setKey] = useState(() =>
    typeof window === "undefined" ? "" : (sessionStorage.getItem("nh-admin-key") ?? "")
  );
  const [authed, setAuthed] = useState(false);
  const [server, setServer] = useState<Q[]>([]);
  const [stats, setStats] = useState<{ total: number; count: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const k = sessionStorage.getItem("nh-admin-key") ?? "";
    if (k) void fetchServer(k);
  }, []);

  function persistHouse(h: typeof DEFAULT_HOUSE) {
    setHouse(h);
    try {
      localStorage.setItem("nh-house", JSON.stringify(h));
    } catch {}
  }

  async function fetchServer(k: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/quotes?limit=50", { headers: { "x-admin-key": k } });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Could not load server quotes");
      setServer(data.quotes);
      setStats(data.stats);
      setAuthed(true);
      sessionStorage.setItem("nh-admin-key", k);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Login failed. Check ADMIN_KEY in .env.local matches.");
      setAuthed(false);
    } finally {
      setLoading(false);
    }
  }

  async function setStatus(reference: string, status: string) {
    try {
      const res = await fetch(`/api/quote/${reference}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "x-admin-key": key },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Update failed");
      setServer((s) => s.map((q) => (q.reference === reference ? { ...q, status } : q)));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Update failed");
    }
  }

  const revenue = quotes.reduce((t, q) => t + (q.total || 0), 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Staff · CRM lite</p>
      <h1 className="font-display mt-2 text-4xl">Today at Nutting House.</h1>

      <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
        <h2 className="font-display text-2xl">Staff access</h2>
        {!authed ? (
          <form
            className="mt-3 flex flex-wrap gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              void fetchServer(key);
            }}
          >
            <input
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="Enter ADMIN_KEY from .env.local"
              className="w-full max-w-sm rounded-xl border px-3 py-2.5 text-sm"
            />
            <button disabled={loading} className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {loading ? "Checking…" : "Unlock server quotes"}
            </button>
            <p className="w-full text-xs text-ink-600">Set a long ADMIN_KEY in .env.local. Without it, only this-device quotes show below.</p>
          </form>
        ) : (
          <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
            <span className="rounded-full bg-green-100 px-3 py-1 font-semibold text-green-800">Server connected</span>
            <button
              onClick={() => {
                sessionStorage.removeItem("nh-admin-key");
                setAuthed(false);
                setServer([]);
                setKey("");
              }}
              className="text-xs font-semibold text-clay-600 underline"
            >
              Lock
            </button>
            <button onClick={() => void fetchServer(key)} className="rounded-full border px-4 py-1.5 text-xs font-semibold">
              Refresh
            </button>
          </div>
        )}
        {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          ["Quotations (server)", String(stats?.count ?? server.length)],
          ["Pipeline value", zar(stats?.total ?? revenue)],
          ["Deposit due (50%)", zar(Math.round((stats?.total ?? revenue) / 2))],
        ].map(([l, v]) => (
          <div key={l} className="rounded-2xl bg-forest-950 p-6 text-stone-100">
            <p className="text-xs uppercase tracking-widest text-stone-300">{l}</p>
            <p className="font-display mt-1 text-3xl">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Latest quotations {authed ? "(server)" : "(this device)"}</h2>
          {(authed ? server : quotes).length === 0 && (
            <p className="mt-3 text-sm text-ink-600">
              None yet — <a href="/book" className="underline">create one</a> and it will land here.
            </p>
          )}
          <ul className="mt-4 divide-y text-sm">
            {(authed ? server : quotes).slice(0, 10).map((q) => (
              <li key={q.reference} className="gap-3 py-3">
                <div className="flex items-center justify-between gap-3">
                  <span>
                    <strong>{q.reference}</strong> · {q.room ?? q.venue} · {q.input?.name}
                    <span className="block text-xs text-ink-600">
                      {q.input?.checkIn ? `${q.input.checkIn} → ${q.input.checkOut}` : `${q.input?.date} · ${q.input?.pax} pax`} ·{" "}
                      {q.input?.phone || q.input?.email}
                    </span>
                  </span>
                  <span className="font-semibold">{zar(q.total)}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                  {q.status && <span className="rounded-full bg-stone-100 px-3 py-1 font-semibold">{q.status}</span>}
                  {q.proofUrl && (
                    <a href={q.proofUrl} target="_blank" className="font-semibold text-clay-600 underline">
                      View proof →
                    </a>
                  )}
                  {authed && (
                    <>
                      <button onClick={() => void setStatus(q.reference, "confirmed")} className="rounded-full bg-green-700 px-3 py-1 font-semibold text-white">
                        Confirm
                      </button>
                      <button onClick={() => void setStatus(q.reference, "cancelled")} className="rounded-full bg-red-700 px-3 py-1 font-semibold text-white">
                        Cancel
                      </button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-6">
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Housekeeping board</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {house.map((h) => (
                <li key={h.room} className="flex items-center justify-between gap-2 rounded-xl bg-stone-100 px-4 py-2">
                  {h.room}
                  <select
                    value={h.state}
                    onChange={(e) => persistHouse(house.map((x) => (x.room === h.room ? { ...x, state: e.target.value } : x)))}
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${stateColor(h.state)}`}
                  >
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-white p-6 shadow-lg">
            <h2 className="font-display text-2xl">Shifts today</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {SHIFTS.map((s) => (
                <li key={s.who} className="flex items-center justify-between gap-3 rounded-xl bg-stone-100 px-4 py-2">
                  <strong>{s.who}</strong><span className="text-xs">{s.when}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-ink-600">Next: rota builder, leave, clock-in, maintenance tickets with photos.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
