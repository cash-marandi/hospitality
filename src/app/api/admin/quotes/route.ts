import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { QuoteModel } from "@/models/Quote";
import { env, hasMongo } from "@/lib/env";

export async function GET(req: NextRequest) {
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  if (req.headers.get("x-admin-key") !== env.ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const limit = Math.min(100, Math.max(1, Number(req.nextUrl.searchParams.get("limit") ?? "50")));
  await dbConnect();
  const quotes = await QuoteModel.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  const pipeline = await QuoteModel.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } },
  ]);
  return NextResponse.json({ ok: true, quotes, stats: pipeline[0] ?? { total: 0, count: 0 } });
}
