"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { homeWeekStory as t } from "@/content/copy";

const LAST = t.steps.length - 1;
const START = t.scores[0];

function Check() {
  return (
    <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-mint text-ink-deep" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

const REDUCED = "(prefers-reduced-motion: reduce)";
const subscribeReduced = (cb: () => void) => {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

// The week, step by step: each step lights up and the score climbs with it. One extra beat holds the payoff, then it resets.
export function WeekStory() {
  const [step, setStep] = useState(0);
  const [animatedScore, setScore] = useState(START);
  const reduced = useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
  // With reduced motion the story rests on its payoff instead of playing
  const active = reduced ? LAST : step;
  const score = reduced ? t.scores[LAST] : animatedScore;
  const target = t.scores[Math.min(active, LAST)];

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setStep((a) => (a + 1) % (LAST + 2)), 1800);
    return () => clearInterval(id);
  }, [reduced]);

  // Climbs one point at a time; a lower target (the loop reset) snaps down
  useEffect(() => {
    const id = setInterval(() => setScore((s) => (s > target ? target : Math.min(s + 1, target))), 120);
    return () => clearInterval(id);
  }, [target]);

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-[1.2fr_1fr]">
        <ol className="flex flex-col gap-2.5">
          {t.steps.map((s, i) => {
            const done = i < active;
            const now = i === active;
            return (
              <li
                key={i}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all duration-500 ${
                  now ? "scale-[1.03] border-fg bg-white text-ink font-semibold" : "border-line bg-white/60 text-ink"
                } ${done || now ? "opacity-100" : "opacity-45"}`}
              >
                {done ? <Check /> : <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full border border-line text-xs">{i + 1}</span>}
                {s}
              </li>
            );
          })}
        </ol>
        <div data-invert="" className="grid place-items-center rounded-2xl p-6 text-center" aria-live="off">
          <div>
            <p className="text-sm opacity-70">{t.scoreLabel}</p>
            <p className="mt-1 text-6xl font-bold tabular-nums">
              <bdi dir="ltr">{score}</bdi>
            </p>
            <p className={`mt-3 inline-block rounded-full bg-mint px-3 py-1 text-sm font-bold text-ink-deep transition-opacity duration-500 ${score > START ? "opacity-100" : "opacity-0"}`}>
              <bdi dir="ltr">+{score - START}</bdi>
            </p>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm opacity-70">{t.disclaimer}</p>
    </div>
  );
}
