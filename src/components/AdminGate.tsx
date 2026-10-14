"use client";
import { useEffect, useState, type ReactNode } from "react";

// Staff gate: unlocks once with ADMIN_KEY (stored in sessionStorage),
// then renders children with the key for API calls.
export default function AdminGate({ children }: { children: (key: string) => ReactNode }) {
  const [key, setKey] = useState("");
  const [draft, setDraft] = useState("");
  const [state, setState] = useState<"checking" | "locked" | "open">("checking");
  const [error, setError] = useState("");

  useEffect(() => {
    const k = sessionStorage.getItem("nh-admin-key") ?? "";
    if (!k) {
      setState("locked");
      return;
    }
    fetch("/api/admin/quotes?limit=1", { headers: { "x-admin-key": k } })
      .then((r) => {
        if (!r.ok) throw new Error();
        setKey(k);
        setState("open");
      })
      .catch(() => setState("locked"));
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/admin/quotes?limit=1", { headers: { "x-admin-key": draft } });
      if (!res.ok) throw new Error("Wrong key — check ADMIN_KEY in .env.local");
      sessionStorage.setItem("nh-admin-key", draft);
      setKey(draft);
      setDraft("");
      setState("open");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unlock failed");
    }
  }

  if (state === "checking") {
    return (
      <div className="mx-auto max-w-6xl px-6 py-14">
        <p className="text-sm text-ink-600">Checking staff access…</p>
      </div>
    );
  }
  if (state === "locked") {
    return (
      <div className="mx-auto max-w-md px-6 py-14">
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Staff only</p>
        <h1 className="font-display mt-2 text-3xl">Enter staff key.</h1>
        <form onSubmit={unlock} className="mt-4 grid gap-2">
          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="ADMIN_KEY from .env.local"
            className="w-full rounded-xl border px-3 py-2.5 text-sm"
          />
          <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white">Unlock →</button>
        </form>
        {error && <p className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      </div>
    );
  }
  return <>{children(key)}</>;
}
