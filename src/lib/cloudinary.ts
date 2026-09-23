import { v2 as cloudinary } from "cloudinary";
import { env } from "./env";

let configured = false;
export function cloud() {
  if (!configured) {
    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });
    configured = true;
  }
  return cloudinary;
}

export async function uploadProof(buffer: Buffer, reference: string, mime: string) {
  const ext = mime.includes("pdf") ? "pdf" : mime.includes("png") ? "png" : mime.includes("webp") ? "webp" : "jpg";
  const dataUri = `data:${mime};base64,${buffer.toString("base64")}`;
  const res = await cloud().uploader.upload(dataUri, {
    folder: "nutting-house/proofs",
    public_id: `${reference}-${Date.now()}`,
    resource_type: "image",
    format: ext === "pdf" ? undefined : ext,
    overwrite: false,
  });
  return { secure_url: res.secure_url as string, public_id: res.public_id as string };
}
