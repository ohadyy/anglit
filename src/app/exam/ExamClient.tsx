"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { QuestionView, TypeLabel, WordFormationView } from "@/components/QuestionView";
import { isCorrectAnswer, type ExamQuestion, type QuestionType } from "@/content/questions";
import { TYPE_LABELS } from "@/content/questionLabels";
import { recordAnswers } from "@/lib/mistakes";
import { planTotals, type ExamPlanItem } from "@/lib/examStructure";
import { PILOT_MAX_BONUS, scoreExam, scoreLevel, scoreMessage, type ExamScore } from "@/lib/examScore";
import { AudioCheck } from "@/components/ReadAloud";
import { TactileButton } from "@/components/TactileButton";

type Phase = "intro" | "running" | "submitting" | "done";
// Multiple choice stores the option index, word formation stores the typed word
type Answers = Record<string, number | string | null>;
type Result = ExamScore & { id?: string };
// Right answers out of asked, per question type, in exam order
type TypeTally = { type: QuestionType; correct: number; total: number }[];

function formatTime(sec: number) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function ExamClient({
  plan,
  kind,
  testNumber,
}: {
  plan: ExamPlanItem[];
  kind: "open" | "close";
  testNumber: string;
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [includePilot, setIncludePilot] = useState(true);
  const [activePlan, setActivePlan] = useState<ExamPlanItem[]>(plan);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Result | null>(null);
  const [tally, setTally] = useState<TypeTally>([]);
  const startedAtRef = useRef<string>("");

  const totals = planTotals(plan, includePilot);

  async function finishExam(finalAnswers: Answers) {
    setPhase("submitting");
    const all = activePlan.flatMap((p) => p.questions);
    const correctness: Record<string, boolean> = {};
    for (const question of all) {
      correctness[question.id] = isCorrectAnswer(question, finalAnswers[question.id]);
    }
    const fallback = scoreExam(correctness);
    // Core sections only: pilot items come from a separate bank that /practice can't replay
    recordAnswers(
      Object.fromEntries(
        activePlan
          .filter((p) => !p.section.pilot)
          .flatMap((p) =>
            p.questions.map((q) => {
              const a = finalAnswers[q.id];
              return [q.id, { correct: correctness[q.id], chosen: typeof a === "number" ? a : null }];
            }),
          ),
      ),
    );
    setTally(tallyByType(activePlan, correctness));

    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind,
          testNumber,
          includePilot,
          answers: finalAnswers,
          correctness,
          startedAt: startedAtRef.current,
        }),
      });
      setResult(res.ok ? await res.json() : fallback);
    } catch {
      setResult(fallback);
    }
    setPhase("done");
  }

  function handleSectionDone(latestAnswers: Answers) {
    if (sectionIndex + 1 < activePlan.length) {
      setSectionIndex((i) => i + 1);
    } else {
      void finishExam(latestAnswers);
    }
  }

  function start() {
    startedAtRef.current = new Date().toISOString();
    setActivePlan(plan.filter((p) => includePilot || !p.section.pilot));
    setSectionIndex(0);
    setPhase("running");
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">מבחן תרגול</h1>
        <p className="mt-2 text-sm font-semibold tabular-nums opacity-70">מספר מבחן: {testNumber}</p>
        <p className="mt-3 leading-relaxed opacity-80">
          {totals.questions} שאלות ב-{totals.sections} פרקים מתוזמנים, {totals.minutes} דקות בסך הכול. כל פרק עובר
          אוטומטית כשהזמן נגמר, גם אם לא סיימתם.
        </p>

        <fieldset className="mt-8 text-start">
          <legend className="text-sm font-semibold">לפני שמתחילים: לכלול פרקי ניסיון?</legend>
          <p className="mt-2 text-sm leading-relaxed opacity-70">
            במבחן האמיתי פרקי הניסיון תמיד מופיעים, ואי אפשר לבחור אותם. משקלם בציון קטן מאוד: טעות לא פוגעת, ותשובה נכונה
            עשויה להעלות את הציון בעד {PILOT_MAX_BONUS} נקודות. באתר אפשר לתרגל גם רק את פרקי הליבה.
          </p>
          <div className="mt-4 grid gap-2">
            <ChoiceButton
              selected={includePilot}
              onClick={() => setIncludePilot(true)}
              title="כן, כולל פרקי ניסיון (כמו במבחן)"
              detail={`${planTotals(plan, true).questions} שאלות · ${planTotals(plan, true).minutes} דקות`}
            />
            <ChoiceButton
              selected={!includePilot}
              onClick={() => setIncludePilot(false)}
              title="לא, רק פרקי הליבה"
              detail={`${planTotals(plan, false).questions} שאלות · ${planTotals(plan, false).minutes} דקות`}
            />
          </div>
        </fieldset>

        <p className="mt-6 text-sm opacity-70">
          בסוף תקבלו הערכת ציון משוערת (50–150). זו לא הציון הרשמי של מאל&quot;ו.
        </p>
        <div className="mt-8">
          <AudioCheck />
        </div>
        <TactileButton onClick={start} size="lg" className="mt-8">
          להתחיל
        </TactileButton>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 text-center opacity-70">
        שומר תוצאות...
      </div>
    );
  }

  if (phase === "done" && result) {
    const level = scoreLevel(result.estimatedScore);
    return (
      <div className="mx-auto flex min-h-dvh max-w-sm flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold opacity-70">סיימתם!</p>
        <p className="mt-2 text-8xl font-bold tracking-tight tabular-nums">
          {result.estimatedScore}
          <span className="ms-3 text-2xl font-semibold opacity-70">מתוך 150</span>
        </p>
        <p className="mt-1 text-sm opacity-70">הערכה משוערת, לא הציון הרשמי</p>
        <p className="mt-6 max-w-sm leading-relaxed">{scoreMessage(result.estimatedScore)}</p>
        <div className="mt-6 rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] p-5">
          <p className="font-semibold">{level.label}</p>
          <p className="mt-1 text-sm opacity-70">{level.note}</p>
          <p className="mt-2 text-sm opacity-60">מספר הקורסים הסופי נקבע על ידי המוסד שבו תלמדו.</p>
          <p className="mt-3 text-sm opacity-70">
            פרקי ליבה: {result.coreCorrect} מתוך {result.coreTotal} נכונות
          </p>
          {result.pilotTotal > 0 && (
            <p className="mt-1 text-sm opacity-70">
              פרקי ניסיון: {result.pilotCorrect} מתוך {result.pilotTotal} נכונות
              {result.pilotBonus > 0 ? ` (בונוס +${result.pilotBonus})` : ""}
            </p>
          )}
        </div>
        <Diagnosis tally={tally} />
        <Link href="/account" className="mt-8 rounded-full bg-fg px-6 py-3 font-semibold text-bg">
          לאזור האישי
        </Link>
      </div>
    );
  }

  const current = activePlan[sectionIndex];
  return (
    <SectionRunner
      key={sectionIndex}
      questions={current.questions}
      minutes={current.section.minutes}
      sectionIndex={sectionIndex}
      totalSections={activePlan.length}
      answers={answers}
      onAnswer={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))}
      onSectionDone={handleSectionDone}
    />
  );
}

