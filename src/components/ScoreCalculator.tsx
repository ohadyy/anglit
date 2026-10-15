"use client";

import Link from "next/link";
import { useState } from "react";
import { calculatorCopy as c } from "@/content/examGuide";
import { SCORE_LEVELS, scoreLevel } from "@/lib/scoreLevels";

export function ScoreCalculator() {
  const [score, setScore] = useState(100);
  // What's typed, so "1" on the way to "120" isn't clamped to 50 mid-typing
  const [draft, setDraft] = useState("100");
  const level = scoreLevel(score);
  const next = SCORE_LEVELS.find((l) => l.min > score);

  function set(v: number) {
    const clamped = Math.min(150, Math.max(50, Math.round(v)));
    setScore(clamped);
    setDraft(String(clamped));
  }

  function type(raw: string) {
    setDraft(raw);
    const v = Number(raw);
    if (raw !== "" && v >= 50 && v <= 150) setScore(Math.round(v));
  }

  return (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-7">
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
          min={50}
          max={150}
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
          min={50}
          max={150}
          value={score}
          onChange={(e) => set(Number(e.target.value))}
          aria-label={c.inputLabel}
          className="h-11 w-full cursor-pointer accent-fg"
        />
        <div className="flex justify-between text-xs tabular-nums opacity-60">
          <span>50</span>
          <span>150</span>
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

      <ol dir="ltr" className="mt-5 grid grid-cols-6 gap-1" aria-hidden>
        {SCORE_LEVELS.map((l) => (
          <li
            key={l.min}
            className={`h-2 rounded-full ${l.min <= score ? "bg-fg" : "bg-fg/12"}`}
            title={l.label}
          />
        ))}
      </ol>

      {level.courses > 0 && (
        <div className="mt-5 text-center">
          <p className="text-5xl font-bold tabular-nums text-warn">
            <bdi dir="ltr">{(level.courses * c.costPerCourse).toLocaleString("en-US")} ₪</bdi>
          </p>
          <p className="mt-1 text-sm opacity-70">{c.costLabel}</p>
          <p className="mt-4 font-semibold">{c.costPitch}</p>
          <Link href="/sign-up" className="mt-3 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
            {c.costCta}
          </Link>
        </div>
      )}
      <p className="mt-2 text-sm leading-relaxed opacity-60">{c.disclaimer}</p>
    </div>
  );
}
