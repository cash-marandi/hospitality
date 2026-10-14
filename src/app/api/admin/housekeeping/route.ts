import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { HousekeepingModel } from "@/models/staff";

const STATES = ["Ready", "Cleaning", "Inspection", "Out of order"];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const tasks = await HousekeepingModel.find({}).sort({ room: 1 }).lean();
  return NextResponse.json({ ok: true, tasks });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const room = String(body?.room ?? "").trim();
  const state = String(body?.state ?? "Inspection");
  if (!room) return NextResponse.json({ ok: false, error: "room is required" }, { status: 400 });
  if (!STATES.includes(state)) return NextResponse.json({ ok: false, error: "Invalid state" }, { status: 400 });
  await dbConnect();
  const task = await HousekeepingModel.findOneAndUpdate(
    { room },
    {
      room,
      state,
      note: String(body?.note ?? ""),
      photoUrl: body?.photoUrl ? String(body.photoUrl) : undefined,
      updatedBy: String(body?.updatedBy ?? ""),
    },
    { new: true, upsert: true }
  ).lean();
  return NextResponse.json({ ok: true, task });
}
