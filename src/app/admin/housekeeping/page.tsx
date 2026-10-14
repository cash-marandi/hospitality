"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";

type Task = { _id: string; room: string; state: string; note?: string; photoUrl?: string; updatedBy?: string };
const STATES = ["Ready", "Cleaning", "Inspection", "Out of order"];

export default function HousekeepingPage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [room, setRoom] = useState("");
  const [note, setNote] = useState("");
  const [by, setBy] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const res = await fetch("/api/admin/housekeeping", { headers: { "x-admin-key": adminKey } });
      const d = await res.json();
      if (!res.ok || !d.ok) throw new Error(d.error || "Load failed");
      setTasks(d.tasks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Load failed");
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function save(roomName: string, state: string) {
    await fetch("/api/admin/housekeeping", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ room: roomName, state, note, updatedBy: by }),
    });
    setNote("");
    void load();
  }

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!room.trim()) return;
    await save(room.trim(), "Inspection");
    setRoom("");
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Housekeeping</p>
      <h1 className="font-display mt-2 text-4xl">Room task queue.</h1>
      {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <form onSubmit={add} className="mt-6 flex flex-wrap gap-2 rounded-3xl bg-white p-4 shadow-lg">
        <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="Room, e.g. Standard 3" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="Note (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={by} onChange={(e) => setBy(e.target.value)} placeholder="Your name" className="rounded-xl border px-3 py-2 text-sm" />
        <button className="rounded-full bg-forest-900 px-5 py-2 text-sm font-semibold text-white">Add room →</button>
      </form>
      <ul className="mt-6 grid gap-3">
        {tasks.map((t) => (
          <li key={t._id} className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-5 py-3 shadow">
            <span>
              <strong>{t.room}</strong>
              {t.note && <span className="block text-xs text-ink-600">{t.note}</span>}
              {t.updatedBy && <span className="block text-xs text-ink-600">by {t.updatedBy}</span>}
            </span>
            <select
              value={t.state}
              onChange={(e) => void save(t.room, e.target.value)}
              className="rounded-full bg-stone-100 px-4 py-2 text-sm font-semibold"
            >
              {STATES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
          </li>
        ))}
      </ul>
      {tasks.length === 0 && <p className="mt-4 text-sm text-ink-600">No rooms yet — add the first one above.</p>}
    </div>
  );
}
