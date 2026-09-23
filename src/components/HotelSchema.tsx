import { SITE } from "@/lib/site";

export default function HotelSchema() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: SITE.name,
    description:
      "3-star lodge and 4-star conference venue in Mbombela, Mpumalanga. Family rooms, weddings at the dam, conferences to 800 in one hall and 2000+ on full buyout.",
    url: SITE.url,
    telephone: SITE.phoneHref,
    email: SITE.email,
    priceRange: "R950 - R1450",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Plot 6, Burnside Road",
      addressLocality: "Mbombela",
      postalCode: "1201",
      addressRegion: "Mpumalanga",
      addressCountry: "ZA",
    },
    geo: { "@type": "GeoCoordinates", latitude: SITE.geo.lat, longitude: SITE.geo.lng },
    hasMap: SITE.mapsPin,
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Secure parking" },
      { "@type": "LocationFeatureSpecification", name: "High-speed WiFi" },
      { "@type": "LocationFeatureSpecification", name: "Swimming pools" },
      { "@type": "LocationFeatureSpecification", name: "Bar and buffet" },
      { "@type": "LocationFeatureSpecification", name: "Conference venues" },
      { "@type": "LocationFeatureSpecification", name: "Wedding venue" },
    ],
    areaServed: ["Mbombela", "Nelspruit", "Lowveld", "Kruger National Park", "Mpumalanga", "South Africa"],
    checkinTime: "14:00",
    checkoutTime: "10:00",
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}
