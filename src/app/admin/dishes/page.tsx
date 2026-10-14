"use client";
import { useEffect, useState } from "react";
import AdminGate from "@/components/AdminGate";
import ImageUpload from "@/components/ImageUpload";
import { zar } from "@/lib/data";

type Dish = { _id: string; name: string; description?: string; price?: number; category: string; photoUrl?: string; available: boolean; postedBy?: string };
const CATS = ["Breakfast", "Mains", "Dessert", "Function", "Special"];

export default function DishesPage() {
  return (
    <AdminGate>
      {(key) => <Board adminKey={key} />}
    </AdminGate>
  );
}

function Board({ adminKey }: { adminKey: string }) {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [f, setF] = useState({ name: "", description: "", price: "", category: "Mains", photoUrl: "", postedBy: "" });

  const load = () =>
    fetch("/api/admin/dishes", { headers: { "x-admin-key": adminKey } })
      .then((r) => r.json())
      .then((d) => d.ok && setDishes(d.dishes));
  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function add(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return;
    await fetch("/api/admin/dishes", { method: "POST", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify(f) });
    setF({ name: "", description: "", price: "", category: "Mains", photoUrl: "", postedBy: "" });
    void load();
  }

  async function patch(id: string, body: Record<string, unknown>) {
    await fetch("/api/admin/dishes", { method: "PATCH", headers: { "Content-Type": "application/json", "x-admin-key": adminKey }, body: JSON.stringify({ id, ...body }) });
    void load();
  }

  async function del(id: string) {
    if (!confirm("Delete this dish?")) return;
    await fetch(`/api/admin/dishes?id=${id}`, { method: "DELETE", headers: { "x-admin-key": adminKey } });
    void load();
  }

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Chef</p>
      <h1 className="font-display mt-2 text-4xl">Post today&apos;s food.</h1>
      <form onSubmit={add} className="mt-6 grid gap-2 rounded-3xl bg-white p-6 shadow-lg sm:grid-cols-2">
        <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Dish name, e.g. Oxtail & mash" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.postedBy} onChange={(e) => setF({ ...f, postedBy: e.target.value })} placeholder="Chef name (optional)" className="rounded-xl border px-3 py-2 text-sm" />
        <input value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Description" className="rounded-xl border px-3 py-2 text-sm sm:col-span-2" />
        <input value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} placeholder="Price R (optional)" inputMode="decimal" className="rounded-xl border px-3 py-2 text-sm" />
        <select value={f.category} onChange={(e) => setF({ ...f, category: e.target.value })} className="rounded-xl border px-3 py-2 text-sm">
          {CATS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
        <div className="sm:col-span-2">
          <ImageUpload folder="food" adminKey={adminKey} onUploaded={(url) => setF((p) => ({ ...p, photoUrl: url }))} />
          {f.photoUrl && <p className="mt-1 text-xs font-semibold text-green-700">Photo attached ✓</p>}
        </div>
        <button className="rounded-full bg-forest-900 px-5 py-2.5 text-sm font-semibold text-white sm:col-span-2">Publish dish →</button>
      </form>
      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {dishes.map((d) => (
          <li key={d._id} className="rounded-3xl bg-white p-5 shadow">
            {d.photoUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={d.photoUrl} alt={d.name} className="h-40 w-full rounded-2xl object-cover" />
            )}
            <p className="mt-3 text-xs uppercase tracking-widest text-clay-600">{d.category}</p>
            <h3 className="font-display text-xl">{d.name}</h3>
            {d.description && <p className="text-sm text-ink-600">{d.description}</p>}
            {d.price !== undefined && <p className="mt-1 font-semibold">{zar(Number(d.price))}</p>}
            <div className="mt-3 flex gap-2 text-xs font-semibold">
              <button onClick={() => void patch(d._id, { available: !d.available })} className={`rounded-full px-3 py-1.5 text-white ${d.available ? "bg-green-700" : "bg-stone-400"}`}>
                {d.available ? "Live ✓" : "Hidden"}
              </button>
              <button onClick={() => void del(d._id)} className="rounded-full bg-red-700 px-3 py-1.5 text-white">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
