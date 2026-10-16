"use client";

import { useEffect, useRef, useState } from "react";

// Word-by-word reveal: each word slides up from behind a mask as the
// paragraph scrolls into view, matching the downloaded GSAP SplitText demo's
// look. Reimplemented with plain CSS (no GSAP/ScrollTrigger/SplitText,
// libraries this project doesn't otherwise use) — an IntersectionObserver
// triggers the reveal once, then ordinary animation-delay staggers the words
// (safe here since, unlike a scroll-linked timeline, time-based delay doesn't
// fight a fixed scroll range).
export function TextReveal({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    // Reduced motion is handled in CSS (the animation itself is disabled there);
    // the observer still flips visibility so the text isn't stuck hidden.
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = text.split(" ");
  return (
    <p ref={ref} className={className} style={{ visibility: revealed ? "visible" : "hidden" }}>
      {words.map((word, i) => (
        <span key={i}>
          <span className="word-mask">
            <span style={revealed ? { animationDelay: `${i * 45}ms` } : undefined}>{word}</span>
          </span>
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </p>
  );
}
