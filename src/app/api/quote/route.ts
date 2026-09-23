import { NextRequest, NextResponse } from "next/server";
import { buildStayQuote, buildVenueQuote } from "@/lib/quote";
import fs from "node:fs";
import path from "node:path";

function saveQuote(q: unknown) {
  try {
    const dir = path.join(process.cwd(), "data");
    fs.mkdirSync(dir, { recursive: true });
    const file = path.join(dir, "quotes.jsonl");
    fs.appendFileSync(file, JSON.stringify(q) + "\n");
  } catch {
    // demo-safe: ignore file errors on read-only hosts
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body?.kind === "venue") {
    const quote = buildVenueQuote(body.input);
    saveQuote({ kind: "venue", ...quote });
    return NextResponse.json({ ok: true, quote });
  }
  const quote = buildStayQuote(body.input);
  saveQuote({ kind: "stay", ...quote });
  return NextResponse.json({ ok: true, quote });
}
