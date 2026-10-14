"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";

type Thread = { _id: string; count: number; lastText: string; lastFrom: string; lastAt: string };
type Msg = { _id: string; from: string; name: string; text: string; createdAt: string };

export default function InboxPage() {
  return (
    <AdminGate>
      {(key) => <Box adminKey={key} />}
    </AdminGate>
  );
}

function Box({ adminKey }: { adminKey: string }) {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [ref, setRef] = useState("");
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");

  const loadThreads = () =>
    fetch("/api/admin/inbox", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => d.ok && setThreads(d.threads));
  useEffect(() => {
    void loadThreads();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function open(reference: string) {
    setRef(reference);
    const res = await fetch(`/api/admin/inbox?reference=${encodeURIComponent(reference)}`, { headers: { "x-admin-key": adminKey } });
    const d = await res.json();
    if (d.ok) setMsgs(d.messages);
  }

  async function reply(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !ref) return;
    await fetch("/api/admin/inbox", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ reference: ref, text: draft.trim(), name: "Staff" }),
    });
    setDraft("");
    void open(ref);
    void loadThreads();
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Guests</p>
      <h1 className="font-display mt-2 text-4xl">Message inbox.</h1>
      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr]">
        <div className="h-fit rounded-3xl bg-white p-4 shadow-lg">
          <h2 className="font-display px-2 text-xl">Threads ({threads.length})</h2>
          <ul className="mt-2 divide-y text-sm">
            {threads.map((t) => (
              <li key={t._id}>
                <button onClick={() => void open(t._id)} className={`w-full rounded-xl px-3 py-2 text-left hover:bg-stone-100 ${ref === t._id ? "bg-stone-100" : ""}`}>
                  <strong>{t._id}</strong> <span className="text-xs text-ink-600">({t.count})</span>
                  <span className="block truncate text-xs text-ink-600">{t.lastFrom}: {t.lastText}</span>
                </button>
              </li>
            ))}
          </ul>
          {threads.length === 0 && <p className="px-2 py-3 text-xs text-ink-600">No messages yet — guest notes from /track land here.</p>}
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          {!ref && <p className="text-sm text-ink-600">Pick a thread to read and reply.</p>}
          {ref && (
            <>
              <h2 className="font-display text-2xl">{ref}</h2>
              <div className="mt-4 flex max-h-96 flex-col gap-2 overflow-y-auto text-sm">
                {msgs.map((m) => (
                  <div key={m._id} className={`max-w-[85%] rounded-xl px-3 py-2 ${m.from === "staff" ? "self-end bg-forest-900 text-white" : "self-start bg-stone-100"}`}>
                    <p className="text-[11px] opacity-70">{m.name} · {m.from}</p>
                    {m.text}
                  </div>
                ))}
              </div>
              <form onSubmit={reply} className="mt-4 flex gap-2">
                <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Reply as staff…" className="w-full rounded-xl border px-3 py-2 text-sm" />
                <button className="rounded-full bg-forest-900 px-5 py-2 text-sm font-semibold text-white">Send</button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
