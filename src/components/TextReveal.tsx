// Word-by-word scroll reveal for a block of prose. Reuses the site's existing
// CSS-only `animation-timeline: view()` reveal (see .reveal-word in globals.css)
// instead of a JS animation library, so there's no new runtime dependency.
//
// The space between words is a plain text node, not part of the inline-block
// span — a space *inside* an inline-block isn't a valid line-break point, so
// putting it there would stop the paragraph from wrapping at all.
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <p className={className}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="reveal-word" style={{ animationDelay: `${i * 35}ms` }}>
            {word}
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
