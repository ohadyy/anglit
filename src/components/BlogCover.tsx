import { blogPosts, type BlogPost } from "@/content/blog";

// Three brand tones, handed out so neighbours in the grid rarely match (a Latin square for 3 columns).
// Brand constants, not the theme variables, on purpose: the covers keep their colours in both site themes.
const TONES = [
  { bg: "var(--color-mist)", fg: "var(--color-ink)", pillBg: "var(--color-ink)", pillFg: "#fff", mark: "var(--color-marker)" },
  { bg: "var(--color-ink)", fg: "#fff", pillBg: "#fff", pillFg: "var(--color-ink)", mark: "var(--color-marker)" },
  { bg: "var(--color-marker)", fg: "var(--color-ink-deep)", pillBg: "var(--color-ink-deep)", pillFg: "#fff", mark: "#fff" },
];

export function BlogCover({ post, className = "" }: { post: BlogPost; className?: string }) {
  const i = Math.max(0, blogPosts.findIndex((p) => p.slug === post.slug));
  const t = TONES[(i + Math.floor(i / 3)) % 3];
  const { tag, word } = post.cover;
  return (
    <div
      aria-hidden
      className={`flex flex-col items-center justify-center gap-[5cqw] overflow-hidden [container-type:inline-size] ${className}`}
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      <span className="rounded-full px-[3.5cqw] py-[1cqw] text-[3.6cqw] font-semibold" style={{ backgroundColor: t.pillBg, color: t.pillFg }}>
        {tag}
      </span>
      <span
        dir="ltr"
        className="max-w-[88cqw] px-[1.5cqw] text-center font-bold leading-[1.1] tracking-tight"
        style={{ fontSize: `min(18cqw, ${105 / word.length}cqw)`, boxShadow: `inset 0 -0.3em 0 ${t.mark}` }}
      >
        {word}
      </span>
    </div>
  );
}
