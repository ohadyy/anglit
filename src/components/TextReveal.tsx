// Word-by-word scroll reveal for a block of prose. Reuses the site's existing
// CSS-only `animation-timeline: view()` reveal (see .reveal-word in globals.css)
// instead of a JS animation library, so there's no new runtime dependency and
// text stays visible with no animation if the browser can't drive it.
//
// Each word gets its own `animation-range`, offset along the "cover" range
// (the element's full pass through the viewport) rather than plain
// `animation-delay`: a scroll-linked animation's "time" is the scroll
// position itself, so a delay eats into that fixed range and can leave later
// words stuck invisible. Shifting the range per word staggers them safely.
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span
            className="reveal-word"
            style={{ animationRange: `cover ${i * 1.5}% cover ${i * 1.5 + 18}%` }}
          >
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
