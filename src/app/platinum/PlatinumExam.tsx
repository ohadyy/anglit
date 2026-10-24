"use client";

import Link from "next/link";
import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import type { Passage, Question } from "@/content/questions";
import type { PlatinumTestDef } from "@/content/examTests";
import type { ExamPlanItem } from "@/lib/examStructure";
import { TYPE_LABELS } from "@/content/questionLabels";
import { scoreExam, scoreMessage, type ExamScore } from "@/lib/examScore";
import { Ore } from "./Ore";
import { TactileButton } from "@/components/TactileButton";
import { HoldButton } from "@/components/HoldButton";

// The Platinum exam: same chapters and clock as the regular practice tests, in a black-and-gold
// shell. Answers are never revealed while a chapter runs. When a chapter ends it is "sealed":
// a card shows how it went, in cold one-word verdicts instead of cheering.

type Phase = "intro" | "running" | "seal" | "submitting" | "done";
type Answers = Record<string, number>;
type Result = ExamScore & { id?: string };
type Chapter = { section: ExamPlanItem["section"]; questions: Question[] };

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;
const PASS_SCORE = 134;

function formatTime(sec: number) {
  return `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, "0")}`;
}

/** One-word verdict for a chapter */
function chapterVerdict(correct: number, total: number) {
  if (correct === total) return "Flawless";
  if (correct / total >= 0.75) return "Exceptional";
  if (correct / total >= 0.5) return "Distinguished";
  return "Noted";
}

/** Verdict for the whole test, by accuracy. Nothing under 70% gets an honor. */
function honors(correct: number, total: number) {
  const r = correct / total;
  if (r === 1) return "Flawless";
  if (r >= 0.85) return "Exceptional";
  if (r >= 0.7) return "Distinguished";
  return null;
}

