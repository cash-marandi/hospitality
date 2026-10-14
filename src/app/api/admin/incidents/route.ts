import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { IncidentModel } from "@/models/staff";

const TYPES = ["complaint", "incident", "lost", "found"];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const items = await IncidentModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!TYPES.includes(body?.type)) return NextResponse.json({ ok: false, error: "Invalid type" }, { status: 400 });
  if (!String(body?.title ?? "").trim()) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  await dbConnect();
  const item = await IncidentModel.create({
    type: body.type,
    title: String(body.title).trim(),
    detail: String(body.detail ?? ""),
    reference: String(body.reference ?? ""),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    reportedBy: String(body.reportedBy ?? ""),
  });
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  await dbConnect();
  const item = await IncidentModel.findByIdAndUpdate(
    body.id,
    { status: body.status === "resolved" ? "resolved" : "open" },
    { new: true }
  ).lean();
  return NextResponse.json({ ok: true, item });
}
