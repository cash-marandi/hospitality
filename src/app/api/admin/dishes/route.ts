import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { requireAdmin } from "@/lib/adminAuth";
import { DishModel } from "@/models/staff";

const CATS = ["Breakfast", "Mains", "Dessert", "Function", "Special"];

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  await dbConnect();
  const dishes = await DishModel.find({}).sort({ category: 1, createdAt: -1 }).limit(200).lean();
  return NextResponse.json({ ok: true, dishes });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!String(body?.name ?? "").trim()) return NextResponse.json({ ok: false, error: "name is required" }, { status: 400 });
  await dbConnect();
  const dish = await DishModel.create({
    name: String(body.name).trim(),
    description: String(body.description ?? ""),
    price: body.price === "" || body.price === undefined ? undefined : Number(body.price),
    category: CATS.includes(body.category) ? body.category : "Mains",
    photoUrl: body.photoUrl ? String(body.photoUrl) : undefined,
    photoPublicId: body.photoPublicId ? String(body.photoPublicId) : undefined,
    available: body.available !== false,
    postedBy: String(body.postedBy ?? ""),
  });
  return NextResponse.json({ ok: true, dish });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  if (!body?.id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  const update: Record<string, unknown> = {};
  for (const k of ["name", "description", "photoUrl", "photoPublicId", "postedBy"]) {
    if (body[k] !== undefined) update[k] = body[k];
  }
  if (body.price !== undefined) update.price = body.price === "" ? undefined : Number(body.price);
  if (body.category && CATS.includes(body.category)) update.category = body.category;
  if (body.available !== undefined) update.available = body.available === true;
  await dbConnect();
  const dish = await DishModel.findByIdAndUpdate(body.id, update, { new: true }).lean();
  return NextResponse.json({ ok: true, dish });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Database not configured" }, { status: 503 });
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ ok: false, error: "id is required" }, { status: 400 });
  await dbConnect();
  await DishModel.findByIdAndDelete(id);
  return NextResponse.json({ ok: true });
}