export function PlatinumExam({
  plan,
  passage,
  test,
  userName,
  upsell,
}: {
  plan: ExamPlanItem[];
  passage: Passage;
  test: PlatinumTestDef;
  userName: string;
  /** No paid access: point to the other Platinum tests after the result */
  upsell: boolean;
}) {
  // Platinum tests are all multiple choice
  const chapters = plan as Chapter[];
  const [phase, setPhase] = useState<Phase>("intro");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [result, setResult] = useState<Result | null>(null);
  const startedAtRef = useRef("");

  const totalQuestions = chapters.reduce((n, c) => n + c.questions.length, 0);
  const totalMinutes = chapters.reduce((n, c) => n + c.section.minutes, 0);

  async function finish(finalAnswers: Answers) {
    setAnswers(finalAnswers);
    setPhase("submitting");
    const correctness: Record<string, boolean> = {};
    for (const c of chapters) for (const q of c.questions) correctness[q.id] = finalAnswers[q.id] === q.answer;
    const fallback = scoreExam(correctness);
    try {
      const res = await fetch("/api/exam/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "open",
          testNumber: test.number,
          includePilot: false,
          answers: finalAnswers,
          startedAt: startedAtRef.current,
        }),
      });
      setResult(res.ok ? await res.json() : fallback);
    } catch {
      setResult(fallback);
    }
    setPhase("done");
  }

  function onSectionDone(latest: Answers) {
    if (sectionIndex + 1 < chapters.length) {
      setAnswers(latest);
      setPhase("seal");
    } else {
      void finish(latest);
    }
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <Ore tone={test.tone} className="plat-fade size-20" />
        <h1 className={`plat-tone-${test.tone} plat-rise plat-cinzel plat-tone-text mt-4 text-5xl font-bold leading-none`} style={delay(200)}>
          {test.name}
        </h1>
        <div className="plat-fade mt-8 h-px w-20 bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" style={delay(700)} />
        <p className="plat-fade mt-8 text-lg tabular-nums" style={delay(900)}>
          {totalQuestions} שאלות · {chapters.length} פרקים · {totalMinutes} דקות
        </p>
        <p className="plat-fade mt-4 leading-relaxed opacity-70" style={delay(1100)}>
          כל פרק מסתיים אוטומטית כשהזמן נגמר, ואי אפשר לחזור אליו. בסוף תקבלו הערכת ציון משוערת ותעודה.
        </p>
        <div className="plat-fade mt-10 w-full" style={delay(1400)}>
          <TactileButton
            size="lg"
            fullWidth
            onClick={() => {
              startedAtRef.current = new Date().toISOString();
              setPhase("running");
            }}
          >
            להתחיל
          </TactileButton>
        </div>
      </div>
    );
  }

  if (phase === "submitting") {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="plat-serif plat-fade text-lg italic tracking-[0.3em] text-[var(--gold)]">Sealing results</p>
      </div>
    );
  }

  if (phase === "done" && result) {
    return <Certificate result={result} chapters={chapters} answers={answers} test={test} userName={userName} upsell={upsell} />;
  }

  if (phase === "seal") {
    const chapter = chapters[sectionIndex];
    const correct = chapter.questions.filter((q) => answers[q.id] === q.answer).length;
    return (
      <div className="mx-auto flex w-full max-w-sm flex-1 flex-col items-center justify-center px-6 py-16 text-center">
        <p className="plat-fade plat-serif text-xs font-medium uppercase tracking-[0.5em] text-[var(--gold)]">
          Chapter {sectionIndex + 1} sealed
        </p>
        <h2 className="plat-rise plat-serif plat-gold-text mt-5 text-6xl font-medium italic leading-tight" style={delay(300)}>
          {chapterVerdict(correct, chapter.questions.length)}
        </h2>
        <p className="plat-fade mt-3 tabular-nums opacity-65" style={delay(700)}>
          {correct} מתוך {chapter.questions.length}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {chapter.questions.map((q, i) => (
            <Medallion
              key={q.id}
              n={i + 1}
              state={answers[q.id] === undefined ? "skipped" : answers[q.id] === q.answer ? "correct" : "wrong"}
              at={900 + i * 260}
            />
          ))}
        </div>
        <div className="plat-fade mt-12 w-full" style={delay(1500)}>
          <TactileButton
            size="lg"
            fullWidth
            onClick={() => {
              setSectionIndex((i) => i + 1);
              setPhase("running");
            }}
          >
            לפרק הבא
          </TactileButton>
        </div>
      </div>
    );
  }

  const chapter = chapters[sectionIndex];
  return (
    <SectionRunner
      key={sectionIndex}
      chapter={chapter}
      passage={passage}
      test={test}
      sectionIndex={sectionIndex}
      totalSections={chapters.length}
      answers={answers}
      onAnswer={(id, value) => setAnswers((a) => ({ ...a, [id]: value }))}
      onSectionDone={onSectionDone}
    />
  );

}

function Medallion({ n, state, at }: { n: number; state: "correct" | "wrong" | "skipped"; at: number }) {
  const look =
    state === "correct"
      ? "plat-shimmer bg-gradient-to-br from-[var(--gold-hi)] via-[var(--gold)] to-[var(--gold-lo)] text-[#1a1305] font-semibold"
      : state === "wrong"
        ? "border border-[var(--copper)] text-[var(--copper)]"
        : "border border-dashed border-[var(--fg)]/30 text-[var(--fg)]/40";
  return (
    <span
      className={`plat-rise grid size-14 place-items-center rounded-full text-lg tabular-nums ${look}`}
      style={delay(at)}
      role="img"
      aria-label={`שאלה ${n}: ${state === "correct" ? "נכונה" : state === "wrong" ? "שגויה" : "לא נענתה"}`}
    >
      {n}
    </span>
  );
}

function Blank({ text }: { text: string }) {
  const parts = text.split(/_{4,}/);
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <span className="plat-blank" role="img" aria-label="blank" />}
        </Fragment>
      ))}
    </>
  );
}

