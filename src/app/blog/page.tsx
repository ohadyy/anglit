import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Image from "next/image";
import Link from "next/link";
import { blogIndexCopy, blogPosts } from "@/content/blog";

export const metadata: Metadata = {
  title: blogIndexCopy.title,
  description: blogIndexCopy.intro,
  alternates: { canonical: "/blog" },
};

export default function BlogIndexPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <BreadcrumbJsonLd trail={[{ name: "בלוג", path: "/blog" }]} />
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
        <mark className="pink">{blogIndexCopy.title}</mark>
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">{blogIndexCopy.intro}</p>

      {/* Smaller cards in a grid on desktop — they grow on hover. Mobile stays one column at
          normal size, since hover doesn't exist there and that's 90% of visits. */}
      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <li key={post.slug} className="relative">
            <Link
              href={`/blog/${post.slug}`}
              className="relative block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] transition-transform duration-300 hover:z-10 hover:scale-[1.12] hover:shadow-[0_30px_60px_-20px_rgb(14_8_82/0.45)]"
            >
              {post.heroImage && (
                <Image src={post.heroImage} alt="" width={1344} height={752} className="aspect-[16/9] w-full object-cover" />
              )}
              <div className="p-4">
                <h2 className="text-base font-bold leading-snug">{post.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed opacity-80 line-clamp-2">{post.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
