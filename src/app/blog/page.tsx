import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Stories from Nutting House",
  description: "Weddings, conferences, Lowveld guides and lodge news from Nutting House, Mbombela.",
  alternates: { canonical: "/blog" },
};

type Post = { slug: string; title: string; excerpt?: string; coverUrl?: string; publishedAt?: string };

async function getPosts(): Promise<Post[]> {
  try {
    const { hasMongo } = await import("@/lib/env");
    if (!hasMongo()) return [];
    const { dbConnect } = await import("@/lib/db");
    const { PostModel } = await import("@/models/staff");
    await dbConnect();
    return JSON.parse(
      JSON.stringify(
        await PostModel.find({ published: true }).sort({ publishedAt: -1, createdAt: -1 }).select("slug title excerpt coverUrl publishedAt").lean()
      )
    );
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getPosts();
  return (
    <div className="mx-auto max-w-6xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">Stories</p>
        <h1 className="font-display mt-2 text-5xl">From the lodge.</h1>
        <p className="mt-3 max-w-2xl text-ink-600">Weddings, conferences, Lowveld guides and news from Nutting House.</p>
      </Reveal>
      {posts.length === 0 && <p className="mt-10 text-sm text-ink-600">First stories are on the way — check back soon.</p>}
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Reveal key={p.slug}>
            <Link href={`/blog/${p.slug}`} className="img-zoom block overflow-hidden rounded-3xl bg-white shadow-lg">
              {p.coverUrl ? (
                <div className="relative h-52 w-full">
                  <Image src={p.coverUrl} alt={p.title} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
                </div>
              ) : (
                <div className="flex h-52 w-full items-center justify-center bg-forest-900 text-4xl text-stone-200">✦</div>
              )}
              <div className="p-5">
                {p.publishedAt && <p className="text-xs uppercase tracking-widest text-clay-600">{p.publishedAt}</p>}
                <h2 className="font-display mt-1 text-2xl">{p.title}</h2>
                {p.excerpt && <p className="mt-1 text-sm text-ink-600">{p.excerpt}</p>}
                <span className="mt-3 inline-block text-sm font-semibold text-clay-600 underline">Read →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
