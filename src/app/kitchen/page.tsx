import Image from "next/image";
import Reveal from "@/components/Reveal";
import { zar } from "@/lib/data";

export const metadata = {
  title: "From the kitchen · Today at Nutting House",
  description: "See what our chefs are cooking today — breakfast, mains, desserts and function catering in Mbombela.",
  alternates: { canonical: "/kitchen" },
};

type Dish = { _id: string; name: string; description?: string; price?: number; category: string; photoUrl?: string };

async function getDishes(): Promise<Dish[]> {
  try {
    const { hasMongo } = await import("@/lib/env");
    if (!hasMongo()) return [];
    const { dbConnect } = await import("@/lib/db");
    const { DishModel } = await import("@/models/staff");
    await dbConnect();
    return JSON.parse(JSON.stringify(await DishModel.find({ available: true }).sort({ category: 1, createdAt: -1 }).lean()));
  } catch {
    return [];
  }
}

const ORDER = ["Special", "Breakfast", "Mains", "Dessert", "Function"];

export default async function KitchenPage() {
  const dishes = await getDishes();
  const groups = ORDER.map((c) => ({ cat: c, items: dishes.filter((d) => d.category === c) })).filter((g) => g.items.length > 0);

  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">From the kitchen</p>
        <h1 className="font-display mt-2 text-5xl">Today on our tables.</h1>
        <p className="mx-auto mt-3 max-w-2xl text-ink-600">Posted by our chefs — buffet spreads, wedding menus and quiet breakfasts worth waking for.</p>
      </Reveal>
      {groups.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-600">The chefs haven&apos;t posted today&apos;s menu yet — check back soon or WhatsApp us.</p>
      )}
      {groups.map((g) => (
        <section key={g.cat} className="mt-12">
          <Reveal>
            <h2 className="font-display text-3xl">{g.cat}</h2>
          </Reveal>
          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {g.items.map((d) => (
              <Reveal key={d._id}>
                <article className="img-zoom overflow-hidden rounded-3xl bg-white shadow-lg">
                  {d.photoUrl ? (
                    <div className="relative h-52 w-full">
                      <Image src={d.photoUrl} alt={d.name} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                    </div>
                  ) : (
                    <div className="flex h-52 w-full items-center justify-center bg-forest-900 text-4xl text-stone-200">✦</div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-xl">{d.name}</h3>
                    {d.description && <p className="mt-1 text-sm text-ink-600">{d.description}</p>}
                    {d.price !== undefined && <p className="mt-2 font-semibold">{zar(Number(d.price))}</p>}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
