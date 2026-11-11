"use client";

import { Stem } from "./Stem";
import { useState } from "react";
import { QuestionView, TypeLabel } from "@/components/QuestionView";
import { isCorrectAnswer, type ExamQuestion, type Question } from "@/content/questions";

export type ReviewItem = { q: ExamQuestion; value: number | string | null | undefined };

/** Every question of a finished test: what the student chose, the right answer and why.
 * Needs a PassageProvider around it for the reading and listening questions. */
export function ExamReview({ items, askOhad = false }: { items: ReviewItem[]; askOhad?: boolean }) {
  const rows = items.map((item, i) => ({ ...item, n: i + 1, correct: isCorrectAnswer(item.q, item.value) }));
  const wrong = rows.filter((r) => !r.correct);
  const [showAll, setShowAll] = useState(wrong.length === 0);
  const shown = showAll ? rows : wrong;

  const passageSeen = new Set<string>();

  return (
    <section id="review" className="scroll-mt-6">
      <h2 className="font-display text-2xl font-bold">סקירת המבחן</h2>
      <p className="mt-1 text-sm opacity-70">
        {wrong.length === 0 ? `כל ${rows.length} השאלות נכונות.` : `טעיתם ב-${wrong.length} מתוך ${rows.length} שאלות.`}
      </p>

      {wrong.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-sunk p-1" role="group" aria-label="אילו שאלות להציג">
          <FilterButton active={!showAll} onClick={() => setShowAll(false)}>
            רק הטעויות ({wrong.length})
          </FilterButton>
          <FilterButton active={showAll} onClick={() => setShowAll(true)}>
            כל השאלות ({rows.length})
          </FilterButton>
        </div>
      )}

      <ol className="mt-6 grid gap-10">
        {shown.map(({ q, value, n, correct }) => {
          const showPassage = !("passageId" in q) || q.type !== "reading" || !passageSeen.has(q.passageId);
          if ("passageId" in q) passageSeen.add(q.passageId);
          return (
            <li key={q.id} className="border-t border-line pt-6">
              <div className="mb-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="whitespace-nowrap font-semibold tabular-nums">שאלה {n}</span>
                  <Status correct={correct} blank={value === null || value === undefined || value === ""} />
                </div>
                <div className="mt-1">
                  <TypeLabel q={q} />
                </div>
              </div>
              {q.type === "wordformation" ? (
                <TypedAnswer q={q} value={typeof value === "string" ? value : null} />
              ) : (
                <QuestionView q={q as Question} selected={typeof value === "number" ? value : null} revealed showPassage={showPassage} askOhad={askOhad} />
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-11 rounded-full px-3 text-sm font-semibold transition-colors ${active ? "bg-fg text-bg" : ""}`}
    >
      {children}
    </button>
  );
}

function Status({ correct, blank }: { correct: boolean; blank: boolean }) {
  const [label, tone] = correct ? ["נכון", "bg-mint"] : blank ? ["לא נענתה בזמן", "bg-marker"] : ["טעות", "bg-coral"];
  return <span className={`shrink-0 rounded-full px-3 py-1 text-sm font-semibold text-ink-deep ${tone}`}>{label}</span>;
}

function TypedAnswer({ q, value }: { q: Extract<ExamQuestion, { type: "wordformation" }>; value: string | null }) {
  const correct = isCorrectAnswer(q, value);
  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-3xl bg-sunk p-5">
        <p className="text-sm opacity-70">מילת הבסיס</p>
        <p dir="ltr" className="mt-1 text-left text-xl font-bold">{q.baseWord}</p>
        <p dir="ltr" className="mt-4 text-left text-xl font-medium leading-snug text-balance"><Stem text={q.stem} revealed={false} /></p>
      </div>
      <p className="text-sm">
        מה כתבתם:{" "}
        <bdi dir="ltr" className={`rounded-md px-1.5 py-0.5 font-semibold text-ink-deep ${correct ? "bg-mint" : "bg-coral"}`}>
          {value?.trim() || "—"}
        </bdi>
        {!correct && (
          <>
            {" "}· התשובה: <bdi dir="ltr" className="rounded-md bg-mint px-1.5 py-0.5 font-semibold text-ink-deep">{q.accepted[0]}</bdi>
          </>
        )}
      </p>
      <div className="rounded-3xl bg-white p-5 text-ink">
        <p className="leading-relaxed">{q.explanation}</p>
        {q.trick && (
          <p className="mt-3 font-semibold leading-relaxed">
            <span className="me-1.5 rounded-md bg-marker px-1.5 py-0.5 text-ink-deep">הטריק</span>
            {q.trick}
          </p>
        )}
      </div>
    </div>
  );
}
