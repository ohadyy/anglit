"use client";

import { useState } from "react";
import type { Question } from "@/content/questions";
import { QuestionView } from "@/components/QuestionView";

// Two open sample questions. Nothing is saved: this is a taste of the paid practice.
export function TryIt({ questions }: { questions: Question[] }) {
  const [picks, setPicks] = useState<(number | null)[]>(() => questions.map(() => null));
  return (
    <div className="grid gap-6">
      {questions.map((q, n) => (
        <div key={q.id} className="rounded-3xl border border-line bg-white p-4 sm:p-6">
          <QuestionView
            q={q}
            selected={picks[n]}
            revealed={picks[n] !== null}
            onSelect={(i) => setPicks((p) => (p[n] !== null ? p : p.map((v, k) => (k === n ? i : v))))}
          />
        </div>
      ))}
    </div>
  );
}
