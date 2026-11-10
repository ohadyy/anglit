"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ExtraTimePicker, useExtraTime, withExtraTime } from "@/components/ExtraTimePicker";
import { countWords, WRITING_MIN_WORDS, WRITING_MINUTES } from "@/content/practiceFacts";
import { writingChecklist, writingTasks, writingTips } from "@/content/writingTasks";
import { formatClock } from "@/lib/formatClock";

type Phase = "intro" | "writing" | "done";

export function WritingPractice() {
  const [extraPct, setExtraPct] = useExtraTime();
  const [phase, setPhase] = useState<Phase>("intro");
  const [taskIndex, setTaskIndex] = useState(0);
  const [text, setText] = useState("");
  const [left, setLeft] = useState(0);
  const [ticked, setTicked] = useState<number[]>([]);

  const task = writingTasks[taskIndex];
  const total = withExtraTime(WRITING_MINUTES * 60, extraPct);
  const words = countWords(text);

  // Each screen starts at the top (the results page is long and the button sits at the bottom)
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [phase]);

  // Counts down once a second while writing; at zero the text is handed in as it is
  useEffect(() => {
    if (phase !== "writing") return;
    if (left <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the timer ran out
      setPhase("done");
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [phase, left]);

  function start() {
    setText("");
    setTicked([]);
    setLeft(total);
    setPhase("writing");
  }

  function another() {
    setTaskIndex((i) => (i + 1) % writingTasks.length);
    setPhase("intro");
  }

  if (phase === "intro") {
    return (
      <div className="mx-auto flex flex-1 max-w-md flex-col px-4 py-12">
        <h1 className="font-display text-3xl font-bold">מטלת כתיבה</h1>
        <p className="mt-3 leading-relaxed opacity-80">
          במבחן האמיתי חלק מהנבחנים מקבלים מטלת כתיבה אחת, בת {WRITING_MINUTES} דקות, במקום שני פרקי הניסיון. מקלידים טקסט באנגלית על נושא נתון,
          והבדיקה אוטומטית. המשקל שלה בציון קטן מאוד, אבל כדאי להכיר את הפורמט כדי שלא תיבהלו.
        </p>
        <p className="mt-3 leading-relaxed">
          <strong>מינימום <bdi dir="ltr">{WRITING_MIN_WORDS}</bdi> מילים.</strong>
        </p>
        <p className="mt-3 text-sm leading-relaxed opacity-70">
          כאן אין ציון: אחרי שמסיימים רואים רשימת בדיקה ואת הטקסט לדוגמה, כדי להשוות לכתיבה שלכם.
        </p>

        <ul className="mt-6 list-disc space-y-1.5 ps-5 text-sm leading-relaxed opacity-80">
          {writingTips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className="mt-8 rounded-3xl border border-line bg-white p-5">
          <p className="text-sm opacity-70">הנושא הבא</p>
          <p dir="ltr" className="mt-2 text-left text-lg font-medium leading-snug">{task.prompt}</p>
        </div>

        <ExtraTimePicker value={extraPct} onChange={setExtraPct} className="mt-6" />
        <button
          type="button"
          onClick={start}
          className="mt-6 flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
        >
          מתחילים: {formatClock(total)} דקות
        </button>
        <Link href="/practice" className="mt-4 text-center text-sm opacity-70 underline">
          חזרה לתרגול
        </Link>
      </div>
    );
  }

  if (phase === "writing") {
    return (
      <div className="mx-auto flex flex-1 max-w-md flex-col px-4 py-6">
        <div className="flex items-center justify-between">
          <span className={`rounded-full px-3 py-1 text-sm font-bold tabular-nums ${left <= 60 ? "bg-coral text-ink-deep" : "bg-ink text-mist"}`}>
            {formatClock(left)}
          </span>
          <span className={`text-sm tabular-nums ${words >= WRITING_MIN_WORDS ? "font-semibold text-ok" : "opacity-70"}`}>
            <bdi dir="ltr">{words} / {WRITING_MIN_WORDS}</bdi> מילים
          </span>
        </div>
        <p dir="ltr" className="mt-4 text-left text-lg font-medium leading-snug">{task.prompt}</p>
        <textarea
          dir="ltr"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          aria-label="הטקסט שלכם"
          className="mt-4 min-h-64 w-full flex-1 resize-none rounded-2xl border border-line bg-white p-4 text-left text-lg leading-relaxed text-ink outline-none focus:border-fg focus:ring-2 focus:ring-fg/15"
        />
        <button
          type="button"
          onClick={() => setPhase("done")}
          className="mt-4 flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
        >
          סיימתי
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-1 max-w-md flex-col px-4 py-10">
      <h1 className="font-display text-2xl font-bold">סיימתם. עכשיו משווים.</h1>
      <p className="mt-2 text-sm opacity-70">
        כתבתם <bdi dir="ltr" className="tabular-nums">{words}</bdi> מילים.{" "}
        {words < WRITING_MIN_WORDS
          ? `זה קצר מדי: המינימום הוא ${WRITING_MIN_WORDS} מילים.`
          : "עברתם את המינימום."}{" "}
        המערכת לא נותנת ציון, אז עוברים ביחד על הרשימה:
      </p>

      <ul className="mt-5 space-y-2">
        {writingChecklist.map((item, i) => (
          <li key={item}>
            <label className="flex min-h-11 cursor-pointer items-start gap-3 rounded-2xl border border-line bg-white p-3 text-sm leading-relaxed">
              <input
                type="checkbox"
                checked={ticked.includes(i)}
                onChange={(e) => setTicked((t) => (e.target.checked ? [...t, i] : t.filter((x) => x !== i)))}
                className="mt-0.5 size-5 shrink-0"
              />
              {item}
            </label>
          </li>
        ))}
      </ul>

      <h2 className="mt-8 text-lg font-bold">הטקסט שלכם</h2>
      <p dir="ltr" className="mt-2 whitespace-pre-wrap rounded-2xl bg-sunk p-4 text-left leading-relaxed">{text.trim() || "—"}</p>

      <h2 className="mt-6 text-lg font-bold">טקסט לדוגמה</h2>
      <p dir="ltr" className="mt-2 whitespace-pre-wrap rounded-2xl bg-sunk p-4 text-left leading-relaxed">{task.model}</p>

      <button
        type="button"
        onClick={another}
        className="mt-8 flex min-h-12 w-full touch-manipulation items-center justify-center rounded-full bg-fg px-6 py-4 font-semibold text-bg"
      >
        נושא נוסף
      </button>
      <Link href="/practice" className="mt-4 text-center text-sm opacity-70 underline">
        חזרה לתרגול
      </Link>
    </div>
  );
}
