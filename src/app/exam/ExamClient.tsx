"use client";

import Link from "next/link";
import { FreeNextCard } from "@/components/FreeNextCard";
import { useEffect, useRef, useState } from "react";
import { QuestionView, TypeLabel, WordFormationView } from "@/components/QuestionView";
import { isCorrectAnswer, type ExamQuestion, type QuestionType } from "@/content/questions";
import { isQuestionType, TYPE_LABELS } from "@/content/questionLabels";
import { recordAnswers } from "@/lib/mistakes";
import { isPoolId } from "@/content/examPool";
import { findExamTest } from "@/content/examTests";
import { buildExam, planFor, planTotals, type ExamPlanItem } from "@/lib/examStructure";
import { PILOT_MAX_BONUS, scoreExam, scoreMessage, type ExamScore } from "@/lib/examScore";
import { scoreLevel } from "@/lib/scoreLevels";
import { formatClock } from "@/lib/formatClock";
import { AudioCheck } from "@/components/ReadAloud";
import { TactileButton } from "@/components/TactileButton";
import { HoldButton } from "@/components/HoldButton";
import { LiquidGauge } from "@/components/LiquidGauge";
import { ExtraTimePicker, useExtraTime, withExtraTime } from "@/components/ExtraTimePicker";
import { countWords, WRITING_MINUTES, WRITING_MIN_WORDS } from "@/content/practiceFacts";
import { EXAM_FORMAT, SCORE_MAX, SCORE_RANGE_TEXT } from "@/content/facts";
import { ExamReview, type ReviewItem } from "@/components/ExamReview";

type Phase = "intro" | "running" | "submitting" | "done";
// Multiple choice stores the option index, word formation stores the typed word
type Answers = Record<string, number | string | null>;
type Result = ExamScore & { id?: string };
type TypeTally = { type: QuestionType; correct: number; total: number }[];

