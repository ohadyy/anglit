import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { blogPosts } from "@/content/blog";
import { institutions } from "@/content/institutions";

// Public, indexable pages only. Internal tools (/studio, /review, /content),
// and account/checkout flows are
// deliberately left out — they carry robots: { index: false } in their own metadata.
// Bump by hand when page content really changes; "now" on every build teaches Google to ignore lastmod.
const PAGES_UPDATED = new Date("2026-10-20");

const PUBLIC_PATHS = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/practice", priority: 0.9, changeFrequency: "weekly" as const },
  { path: "/amirnet", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/guide", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/score", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/exam-dates", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/pricing", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/private-tutor", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/ads", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/start", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/llm-information", priority: 0.5, changeFrequency: "monthly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = PUBLIC_PATHS.map(({ path, priority, changeFrequency }) => ({
    url: `${site.url}${path}`,
    lastModified: PAGES_UPDATED,
    changeFrequency,
    priority,
  }));
  const blogEntries = blogPosts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.publishedAt),
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
