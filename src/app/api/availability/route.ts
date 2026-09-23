import { NextRequest, NextResponse } from "next/server";
import { stayConflicts, venueConflicts } from "@/lib/availability";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams;
  const kind = q.get("kind");
  try {
    if (kind === "stay") {
      const roomSlug = q.get("roomSlug") ?? "";
      const checkIn = q.get("checkIn") ?? "";
      const checkOut = q.get("checkOut") ?? "";
      if (!roomSlug || !checkIn || !checkOut) {
        return NextResponse.json({ ok: false, error: "roomSlug, checkIn, checkOut required" }, { status: 400 });
      }
      const conflicts = await stayConflicts(roomSlug, checkIn, checkOut);
      return NextResponse.json({ ok: true, available: conflicts.length === 0, conflicts });
    }
    if (kind === "venue") {
      const venueSlug = q.get("venueSlug") ?? "";
      const date = q.get("date") ?? "";
      const days = Number(q.get("days") ?? "1");
      if (!venueSlug || !date) {
        return NextResponse.json({ ok: false, error: "venueSlug and date required" }, { status: 400 });
      }
      const conflicts = await venueConflicts(venueSlug, date, days);
      return NextResponse.json({ ok: true, available: conflicts.length === 0, conflicts });
    }
    return NextResponse.json({ ok: false, error: "kind must be stay or venue" }, { status: 400 });
  } catch {
    return NextResponse.json({ ok: false, error: "Availability check failed" }, { status: 503 });
  }
}
