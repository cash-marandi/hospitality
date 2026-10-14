"use client";
import { useState } from "react";

// Staff image picker → Cloudinary (folders: maintenance | food | blog).
export default function ImageUpload({
  folder,
  adminKey,
  onUploaded,
}: {
  folder: "maintenance" | "food" | "blog";
  adminKey: string;
  onUploaded: (url: string) => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function upload() {
    if (!file) return;
    setBusy(true);
    setMsg("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", headers: { "x-admin-key": adminKey }, body: fd });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || "Upload failed");
      onUploaded(data.url);
      setFile(null);
      setMsg("Uploaded ✓");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        className="max-w-full text-xs"
      />
      <button
        type="button"
        onClick={upload}
        disabled={!file || busy}
        className="rounded-full bg-forest-900 px-4 py-1.5 text-xs font-semibold text-white disabled:opacity-50"
      >
        {busy ? "Uploading…" : "Upload photo"}
      </button>
      {msg && <span className="text-xs">{msg}</span>}
    </div>
  );
}