// Keyed by sectionIndex in the parent, so every chapter mounts fresh and its clock restarts
function SectionRunner({
  chapter,
  passage,
  test,
  sectionIndex,
  totalSections,
  answers,
  onAnswer,
  onSectionDone,
}: {
  chapter: Chapter;
  passage: Passage;
  test: PlatinumTestDef;
  sectionIndex: number;
  totalSections: number;
  answers: Answers;
  onAnswer: (id: string, value: number) => void;
  onSectionDone: (latest: Answers) => void;
}) {
  const { questions, section } = chapter;
  const [qIndex, setQIndex] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(section.minutes * 60);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onSectionDone is stable enough per chapter mount
  }, []);

  const q = questions[qIndex];
  const selected = answers[q.id] ?? null;
  const label = TYPE_LABELS[q.type];

  // The last question only finishes the chapter once every question has an answer;
  // otherwise it sends the student back to the first unanswered one.
  const firstUnanswered = questions.findIndex((qq) => answers[qq.id] === undefined);
  const onLast = qIndex === questions.length - 1;
  const returnTo = onLast && firstUnanswered !== -1 ? firstUnanswered : null;
  // The press that ends the whole exam is a hold, so a stray tap can't do it
  const finalSubmit = onLast && returnTo === null && sectionIndex + 1 === totalSections;

  function next() {
    if (!onLast) return setQIndex((i) => i + 1);
    if (returnTo !== null) return setQIndex(returnTo);
    if (!doneRef.current) {
      doneRef.current = true;
      onSectionDone(answersRef.current);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-5 pb-32 pt-6 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <span className="plat-serif text-xs font-medium uppercase tracking-[0.35em] text-[var(--gold)]">
          {test.name}
        </span>
        <span
          className={`plat-serif text-2xl font-medium tabular-nums transition-colors duration-1000 ${secondsLeft <= 60 ? "text-[var(--copper)]" : ""}`}
          aria-label={`נשארו ${formatTime(secondsLeft)}`}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
      <div className="mt-4 flex gap-1.5" aria-hidden>
        {Array.from({ length: totalSections }, (_, i) => (
          <span
            key={i}
            className={`h-[3px] flex-1 transition-colors duration-1000 ${i < sectionIndex ? "bg-[var(--gold)]" : i === sectionIndex ? "bg-[var(--fg)]" : "bg-[var(--fg)] opacity-15"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-xs opacity-60">
        פרק {sectionIndex + 1} מתוך {totalSections} · שאלה {qIndex + 1} מתוך {questions.length}
      </p>

      <div key={q.id} className="plat-rise mt-8 flex-1">
        <p className="flex items-baseline gap-3">
          <span dir="ltr" className="plat-serif text-xs font-semibold uppercase tracking-[0.3em] text-[var(--gold)]">
            {label.en}
          </span>
          <span className="text-xs opacity-55">{label.he}</span>
        </p>

        {q.type === "reading" && <PassagePanel passage={passage} paragraph={q.paragraph} />}

        <p dir="ltr" className="plat-serif mt-5 text-left text-[1.7rem] font-medium leading-snug text-balance sm:text-3xl">
          <Blank text={q.stem} />
        </p>

        <ol dir="ltr" className="mt-7 flex flex-col gap-3">
          {q.options.map((opt, i) => (
            <li key={i} className="plat-fade" style={delay(250 + i * 140)}>
              <button
                type="button"
                aria-pressed={selected === i}
                onClick={() => onAnswer(q.id, i)}
                className="plat-opt flex min-h-14 w-full touch-manipulation items-center gap-4 rounded-sm px-4 py-3.5 text-left text-base sm:text-lg"
              >
                <span
                  className={`grid size-7 shrink-0 place-items-center rounded-full border text-sm tabular-nums transition-colors duration-700 ${
                    selected === i
                      ? "border-[var(--gold)] bg-[var(--gold)] font-semibold text-[#1a1305]"
                      : "border-[var(--fg)]/25 text-[var(--fg)]/60"
                  }`}
                >
                  {i + 1}
                </span>
                <span className="flex-1">{opt}</span>
              </button>
            </li>
          ))}
        </ol>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-20 bg-gradient-to-t from-[var(--bg)] from-70% to-transparent pt-8"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="mx-auto max-w-2xl px-5 py-4 sm:px-6">
          {finalSubmit ? (
            <HoldButton onComplete={next} fullWidth>
              החזיקו להגשת המבחן
            </HoldButton>
          ) : (
            <TactileButton onClick={next} fullWidth>
              {!onLast ? "השאלה הבאה" : returnTo !== null ? `חזרה לשאלה ${returnTo + 1}` : "לסיום הפרק"}
            </TactileButton>
          )}
        </div>
      </div>
    </div>
  );
}

function PassagePanel({ passage, paragraph }: { passage: Passage; paragraph?: number }) {
  return (
    <div dir="ltr" className="plat-card mt-5 max-h-[38vh] overflow-y-auto rounded-sm p-5 text-left">
      <p className="plat-serif mb-3 text-lg font-semibold italic text-[var(--gold)]">{passage.title}</p>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed">
        {passage.paragraphs.map((text, i) => (
          <p key={i} className={`flex gap-3 transition-opacity duration-700 ${paragraph && paragraph !== i + 1 ? "opacity-50" : ""}`}>
            <span className="shrink-0 font-semibold tabular-nums text-[var(--gold)]">{i + 1}</span>
            <span>{text}</span>
          </p>
        ))}
      </div>
    </div>
  );
}

/** Counts from 50 up to the score, easing out. Under reduced motion it lands at once. */
function useCountUp(target: number, ms = 2600) {
  const [value, setValue] = useState(50);
  useEffect(() => {
    const total = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 1 : ms;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / total);
      setValue(Math.round(50 + (target - 50) * (1 - Math.pow(1 - t, 4))));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, ms]);
  return value;
}

function Certificate({
  result,
  chapters,
  answers,
  test,
  userName,
  upsell,
}: {
  result: Result;
  chapters: Chapter[];
  answers: Answers;
  test: PlatinumTestDef;
  userName: string;
  upsell: boolean;
}) {
  const [name, setName] = useState(userName);
  const shown = useCountUp(result.estimatedScore);
  const total = result.coreTotal;
  const verdict = honors(result.coreCorrect, total);
  const distinguished = result.estimatedScore >= PASS_SCORE;
  const perChapter = chapters.map((c) => ({
    correct: c.questions.filter((q) => answers[q.id] === q.answer).length,
    total: c.questions.length,
    type: c.section.type,
  }));
  const flawless = perChapter.filter((c) => c.correct === c.total).length;
  const date = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center px-5 pb-16 pt-6">
      <label className="plat-fade flex w-full max-w-sm items-center gap-3 text-sm" style={delay(1500)}>
        <span className="shrink-0 opacity-60">השם על התעודה</span>
        <input
          type="text"
          value={name}
          maxLength={28}
          onChange={(e) => setName(e.target.value)}
          placeholder="השם שלכם"
          autoComplete="off"
          className="min-w-0 flex-1 border-b border-[var(--line)] bg-transparent py-1.5 text-[var(--fg)] outline-none transition-colors focus:border-[var(--gold)]"
        />
      </label>

      {/* The certificate is a 9:16 frame so a screenshot drops straight into a story. Sizes are
          in container-width units (cqw), the same way /studio does it. */}
      <div
        className="plat-rise relative mt-5 aspect-[9/16] w-[min(100%,24rem,calc((100dvh-9rem)*9/16))] bg-[#050505]"
        style={{ containerType: "inline-size", ...delay(200) }}
      >
        <div className="absolute inset-0 border border-[var(--gold)]/60" />
        <div className="absolute inset-[2.4cqw] border border-[var(--gold)]/25" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_45%_at_50%_0%,rgb(201_162_75/0.16),transparent_70%)]" />

        <div className="relative flex h-full flex-col items-center px-[9cqw] py-[9cqw] text-center">
          <p dir="ltr" className="plat-serif text-[3.2cqw] font-medium uppercase tracking-[1.6cqw] text-[var(--gold)]">Anglit</p>
          <p dir="ltr" className="plat-serif plat-gold-text -mt-[0.5cqw] text-[12.5cqw] font-semibold leading-[1.1]">Platinum</p>
          <div className="mt-[3cqw] h-px w-[22cqw] bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent" />

          <p dir="ltr" className="plat-serif mt-[6cqw] text-[6.2cqw] font-medium italic leading-tight">
            {distinguished ? "Certificate of Distinction" : "Statement of Result"}
          </p>
          <p dir="ltr" className="plat-serif mt-[2.2cqw] text-[3.1cqw] uppercase tracking-[0.9cqw] opacity-55">
            {distinguished ? "awarded to" : "prepared for"}
          </p>
          <p dir="auto" className="plat-serif mt-[2cqw] max-w-full break-words text-[8cqw] font-medium leading-tight">
            {name.trim() || "Anglit Candidate"}
          </p>

          <div className="plat-shimmer mt-auto pb-[2.5cqw]">
            <p dir="ltr" className="plat-serif plat-gold-text px-[2cqw] text-[36cqw] font-semibold leading-[1] tabular-nums">
              {shown}
            </p>
          </div>
          <p dir="ltr" className="plat-serif mt-[1.5cqw] text-[3.4cqw] uppercase tracking-[1cqw] opacity-60">
            / 150 · Estimated score
          </p>
          {verdict && (
            <p
              dir="ltr"
              className="plat-serif mb-[3cqw] mt-[4cqw] border border-[var(--gold)]/60 px-[5cqw] py-[1.6cqw] text-[3.6cqw] font-semibold uppercase tracking-[1.3cqw] text-[var(--gold)]"
            >
              {verdict}
            </p>
          )}

          <dl dir="ltr" className="plat-serif mt-auto grid w-full grid-cols-3 gap-[2cqw] border-t border-[var(--gold)]/25 pt-[5cqw]">
            <Stat label="Accuracy" value={`${Math.round((result.coreCorrect / total) * 100)}%`} />
            <Stat label="Flawless" value={`${flawless}/${chapters.length}`} />
            <Stat label="Level" value={test.name} small />
          </dl>

          <p dir="ltr" className="plat-script plat-gold-text mt-[5cqw] text-[13cqw] leading-none">Anglit Platinum</p>
          <p dir="ltr" className="plat-serif mt-[1.5cqw] text-[2.8cqw] uppercase tracking-[0.8cqw] opacity-55">{date}</p>
          <p dir="ltr" className="plat-serif mt-[3cqw] text-[2.6cqw] leading-snug opacity-40">
            Estimated score from an Anglit practice exam. Not an official result.
          </p>
        </div>
      </div>

      <p className="plat-fade mt-5 text-center text-sm opacity-60" style={delay(2600)}>
        צלמו מסך ושתפו בסטורי
      </p>

      <section className="plat-fade mt-10 w-full" style={delay(2800)}>
        <h2 className="plat-serif text-xl font-semibold italic text-[var(--gold)]">Chapter by chapter</h2>
        <ul className="mt-4 grid gap-3">
          {perChapter.map((c, i) => (
            <li key={i} className="flex items-baseline justify-between gap-3 border-b border-[var(--line)] pb-2 text-sm">
              <span>
                {i + 1}. {TYPE_LABELS[c.type].he}
              </span>
              <span className="flex items-baseline gap-3">
                <span className="plat-serif italic text-[var(--gold)]">{chapterVerdict(c.correct, c.total)}</span>
                <span className="tabular-nums opacity-60">
                  {c.correct}/{c.total}
                </span>
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6 leading-relaxed opacity-75">
          {distinguished ? scoreMessage(result.estimatedScore) : "הרף של Platinum הוא 134. עוד סבב תרגול על סוגי השאלות שטעיתם בהם, ומנסים שוב."}
        </p>
        <p className="mt-2 text-xs opacity-45">הציון הוא הערכה בלבד ואינו ציון רשמי של מאל&quot;ו.</p>

        {upsell && (
          <div className="plat-card mt-8 rounded-sm p-6 text-center">
            <p className="font-semibold">ארבעת מבחני Platinum הנוספים נפתחים עם הסמינר.</p>
            <Link href="/pricing" className="mt-4 inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--fg)] px-6 font-semibold text-[var(--bg)]">
              לפרטים על הסמינר
            </Link>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6">
          <Link href="/platinum" className="flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">
            למבחני Platinum
          </Link>
          <Link href="/account" className="flex min-h-11 items-center text-sm underline underline-offset-4 opacity-60">
            לאזור האישי
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <div className="min-w-0">
      <dt className="text-[2.3cqw] uppercase tracking-[0.5cqw] opacity-50">{label}</dt>
      <dd className={`mt-[1cqw] font-semibold ${small ? "text-[4.2cqw]" : "text-[5.6cqw]"}`}>{value}</dd>
    </div>
  );
}
