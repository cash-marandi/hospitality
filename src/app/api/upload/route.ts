import { NextRequest, NextResponse } from "next/server";
import { hasCloudinary, hasMongo } from "@/lib/env";
import { uploadProof } from "@/lib/cloudinary";
import { dbConnect } from "@/lib/db";
import { QuoteModel } from "@/models/Quote";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

export async function POST(req: NextRequest) {
  if (!hasCloudinary()) {
    return NextResponse.json(
      { ok: false, error: "Cloudinary is not configured. Add CLOUDINARY_* keys to .env.local" },
      { status: 503 }
    );
  }
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Send multipart form with file + reference" }, { status: 400 });
  }
  const file = form.get("file");
  const reference = String(form.get("reference") ?? "").trim();
  if (!(file instanceof File) || !reference) {
    return NextResponse.json({ ok: false, error: "file and reference are required" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json({ ok: false, error: "Only JPG, PNG, WebP or PDF proof allowed" }, { status: 415 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ ok: false, error: "File too large — max 6MB" }, { status: 413 });
  }
  const bytes = await file.arrayBuffer();
  try {
    const up = await uploadProof(Buffer.from(bytes), reference, file.type);
    if (hasMongo()) {
      await dbConnect();
      await QuoteModel.findOneAndUpdate(
        { reference },
        { proofUrl: up.secure_url, proofPublicId: up.public_id, status: "proof_received" }
      );
    }
    return NextResponse.json({ ok: true, url: up.secure_url, public_id: up.public_id });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed, please try again or WhatsApp the proof" }, { status: 502 });
  }
}
