"use client";

import { useEffect, useState } from "react";

// A round gauge filled with liquid up to the estimated score (50 at the bottom, 150 at the top).
// On mount it fills from empty up to the score while the number counts up with it, then rests.
// The number is drawn twice, ink on the empty part and light on the liquid, so it reads on both.
// Under reduced motion it shows the final score straight away.
const SCORE_MIN = 50;
const SCORE_MAX = 150;
const FILL_MS = 2200;
const WAVE = "M0 0 q25 -9 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 V210 H0 Z";

export function LiquidGauge({ score, className = "" }: { score: number; className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ms = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : FILL_MS;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ms);
      setProgress(1 - Math.pow(1 - t, 3));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const shown = SCORE_MIN + (score - SCORE_MIN) * progress;
  const level = Math.min(1, Math.max(0, (shown - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)));
  const y = 190 - 180 * level;
  const number = (fill: string) => (
    <text x="100" y="118" textAnchor="middle" fontSize="68" fontWeight="700" fill={fill} style={{ fontVariantNumeric: "tabular-nums" }}>
      {Math.round(shown)}
    </text>
  );
  return (
    <svg
      viewBox="0 0 200 200"
      role="img"
      aria-label={`ציון משוער ${score} מתוך ${SCORE_MAX}`}
      className={`block ${className}`}
    >
      <defs>
        <clipPath id="gauge-circle">
          <circle cx="100" cy="100" r="92" />
        </clipPath>
        <clipPath id="gauge-liquid">
          <rect x="0" y={y} width="200" height="200" />
        </clipPath>
      </defs>
      <circle cx="100" cy="100" r="94" fill="var(--raise, white)" stroke="var(--fg)" strokeOpacity="0.2" strokeWidth="3" />
      {number("var(--fg)")}
      <g clipPath="url(#gauge-circle)">
        <g transform={`translate(0 ${y})`}>
          <path d={WAVE} fill="var(--fg)" opacity="0.28" className="gauge-wave gauge-wave-back" />
          <path d={WAVE} fill="var(--fg)" className="gauge-wave" />
        </g>
        <g clipPath="url(#gauge-liquid)">{number("var(--bg)")}</g>
      </g>
    </svg>
  );
}
