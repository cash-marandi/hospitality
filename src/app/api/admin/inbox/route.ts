import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { MessageModel } from "@/models/staff";

// Staff inbox: threads grouped by booking reference.
export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const reference = req.nextUrl.searchParams.get("reference");
  if (reference) {
    const messages = await MessageModel.find({ reference }).sort({ createdAt: 1 }).limit(200).lean();
    return NextResponse.json({ ok: true, messages });
  }
  const threads = await MessageModel.aggregate([
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$reference",
        count: { $sum: 1 },
        lastText: { $first: "$text" },
        lastFrom: { $first: "$from" },
        lastAt: { $first: "$createdAt" },
      },
    },
    { $sort: { lastAt: -1 } },
    { $limit: 100 },
  ]);
  return NextResponse.json({ ok: true, threads });
}

// Staff reply / internal note on a thread.
export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const reference = String(body?.reference ?? "").trim().toUpperCase();
  const text = String(body?.text ?? "").trim();
  if (!reference || !text) return NextResponse.json({ ok: false, error: "reference and text are required" }, { status: 400 });
  if (text.length > 2000) return NextResponse.json({ ok: false, error: "Message too long" }, { status: 400 });
  await dbConnect();
  const message = await MessageModel.create({ reference, from: "staff", name: String(body.name ?? "Staff"), text });
  return NextResponse.json({ ok: true, message });
}
