import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { MaintenanceModel } from "@/models/staff";

const PRI = ["urgent", "routine", "low"];
const STATES = ["open", "in_progress", "done"];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const status = req.nextUrl.searchParams.get("status");
  const items = await MaintenanceModel.find(status ? { status } : {})
    .sort({ createdAt: -1 })
    .limit(200)
    .lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!String(body?.title ?? "").trim()) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  await dbConnect();
  const item = await MaintenanceModel.create({
    title: String(body.title).trim(),
    location: String(body.location ?? ""),
    priority: PRI.includes(body.priority) ? body.priority : "routine",
    detail: String(body.detail ?? ""),
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    assignedTo: String(body.assignedTo ?? ""),
  });
  return NextResponse.json({ ok: true, item });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  const update: Record<string, string> = {};
  if (body.status && STATES.includes(body.status)) update.status = body.status;
  if (body.priority && PRI.includes(body.priority)) update.priority = body.priority;
  if (body.assignedTo !== undefined) update.assignedTo = String(body.assignedTo);
  await dbConnect();
  const item = await MaintenanceModel.findByIdAndUpdate(body.id, update, { new: true }).lean();
  return NextResponse.json({ ok: true, item });
}
