import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Nutting House · Mbombela",
    short_name: "Nutting House",
    description: "Lodge, weddings & conferences in Mbombela, Mpumalanga. Instant EFT quotations.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4eee1",
    theme_color: "#0e1f14",
    icons: [{ src: "/legacy/img/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
