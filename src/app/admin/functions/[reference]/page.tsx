"use client";
import { useEffect, useState } from "react";
import { zar } from "@/lib/data";

type Q = {
  reference: string;
  room?: string;
  venue?: string;
  total: number;
  status: string;
  input?: { name?: string; checkIn?: string; checkOut?: string; date?: string; pax?: number; layout?: string; catering?: string; phone?: string; email?: string };
  lines?: { label: string; amount: number }[];
  proofUrl?: string;
};

export default function FunctionSheet({ params }: { params: Promise<{ reference: string }> }) {
  const [q, setQ] = useState<Q | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    void params.then(({ reference }) =>
      fetch(`/api/quote/${encodeURIComponent(reference)}`)
        .then(async (r) => {
          const d = await r.json();
          if (!r.ok || !d.ok) throw new Error(d.error || "Not found");
          setQ(d.quote);
        })
        .catch((e) => setError(e instanceof Error ? e.message : "Load failed"))
    );
  }, [params]);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!q) return <p className="text-sm text-ink-600">Loading sheet…</p>;

  const rows: [string, string][] = [
    ["Reference", q.reference],
    ["Status", q.status],
    ["Client", `${q.input?.name ?? ""} · ${q.input?.phone ?? ""} ${q.input?.email ?? ""}`],
    ["When", q.input?.checkIn ? `${q.input.checkIn} → ${q.input.checkOut}` : `${q.input?.date}`],
    ["Setup", q.input?.layout ?? q.room ?? q.venue ?? ""],
    ["Pax", String(q.input?.pax ?? "")],
    ["Catering", q.input?.catering ?? ""],
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-xl">
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Function sheet · internal</p>
        <h1 className="font-display mt-2 text-4xl">{q.venue ?? q.room}</h1>
        <table className="mt-6 w-full text-sm">
          <tbody>
            {rows.map(([k, v]) => (
              <tr key={k} className="border-b">
                <td className="py-2 pr-4 font-semibold">{k}</td>
                <td className="py-2">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2 className="font-display mt-6 text-2xl">Priced lines</h2>
        <ul className="mt-2 divide-y text-sm">
          {(q.lines ?? []).map((l) => (
            <li key={l.label} className="flex justify-between py-1.5">
              <span>{l.label}</span>
              <strong>{zar(l.amount)}</strong>
            </li>
          ))}
        </ul>
        <p className="mt-3 font-semibold">Total {zar(q.total)}</p>
        {q.proofUrl && (
          <a href={q.proofUrl} target="_blank" className="mt-2 inline-block text-sm font-semibold text-clay-600 underline">
            View proof of payment →
          </a>
        )}
        <button onClick={() => window.print()} className="no-print mt-6 rounded-full bg-forest-900 px-6 py-3 text-sm font-semibold text-white">
          Print sheet
        </button>
      </div>
    </div>
  );
}
