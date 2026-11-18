"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { onboardingCopy as t } from "@/content/copy";
import { SCORE_MAX, SCORE_MIN } from "@/content/facts";
import { saveOnboarding } from "@/lib/onboarding";
import { SCORE_LEVELS } from "@/lib/scoreLevels";
import { safeNext } from "@/lib/safeNext";
import type { Gender } from "@/lib/gender";

type Step = "gender" | "took" | "prior" | "target" | "date";

// Target scores the student can aim for: the placement levels from "basic" up to the exemption
const TARGETS = SCORE_LEVELS.filter((l) => l.min >= 85);

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in the visitor's own timezone

function Choice({ selected, onClick, children }: { selected: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`flex min-h-16 w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-start text-lg font-semibold transition-colors ${
        selected ? "border-fg bg-raise" : "border-line bg-white"
      }`}
    >
      {children}
    </button>
  );
}

export function OnboardingFlow() {
  const router = useRouter();
  const next = safeNext(useSearchParams().get("next"));
  const [index, setIndex] = useState(0);
  // "n" = neutral wording, saved as no gender
  const [gender, setGender] = useState<Gender | "n" | null>(null);
  const [took, setTook] = useState<boolean | null>(null);
  const [prior, setPrior] = useState("");
  const [target, setTarget] = useState<number | null>(null);
  const [hasDate, setHasDate] = useState<boolean | null>(null);
  const [date, setDate] = useState("");
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Someone who has not taken the exam is never asked for a previous score
  const steps: Step[] = took ? ["gender", "took", "prior", "target", "date"] : ["gender", "took", "target", "date"];
  const step = steps[index];
  // The bar starts a quarter full and reaches the end when the account form opens
  const percent = 25 + (75 * index) / steps.length;

  useEffect(() => {
    headingRef.current?.focus();
  }, [step]);

  const priorNumber = Number(prior);
  const priorValid = Number.isInteger(priorNumber) && priorNumber >= SCORE_MIN && priorNumber <= SCORE_MAX;
  const dateValid = /^\d{4}-\d{2}-\d{2}$/.test(date) && date >= today();

  const canContinue =
    step === "gender" ? gender !== null
    : step === "took" ? took !== null
    : step === "prior" ? priorValid
    : step === "target" ? target !== null
    : hasDate === false || (hasDate === true && dateValid);

  function advance(skipPrior = false) {
    if (index < steps.length - 1) {
      if (skipPrior) setPrior("");
      setIndex(index + 1);
      return;
    }
    saveOnboarding({
      gender: gender === "f" || gender === "m" ? gender : null,
      priorScore: took && priorValid ? priorNumber : null,
      targetScore: target,
      examDate: hasDate && dateValid ? date : "",
    });
    // A Google user already has an account and goes on to finish the profile; everyone else goes to the sign-up form
    router.push(next.startsWith("/complete-profile") ? next : `/sign-up?next=${encodeURIComponent(next)}`);
  }

  function back() {
    if (index === 0) router.back();
    else setIndex(index - 1);
  }

  const title = { gender: t.genderTitle, took: t.tookTitle, prior: t.priorTitle, target: t.targetTitle, date: t.dateTitle }[step];

  return (
    <div className="hero-mesh flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-xl items-center gap-3 px-4 pt-5">
        <button
          type="button"
          onClick={back}
          aria-label={t.back}
          className="grid size-11 shrink-0 place-items-center rounded-full"
        >
          {/* Points to the start of the line: right in Hebrew */}
          <svg viewBox="0 0 24 24" fill="none" className="size-6 rtl:rotate-180" aria-hidden>
            <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(percent)}
          className="h-2.5 flex-1 overflow-hidden rounded-full bg-sunk"
        >
          <div className="h-full rounded-full bg-fg transition-[width] duration-500 ease-out" style={{ width: `${percent}%` }} />
        </div>
      </header>

      <main className="mx-auto w-full max-w-xl flex-1 px-4 pb-8 pt-10">
        <div key={step} className="fade-in">
          <h1 ref={headingRef} tabIndex={-1} className="font-display text-2xl font-bold outline-none sm:text-3xl">
            {title}
          </h1>

          {step === "gender" && (
            <div className="mt-8 flex flex-col gap-3">
              <Choice selected={gender === "m"} onClick={() => setGender("m")}>{t.genderM}</Choice>
              <Choice selected={gender === "f"} onClick={() => setGender("f")}>{t.genderF}</Choice>
              <Choice selected={gender === "n"} onClick={() => setGender("n")}>{t.genderN}</Choice>
            </div>
          )}

          {step === "took" && (
            <div className="mt-8 flex flex-col gap-3">
              <Choice selected={took === true} onClick={() => setTook(true)}>{t.tookYes}</Choice>
              <Choice selected={took === false} onClick={() => setTook(false)}>{t.tookNo}</Choice>
            </div>
          )}

          {step === "prior" && (
            <div className="mt-8">
              {/* A slider instead of typing: nothing to type on a phone. The number stays empty until the student touches it. */}
              <p className="rounded-2xl border-2 border-line bg-white py-5 text-center font-display text-6xl font-bold tabular-nums" aria-live="polite">
                {prior === "" ? <span className="opacity-30">—</span> : <bdi dir="ltr">{prior}</bdi>}
              </p>
              <input
                type="range"
                min={SCORE_MIN}
                max={SCORE_MAX}
                step={1}
                dir="ltr"
                value={prior === "" ? 100 : priorNumber}
                onChange={(e) => setPrior(e.target.value)}
                onPointerUp={(e) => { if (prior === "") setPrior(e.currentTarget.value); }}
                aria-label={t.priorTitle}
                className="mt-8 h-11 w-full cursor-pointer accent-fg"
              />
              <div dir="ltr" className="mt-1 flex justify-between text-sm opacity-60">
                <span>{SCORE_MIN}</span>
                <span>{SCORE_MAX}</span>
              </div>
              <p className="mt-4 text-center text-sm opacity-70">{t.priorHint}</p>
            </div>
          )}

          {step === "target" && (
            <div className="mt-8 flex flex-col gap-3">
              {TARGETS.map((l) => (
                <Choice key={l.min} selected={target === l.min} onClick={() => setTarget(l.min)}>
                  <span>{l.label}</span>
                  <bdi dir="ltr" className="font-display text-2xl font-bold">{l.min}+</bdi>
                </Choice>
              ))}
              <p className="mt-1 text-sm opacity-70">{t.targetHint}</p>
            </div>
          )}

          {step === "date" && (
            <div className="mt-8 flex flex-col gap-3">
              <Choice selected={hasDate === true} onClick={() => setHasDate(true)}>{t.dateYes}</Choice>
              <Choice selected={hasDate === false} onClick={() => setHasDate(false)}>{t.dateNo}</Choice>
              {hasDate && (
                <label className="mt-2 flex flex-col gap-1.5">
                  <span className="text-sm opacity-70">{t.dateLabel}</span>
                  <input
                    type="date"
                    min={today()}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-2xl border-2 border-line bg-white px-4 py-3.5 text-base outline-none focus:border-fg"
                  />
                </label>
              )}
            </div>
          )}
        </div>
      </main>

      <footer className="mx-auto w-full max-w-xl px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        {step === "prior" && (
          <button type="button" onClick={() => advance(true)} className="mb-2 flex min-h-11 w-full items-center justify-center text-sm font-semibold underline underline-offset-4">
            {t.skip}
          </button>
        )}
        <button
          type="button"
          disabled={!canContinue}
          onClick={() => advance()}
          className="flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 text-lg font-semibold text-bg transition-opacity disabled:opacity-35"
        >
          {t.next}
        </button>
      </footer>
    </div>
  );
}
