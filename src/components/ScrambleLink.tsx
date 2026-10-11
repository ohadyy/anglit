"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

const HEBREW = "אבגדהוזחטיכלמנסעפצקרשתםןףךץ";
const LATIN = "abcdefghijklmnopqrstuvwxyz";
const FRAME_MS = 35;
const FRAMES = 18;

export function ScrambleLink({
  href,
  label,
  external = false,
}: {
  href: string;
  label: string;
  external?: boolean;
}) {
  const chars = Array.from(label);
  const pool = /[א-ת]/.test(label) ? HEBREW : LATIN;
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const timer = useRef<number | null>(null);

  function stop() {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    chars.forEach((ch, i) => {
      const span = spans.current[i];
      if (span) span.textContent = ch === " " ? " " : ch;
    });
  }

  function start() {
    stop();
    const settle = (i: number) => FRAMES * 0.4 + i * 1.5;
    const end = Math.max(...chars.map((_, i) => settle(i))) + 1;
    let frame = 0;
    timer.current = window.setInterval(() => {
      frame++;
      chars.forEach((ch, i) => {
        const span = spans.current[i];
        if (!span || ch === " ") return;
        span.textContent =
          frame >= settle(i) ? ch : pool[Math.floor(Math.random() * pool.length)];
      });
      if (frame >= end) stop();
    }, FRAME_MS);
  }

  useEffect(() => {
    const current = timer;
    return () => {
      if (current.current !== null) window.clearInterval(current.current);
    };
  }, []);

  const content = (
    <>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 h-7 -translate-y-1/2 scale-90 rounded-lg bg-fg/10 opacity-0 transition-[opacity,transform] duration-200 ease-[cubic-bezier(0.645,0.045,0.355,1)] group-hover:scale-100 group-hover:opacity-100"
      />
      <span aria-hidden="true" className="relative inline-flex" dir="rtl">
        {chars.map((ch, i) => (
          <span
            key={i}
            ref={(el) => {
              spans.current[i] = el;
            }}
            className="inline-block"
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
      <span className="sr-only">{label}</span>
    </>
  );

  const className =
    "group relative flex items-center rounded-lg px-3 py-1.5 transition-colors hover:text-fg";
  const handlers = { onMouseEnter: start, onMouseLeave: stop, onFocus: start, onBlur: stop };

  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className} {...handlers}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className={className} {...handlers}>
      {content}
    </Link>
  );
}
