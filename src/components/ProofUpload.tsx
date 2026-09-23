"use client";
import { useState } from "react";

export default function ProofUpload({ reference, onUploaded }: { reference: string; onUploaded?: (url: string) => void }) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [url, setUrl] = useState("");

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("reference", reference);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
      setUrl(data.url);
      setMsg("Proof received — we will confirm within one working day.");
      onUploaded?.(data.url);
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed. Please WhatsApp the proof instead.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-forest-800/15 bg-stone-100 p-4 text-sm">
      <p className="font-semibold">Upload proof of payment (optional)</p>
      <p className="mt-1 text-xs text-ink-600">JPG, PNG, WebP or PDF · max 6MB · stored securely, linked to {reference}.</p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="max-w-full text-xs"
        />
        <button
          type="button"
          onClick={upload}
          disabled={!file || busy}
          className="rounded-full bg-forest-900 px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
        >
          {busy ? "Uploading…" : "Upload proof"}
        </button>
      </div>
      {msg && <p className="mt-2 text-xs font-medium">{msg}</p>}
      {url && (
        <a href={url} target="_blank" className="mt-1 inline-block text-xs font-semibold text-clay-600 underline">
          View uploaded proof →
        </a>
      )}
    </div>
  );
}
