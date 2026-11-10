"use client";

import Link from "next/link";
import { useState } from "react";
import { blackoutCopy as t, SCENARIOS } from "@/content/blackout";
import { calmCopy } from "@/content/calm";

export function BlackoutGame() {
  const [started, setStarted] = useState(false);
  const [si, setSi] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [done, setDone] = useState(false);

  function restart() {
    setSi(0);
    setPicked(null);
    setDone(false);
    setStarted(true);
  }

  if (!started || done) {
    return (
      <Shell>
        <h1 className="font-display text-4xl font-bold">{done ? t.doneTitle : calmCopy.blackoutTitle}</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-80">{done ? t.doneText : t.intro}</p>
        <button onClick={restart} className="mt-10 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
          {done ? t.again : t.start}
        </button>
        <Link href="/calm" className="mt-6 inline-flex min-h-11 items-center text-sm underline opacity-70">
          {t.back}
        </Link>
      </Shell>
    );
  }

  const s = SCENARIOS[si];
  const chosen = picked === null ? null : s.options[picked];
  const last = si + 1 >= SCENARIOS.length;

  return (
    <Shell>
      <p className="text-sm font-semibold tabular-nums opacity-60">
        <bdi dir="ltr">{si + 1} / {SCENARIOS.length}</bdi>
      </p>
      <p className="mt-4 text-xl font-medium leading-relaxed">{s.setup}</p>

      <ul className="mt-8 flex flex-col gap-3">
        {s.options.map((o, i) => (
          <li key={o.text}>
            <button
              onClick={() => setPicked(i)}
              disabled={chosen?.good}
              className={`min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-start text-base font-semibold leading-snug ${
                picked === i ? (o.good ? "border-mint bg-white" : "border-warn bg-white") : "border-line bg-white"
              }`}
            >
              {o.text}
            </button>
          </li>
        ))}
      </ul>

      {chosen && (
        <div className="mt-6">
          <p className="leading-relaxed">{chosen.reply}</p>
          {chosen.good ? (
            <button
              onClick={() => (last ? setDone(true) : (setSi(si + 1), setPicked(null)))}
              className="mt-6 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg"
            >
              {last ? t.finish : t.next}
            </button>
          ) : (
            <button onClick={() => setPicked(null)} className="mt-6 min-h-12 text-sm font-semibold underline">
              {t.retry}
            </button>
          )}
        </div>
      )}
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 pb-20 pt-24">{children}</div>;
}
