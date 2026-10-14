import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { PostModel } from "@/models/staff";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ slug: string }> }) {
  const { slug } = await ctx.params;
  if (!hasMongo()) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  await dbConnect();
  const post = await PostModel.findOne({ slug, published: true }).lean();
  if (!post) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, post });
}
