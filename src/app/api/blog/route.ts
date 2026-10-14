import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { hasMongo } from "@/lib/env";
import { PostModel } from "@/models/staff";

// Public blog index — published posts only.
export async function GET() {
  if (!hasMongo()) return NextResponse.json({ ok: true, posts: [] });
  await dbConnect();
  const posts = await PostModel.find({ published: true })
    .sort({ publishedAt: -1, createdAt: -1 })
    .select("slug title excerpt coverUrl publishedAt")
    .lean();
  return NextResponse.json({ ok: true, posts });
}
