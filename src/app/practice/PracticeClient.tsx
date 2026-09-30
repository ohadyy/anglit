"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { copy } from "@/content/copy";
import { TYPE_LABELS, type QuestionType } from "@/content/questions";
import { QuestionView, TypeLabel } from "@/components/QuestionView";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { buildSet, TYPES } from "@/lib/practice";
import { site } from "@/lib/site";

export function PracticeClient({ type }: { type?: QuestionType }) {
  const set = useMemo(() => buildSet(type), [type]);
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => set.map(() => null));
  const done = index >= set.length;

  const q = set[index];
  const selected = done ? null : picks[index];
  const revealed = selected !== null;

  const pick = useCallback(
    (i: number) => {
      if (done || picks[index] !== null) return;
      setPicks((p) => p.map((v, k) => (k === index ? i : v)));
    },
    [done, index, picks],
  );

  const next = useCallback(() => {
    if (!revealed) return;
    setIndex((i) => i + 1);
    window.scrollTo({ top: 0 });
  }, [revealed]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const n = Number(e.key);
      if (n >= 1 && n <= 4) pick(n - 1);
      else if (e.key === "Enter") next();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pick, next]);

  const correct = picks.filter((p, i) => p === set[i].answer).length;

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-4 sm:px-6 sm:pt-5">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <div className="flex items-center gap-3">
          {!done && (
            <span className="text-sm tabular-nums opacity-70">
              {index + 1} מתוך {set.length}
            </span>
          )}
          <ThemeToggle />
        </div>
      </header>

      <div className="mx-auto mt-3 w-full max-w-3xl px-4 sm:px-6" aria-hidden>
        <div className="flex gap-1">
          {set.map((sq, i) => {
            const p = picks[i];
            const tone =
              p === null
                ? i === index
                  ? "bg-fg/50"
                  : "bg-fg/12"
                : p === sq.answer
                  ? "bg-mint"
                  : "bg-coral";
            return <span key={sq.id} className={`h-1.5 flex-1 rounded-full transition-colors ${tone}`} />;
          })}
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        {done ? (
          <Summary correct={correct} total={set.length} type={type} />
        ) : (
          <div key={q.id} className="rise">
            <div className="mb-4">
              <TypeLabel q={q} />
            </div>
            <QuestionView q={q} selected={selected} revealed={revealed} onSelect={pick} />
          </div>
        )}
      </main>

      {!done && (
        <div
          className="fixed inset-x-0 bottom-0 border-t border-line bg-bg/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="hidden text-sm opacity-50 sm:block">
              {revealed ? "Enter לשאלה הבאה" : <>אפשר לענות גם במקשים <bdi dir="ltr">1–4</bdi></>}
            </p>
            <button
              type="button"
              onClick={next}
              disabled={!revealed}
              className="w-full rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-opacity disabled:opacity-30 sm:ms-auto sm:w-auto sm:py-3"
            >
              {!revealed ? "בחרו תשובה" : index === set.length - 1 ? "לתוצאות" : "לשאלה הבאה"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Summary({ correct, total, type }: { correct: number; total: number; type?: QuestionType }) {
  const others = TYPES.filter((t) => t !== type);
  return (
    <div className="rise">
      <p className="text-sm opacity-60">סיימתם את התרגול</p>
      <p className="mt-2 text-6xl font-bold tabular-nums">
        {correct}
        <span className="opacity-40">/{total}</span>
      </p>
      <p className="mt-3 max-w-md text-lg opacity-80">
        {correct === total
          ? "מושלם. עכשיו נשאר רק לשמור על זה בזמן אמת."
          : correct >= total * 0.7
            ? "בסיס טוב. בשבוע של עבודה ממוקדת סוגרים את הפער."
            : "יש לאן לעלות, ובשביל זה בדיוק בנינו את השבוע."}
      </p>

      <div data-invert="" className="mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{copy.practiceEndTitle}</h2>
        <p className="mt-2 opacity-80">{copy.practiceEndText}</p>
        <a
          href={site.instagramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-5 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg"
        >
          {copy.practiceEndCta}
        </a>
      </div>

      <div className="mt-8">
        <p className="text-sm opacity-60">תרגול נוסף לפי סוג שאלה</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {others.map((t) => (
            <a
              key={t}
              href={`/practice?type=${t}`}
              className="rounded-full border border-line px-4 py-2.5 text-sm hover:bg-fg/5"
            >
              {TYPE_LABELS[t].he}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
