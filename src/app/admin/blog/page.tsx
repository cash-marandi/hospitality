"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import ImageUpload from "@/components/ImageUpload";

type Post = { _id: string; slug: string; title: string; excerpt?: string; body?: string; coverUrl?: string; published: boolean; publishedAt?: string };

export default function BlogAdminPage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [f, setF] = useState({ title: "", slug: "", excerpt: "", body: "", coverUrl: "" });

  const load = () =>
    fetch("/api/admin/posts", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => d.ok && setPosts(d.posts));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.title.trim()) return;
    const res = await fetch("/api/admin/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-key": adminKey },
      body: JSON.stringify({ ...f, published: false }),
    });
    const d = await res.json();
    if (!res.ok || !d.ok) {
      alert(d.error || "Save failed");
      return;
    }
    setF({ title: "", slug: "", excerpt: "", body: "", coverUrl: "" });
    void load();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch("/api/admin/posts", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id, ...body }) });
    void load();
  }

  async function del(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/admin/posts?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
    void load();
  }

  const [editing, setEditing] = useState<Post | null>(null);

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Stories</p>
      <h1 className="font-display mt-2 text-4xl">Blog manager.</h1>
      <form onSubmit={add} className="mt-6 grid gap-2 rounded-3xl bg-white p-6 shadow-lg">
        <input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Post title" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.slug} onChange={(e) => setF({ ...f, slug: e.target.value })} placeholder="slug (auto from title if blank)" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.excerpt} onChange={(e) => setF({ ...f, excerpt: e.target.value })} placeholder="Excerpt (1–2 lines)" className="rounded-xl border px-3 py-2 text-sm" />
        <ImageUpload folder="blog" adminKey={adminKey} onUploaded={(url) => setF((p) => ({ ...p, coverUrl: url }))} />
        {f.coverUrl && <p className="text-xs font-semibold text-green-700">Cover attached ✓</p>}
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white">Create draft →</button>
      </form>

      {editing && (
        <div className="mt-6 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Editing: {editing.title}</h2>
          <textarea
            value={editing.body ?? ""}
            onChange={(e) => setEditing({ ...editing, body: e.target.value })}
            rows={10}
            placeholder="Write the story… blank line = new paragraph"
            className="mt-3 w-full rounded-xl border px-3 py-2 text-sm"
          />
          <input value={editing.excerpt ?? ""} onChange={(e) => setEditing({ ...editing, excerpt: e.target.value })} placeholder="Excerpt" className="mt-2 w-full rounded-xl border px-3 py-2 text-sm" />
          <div className="mt-3 flex gap-2">
            <button onClick={() => editing && void patch(editing._id, { body: editing.body, excerpt: editing.excerpt }).then(() => setEditing(null))} className="rounded-full bg-forest-900 px-5 py-2 text-sm font-semibold text-white">
              Save
            </button>
            <button onClick={() => setEditing(null)} className="rounded-full border px-5 py-2 text-sm font-semibold">Close</button>
          </div>
        </div>
      )}

      <ul className="mt-6 grid gap-3">
        {posts.map((p) => (
          <li key={p._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white px-5 py-3 shadow">
            <span>
              <strong>{p.title}</strong> <span className="text-xs text-ink-600">/{p.slug} · {p.published ? `live ${p.publishedAt ?? ""}` : "draft"}</span>
            </span>
            <span className="flex gap-2 text-xs font-semibold">
              <button onClick={() => setEditing(p)} className="rounded-full bg-stone-100 px-3 py-1.5">Edit</button>
              <button onClick={() => void patch(p._id, { published: !p.published })} className={`rounded-full px-3 py-1.5 text-white ${p.published ? "bg-stone-400" : "bg-green-700"}`}>
                {p.published ? "Unpublish" : "Publish"}
              </button>
              <button onClick={() => void del(p._id)} className="rounded-full bg-red-700 px-3 py-1.5 text-white">Delete</button>
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
