"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { THOUGHTS, THOUGHTS_ROUND_SECONDS as SECONDS, thoughtsCopy as t, type Thought } from "@/content/calm";
import { randomOrder } from "@/lib/random";
import { useCalmBest } from "../useCalmBest";

const SWIPE_PX = 80;

export function ThoughtsGame() {
  const [best, setBest] = useCalmBest();
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [deck, setDeck] = useState<Thought[]>([]);
  const [i, setI] = useState(0);
  const [left, setLeft] = useState(SECONDS);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(false);
  const [dx, setDx] = useState(0);
  const startX = useRef<number | null>(null);

  useEffect(() => {
    if (phase !== "play") return;
    const id = setInterval(() => setLeft((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [phase]);

  useEffect(() => {
    if (phase === "play" && left <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- the round ends when the clock runs out
      setPhase("done");
      setBest((b) => ({ ...b, thoughtsBest: Math.max(b.thoughtsBest, score) }));
    }
  }, [phase, left, score, setBest]);

  function start() {
    setDeck(randomOrder(THOUGHTS));
    setI(0);
    setScore(0);
    setLeft(SECONDS);
    setWrong(false);
    setPhase("play");
  }

  const card = deck[i % (deck.length || 1)];

  // toss = true for the bin, false for keep
  function answer(toss: boolean) {
    if (!card || phase !== "play") return;
    if (toss === card.heavy) {
      setScore((s) => s + 1);
      setWrong(false);
      setI((n) => n + 1);
    } else {
      setWrong(true);
    }
    setDx(0);
  }

  function onUp() {
    if (startX.current === null) return;
    if (Math.abs(dx) > SWIPE_PX) answer(dx < 0);
    startX.current = null;
    setDx(0);
  }

  if (phase === "intro") {
    return (
      <Shell>
        <h1 className="font-display text-4xl font-bold">לסנן את הרעש</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-80">{t.intro}</p>
        {best.thoughtsBest > 0 && <p className="mt-4 text-sm opacity-60">השיא שלך: {best.thoughtsBest}</p>}
        <button onClick={start} className="mt-10 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
          {t.start}
        </button>
        <Link href="/calm" className="mt-6 inline-flex min-h-11 items-center text-sm underline opacity-70">
          {t.back}
        </Link>
      </Shell>
    );
  }

  if (phase === "done") {
    return (
      <Shell>
        <p className="font-hand text-3xl opacity-70">סיבוב נגמר</p>
        <h1 className="font-display mt-2 text-4xl font-bold">סיננת {score} מחשבות</h1>
        <p className="mt-4 text-lg leading-relaxed opacity-80">
          ככל שחוזרים על זה, ההחלקה הופכת לרפלקס. כשתגיע מחשבה מעכבת במבחן, כבר יהיה לך מה לעשות איתה.
        </p>
        <button onClick={start} className="mt-10 min-h-12 rounded-full bg-fg px-10 font-semibold text-bg">
          {t.again}
        </button>
        <Link href="/calm" className="mt-6 inline-flex min-h-11 items-center text-sm underline opacity-70">
          {t.back}
        </Link>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="flex items-center justify-between text-sm font-semibold tabular-nums opacity-70">
        <span>{score} סוננו</span>
        <span>{left}</span>
      </div>

      <div className="relative mt-8 flex h-64 items-center justify-center select-none" style={{ touchAction: "pan-y" }}>
        <div
          key={`${card.id}-${wrong}`}
          onPointerDown={(e) => {
            startX.current = e.clientX;
            e.currentTarget.setPointerCapture(e.pointerId);
          }}
          onPointerMove={(e) => startX.current !== null && setDx(e.clientX - startX.current)}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          className={`font-display flex h-full w-full cursor-grab items-center justify-center rounded-3xl border-2 p-6 text-center text-2xl font-bold leading-snug ${
            wrong ? "calm-shake border-coral bg-coral/20" : "border-line bg-white"
          }`}
          style={{ transform: `translateX(${dx}px) rotate(${dx / 20}deg)` }}
        >
          {card.text}
        </div>
      </div>
      <p className="mt-3 h-5 text-center text-sm font-semibold text-warn">{wrong ? t.fix : ""}</p>

      {/* dir=ltr keeps the bin on the left and keep on the right, matching the swipe direction */}
      <div dir="ltr" className="mt-4 grid grid-cols-2 gap-3">
        <button onClick={() => answer(true)} className="min-h-14 rounded-full border-2 border-coral font-semibold">
          ← {t.trash}
        </button>
        <button onClick={() => answer(false)} className="min-h-14 rounded-full border-2 border-mint font-semibold">
          {t.keep} →
        </button>
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-6 pb-20 pt-24">{children}</div>;
}