export function ExamClient({
  plan,
  kind,
  testNumber,
  freeUpsell = false,
  inCourse = false,
  seen = [],
}: {
  plan: ExamPlanItem[];
  kind: "open" | "close";
  testNumber: string;
  /** The visitor has no paid access: show what to do next after the result */
  freeUpsell?: boolean;
  /** The student is enrolled in the seminar: the result never sells it to them */
  inCourse?: boolean;
  /** Pool items met in earlier tests; an adaptive test avoids them (sent back on submit) */
  seen?: string[];
}) {
  const [phase, setPhase] = useState<Phase>("intro");
  const [includePilot, setIncludePilot] = useState(true);
  const [activePlan, setActivePlan] = useState<ExamPlanItem[]>(plan);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Result | null>(null);
  const [tally, setTally] = useState<TypeTally>([]);
  const [review, setReview] = useState<ReviewItem[]>([]);
  const [extraPct, setExtraPct] = useExtraTime();
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
    // Core sections only: pilot items come from a separate bank that /practice can't replay.
    // Exam-pool items stay out too, so they are never met before a test.
    recordAnswers(
      Object.fromEntries(
        activePlan
          .filter((p) => !p.section.pilot)
          .flatMap((p) =>
            p.questions.filter((q) => !isPoolId(q.id)).map((q) => {
              const a = finalAnswers[q.id];
              return [q.id, { correct: correctness[q.id], chosen: typeof a === "number" ? a : null }];
            }),
          ),
      ),
    );
    setTally(tallyByType(activePlan, correctness));
    setReview(all.map((q) => ({ q, value: finalAnswers[q.id] ?? null })));

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
          seen,
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
      // An adaptive test picks its next chapter from the answers so far. Chapters already
      // taken come out the same, so only what lies ahead can change.
      setActivePlan(planFor(buildExam(testNumber, latestAnswers, seen), includePilot));
      setSectionIndex((i) => i + 1);
    } else {
      void finishExam(latestAnswers);
    }
  }

  function start() {
    startedAtRef.current = new Date().toISOString();
    setActivePlan(planFor(plan, includePilot));
    setSectionIndex(0);
    setPhase("running");
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto flex flex-1 max-w-sm flex-col justify-center px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-bold">מבחן תרגול</h1>
        <p className="mt-2 text-sm font-semibold tabular-nums opacity-70">מספר מבחן: {testNumber}</p>
        <p className="mt-3 leading-relaxed opacity-80">
          {totals.questions} שאלות ב-{totals.sections} פרקים מתוזמנים, {withExtraTime(totals.minutes, extraPct)} דקות בסך הכול. כל פרק עובר
          אוטומטית כשהזמן נגמר, גם אם לא סיימתם. בתוך כל פרק אפשר לחזור לשאלות קודמות, אבל לא לפרק שהסתיים.
        </p>
        {findExamTest(testNumber)?.adaptive && (
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            כמו במבחן האמיתי, הפרק הראשון בינוני, וכל פרק אחריו מותאם לרמה שלכם לפי התשובות עד אז. אם השאלות נעשות קשות,
            זה סימן שהלך לכם טוב.
          </p>
        )}

        {plan.some((p) => p.section.type === "writing") && (
          <p className="mt-3 text-sm leading-relaxed opacity-70">
            במבחן הזה, כמו בחלק מהמבחנים האמיתיים, יש מטלת כתיבה אחת של {WRITING_MINUTES} דקות במקום שני פרקי ניסיון. אין בה שאלות עם תשובה נכונה,
            ולכן היא לא נכנסת להערכת הציון. מינימום <bdi dir="ltr">{WRITING_MIN_WORDS}</bdi> מילים.
          </p>
        )}

        <fieldset className="mt-8 text-start">
          <legend className="text-sm font-semibold">לפני שמתחילים: לכלול פרקי ניסיון?</legend>
          <p className="mt-2 text-sm leading-relaxed opacity-70">
            במבחן האמיתי פרקי הניסיון תמיד מופיעים, ואי אפשר לבחור אותם. יש מבחנים עם שני פרקי ניסיון ({EXAM_FORMAT.practiceChapters}) ויש עם מטלת כתיבה אחת (7 פרקים), לא עם שניהם. משקלם בציון קטן מאוד: טעות לא פוגעת, ותשובה נכונה
            עשויה להעלות את הציון בעד {PILOT_MAX_BONUS} נקודות. באתר אפשר לתרגל גם רק את פרקי הליבה.
          </p>
          <div className="mt-4 grid gap-2">
            <ChoiceButton
              selected={includePilot}
              onClick={() => setIncludePilot(true)}
              title="כן, כולל פרקי ניסיון (כמו במבחן)"
              detail={`${planTotals(plan, true).questions} שאלות · ${withExtraTime(planTotals(plan, true).minutes, extraPct)} דקות`}
            />
            <ChoiceButton
              selected={!includePilot}
              onClick={() => setIncludePilot(false)}
              title="לא, רק פרקי הליבה"
              detail={`${planTotals(plan, false).questions} שאלות · ${withExtraTime(planTotals(plan, false).minutes, extraPct)} דקות`}
            />
          </div>
        </fieldset>

        <ExtraTimePicker value={extraPct} onChange={setExtraPct} className="mt-6" />

        <p className="mt-6 text-sm opacity-70">
          בסוף תקבלו הערכת ציון משוערת ({SCORE_RANGE_TEXT}). זו לא הציון הרשמי של מאל&quot;ו.
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
      <div className="mx-auto flex flex-1 max-w-sm flex-col items-center justify-center px-4 text-center opacity-70">
        שומר תוצאות...
      </div>
    );
  }

  if (phase === "done" && result) {
    const level = scoreLevel(result.estimatedScore);
    // The full review is for students with access; a free visitor gets the summary and the next step
    const showReview = !freeUpsell && review.length > 0;
    return (
      <>
      <div className="mx-auto flex flex-1 max-w-sm flex-col items-center justify-center px-4 py-16 text-center">
        <p className="text-sm font-semibold opacity-70">סיימתם!</p>
        <LiquidGauge score={result.estimatedScore} className="mt-4 w-56" />
        <p className="mt-2 text-sm font-semibold opacity-70">מתוך {SCORE_MAX}</p>
        <p className="mt-1 text-sm opacity-70">הערכה משוערת, לא הציון הרשמי</p>
        <p className="mt-6 max-w-sm leading-relaxed">{scoreMessage(result.estimatedScore)}</p>
        <div className="mt-6 rounded-3xl border border-line bg-white shadow-card p-5">
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
        <Diagnosis tally={tally} paid={!freeUpsell} inCourse={inCourse} />
        {showReview && (
          <a href="#review" className="mt-4 flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
            לסקירה מלאה של השאלות ↓
          </a>
        )}
        {freeUpsell ? (
          <FreeNextCard current="exam" />
        ) : (
          <Link href="/account" className="mt-4 rounded-full bg-fg px-6 py-3 font-semibold text-bg">
            לאזור האישי
          </Link>
        )}
      </div>
      {showReview && (
        <div className="mx-auto w-full max-w-md px-4 pb-24">
          <ExamReview items={review} />
        </div>
      )}
      </>
    );
  }

  const current = activePlan[sectionIndex];
  if (current.prompt) {
    return (
      <WritingRunner
        key={sectionIndex}
        prompt={current.prompt}
        seconds={withExtraTime(current.section.minutes * 60, extraPct)}
        sectionIndex={sectionIndex}
        totalSections={activePlan.length}
        onDone={() => handleSectionDone(answers)}
      />
    );
  }
  return (
    <SectionRunner
      key={sectionIndex}
      questions={current.questions}
      seconds={withExtraTime(current.section.minutes * 60, extraPct)}
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
    if (questions.length === 0) continue; // the writing task has no answer key
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
function Diagnosis({ tally, paid, inCourse }: { tally: TypeTally; paid: boolean; inCourse: boolean }) {
  const weakest = tally
    .filter((r) => r.correct < r.total)
    .sort((a, b) => a.correct / a.total - b.correct / b.total)[0];
  if (tally.length === 0) return null;
  return (
    <div className="mt-6 w-full rounded-3xl border border-line bg-white p-5 text-start shadow-card">
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
          הכי הרבה נקודות הלכו על <strong>{TYPE_LABELS[weakest.type].he}</strong>. משם כדאי להתחיל.
          {inCourse && " נעבור על זה יחד בשיעורים."}
        </p>
      ) : (
        <p className="mt-4 text-sm leading-relaxed opacity-80">בלי טעויות בכלל. נשאר לשמור על זה גם ביום המבחן.</p>
      )}
      {/* Only for students who have access: for everyone else these pages are locked, and the next step is shown below */}
      {paid && (
        <div className="mt-4 flex flex-wrap gap-x-5">
          <Link href="/practice?type=mistakes" className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
            להסבר על הטעויות
          </Link>
          {weakest && isQuestionType(weakest.type) && (
            <Link href={`/practice?type=${weakest.type}`} className="flex min-h-11 items-center text-sm underline underline-offset-4 opacity-70">
              לתרגל {TYPE_LABELS[weakest.type].he}
            </Link>
          )}
        </div>
      )}
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
  seconds,
  sectionIndex,
  totalSections,
  answers,
  onAnswer,
  onSectionDone,
}: {
  questions: ExamQuestion[];
  seconds: number;
  sectionIndex: number;
  totalSections: number;
  answers: Answers;
  onAnswer: (id: string, value: number | string) => void;
  onSectionDone: (latestAnswers: Answers) => void;
}) {
  const [qIndex, setQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(seconds);
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

  // The start button sits at the bottom of the intro page, so without this the first question
  // opens scrolled down to the footer. Runs on mount (new chapter) and on every question change.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [qIndex]);

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
  // The press that sends the whole exam in: hold-to-confirm so a stray tap can't end it
  const finalSubmit = onLastQuestion && returnTo === null && sectionIndex + 1 === totalSections;

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
          {formatClock(secondsLeft)}
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
        className="fixed inset-x-0 bottom-0 z-(--z-fab) border-t border-line bg-bg/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto flex max-w-2xl items-start gap-3 px-4 py-3 sm:px-6">
          {/* Back is allowed inside the chapter only: a finished chapter is locked, because the next one is picked from its answers */}
          {qIndex > 0 && (
            <button
              type="button"
              onClick={() => setQIndex((i) => i - 1)}
              className="h-12 shrink-0 rounded-full border border-line bg-white px-5 font-semibold text-ink"
            >
              → הקודמת
            </button>
          )}
          <div className="min-w-0 flex-1">
            {returnTo !== null && (
              <p role="status" className="mb-2 text-center text-sm font-semibold text-warn">
                {questions.filter((qq) => !isAnswered(qq)).length === 1
                  ? "נשארה שאלה אחת בלי תשובה"
                  : `נשארו ${questions.filter((qq) => !isAnswered(qq)).length} שאלות בלי תשובה`}
              </p>
            )}
            {finalSubmit ? (
              <HoldButton onComplete={nextQuestion} fullWidth>
                החזיקו להגשת המבחן
              </HoldButton>
            ) : (
              <TactileButton onClick={nextQuestion} fullWidth>
                {qIndex + 1 < questions.length
                  ? "השאלה הבאה"
                  : returnTo !== null
                    ? `חזרה לשאלה ${returnTo + 1}`
                    : "הפרק הבא"}
              </TactileButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// The writing task of the 7-chapter exam: typed essay, own timer, nothing scored.
// Keyed by sectionIndex in the parent, like SectionRunner, so the countdown starts fresh.
function WritingRunner({
  prompt,
  seconds,
  sectionIndex,
  totalSections,
  onDone,
}: {
  prompt: string;
  seconds: number;
  sectionIndex: number;
  totalSections: number;
  onDone: () => void;
}) {
  const [text, setText] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(seconds);
  const doneRef = useRef(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  const finish = () => {
    if (doneRef.current) return;
    doneRef.current = true;
    onDoneRef.current();
  };

  useEffect(() => {
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const id = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [secondsLeft]);

  const words = countWords(text);
  const lastSection = sectionIndex + 1 === totalSections;
  return (
    <div className="mx-auto flex min-h-dvh max-w-2xl flex-col px-4 pb-32 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3 text-sm">
        <span className="opacity-70">
          פרק {sectionIndex + 1} מתוך {totalSections} · {TYPE_LABELS.writing.he}
        </span>
        <span className="rounded-full bg-white px-3 py-1 font-semibold tabular-nums">{formatClock(secondsLeft)}</span>
      </div>
      <p dir="ltr" className="mt-6 text-left text-lg font-medium leading-snug">{prompt}</p>
      <p className={`mt-3 text-sm tabular-nums ${words >= WRITING_MIN_WORDS ? "font-semibold text-ok" : "opacity-70"}`}>
        <bdi dir="ltr">{words} / {WRITING_MIN_WORDS}</bdi> מילים
      </p>
      <textarea
        dir="ltr"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
        spellCheck={false}
        aria-label="הטקסט שלכם"
        className="mt-3 min-h-64 w-full flex-1 resize-none rounded-2xl border border-line bg-white p-4 text-left text-lg leading-relaxed text-ink outline-none focus:border-fg focus:ring-2 focus:ring-fg/15"
      />
      <div
        className="fixed inset-x-0 bottom-0 z-(--z-fab) border-t border-line bg-bg/95 backdrop-blur"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-2xl px-4 py-3 sm:px-6">
          {lastSection ? (
            <HoldButton onComplete={finish} fullWidth>
              החזיקו להגשת המבחן
            </HoldButton>
          ) : (
            <TactileButton onClick={finish} fullWidth>
              הפרק הבא
            </TactileButton>
          )}
        </div>
      </div>
    </div>
  );
}
