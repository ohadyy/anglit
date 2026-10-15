"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { copy } from "@/content/copy";
import type { Passage, Question, QuestionType } from "@/content/questions";
import { ALL_TYPES, TYPE_LABELS } from "@/content/questionLabels";
import { PassageProvider } from "@/components/PassageContext";
import { QuestionView, TypeLabel } from "@/components/QuestionView";
import { LockIcon } from "@/components/LockIcon";
import { TactileButton } from "@/components/TactileButton";
import { readMistakes, recordAnswers, removeMistake, type Mistakes } from "@/lib/mistakes";
import type { QuestionNote } from "@/content/questionNotes";

export type PracticeMode = QuestionType | "free" | "mistakes";

// The server decides what this visitor may see and passes only that: visitors without paid
// access get the five free questions, and paid access unlocks every question type.
export type PracticeData = {
  paid: boolean;
  /** The five free questions, with the passage they use */
  free: Question[];
  /** The questions of the requested type, empty when this visitor may not see them */
  set: Question[];
  /** How many questions each type has, for the chooser */
  counts: Record<QuestionType, number>;
  passages: Passage[];
  /** Hebrew notes for the mistakes review, sent only to paid members on that page */
  notes: Record<string, QuestionNote>;
};

export function PracticeClient({ mode, data }: { mode?: PracticeMode; data: PracticeData }) {
  const { paid, free, set, counts, passages, notes } = data;
  return (
    <PassageProvider passages={passages}>
      {!mode && <TypeChooser paid={paid} counts={counts} />}
      {mode === "free" && <PracticeSession mode="free" set={free} notes={notes} />}
      {mode === "mistakes" && <MistakesReview paid={paid} bank={set} notes={notes} />}
      {mode && mode !== "free" && mode !== "mistakes" && (!paid ? <LockedPractice type={mode} /> : <PracticeSession mode={mode} set={set} notes={notes} />)}
    </PassageProvider>
  );
}

