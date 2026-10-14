import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { DishModel } from "@/models/staff";

// Public menu — only available dishes.
export async function GET() {
  if (!hasMongo()) return NextResponse.json({ ok: true, dishes: [] });
  await dbConnect();
  const dishes = await DishModel.find({ available: true }).sort({ category: 1, createdAt: -1 }).lean();
  return NextResponse.json({ ok: true, dishes });
}
