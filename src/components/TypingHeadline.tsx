"use client";

import { useEffect, useState } from "react";

// Hero trial: types the headline once. The full text is always in the DOM (the not-yet-typed part is
// only invisible), so layout never jumps, and server HTML / reduced-motion visitors see it complete.
export function TypingHeadline({ marked, rest, className }: { marked: string; rest: string; className?: string }) {
  const full = marked + rest;
  const [n, setN] = useState(full.length);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let i = 0;
    let tick: ReturnType<typeof setInterval> | undefined;
    const start = setTimeout(() => {
      setN(0);
      tick = setInterval(() => {
        setN(++i);
        if (i >= full.length) clearInterval(tick);
      }, 55);
    }, 0);
    return () => {
      clearTimeout(start);
      clearInterval(tick);
    };
  }, [full.length]);

  const part = (text: string, from: number) => {
    const shown = Math.max(0, Math.min(text.length, n - from));
    return (
      <>
        {text.slice(0, shown)}
        <span className="invisible">{text.slice(shown)}</span>
      </>
    );
  };

  return (
    <h1 className={className} aria-label={full}>
      <span aria-hidden>
        <mark className="pink">{part(marked, 0)}</mark>
        {part(rest, marked.length)}
      </span>
    </h1>
  );
}
