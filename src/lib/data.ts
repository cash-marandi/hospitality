export type Room = {
  slug: string;
  name: string;
  blurb: string;
  priceFrom: number; // ZAR per night
  sleeps: number;
  beds: string;
  perks: string[];
  image: string;
  gallery: string[];
};

export type Venue = {
  slug: string;
  name: string;
  tag: string;
  blurb: string;
  capacity: string;
  layouts: string[];
  priceFrom: number; // ZAR per day (venue hire)
  image: string;
  bestFor: string[];
};

export const ROOMS: Room[] = [
  {
    slug: "standard",
    name: "Standard Room",
    blurb:
      "Cozy, calm and everything you need — a comfortable double or twin, modern furnishings and a well-appointed private bathroom.",
    priceFrom: 950,
    sleeps: 2,
    beds: "Double or twin beds",
    perks: ["Aircon", "DSTV", "Tea & coffee station", "Mini bar fridge", "Private bathroom", "High-speed WiFi"],
    image: "/legacy/img/rooms/2b.jpg",
    gallery: ["/legacy/img/rooms/11.jpg", "/legacy/img/rooms/opt_1b.jpg", "/legacy/img/rooms/opt_8b.jpg"],
  },
  {
    slug: "family",
    name: "Family Room",
    blurb:
      "Space for everyone — a king plus twins so the whole family can stretch out after a day at the pools or in Kruger.",
    priceFrom: 1450,
    sleeps: 4,
    beds: "King + twin beds",
    perks: ["Sleeps 4", "Aircon", "DSTV", "Tea & coffee station", "Mini bar fridge", "Child-friendly pools nearby"],
    image: "/legacy/img/rooms/opt_4.jpg",
    gallery: ["/legacy/img/rooms/opt_4.jpg", "/legacy/img/rooms/opt_2b.jpg", "/legacy/img/rooms/opt_5b.jpg"],
  },
  {
    slug: "executive",
    name: "Executive Room",
    blurb:
      "Plush king bed, seating area and work desk with big lodge views — quiet luxury for business and slow mornings.",
    priceFrom: 1250,
    sleeps: 2,
    beds: "King or twin",
    perks: ["King bed + desk", "Seating area", "Lodge views", "Aircon", "DSTV", "Tea & coffee station"],
    image: "/legacy/img/rooms/3b.jpg",
    gallery: ["/legacy/img/rooms/3b.jpg", "/legacy/img/rooms/opt_3b.jpg", "/legacy/img/rooms/opt_6f.jpg"],
  },
];

export const VENUES: Venue[] = [
  {
    slug: "main-hall",
    name: "The Main Hall",
    tag: "Versatile",
    blurb:
      "Spacious hall with covered terrace overlooking the main garden. Divides into three rooms or opens into one grand space.",
    capacity: "Up to 800 guests",
    layouts: ["Banquet", "Classroom", "U-shape", "Theatre"],
    priceFrom: 8500,
    image: "/legacy/img/blog-1.jpg",
    bestFor: ["Conferences", "Year-end functions", "Banquets"],
  },
  {
    slug: "ralis-rock",
    name: "Rali's Rock",
    tag: "Sunset views",
    blurb:
      "Built on a rocky outcrop in the gardens — sweeping Lowveld mountain views, macadamia orchard edges, legendary sunsets.",
    capacity: "Up to 400 guests",
    layouts: ["Banquet", "Classroom", "U-shape", "Theatre"],
    priceFrom: 7500,
    image: "/legacy/img/blog-2.jpg",
    bestFor: ["Conferences", "Banquets", "Evening events"],
  },
  {
    slug: "edamini-dam",
    name: "Edamini — The Dam",
    tag: "Waterside",
    blurb:
      "Overlooking the dam with ducks, geese and birdsong. Made for weddings, launches and imaginative celebrations.",
    capacity: "Up to 300 guests",
    layouts: ["Banquet", "Classroom", "U-shape", "Theatre"],
    priceFrom: 6500,
    image: "/legacy/img/blog-3.jpg",
    bestFor: ["Weddings", "Product launches", "Team building"],
  },
  {
    slug: "conference-1a-1b",
    name: "Conference 1A & 1B",
    tag: "Boardroom",
    blurb:
      "Intimate meeting rooms in the main building — close to lawns and pools, perfect for breakaways and dinners under stars.",
    capacity: "10–60 guests",
    layouts: ["Boardroom", "U-shape", "Classroom"],
    priceFrom: 2500,
    image: "/legacy/img/rooms/opt_5a.jpg",
    bestFor: ["Board meetings", "Training", "Small workshops"],
  },
];

export const rand = (n: number) => Math.floor(Math.random() * n);
export const zar = (n: number) =>
  new Intl.NumberFormat("en-ZA", { style: "currency", currency: "ZAR", maximumFractionDigits: 0 }).format(n);
