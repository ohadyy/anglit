"use client";

import { useEffect, useRef, useState } from "react";

export function TextReveal({ text }: { text: string }) {
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
    <p ref={ref} style={{ visibility: revealed ? "visible" : "hidden" }}>
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
