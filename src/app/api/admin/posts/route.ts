import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { PostModel } from "@/models/staff";

const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").slice(0, 80) || `post-${Date.now()}`;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const posts = await PostModel.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ ok: true, posts });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!String(body?.title ?? "").trim()) return NextResponse.json({ ok: false, error: "title is required" }, { status: 400 });
  await dbConnect();
  const slug = String(body.slug ?? "").trim() || slugify(String(body.title));
  const exists = await PostModel.findOne({ slug }).lean();
  if (exists) return NextResponse.json({ ok: false, error: "That slug is taken — pick another" }, { status: 409 });
  const post = await PostModel.create({
    slug,
    title: String(body.title).trim(),
    excerpt: String(body.excerpt ?? ""),
    body: String(body.body ?? ""),
    coverUrl: body.coverUrl ? String(body.coverUrl) : undefined,
    coverPublicId: body.coverPublicId ? String(body.coverPublicId) : undefined,
    published: body.published === true,
    publishedAt: body.published === true ? new Date().toISOString().slice(0, 10) : undefined,
  });
  return NextResponse.json({ ok: true, post });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const k of ["title", "excerpt", "body", "coverUrl", "coverPublicId"]) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  if (body.published !== undefined) {
    update.published = body.published === true;
    if (body.published === true) update.publishedAt = new Date().toISOString().slice(0, 10);
  }
  await dbConnect();
  const post = await PostModel.findByIdAndUpdate(body.id, update, { new: true }).lean();
  return NextResponse.json({ ok: true, post });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  await dbConnect();
  await PostModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
