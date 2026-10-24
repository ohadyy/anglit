import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/BreadcrumbJsonLd";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/content/blog";
import { site } from "@/lib/site";

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

async function findPost(params: Promise<{ slug: string }>) {
  const { slug } = await params;
  return getBlogPost(slug);
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const post = await findPost(params);
  if (!post) return { title: "מאמר" };
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: post.heroImage ? { images: [post.heroImage] } : undefined,
  };
}

// Renders "[label](/href)" markdown-style links as real Next links; plain text otherwise.
function renderParagraph(text: string): ReactNode {
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, i) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (!match) return <span key={i}>{part}</span>;
    const [, label, href] = match;
    return (
      <Link key={i} href={href} className="underline underline-offset-4 hover:opacity-80">
        {label}
      </Link>
    );
  });
}

// Next 2 posts after this one in the list, wrapping around — so every post links onward to others
function relatedPosts(slug: string) {
  const i = blogPosts.findIndex((p) => p.slug === slug);
  return [blogPosts[(i + 1) % blogPosts.length], blogPosts[(i + 2) % blogPosts.length]];
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const post = await findPost(params);
  if (!post) notFound();
  const related = relatedPosts(post.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: `${site.url}/blog/${post.slug}`,
    image: post.heroImage ? `${site.url}${post.heroImage}` : undefined,
    url: `${site.url}/blog/${post.slug}`,
    author: { "@type": "Organization", name: "Anglit" },
    publisher: { "@type": "Organization", name: "Anglit", url: site.url },
  };

  return (
    <main className="mx-auto w-full max-w-2xl flex-1 px-4 pb-16 pt-4 sm:px-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />

      <BreadcrumbJsonLd trail={[{ name: "בלוג", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }]} />

      <Link href="/blog" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
        כל המאמרים
      </Link>
      {post.heroImage && (
        <Image
          src={post.heroImage}
          alt=""
          width={1344}
          height={752}
          priority
          className="mt-4 aspect-[16/9] w-full rounded-3xl object-cover"
        />
      )}
      <h1 className="font-display mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      <p className="mt-3 leading-relaxed opacity-80">{post.intro}</p>

      <div className="mt-10 flex flex-col gap-8">
        {post.sections.map((section, i) => (
          <section key={i}>
            {section.heading && <h2 className="text-xl font-bold">{section.heading}</h2>}
            <ul className="mt-3 grid gap-3">
              {section.paragraphs.map((p, j) => (
                <li key={j} className="flex gap-2.5 leading-relaxed">
                  <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-fg" />
                  <span className="opacity-90">{renderParagraph(p)}</span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-14">
        <h2 className="text-xl font-bold">קראו גם</h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {related.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="block overflow-hidden rounded-2xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] transition-colors hover:bg-fg/5"
              >
                {p.heroImage && <Image src={p.heroImage} alt="" width={1344} height={752} className="aspect-[16/9] w-full object-cover" />}
                <p className="p-4 text-sm font-semibold leading-snug">{p.title}</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div data-invert="" className="mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">רוצים להתחיל?</h2>
        <p className="mt-2 opacity-80">שבוע אחד בקבוצה קטנה עם מורה אמיתי, ותרגול יומי עם הסבר לכל שאלה.</p>
        <div className="mt-5 flex flex-wrap items-center gap-4">
          <Link href="/pricing" className="inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            לכל המסלולים והמחירים
          </Link>
          <Link href="/practice" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4 opacity-80">
            לתרגול חינם
          </Link>
        </div>
      </div>
    </main>
  );
}
