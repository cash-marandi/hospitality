"use client";
import Image from "next/image";

const SLIDES = [
  { src: "/legacy/img/hero_home_1.jpg", alt: "Nutting House lawns and lodge at golden hour" },
  { src: "/legacy/img/hero_home_1a.jpg", alt: "Wedding celebration on the Nutting House grounds" },
  { src: "/legacy/img/local_amenities_3aa.jpg", alt: "Edamini dam and gardens at Nutting House" },
];

export default function HeroSlideshow() {
  return (
    <div className="absolute inset-0" aria-hidden="true">
      {SLIDES.map((s, i) => (
        <div key={s.src} className="hero-slide absolute inset-0">
          <Image
            src={s.src}
            alt={s.alt}
            fill
            priority={i === 0}
            fetchPriority={i === 0 ? "high" : undefined}
            sizes="100vw"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
