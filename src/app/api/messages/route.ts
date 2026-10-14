import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { MessageModel } from "@/models/staff";

// Guest message from /track — no key needed, but tied to a real reference.
export async function POST(req: NextRequest) {
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Messaging is unavailable right now" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const reference = String(body?.reference ?? "").trim().toUpperCase();
  const name = String(body?.name ?? "").trim().slice(0, 80);
  const text = String(body?.text ?? "").trim();
  if (!reference || !name || !text) {
    return NextResponse.json({ ok: false, error: "reference, name and message are required" }, { status: 400 });
  }
  if (text.length > 1000) return NextResponse.json({ ok: false, error: "Keep messages under 1000 characters" }, { status: 400 });
  await dbConnect();
  const message = await MessageModel.create({ reference, from: "guest", name, text });
  return NextResponse.json({ ok: true, message });
}
