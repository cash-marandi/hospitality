import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Reveal from "@/components/Reveal";
import { SITE } from "@/lib/site";

type Post = { slug: string; title: string; excerpt?: string; body?: string; coverUrl?: string; publishedAt?: string };

async function getPost(slug: string): Promise<Post | null> {
  try {
    const { hasMongo } = await import("@/lib/env");
    if (!hasMongo()) return null;
    const { dbConnect } = await import("@/lib/db");
    const { PostModel } = await import("@/models/staff");
    await dbConnect();
    const post = await PostModel.findOne({ slug, published: true }).lean();
    return post ? JSON.parse(JSON.stringify(post)) : null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Story not found" };
  return {
    title: post.title,
    description: post.excerpt || post.title,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: { title: post.title, description: post.excerpt, images: post.coverUrl ? [post.coverUrl] : [] },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();
  const paragraphs = (post.body ?? "").split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <article className="mx-auto max-w-3xl px-6 py-14">
      <Reveal>
        <p className="text-xs uppercase tracking-[0.3em] text-clay-600">
          <Link href="/blog" className="underline">Stories</Link> · {post.publishedAt}
        </p>
        <h1 className="font-display mt-3 text-4xl leading-tight md:text-5xl">{post.title}</h1>
        {post.excerpt && <p className="mt-3 text-lg text-ink-600">{post.excerpt}</p>}
      </Reveal>
      {post.coverUrl && (
        <div className="relative mt-8 h-80 overflow-hidden rounded-3xl shadow-lg">
          <Image src={post.coverUrl} alt={post.title} fill sizes="(max-width: 768px) 100vw, 768px" className="object-cover" priority />
        </div>
      )}
      <div className="mt-8 space-y-5 text-lg leading-relaxed">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <div className="mt-10 rounded-3xl bg-forest-950 p-8 text-center text-white">
        <p className="font-display text-2xl">Come experience it yourself.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link href="/book" className="rounded-full bg-clay-500 px-6 py-3 text-sm font-semibold">Check availability →</Link>
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold">WhatsApp us</a>
        </div>
      </div>
    </article>
  );
}
