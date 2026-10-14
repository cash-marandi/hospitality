import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { ShiftModel, LeaveModel, ClockModel } from "@/models/staff";

const LEAVE_STATES = ["pending", "approved", "declined"];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const type = req.nextUrl.searchParams.get("type") ?? "shifts";
  if (type === "leave") {
    const items = await LeaveModel.find({}).sort({ from: 1 }).limit(200).lean();
    return NextResponse.json({ ok: true, items });
  }
  if (type === "clock") {
    const items = await ClockModel.find({}).sort({ date: -1 }).limit(500).lean();
    if (req.nextUrl.searchParams.get("format") === "csv") {
      const csv = ["staffName,date,clockIn,clockOut", ...items.map((c) => `${c.staffName},${c.date},${c.clockIn},${c.clockOut}`)].join("\n");
      return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": "attachment; filename=clock.csv" } });
    }
    return NextResponse.json({ ok: true, items });
  }
  const from = req.nextUrl.searchParams.get("from") ?? new Date().toISOString().slice(0, 10);
  const items = await ShiftModel.find({ date: { $gte: from } }).sort({ date: 1 }).limit(200).lean();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const type = String(body?.type ?? "shift");
  await dbConnect();
  if (type === "leave") {
    if (!body?.staffName || !body?.from || !body?.to) {
      return NextResponse.json({ ok: false, error: "staffName, from and to are required" }, { status: 400 });
    }
    const item = await LeaveModel.create({
      staffName: String(body.staffName),
      from: String(body.from),
      to: String(body.to),
      reason: String(body.reason ?? ""),
    });
    return NextResponse.json({ ok: true, item });
  }
  if (type === "clock") {
    const staffName = String(body?.staffName ?? "").trim();
    const action = String(body?.action ?? "in");
    if (!staffName) return NextResponse.json({ ok: false, error: "staffName is required" }, { status: 400 });
    const date = new Date().toISOString().slice(0, 10);
    const time = new Date().toTimeString().slice(0, 5);
    const item = await ClockModel.findOneAndUpdate(
      { staffName, date },
      action === "out" ? { clockOut: time } : { clockIn: time },
      { new: true, upsert: true }
    ).lean();
    return NextResponse.json({ ok: true, item });
  }
  if (!body?.date || !body?.role || !body?.staffName) {
    return NextResponse.json({ ok: false, error: "date, role and staffName are required" }, { status: 400 });
  }
  const item = await ShiftModel.create({
    date: String(body.date),
    role: String(body.role),
    staffName: String(body.staffName),
    shift: String(body.shift ?? ""),
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
  if (body.type === "leave") {
    if (!LEAVE_STATES.includes(body.status)) return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
    const item = await LeaveModel.findByIdAndUpdate(body.id, { status: body.status }, { new: true }).lean();
    return NextResponse.json({ ok: true, item });
  }
  return NextResponse.json({ ok: false, error: "Unknown type" }, { status: 400 });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  await dbConnect();
  await ShiftModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
