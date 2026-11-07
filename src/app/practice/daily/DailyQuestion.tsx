"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Question } from "@/content/questions";
import { QuestionView } from "@/components/QuestionView";
import { ExamCountdown } from "@/components/ExamCountdown";
import { useStored } from "@/lib/useStored";

// Local calendar date as YYYY-MM-DD, offset by whole days
function localDay(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}

// Same question for everyone on the same date; cycles through the pool
function dayIndex(day: string, size: number) {
  return Math.floor(Date.parse(`${day}T00:00:00Z`) / 86_400_000) % size;
}

/** `embedded` drops the page chrome (title block, countdown, links) so it can sit inside /practice */
export function DailyQuestion({ pool, embedded = false }: { pool: Question[]; embedded?: boolean }) {
  const [state, setState] = useStored("anglit-daily", { day: "", picked: -1, streak: 0, best: 0 });
  // The date is only known in the browser, so nothing renders until after mount
  const [today, setToday] = useState("");
  // eslint-disable-next-line react-hooks/set-state-in-effect -- read the device date once
  useEffect(() => setToday(localDay()), []);

  const header = (
    <>
      <p className="font-hand text-2xl opacity-70">שאלה אחת ביום</p>
      <h1 className="font-display mt-1 text-3xl font-bold">
        <mark className="pink">שאלת היום</mark>
      </h1>
    </>
  );
  const shell = "mx-auto flex w-full max-w-xl flex-1 flex-col px-4 py-8 sm:px-6";

  // The title still renders on the server, so the page is not empty for search engines
  if (!today) return embedded ? null : <div className={shell}>{header}</div>;

  const q = pool[dayIndex(today, pool.length)];
  const answeredToday = state.day === today;
  // A streak that skipped a day shows as broken until the next answer restarts it
  const streak = answeredToday || state.day === localDay(-1) ? state.streak : 0;

  function pick(i: number) {
    if (answeredToday) return;
    const next = state.day === localDay(-1) ? state.streak + 1 : 1;
    setState({ day: today, picked: i, streak: next, best: Math.max(state.best, next) });
  }

  const streakText = (
    <>
      {streak > 0 ? streak === 1 ? "יום אחד ברצף" : `${streak} ימים ברצף` : "עונים היום ומתחילים רצף"}
      {state.best > 1 && ` · השיא: ${state.best}`}
    </>
  );
  const card = (
    <div className="rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6">
      <QuestionView q={q} selected={answeredToday ? state.picked : null} revealed={answeredToday} onSelect={pick} />
    </div>
  );
  const done = answeredToday && <p className="mt-4 text-center text-sm opacity-70">מחר מחכה שאלה חדשה. שווה לחזור כדי לא לשבור את הרצף.</p>;

  if (embedded) {
    return (
      <section>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-xl font-bold">שאלת היום</h2>
          <p className="text-sm font-semibold tabular-nums opacity-70">{streakText}</p>
        </div>
        <div className="mt-3">{card}</div>
        {done}
      </section>
    );
  }

  return (
    <div className={shell}>
      {header}
      <p className="mt-3 text-sm font-semibold tabular-nums opacity-70">{streakText}</p>

      <div className="mt-6">{card}</div>
      {done}

      <ExamCountdown className="mt-10" />

      <Link href="/start" className="mt-8 inline-flex min-h-11 items-center justify-center text-sm underline opacity-70">
        עוד תרגולים חינם
      </Link>
    </div>
  );
}
