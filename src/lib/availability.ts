import { dbConnect } from "./db";
import { QuoteModel } from "@/models/Quote";
import { hasMongo } from "./env";

export async function stayConflicts(roomSlug: string, checkIn: string, checkOut: string) {
  if (!hasMongo()) return [];
  await dbConnect();
  return QuoteModel.find({
    kind: "stay",
    roomSlug,
    status: { $nin: ["cancelled"] },
    checkIn: { $lt: checkOut },
    checkOut: { $gt: checkIn },
  })
    .select("reference checkIn checkOut status")
    .lean();
}

export async function venueConflicts(venueSlug: string, date: string, days: number) {
  if (!hasMongo()) return [];
  await dbConnect();
  const start = new Date(date);
  const end = new Date(start);
  end.setDate(end.getDate() + Math.max(1, days));
  const endISO = end.toISOString().slice(0, 10);
  const rows = await QuoteModel.find({
    kind: "venue",
    venueSlug,
    status: { $nin: ["cancelled"] },
  })
    .select("reference eventDate days status")
    .lean();
  return rows.filter((r) => {
    const rStart = String(r.eventDate);
    const rEnd = new Date(rStart);
    rEnd.setDate(rEnd.getDate() + Math.max(1, Number(r.days ?? 1)));
    const rEndISO = rEnd.toISOString().slice(0, 10);
    return rStart < endISO && rEndISO > date;
  });
}
