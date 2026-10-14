import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { QuoteModel } from "@/models/Quote";

// Function sheets source: upcoming confirmed/paid venue + stay bookings.
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const today = new Date().toISOString().slice(0, 10);
  const events = await QuoteModel.find({
    kind: "venue",
    status: { $in: ["confirmed", "paid", "proof_received"] },
    eventDate: { $gte: today },
  })
    .sort({ eventDate: 1 })
    .limit(50)
    .lean();
  const stays = await QuoteModel.find({
    kind: "stay",
    status: { $in: ["confirmed", "paid", "proof_received"] },
    checkOut: { $gte: today },
  })
    .sort({ checkIn: 1 })
    .limit(50)
    .lean();
  return NextResponse.json({ ok: true, events, stays });
}
