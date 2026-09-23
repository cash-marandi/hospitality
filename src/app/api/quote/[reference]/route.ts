import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { QuoteModel } from "@/models/Quote";
import { env, hasMongo } from "@/lib/env";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ reference: string }> }) {
  const { reference } = await ctx.params;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const q = await QuoteModel.findOne({ reference }).lean();
  if (!q) return NextResponse.json({ ok: false, error: "Quotation not found" }, { status: 404 });
  return NextResponse.json({ ok: true, quote: q });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ reference: string }> }) {
  const { reference } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();

  // Guest proof attach (no key needed)
  if (body?.proofUrl) {
    const q = await QuoteModel.findOneAndUpdate(
      { reference },
      { proofUrl: String(body.proofUrl), status: "proof_received" },
      { new: true }
    ).lean();
    if (!q) return NextResponse.json({ ok: false, error: "Quotation not found" }, { status: 404 });
    return NextResponse.json({ ok: true, quote: q });
  }

  // Status changes need admin key
  if (req.headers.get("x-admin-key") !== env.ADMIN_KEY || !body?.status) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  if (!["quoted", "proof_received", "confirmed", "cancelled"].includes(body.status)) {
    return NextResponse.json({ ok: false, error: "Invalid status" }, { status: 400 });
  }
  const q = await QuoteModel.findOneAndUpdate({ reference }, { status: body.status }, { new: true }).lean();
  if (!q) return NextResponse.json({ ok: false, error: "Quotation not found" }, { status: 404 });
  return NextResponse.json({ ok: true, quote: q });
}
