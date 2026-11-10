import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { blogPosts } from "@/content/blog";
import { institutions } from "@/content/institutions";
import { INDEXED_PAGES, pageUrl } from "@/lib/nav";

// Public, indexable pages only (the list is lib/nav.ts). Internal tools and the account and
// checkout flows are deliberately left out — they carry robots: { index: false } in their own metadata.
// Bump by hand when page content really changes; "now" on every build teaches Google to ignore lastmod.
const PAGES_UPDATED = new Date("2026-11-06");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = INDEXED_PAGES.map(({ path, sitemap: { priority, changeFrequency } }) => ({
    url: pageUrl(site.url, path),
    lastModified: PAGES_UPDATED,
    changeFrequency,
    priority,
  }));
  const blogEntries = blogPosts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  const institutionEntries = institutions.map((i) => ({
    url: `${site.url}/amirnet/${i.slug}`,
    lastModified: PAGES_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  return [...staticEntries, ...institutionEntries, ...blogEntries];
}
