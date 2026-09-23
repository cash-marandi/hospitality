import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // Legacy local imagery + Cloudinary-hosted proofs/uploads.
    // Add your Cloudinary cloud name to NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    // and extend remotePatterns if you serve gallery images from Cloudinary.
    remotePatterns: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
      ? [{ protocol: "https", hostname: "res.cloudinary.com" }]
      : [],
  },
};

export default nextConfig;
