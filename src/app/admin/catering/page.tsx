"use client";
import { useMemo, useState } from "react";
import AdminGate from "@/components/AdminGate";

const MEALS = {
  breakfast: { label: "Breakfast", perPax: [["Eggs", 2, "each"], ["Bacon / sausage", 120, "g"], ["Starch (pap/potato)", 150, "g"], ["Fruit", 100, "g"], ["Juice", 250, "ml"], ["Coffee / tea", 300, "ml"]] as [string, number, string][] },
  half: { label: "Half-day conference (tea + lunch)", perPax: [["Tea/coffee + rusks", 2, "servings"], ["Lunch protein", 200, "g"], ["Starch", 180, "g"], ["Vegetables", 150, "g"], ["Dessert", 1, "portion"], ["Water", 750, "ml"]] as [string, number, string][] },
  full: { label: "Full-day conference", perPax: [["Tea breaks", 2, "servings"], ["Lunch protein", 220, "g"], ["Starch", 200, "g"], ["Vegetables", 180, "g"], ["Salad", 100, "g"], ["Dessert", 1, "portion"], ["Water", 1, "L"]] as [string, number, string][] },
  banquet: { label: "Wedding banquet", perPax: [["Canapés", 4, "each"], ["Starter", 1, "portion"], ["Main protein", 250, "g"], ["Starch", 180, "g"], ["Vegetables", 150, "g"], ["Wedding cake slice", 1, "each"], ["Wine / bubbly", 375, "ml"]] as [string, number, string][] },
};

export default function CateringPage() {
  return (
    <AdminGate>
      {() => <Calc />}
    </AdminGate>
  );
}

function Calc() {
  const [pax, setPax] = useState(100);
  const [meal, setMeal] = useState<keyof typeof MEALS>("half");
  const [buffer, setBuffer] = useState(10);

  const rows: { item: string; perPax: string; total: string }[] = useMemo(() => {
    return MEALS[meal].perPax.map(([item, qty, unit]) => {
      const total = qty * pax * (1 + buffer / 100);
      const pretty =
        unit === "g"
          ? `${(total / 1000).toFixed(1)} kg`
          : unit === "ml"
            ? `${(total / 1000).toFixed(1)} L`
            : `${Math.ceil(total).toLocaleString()} ${unit}`;
      return { item, perPax: `${qty} ${unit}`, total: pretty };
    });
  }, [pax, meal, buffer]);

  const equipment: [string, string][] = [
    ["Plates", `${Math.ceil(pax * 1.1)}`],
    ["Side plates / bowls", `${Math.ceil(pax * 1.1)}`],
    ["Glasses", `${pax * 2}`],
    ["Cups & saucers", `${Math.ceil(pax * 1.2)}`],
    ["Cutlery sets", `${Math.ceil(pax * 1.2)}`],
    ["Chairs", `${Math.ceil(pax * 1.05)}`],
    ["Round tables (8-seat)", `${Math.ceil(pax / 8)}`],
    ["Tablecloths + 2 spare", `${Math.ceil(pax / 8) + 2}`],
  ];

  return (
    <div>
      <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Kitchen</p>
      <h1 className="font-display mt-2 text-4xl">Catering calculator.</h1>
      <div className="mt-6 grid gap-4 rounded-3xl bg-white p-6 shadow-lg sm:grid-cols-3">
        <label className="text-sm font-semibold">Guests (pax)
          <input type="number" min={5} max={2000} value={pax} onChange={(e) => setPax(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
        <label className="text-sm font-semibold">Meal
          <select value={meal} onChange={(e) => setMeal(e.target.value as keyof typeof MEALS)} className="mt-1 w-full rounded-xl border px-3 py-2">
            {Object.entries(MEALS).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-semibold">Wastage buffer %
          <input type="number" min={0} max={30} value={buffer} onChange={(e) => setBuffer(Number(e.target.value))} className="mt-1 w-full rounded-xl border px-3 py-2" />
        </label>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Quantities · {pax} pax</h2>
          <table className="mt-3 w-full text-sm">
            <thead><tr className="text-left text-xs uppercase text-ink-600"><th className="py-1">Item</th><th>Per pax</th><th>Order</th></tr></thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.item} className="border-t"><td className="py-1.5 font-medium">{r.item}</td><td>{r.perPax}</td><td className="font-semibold">{r.total}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="font-display text-2xl">Equipment checklist</h2>
          <ul className="mt-3 divide-y text-sm">
            {equipment.map(([k, v]) => (
              <li key={k} className="flex justify-between py-1.5"><span>{k}</span><strong>{v}</strong></li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-ink-600">Estimates with buffer included — adjust to the chef&apos;s actuals after each event.</p>
        </div>
      </div>
    </div>
  );
}