function tallyByType(plan: ExamPlanItem[], correctness: Record<string, boolean>): TypeTally {
  const out: TypeTally = [];
  for (const { section, questions } of plan) {
    let row = out.find((r) => r.type === section.type);
    if (!row) out.push((row = { type: section.type, correct: 0, total: 0 }));
    for (const q of questions) {
      row.total++;
      if (correctness[q.id]) row.correct++;
    }
  }
  return out;
}

// Shows where the points went, not how to fix it: the method is taught in the course
function Diagnosis({ tally }: { tally: TypeTally }) {
  const weakest = tally
    .filter((r) => r.correct < r.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  if (tally.length === 0) return null;
  return (
    <div className="mt-6 w-full rounded-3xl border border-line bg-white p-5 text-start shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
      <p className="font-semibold">איפה הלכו הנקודות</p>
      <ul className="mt-4 grid gap-3">
        {tally.map((r) => (
          <li key={r.type}>
            <div className="flex justify-between gap-3 text-sm">
              <span className={r === weakest ? "font-bold" : ""}>{TYPE_LABELS[r.type].he}</span>
              <span className="tabular-nums opacity-70">
                {r.correct}/{r.total}
              </span>
            </div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-fg/12">
              <div
                className={`h-full rounded-full ${r === weakest ? "bg-coral" : "bg-fg"}`}
                style={{ width: `${(r.correct / r.total) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
      {weakest ? (
        <p className="mt-4 text-sm leading-relaxed opacity-80">
          הכי הרבה נקודות הלכו על <strong>{TYPE_LABELS[weakest.type].he}</strong>. משם כדאי להתחיל. בסמינר יש לכל סוג שאלה
          שיטה משלו, ועוברים עליה צעד אחרי צעד.
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed opacity-80">בלי טעויות בכלל. נשאר לשמור על זה גם ביום המבחן.</p>
      )}
      <div className="mt-4 flex flex-wrap gap-x-5">
        <Link href="/practice?type=mistakes" className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
          להסבר על הטעויות
        </Link>
        <Link href="/pricing" className="flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
          לפרטים על הסמינר
        </Link>
      </div>
    </div>
  );
}

function ChoiceButton({
  selected,
  onClick,
  title,
  detail,
}: {
  selected: boolean;
  onClick: () => void;
  title: string;
  detail: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3.5 text-start transition-colors ${
        selected ? "border-fg bg-white ring-1 ring-fg" : "border-line bg-white hover:border-fg/30"
      }`}
    >
      <span>
        <span className="block font-semibold">{title}</span>
        <span className="mt-0.5 block text-sm tabular-nums opacity-70">{detail}</span>
      </span>
      <span aria-hidden className="text-lg">{selected ? "●" : "○"}</span>
    </button>
  );
}

// Keyed by sectionIndex in the parent, so every section mounts fresh — that's
// what resets the countdown, instead of an effect fighting the timer.
function SectionRunner({
  questions,
  minutes,
  sectionIndex,
  totalSections,
  answers,
  onAnswer,
  onSectionDone,
}: {
  questions: ExamQuestion[];
  minutes: number;
  sectionIndex: number;
  totalSections: number;
  answers: Answers;
  onAnswer: (id: string, value: number | string) => void;
  onSectionDone: (latestAnswers: Answers) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(minutes * 60);
  const answersRef = useRef(answers);
  const doneRef = useRef(false);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(interval);
          if (!doneRef.current) {
            doneRef.current = true;
            onSectionDone(answersRef.current);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onSectionDone is stable enough per section mount
  }, []);

  const q = questions[qIndex];
  const saved = answers[q.id] ?? null;
  const selected = typeof saved === "number" ? saved : null;
  const typed = typeof saved === "string" ? saved : "";

  function isAnswered(question: ExamQuestion) {
    const a = answers[question.id];
    return typeof a === "number" || (typeof a === "string" && a.trim().length > 0);
  }

  // The last question may skip ahead to a section finish, but only once every
  // question in the section has an answer — skipped ones send the student back.
  const firstUnanswered = questions.findIndex((qq) => !isAnswered(qq));
  const onLastQuestion = qIndex === questions.length - 1;
  const returnTo = onLastQuestion && firstUnanswered !== -1 ? firstUnanswered : null;

  function nextQuestion() {
    if (qIndex + 1 < questions.length) {
      setQIndex((i) => i + 1);
      return;
    }
    if (returnTo !== null) {
      setQIndex(returnTo);
      return;
    }
    if (!doneRef.current) {
      doneRef.current = true;
      onSectionDone(answersRef.current);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pb-32 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="opacity-70">
          פרק {sectionIndex + 1} מתוך {totalSections} · שאלה {qIndex + 1} מתוך {questions.length}
        </span>
        <span className="rounded-full bg-white px-3 py-1 font-semibold tabular-nums">
          {formatTime(secondsLeft)}
        </span>
      </div>

      <div className="mt-6 flex-1">
        <TypeLabel q={q} />
        <div className="mt-4">
          {q.type === "wordformation" ? (
            <WordFormationView q={q} value={typed} onChange={(v) => onAnswer(q.id, v)} />
          ) : (
            <QuestionView q={q} selected={selected} revealed={false} onSelect={(i) => onAnswer(q.id, i)} />
          )}
        </div>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-20 border-t border-line bg-bg/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          <TactileButton onClick={nextQuestion} fullWidth>
            {qIndex + 1 < questions.length
              ? "השאלה הבאה"
              : returnTo !== null
                ? `חזרה לשאלה ${returnTo + 1}`
                : "הפרק הבא"}
          </TactileButton>
        </div>
      </div>
    </div>
  );
}
