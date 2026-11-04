import { blogPosts, type BlogPost } from "@/content/blog";

// Three brand tones, handed out so neighbours in the grid rarely match (a Latin square for 3 columns).
// Fixed hex on purpose: the covers keep their colours in both site themes.
const TONES = [
  { bg: "#E4E4E4", fg: "#19107F", pillBg: "#19107F", pillFg: "#FFFFFF", mark: "#EE478C" },
  { bg: "#19107F", fg: "#FFFFFF", pillBg: "#FFFFFF", pillFg: "#19107F", mark: "#EE478C" },
  { bg: "#EE478C", fg: "#0E0852", pillBg: "#0E0852", pillFg: "#FFFFFF", mark: "#FFFFFF" },
];

/** The blog cover: a Hebrew tag and one big English word. `className` sets the aspect ratio and corners. */
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
      {/* Size shrinks with the word's length so a long word never leaves the frame */}
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
