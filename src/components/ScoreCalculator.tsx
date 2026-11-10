"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { calculatorCopy as c } from "@/content/examGuide";
import { SCORE_MAX, SCORE_MIN } from "@/content/facts";
import { SCORE_LEVELS, scoreLevel } from "@/lib/scoreLevels";

function useRolling(target: number) {
  const [value, setValue] = useState(target);
  useEffect(() => {
    const id = setInterval(() => {
      setValue((v) => {
        if (v === target) return v;
        const step = Math.max(1, Math.round(Math.abs(target - v) / 6));
        return v < target ? Math.min(v + step, target) : Math.max(v - step, target);
      });
    }, 30);
    return () => clearInterval(id);
  }, [target]);
  return value;
}

export function ScoreCalculator() {
  const [score, setScore] = useState(100);
  // What's typed, so "1" on the way to "120" isn't clamped to 50 mid-typing
  const [draft, setDraft] = useState("100");
  const level = scoreLevel(score);
  const next = SCORE_LEVELS.find((l) => l.min > score);
  const cost = useRolling(level.courses * c.costPerCourse);

  function set(v: number) {
    const clamped = Math.min(SCORE_MAX, Math.max(SCORE_MIN, Math.round(v)));
    setScore(clamped);
    setDraft(String(clamped));
  }

  function type(raw: string) {
    setDraft(raw);
    const v = Number(raw);
    if (raw !== "" && v >= SCORE_MIN && v <= SCORE_MAX) setScore(Math.round(v));
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-card sm:p-7">
      <label htmlFor="score-input" className="text-sm font-semibold opacity-70">
        {c.inputLabel}
      </label>
      <div dir="ltr" className="mt-1 flex items-center gap-3">
        <button
          type="button"
          onClick={() => set(score - 1)}
          aria-label="להוריד נקודה"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-xl hover:bg-fg/5"
        >
          −
        </button>
        <input
          id="score-input"
          type="number"
          inputMode="numeric"
          min={SCORE_MIN}
          max={SCORE_MAX}
          value={draft}
          onChange={(e) => type(e.target.value)}
          onBlur={() => setDraft(String(score))}
          className="w-full min-w-0 bg-transparent text-center text-6xl font-bold tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button
          type="button"
          onClick={() => set(score + 1)}
          aria-label="להוסיף נקודה"
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-line text-xl hover:bg-fg/5"
        >
          +
        </button>
      </div>

      {/* Numbers read left to right, so the buttons, slider and level bar do too */}
      <div dir="ltr" className="mt-4">
        <input
          type="range"
          min={SCORE_MIN}
          max={SCORE_MAX}
          value={score}
          onChange={(e) => set(Number(e.target.value))}
          aria-label={c.inputLabel}
          className="h-11 w-full cursor-pointer accent-fg"
        />
        <div className="flex justify-between text-xs tabular-nums opacity-60">
          <span>{SCORE_MIN}</span>
          <span>{SCORE_MAX}</span>
        </div>
      </div>

      <div className="mt-6 rounded-2xl bg-sunk p-4" aria-live="polite">
        <p className="text-2xl font-bold">{level.label}</p>
        {level.courses > 0 ? (
          <p className="mt-1">
            <span className="text-xl font-bold tabular-nums">{level.courses}</span> {c.coursesLabel}
          </p>
        ) : (
          <p className="mt-1 opacity-80">{c.exemptText}</p>
        )}
        {next && (
          <p className="mt-2 text-sm opacity-70">
            עוד <bdi className="font-semibold tabular-nums">{next.min - score}</bdi> נקודות לרמה הבאה: {next.label}
          </p>
        )}
      </div>

      <ol className="mt-5 flex flex-col-reverse gap-2" aria-hidden>
        {SCORE_LEVELS.map((l) => {
          const here = l.min === level.min;
          const passed = l.min < level.min;
          return (
            <li
              key={l.min}
              className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all duration-300 ${
                here ? "scale-[1.03] border-ink bg-ink font-semibold text-mist" : passed ? "border-line bg-mint/20" : "border-line opacity-50"
              }`}
            >
              <span>{l.label}</span>
              <span dir="ltr" className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <i key={i} className={`size-2 rounded-full ${i < l.courses ? (here ? "bg-mist" : "bg-ink/50") : here ? "bg-mist/25" : "bg-ink/10"}`} />
                ))}
              </span>
            </li>
          );
        })}
      </ol>

      {level.courses > 0 && (
        <div className="mt-5 text-center">
          <p className="text-5xl font-bold tabular-nums text-warn">
            <bdi dir="ltr">{cost.toLocaleString("en-US")} ₪</bdi>
          </p>
          <p className="mt-1 text-sm opacity-70">{c.costLabel}</p>
          <p className="mt-4 font-semibold">{c.costPitch}</p>
          {/* Checkout handles every visitor: guests sign up there, members get their price, seminar students go to their cohort */}
          <Link href="/checkout?product=course" className="mt-3 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {c.costCta}
          </Link>
        </div>
      )}
      <p className="mt-2 text-sm leading-relaxed opacity-60">{c.disclaimer}</p>
    </div>
  );
}
