"use client";

import { useState } from "react";
import Link from "next/link";
import type { QuestionType } from "@/content/questions";
import { ALL_TYPES, TYPE_LABELS } from "@/content/questionLabels";
import { FeedbackBar } from "@/components/FeedbackBar";
import { Wordmark } from "@/components/Logo";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useStored } from "@/lib/useStored";

type Entry = { id: string; type: QuestionType; answered: string; why: string; rule: string };

const INITIAL = { name: "", entries: [] as Entry[] };

export function JournalClient() {
  const [st, setSt, reset] = useStored("anglit-journal", INITIAL);
  const [type, setType] = useState<QuestionType>("sentence");
  const [answered, setAnswered] = useState("");
  const [why, setWhy] = useState("");
  const [rule, setRule] = useState("");

  const add = () => {
    if (!answered.trim() && !why.trim() && !rule.trim()) return;
    const entry: Entry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, type, answered: answered.trim(), why: why.trim(), rule: rule.trim() };
    setSt((s) => ({ ...s, entries: [...s.entries, entry] }));
    setAnswered("");
    setWhy("");
    setRule("");
  };

  const remove = (id: string) => setSt((s) => ({ ...s, entries: s.entries.filter((e) => e.id !== id) }));

  const exportPdf = () => window.print();

  const summary = () => {
    const L = [`יומן הטעויות · Anglit${st.name ? ` · ${st.name}` : ""}`, ""];
    if (!st.entries.length) L.push("עוד לא נרשמו טעויות.");
    for (const e of [...st.entries].reverse()) {
      L.push(`• ${TYPE_LABELS[e.type].he}`);
      if (e.answered) L.push(`  עניתי: ${e.answered}`);
      if (e.why) L.push(`  למה טעיתי: ${e.why}`);
      if (e.rule) L.push(`  הכלל: ${e.rule}`);
    }
    return L.join("\n");
  };

  return (
    <div className="flex min-h-dvh flex-col pb-40 print:pb-0">
      <header className="mx-auto flex w-full max-w-2xl items-center justify-between gap-3 px-4 py-4 sm:px-6 print:hidden">
        <Link href="/" aria-label="לעמוד הבית">
          <Wordmark className="h-6 w-auto" />
        </Link>
        <ThemeToggle />
      </header>

      {/* Printable header — hidden on screen, shown only when exporting as PDF */}
      <div className="hidden print:block">
        <h1 className="font-display text-2xl font-bold">יומן הטעויות{st.name ? ` · ${st.name}` : ""}</h1>
        <p className="mt-1 text-sm opacity-70">{new Date().toLocaleDateString("he-IL")}</p>
      </div>

      <main className="mx-auto w-full max-w-2xl px-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold print:hidden">יומן הטעויות</h1>
        <p className="mt-2 leading-relaxed opacity-75 print:hidden">
          בכל פעם שטועים בתרגול או במבחן, מוסיפים שורה: באיזה פרק, מה ענית, ולמה זה היה שגוי. המטרה —
          לראות דפוסים חוזרים, לא טעות אקראית אחת. נשמר רק בטלפון שלך.
        </p>

        <section className="mt-6 rounded-3xl border border-line bg-white p-4 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-5 print:hidden">
          <p className="text-sm font-semibold opacity-70">שורה חדשה</p>

          <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="סוג הפרק">
            {ALL_TYPES.map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={type === t}
                onClick={() => setType(t)}
                className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-colors ${
                  type === t ? "border-fg bg-fg text-bg" : "border-line bg-bg"
                }`}
              >
                {TYPE_LABELS[t].he}
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <input
              value={answered}
              onChange={(e) => setAnswered(e.target.value)}
              placeholder="מה עניתי"
              className="rounded-2xl border border-line bg-bg px-4 py-3"
            />
            <input
              value={why}
              onChange={(e) => setWhy(e.target.value)}
              placeholder="למה טעיתי"
              className="rounded-2xl border border-line bg-bg px-4 py-3"
            />
            <input
              value={rule}
              onChange={(e) => setRule(e.target.value)}
              placeholder="מה הכלל שאני לוקח מזה"
              className="rounded-2xl border border-line bg-bg px-4 py-3"
            />
          </div>

          <button
            type="button"
            onClick={add}
            className="mt-4 w-full rounded-full bg-fg px-5 py-3 font-semibold text-bg active:scale-[0.98]"
          >
            הוספת שורה
          </button>
        </section>

        <section className="mt-8 flex flex-col gap-3">
          {[...st.entries].reverse().map((e) => (
            <article key={e.id} className="rounded-2xl border border-line bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-fg/10 px-3 py-1 text-sm font-semibold">{TYPE_LABELS[e.type].he}</span>
                <button
                  type="button"
                  onClick={() => remove(e.id)}
                  aria-label="מחיקת שורה"
                  className="text-sm opacity-60 hover:opacity-100 print:hidden"
                >
                  מחיקה
                </button>
              </div>
              <dl className="mt-2 flex flex-col gap-1 text-sm leading-relaxed">
                {e.answered && (
                  <div>
                    <dt className="inline opacity-60">עניתי: </dt>
                    <dd className="inline">{e.answered}</dd>
                  </div>
                )}
                {e.why && (
                  <div>
                    <dt className="inline opacity-60">למה טעיתי: </dt>
                    <dd className="inline">{e.why}</dd>
                  </div>
                )}
                {e.rule && (
                  <div>
                    <dt className="inline opacity-60">הכלל: </dt>
                    <dd className="inline font-medium">{e.rule}</dd>
                  </div>
                )}
              </dl>
            </article>
          ))}
        </section>

        <label className="mt-8 flex items-center gap-3 print:hidden">
          <span className="text-sm opacity-70">השם שלך:</span>
          <input
            value={st.name}
            onChange={(e) => setSt((s) => ({ ...s, name: e.target.value }))}
            placeholder="לא חובה, מופיע בשליחה בוואטסאפ"
            className="flex-1 rounded-xl border border-line bg-white px-3 py-2.5"
          />
        </label>

        <div className="mt-4 print:hidden">
          <button
            type="button"
            onClick={exportPdf}
            className="w-full rounded-full border-2 border-fg px-5 py-3 font-semibold active:scale-[0.98]"
          >
            ייצוא היומן כ-PDF
          </button>
          <p className="mt-2 text-center text-xs opacity-60">
            נפתח חלון שמירה/הדפסה — שומרים כ-PDF, ואז שולחים אותו בוואטסאפ למורה כקובץ (באייפון: סמל
            השיתוף בתצוגה המקדימה פותח ישר את וואטסאפ).
          </p>
        </div>
      </main>

      <FeedbackBar
        status={st.entries.length === 1 ? "שורה אחת ביומן" : `${st.entries.length} שורות ביומן`}
        summary={summary}
        onReset={reset}
        to="0535282911"
      />
    </div>
  );
}
