import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const pages = ["", "/stay", "/venues", "/weddings", "/conference", "/book", "/track", "/explore", "/contact"];
  const now = new Date();
  return pages.map((p) => ({
    url: `${base}${p || "/"}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : p === "/book" || p === "/conference" ? 0.9 : 0.7,
  }));
}
