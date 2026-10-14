import { NextRequest, NextResponse } from "next/server";
import { env, hasAdminKey } from "@/lib/env";

/** Returns null when authorized, otherwise a 401 JSON response. */
export function requireAdmin(req: NextRequest) {
  if (!hasAdminKey()) {
    return NextResponse.json({ ok: false, error: "ADMIN_KEY is not configured on the server" }, { status: 503 });
  }
  if (req.headers.get("x-admin-key") !== env.ADMIN_KEY) {
    return NextResponse.json({ ok: false, error: "Unauthorized — staff key required" }, { status: 401 });
  }
  return null;
}

/** Accepts Vercel cron (Bearer CRON_SECRET) or staff key. */
export function requireAdminOrCron(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET ?? "";
  const auth = req.headers.get("authorization") ?? "";
  if (cronSecret && auth === `Bearer ${cronSecret}`) return null;
  return requireAdmin(req);
}
