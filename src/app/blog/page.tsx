import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import Link from "next/link";
import { blogIndexCopy, blogPostsByDate } from "@/content/blog";
import { BlogCover } from "@/components/BlogCover";

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

      <ul className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {blogPostsByDate.map((post) => (
          <li key={post.slug} className="relative">
            <Link
              href={`/blog/${post.slug}`}
              className="relative block overflow-hidden rounded-2xl border border-line bg-white shadow-card transition-transform duration-300 hover:-translate-y-1 hover:shadow-card-lift"
            >
              <BlogCover post={post} className="aspect-[16/9] w-full" />
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
