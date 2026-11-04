"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ELIMINATE, eliminateCopy as t, type EliminateQuestion } from "@/content/eliminate";
import { LtrWords } from "@/components/LtrWords";
import { useStored } from "@/lib/useStored";

const ROUNDS = 8;
const SECONDS = 25;

type Round = EliminateQuestion & { options: string[] };

function shuffle<T>(arr: T[]) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function EliminateGame() {
  const [best, setBest] = useStored("anglit-calm", { thoughtsBest: 0, eliminateBest: 0 });
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [rounds, setRounds] = useState<Round[]>([]);
  const [qi, setQi] = useState(0);
  const [struck, setStruck] = useState<string[]>([]);
  const [status, setStatus] = useState<"play" | "won" | "late">("play");
  const [left, setLeft] = useState(SECONDS);
  const [wrong, setWrong] = useState(0);
  const [miss, setMiss] = useState(0);
  const [wins, setWins] = useState(0);

  useEffect(() => {
    if (phase !== "play" || status !== "play") return;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase, status, qi]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the question ends when the clock runs out
    if (phase === "play" && status === "play" && left <= 0) setStatus("late");
  }, [phase, status, left]);

  function start() {
    setRounds(shuffle(ELIMINATE).slice(0, ROUNDS).map((q) => ({ ...q, options: shuffle([...q.keep, ...q.out]) })));
    setQi(0);
    setWins(0);
    setStruck([]);
    setStatus("play");
    setLeft(SECONDS);
    setWrong(0);
    setMiss(0);
    setPhase("play");
  }

  function next() {
    if (qi + 1 >= ROUNDS) {
      setPhase("done");
      setBest((b) => ({ ...b, eliminateBest: Math.max(b.eliminateBest, wins) }));
      return;
    }
    setQi(qi + 1);
    setStruck([]);
    setStatus("play");
    setLeft(SECONDS);
    setWrong(0);
    setMiss(0);
  }

  const q = rounds[qi];

  // Step 1: cross out the two impossible options. Step 2: pick the answer from the two left.
  function tap(opt: string) {
    if (status !== "play" || struck.includes(opt)) return;
    if (struck.length < 2) {
      if (q.keep.includes(opt)) setWrong((n) => n + 1);
      else setStruck([...struck, opt]);
      return;
    }
    if (opt === q.keep[0]) {
      setStatus("won");
      if (wrong === 0 && miss === 0) setWins((n) => n + 1);
    } else setMiss((n) => n + 1);
  }

  if (phase === "intro") {
    return (
      <Shell>
        <h1 className="font-display text-4xl font-bold">לפסול ולהמשיך</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-80">{t.intro}</p>
        {best.eliminateBest > 0 && <p className="mt-4 text-sm opacity-60">השיא שלך: {best.eliminateBest} מתוך {ROUNDS}</p>}
        <button onClick={start} className="mt-10 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
          {t.start}
        </button>
        <BackLink />
      </Shell>
    );
  }

  if (phase === "done") {
    return (
      <Shell>
        <p className="font-hand text-3xl opacity-70">סיבוב נגמר</p>
        <h1 className="font-display mt-2 text-4xl font-bold">פסלת בזמן {wins} מתוך {ROUNDS}</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-80">
          במבחן אמיתי, שתי תשובות שירדו מהשולחן משאירות הרבה פחות מקום לפאניקה.
        </p>
        <button onClick={start} className="mt-10 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
          {t.again}
        </button>
        <BackLink />
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between text-sm font-semibold tabular-nums opacity-70">
        <bdi dir="ltr">{qi + 1} / {ROUNDS}</bdi>
        <span>{status === "play" ? left : ""}</span>
      </div>
      <div className="mt-2 h-1 overflow-hidden rounded-full bg-line" aria-hidden>
        <div className="h-full bg-fg transition-[width] duration-1000 ease-linear" style={{ width: `${(left / SECONDS) * 100}%` }} />
      </div>

      <p dir="ltr" className="mt-8 text-left text-xl font-semibold leading-relaxed">{q.stem}</p>

      <ul dir="ltr" className="mt-6 flex flex-col gap-3">
        {q.options.map((opt) => {
          const gone = struck.includes(opt) || (status !== "play" && q.out.includes(opt));
          const right = status !== "play" && opt === q.keep[0];
          return (
            <li key={opt}>
              <button
                onClick={() => tap(opt)}
                disabled={status !== "play"}
                className={`min-h-14 w-full rounded-2xl border-2 px-4 py-3 text-left text-base font-semibold leading-snug ${
                  gone ? "border-line line-through opacity-40" : right ? "border-mint bg-white" : "border-line bg-white"
                }`}
              >
                {opt}
              </button>
            </li>
          );
        })}
      </ul>

      <p className="mt-4 min-h-10 text-center text-sm font-semibold">
        {status === "play" && struck.length < 2 && wrong > 0 && <span className="text-warn">{t.wrongTap}</span>}
        {status === "play" && struck.length === 2 && (miss > 0 ? <span className="text-warn">{t.closeMiss}</span> : t.step2)}
        {status === "won" && t.won}
        {status === "late" && t.late}
      </p>
      {status !== "play" && (
        <>
          <p className="text-center text-sm leading-relaxed opacity-70"><LtrWords text={q.why} /></p>
          <p className="mt-2 text-center text-sm leading-relaxed opacity-70"><LtrWords text={q.pick} /></p>
          <button onClick={next} className="mt-6 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
            {qi + 1 >= ROUNDS ? t.finish : t.next}
          </button>
        </>
      )}
    </Shell>
  );
}

function BackLink() {
  return (
    <Link href="/calm" className="mt-6 inline-flex min-h-11 items-center text-sm underline opacity-70">
      {t.back}
    </Link>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 pb-20 pt-24">{children}</div>;
}
