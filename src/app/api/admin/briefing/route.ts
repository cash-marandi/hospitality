import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdminOrCron } from "@/lib/adminAuth";
import { QuoteModel } from "@/models/Quote";
import { HousekeepingModel, MaintenanceModel } from "@/models/staff";

const iso = (d: Date) => d.toISOString().slice(0, 10);

// Owner's morning briefing: occupancy, events, money, ops. Vercel cron hits this at 04:00 UTC (06:00 SAST).
export async function GET(req: NextRequest) {
  const denied = requireAdminOrCron(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const today = iso(new Date());

  const [arrivals, departures, events, money, house, maint] = await Promise.all([
    QuoteModel.find({ kind: "stay", status: { $nin: ["cancelled"] }, checkIn: today })
      .select("reference room roomSlug input total status")
      .lean(),
    QuoteModel.find({ kind: "stay", status: { $nin: ["cancelled"] }, checkOut: today })
      .select("reference room roomSlug input")
      .lean(),
    QuoteModel.find({ kind: "venue", status: { $in: ["confirmed", "paid", "proof_received"] }, eventDate: { $gte: today } })
      .sort({ eventDate: 1 })
      .limit(10)
      .select("reference venue eventDate input status total")
      .lean(),
    QuoteModel.aggregate([
      { $match: { status: { $in: ["confirmed", "proof_received", "paid"] } } },
      { $group: { _id: "$status", total: { $sum: "$total" }, deposit: { $sum: "$depositDue" }, count: { $sum: 1 } } },
    ]),
    HousekeepingModel.find({ state: { $ne: "Ready" } }).select("room state note").lean(),
    MaintenanceModel.find({ status: { $ne: "done" } }).select("title location priority status").lean(),
  ]);

  return NextResponse.json({
    ok: true,
    date: today,
    arrivals,
    departures,
    events,
    money,
    housekeepingAttention: house,
    maintenanceOpen: maint,
  });
}