function TypeChooser({ paid, counts }: { paid: boolean; counts: Record<QuestionType, number> }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 sm:py-14">
      <p className="font-hand text-2xl opacity-70">תרגול חופשי</p>
      <h1 className="font-display mt-2 text-3xl font-bold sm:text-4xl">בחרו <mark className="pink">סוג שאלה</mark></h1>
      <p className="mt-3 max-w-xl text-lg leading-relaxed opacity-80">
        {paid
          ? "בכל סוג יש הרבה שאלות, בלי לחץ זמן. אחרי כל תשובה תקבלו הסבר, ואפשר לעבור לסוג אחר בכל רגע."
          : "בחינם אפשר לתרגל 5 שאלות לדוגמה. לתרגול מלא בכל הסוגים יש מסלול בתשלום."}
      </p>

      <Link
        href="/practice/words"
        className="mt-8 flex items-center justify-between rounded-3xl bg-fg p-5 text-bg transition-transform active:scale-[0.98] sm:p-6"
      >
        <span>
          <span className="block text-xl font-bold">שרשרת מילים</span>
          <span className="mt-1 block text-sm opacity-80">משחק קצר: מילה בעברית, ותשובה באנגלית</span>
        </span>
        <span className="text-sm font-semibold">לשחק ←</span>
      </Link>

      <Link
        href="/practice/challenge"
        className="mt-3 flex items-center justify-between rounded-3xl bg-marker p-5 text-ink-deep transition-transform active:scale-[0.98] sm:p-6"
      >
        <span>
          <span className="block text-xl font-bold">אתגר נגד השעון</span>
          <span className="mt-1 block text-sm opacity-80">12 שניות לשאלה, בלי טעויות — כמה רחוק תגיעו?</span>
        </span>
        <span className="text-sm font-semibold">לשחק ←</span>
      </Link>

      <MistakesCard />

      <ul className="mt-4 grid gap-3">
        {!paid && (
          <li>
            <Link
              href="/practice?type=free"
              className="group flex items-center justify-between rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5 transition-colors hover:border-fg/30 sm:p-6"
            >
              <span>
                <span className="block text-xl font-bold">5 שאלות חינם</span>
                <span className="mt-1 block text-sm opacity-70">מכל הסוגים, עם הסבר לכל תשובה</span>
              </span>
              <span className="text-sm font-semibold opacity-70 group-hover:opacity-100">להתחיל ←</span>
            </Link>
          </li>
        )}

        {ALL_TYPES.map((t) => {
          const card = (
            <>
              <span>
                <span className="block text-xl font-bold">{TYPE_LABELS[t].he}</span>
                <span dir="ltr" className="mt-1 block text-left text-sm opacity-70">
                  {TYPE_LABELS[t].en}
                </span>
              </span>
              {paid ? (
                <span className="text-sm font-semibold tabular-nums opacity-70 group-hover:opacity-100">
                  {counts[t]} שאלות ←
                </span>
              ) : (
                <span className="flex items-center gap-2 text-sm font-semibold opacity-70">
                  <LockIcon className="size-4" /> בתשלום
                </span>
              )}
            </>
          );

          return (
            <li key={t}>
              <Link
                href={paid ? `/practice?type=${t}` : "/pricing"}
                className="group flex items-center justify-between rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5 transition-colors hover:border-fg/30 sm:p-6"
              >
                {card}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function LockedPractice({ type }: { type: QuestionType }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-16 text-center">
      <div className="flex size-14 items-center justify-center rounded-full bg-white">
        <LockIcon />
      </div>
      <p className="mt-5 font-hand text-2xl opacity-70">{TYPE_LABELS[type].he}</p>
      <h1 className="font-display mt-2 text-2xl font-bold">התרגול הזה במסלול בתשלום</h1>
      <p className="mt-3 leading-relaxed opacity-80">
        בחינם אפשר לתרגל 5 שאלות לדוגמה מכל הסוגים, עם הסבר מלא לכל תשובה. לתרגול מלא בכל הסוגים יש מסלול בתשלום.
      </p>
      <Link href="/pricing" className="mt-8 flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg">
        לצפייה במסלולים
      </Link>
      <Link href="/practice?type=free" className="mt-4 inline-flex min-h-11 items-center text-sm underline opacity-70">
        לחמש השאלות החינמיות
      </Link>
    </div>
  );
}

function PracticeSession({
  mode,
  set,
  notes,
}: {
  mode: PracticeMode;
  set: Question[];
  notes: Record<string, QuestionNote>;
}) {
  const [index, setIndex] = useState(0);
  const [picks, setPicks] = useState<(number | null)[]>(() => set.map(() => null));
  const done = index >= set.length;

  const q = set[index];
  const selected = done ? null : picks[index];
  const revealed = selected !== null;

  const pick = useCallback(
    (i: number) => {
      if (done || picks[index] !== null) return;
      recordAnswers({ [set[index].id]: { correct: i === set[index].answer, chosen: i } });
      setPicks((p) => p.map((v, k) => (k === index ? i : v)));
    },
    [done, index, picks, set],
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
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4 px-4 pt-4 text-sm sm:px-6">
        <Link href="/practice" className="opacity-70 underline underline-offset-4">
          כל הסוגים
        </Link>
        {!done && <span className="tabular-nums opacity-70">{index + 1} מתוך {set.length}</span>}
      </div>

      <div className="mx-auto mt-3 w-full max-w-3xl px-4 sm:px-6" aria-hidden>
        <div className="h-1.5 overflow-hidden rounded-full bg-fg/12">
          <div
            className="h-full rounded-full bg-fg transition-[width] duration-300"
            style={{ width: `${(Math.min(index, set.length) / set.length) * 100}%` }}
          />
        </div>
      </div>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-32 pt-6 sm:px-6 sm:pt-8">
        {done ? (
          <Summary correct={correct} total={set.length} mode={mode} />
        ) : (
          <div key={q.id} className="rise">
            <div className="mb-4">
              <TypeLabel q={q} />
            </div>
            <QuestionView q={q} selected={selected} revealed={revealed} onSelect={pick} note={notes[q.id]} />
          </div>
        )}
      </main>

      {!done && (
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="hidden text-sm opacity-70 sm:block">
              {revealed ? "Enter לשאלה הבאה" : <>אפשר לענות גם במקשים <bdi dir="ltr">1–4</bdi></>}
            </p>
            <TactileButton
              type="button"
              onClick={next}
              disabled={!revealed}
              fullWidth
              className="sm:ms-auto sm:w-max"
            >
              {!revealed ? "בחרו תשובה" : index === set.length - 1 ? "לתוצאות" : "לשאלה הבאה"}
            </TactileButton>
          </div>
        </div>
      )}
    </div>
  );
}

function Summary({ correct, total, mode }: { correct: number; total: number; mode: PracticeMode }) {
  const others = ALL_TYPES.filter((t) => t !== mode);
  return (
    <div className="rise">
      <p className="font-hand text-2xl opacity-70">סיימתם את התרגול</p>
      <p className="mt-2 text-6xl font-bold tabular-nums">
        {correct}
        <span className="opacity-40">/{total}</span>
      </p>
      <p className="mt-3 max-w-md text-lg opacity-80">
        {correct === total
          ? "מושלם. עכשיו נשאר רק לשמור על זה בזמן אמת."
          : correct >= total * 0.7
            ? "בסיס טוב. בשבוע של עבודה ממוקדת סוגרים את הפער."
            : "אם אתם רוצים לענות נכון על כל השאלות בזמן אמת, אנחנו מזמינים אתכם להצטרף למחזור הקרוב של \"7 ימים לאמירנט\"."}
      </p>

      <div data-invert="" className="mt-10 rounded-3xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold">{copy.practiceEndTitle}</h2>
        <p className="mt-2 opacity-80">{copy.practiceEndText}</p>
        <Link href="/sign-up" className="mt-5 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
          {copy.practiceEndCta}
        </Link>
      </div>

      <div className="mt-8">
        <p className="text-sm opacity-70">תרגול נוסף לפי סוג שאלה</p>
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

// Reads the device's saved mistakes after mount, so server and client render the same markup
function useMistakes() {
  const [mistakes, setMistakes] = useState<Mistakes | null>(null);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
    setMistakes(readMistakes());
  }, []);
  return [mistakes, setMistakes] as const;
}

function MistakesCard() {
  const [mistakes] = useMistakes();
  return (
    <Link
      href="/practice?type=mistakes"
      className="group mt-3 flex items-center justify-between rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] transition-colors hover:border-fg/30 sm:p-6"
    >
      <span>
        <span className="block text-xl font-bold">הטעויות שלי</span>
        <span className="mt-1 block text-sm opacity-70">כל שאלה שטעיתם בה, עם הסבר ותרגום לעברית</span>
      </span>
      <span className="text-sm font-semibold tabular-nums opacity-70 group-hover:opacity-100">
        {mistakes === null ? "" : `${Object.keys(mistakes).length} שאלות ←`}
      </span>
    </Link>
  );
}

function MistakesReview({ paid, bank, notes }: { paid: boolean; bank: Question[]; notes: Record<string, QuestionNote> }) {
  const [mistakes, setMistakes] = useMistakes();
  if (mistakes === null) return null;
  const count = Object.keys(mistakes).length;

  if (!paid) {
    return (
      <div className="mx-auto flex min-h-dvh max-w-md flex-col items-center justify-center px-4 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-white">
          <LockIcon />
        </div>
        <p className="mt-5 font-hand text-2xl opacity-70">הטעויות שלי</p>
        <h1 className="font-display mt-2 text-2xl font-bold">
          {count === 0
            ? "הסבר מלא לכל טעות"
            : count === 1
              ? "שאלה אחת מחכה להסבר"
              : `${count} שאלות מחכות להסבר`}
        </h1>
        <p className="mt-3 leading-relaxed opacity-80">
          כל שאלה שטעיתם בה נשמרת, עם תרגום לעברית, פירוש של כל תשובה, ולמה התשובה שבחרתם לא מתאימה. זה פתוח במסלול בתשלום.
        </p>
        <Link href="/pricing" className="mt-8 flex w-full items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg">
          לצפייה במסלולים
        </Link>
        <Link href="/practice?type=free" className="mt-4 inline-flex min-h-11 items-center text-sm underline opacity-70">
          לחמש השאלות החינמיות
        </Link>
      </div>
    );
  }

  const list = bank.filter((q) => q.id in mistakes);
  function done(id: string) {
    removeMistake(id);
    setMistakes((m) => {
      if (!m) return m;
      const rest = { ...m };
      delete rest[id];
      return rest;
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-4 sm:px-6">
      <Link href="/practice" className="text-sm underline underline-offset-4 opacity-70">
        כל הסוגים
      </Link>
      <p className="mt-6 font-hand text-2xl opacity-70">הטעויות שלי</p>
      <h1 className="font-display mt-1 text-3xl font-bold">
        {list.length === 0 ? "אין טעויות שמורות" : list.length === 1 ? "שאלה אחת לחזור עליה" : `${list.length} שאלות לחזור עליהן`}
      </h1>
      <p className="mt-3 max-w-xl leading-relaxed opacity-80">
        {list.length === 0
          ? "כל שאלה שתטעו בה בתרגול או במבחן תופיע כאן, עם הסבר מלא ותרגום לעברית."
          : "לכל שאלה: מה בחרתם, מה התשובה הנכונה, ומה המשמעות של כל אחת מהתשובות. כשהבנתם, מסירים אותה מהרשימה."}
      </p>
      {list.length === 0 && (
        <Link href="/practice" className="mt-8 inline-flex rounded-full bg-fg px-6 py-3.5 font-semibold text-bg">
          לתרגול
        </Link>
      )}

      <ol className="mt-8 grid gap-10">
        {list.map((q) => (
          <li key={q.id} className="border-t border-line pt-8">
            <MistakeCard q={q} chosen={mistakes[q.id]} note={notes[q.id]} onDone={() => done(q.id)} />
          </li>
        ))}
      </ol>
    </div>
  );
}

function MistakeCard({
  q,
  chosen,
  note,
  onDone,
}: {
  q: Question;
  chosen: number | null;
  note?: QuestionNote;
  onDone: () => void;
}) {
  return (
    <article>
      <div className="mb-4">
        <TypeLabel q={q} />
      </div>
      {chosen === null && <p className="mb-4 text-sm font-semibold opacity-80">לא עניתם על השאלה הזאת בזמן.</p>}
      <QuestionView q={q} selected={chosen} revealed note={note} />

      <TactileButton type="button" onClick={onDone} className="mt-5">
        הבנתי, להסיר מהרשימה
      </TactileButton>
    </article>
  );
}
