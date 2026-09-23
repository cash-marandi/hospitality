import { NextRequest, NextResponse } from "next/server";
import { buildStayQuote, buildVenueQuote } from "@/lib/quote";
import { quoteBodySchema } from "@/lib/validation";
import { dbConnect } from "@/lib/db";
import { QuoteModel } from "@/models/Quote";
import { hasMongo } from "@/lib/env";
import { stayConflicts, venueConflicts } from "@/lib/availability";
import fs from "node:fs";
import path from "node:path";

function saveQuoteLocal(q: unknown) {
  try {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    fs.appendFileSync(path.join(dir, "quotes.jsonl"), JSON.stringify(q) + "\n");
  } catch {
    // demo-safe on read-only hosts
  }
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }
  const parsed = quoteBodySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the highlighted fields", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  if (parsed.data.kind === "stay") {
    const input = parsed.data.input;
    const conflicts = await stayConflicts(input.roomSlug, input.checkIn, input.checkOut);
    if (conflicts.length > 0) {
      return NextResponse.json(
        { ok: false, error: "Those dates are already held for this room. Try nearby dates or WhatsApp us.", conflicts },
        { status: 409 }
      );
    }
    const quote = buildStayQuote({ ...input, email: input.email ?? "", phone: input.phone ?? "", notes: input.notes ?? "" });
    const doc = {
      kind: "stay" as const,
      reference: quote.reference,
      title: "Stay quotation",
      room: quote.room,
      roomSlug: input.roomSlug,
      nights: quote.nights,
      checkIn: input.checkIn,
      checkOut: input.checkOut,
      lines: quote.lines,
      total: quote.total,
      depositDue: quote.depositDue,
      input,
      status: "quoted" as const,
    };
    if (hasMongo()) {
      try {
        await dbConnect();
        await QuoteModel.create(doc);
      } catch {
        return NextResponse.json({ ok: false, error: "Database unavailable, please try again" }, { status: 503 });
      }
    } else {
      saveQuoteLocal({ kind: "stay", ...quote });
    }
    return NextResponse.json({ ok: true, quote, stored: hasMongo() });
  }

  const input = parsed.data.input;
  const conflicts = await venueConflicts(input.venueSlug, input.date, input.days);
  if (conflicts.length > 0) {
    return NextResponse.json(
      { ok: false, error: "That venue is already held for those dates. Try another date or venue.", conflicts },
      { status: 409 }
    );
  }
  const quote = buildVenueQuote({ ...input, email: input.email ?? "", phone: input.phone ?? "", notes: input.notes ?? "" });
  const doc = {
    kind: "venue" as const,
    reference: quote.reference,
    title: "Event estimate",
    venue: quote.venue,
    venueSlug: input.venueSlug,
    days: Math.max(1, input.days),
    eventDate: input.date,
    lines: quote.lines,
    total: quote.total,
    depositDue: quote.depositDue,
    input,
    status: "quoted" as const,
  };
  if (hasMongo()) {
    try {
      await dbConnect();
      await QuoteModel.create(doc);
    } catch {
      return NextResponse.json({ ok: false, error: "Database unavailable, please try again" }, { status: 503 });
    }
  } else {
    saveQuoteLocal({ kind: "venue", ...quote });
  }
  return NextResponse.json({ ok: true, quote, stored: hasMongo() });
}
