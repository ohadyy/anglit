"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Question } from "@/content/questions";
import { randomOrder } from "@/lib/shuffle";
import { useStored } from "@/lib/useStored";

const QUESTION_MS = 12000;
const TICK_MS = 100;
const CONFETTI_COLORS = ["var(--color-mint)", "var(--color-marker)", "var(--color-coral)", "var(--color-ink)"];

type ConfettiPiece = { id: string; color: string; tx: number; ty: number; rot: number; size: number; delay: number };

function makeBurst(streak: number): ConfettiPiece[] {
  const count = Math.min(10 + streak * 4, 48);
  return Array.from({ length: count }, (_, i) => {
    const angle = Math.random() * Math.PI * 2;
    const distance = 70 + Math.random() * 130 + streak * 4;
    return {
      id: `${Date.now()}-${i}`,
      color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance,
      rot: (Math.random() - 0.5) * 720,
      size: 6 + Math.random() * (8 + Math.min(streak, 10)),
      delay: Math.random() * 60,
    };
  });
}

export function ChallengeGame({ questions }: { questions: Question[] }) {
  const [phase, setPhase] = useState<"start" | "playing" | "gameover" | "victory">("start");
  const [order, setOrder] = useState<Question[]>(questions);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [streak, setStreak] = useState(0);
  const [best, setBest] = useStored("anglit-challenge-best", 0);
  const [timeLeft, setTimeLeft] = useState(QUESTION_MS);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const [shaking, setShaking] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [missed, setMissed] = useState<Question | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = order[index];

  function fail(q: Question, timedOut: boolean) {
    setMissed(q);
    setFlashing(true);
    setShaking(true);
    window.setTimeout(() => setFlashing(false), 550);
    window.setTimeout(() => setShaking(false), 450);
    advanceTimer.current = setTimeout(() => setPhase("gameover"), timedOut ? 650 : 900);
  }

  // The countdown. Stops the moment an answer is picked (correct or not).
  useEffect(() => {
    if (phase !== "playing" || picked !== null) return;
    const iv = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= TICK_MS) {
          clearInterval(iv);
          fail(current, true);
          return 0;
        }
        return t - TICK_MS;
      });
    }, TICK_MS);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fail/current captured fresh each question via index dep
  }, [phase, picked, index]);

  useEffect(() => {
    return () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    };
  }, []);

  function start() {
    setOrder(randomOrder(questions));
    setPhase("playing");
    setIndex(0);
    setStreak(0);
    setPicked(null);
    setRevealed(false);
    setTimeLeft(QUESTION_MS);
    setMissed(null);
  }

  function choose(i: number) {
    if (picked !== null || phase !== "playing") return;
    setPicked(i);
    setRevealed(true);
    if (i === current.answer) {
      const next = streak + 1;
      setStreak(next);
      if (next > best) setBest(next);
      setConfetti(makeBurst(next));
      window.setTimeout(() => setConfetti([]), 1000);
      advanceTimer.current = setTimeout(() => {
        if (index + 1 >= questions.length) {
          setPhase("victory");
        } else {
          setIndex((n) => n + 1);
          setPicked(null);
          setRevealed(false);
          setTimeLeft(QUESTION_MS);
        }
      }, 550);
    } else {
      fail(current, false);
    }
  }

  if (phase === "start") {
    return (
      <div className="mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <Image src="/track.svg" alt="" width={2825} height={1910} priority className="mb-6 h-auto w-72 sm:w-96" />
        <h1 className="font-display text-4xl font-bold leading-tight">אתגר נגד השעון</h1>
        <p className="mt-4 max-w-sm text-lg leading-relaxed opacity-80">
          שאלה אחת, 12 שניות, בלי טעויות. כל תשובה נכונה מאריכה את הרצף שלכם — טעות אחת, או שהזמן נגמר, ומסיימים.
        </p>
        {best > 0 && <p className="mt-3 text-sm font-semibold opacity-70">השיא שלכם: {best} ברצף</p>}
        <button
          type="button"
          onClick={start}
          className="mt-8 w-full max-w-xs rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-transform active:scale-[0.97]"
        >
          להתחיל
        </button>
        <Link href="/practice" className="mt-5 inline-flex min-h-11 items-center text-sm underline opacity-70">
          חזרה לתרגול
        </Link>
      </div>
    );
  }

  if (phase === "gameover" || phase === "victory") {
    const won = phase === "victory";
    return (
      <div className="mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <Image
          src={won ? "/winning.svg" : "/frustrated.svg"}
          alt=""
          width={2825}
          height={1910}
          className="mb-6 h-auto w-64 sm:w-80"
        />
        <h1 className={`font-display text-4xl font-bold ${won ? "" : "text-coral"}`}>
          {won ? "עברתם את כל הסבב!" : "נגמר הרצף"}
        </h1>
        <p className="mt-4 text-6xl font-bold tabular-nums">
          {streak}
          <span className="ms-2 text-2xl font-semibold opacity-50">ברצף</span>
        </p>
        <p className="mt-3 text-lg opacity-80">השיא שלכם: {best} ברצף</p>

        {!won && missed && (
          <div className="mt-8 w-full rounded-3xl border border-line bg-white p-5 text-start">
            <p dir="ltr" className="text-left font-semibold leading-snug">
              {missed.stem}
            </p>
            <p className="mt-2 text-sm leading-relaxed opacity-80">
              <span dir="ltr" className="font-semibold">
                {missed.options[missed.answer]}
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed opacity-80">{missed.explanation}</p>
          </div>
        )}

        <div className="mt-8 grid w-full max-w-xs gap-3">
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-transform active:scale-[0.97]"
          >
            לנסות שוב
          </button>
          <Link
            href="/practice"
            className="flex min-h-11 items-center justify-center rounded-full border border-fg/25 font-semibold hover:bg-fg/5"
          >
            חזרה לתרגול
          </Link>
        </div>
      </div>
    );
  }

  const timeFraction = timeLeft / QUESTION_MS;
  const barColor = timeFraction > 0.5 ? "bg-mint" : timeFraction > 0.2 ? "bg-marker" : "bg-coral";

  return (
    <div className={`relative mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-6 sm:px-6 ${shaking ? "shake-fail" : ""}`}>
      {flashing && <div aria-hidden className="flash-fail pointer-events-none fixed inset-0 z-40 bg-coral" />}

      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/practice" className="inline-flex min-h-11 items-center opacity-70 underline underline-offset-4">
          לתרגול
        </Link>
        <span className="tabular-nums opacity-70">
          שאלה {index + 1} מתוך {questions.length}
        </span>
      </div>

      <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-fg/10">
        <div
          className={`h-full rounded-full transition-[width] duration-100 ease-linear ${barColor}`}
          style={{ width: `${Math.max(timeFraction, 0) * 100}%` }}
        />
      </div>

      <div className="relative mt-6 flex items-center justify-center">
        <span key={streak} className="streak-pop font-display text-6xl font-bold tabular-nums">
          {streak}
        </span>
        {confetti.map((p) => (
          <span
            key={p.id}
            className="confetti-piece"
            style={
              {
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                "--rot": `${p.rot}deg`,
                width: p.size,
                height: p.size,
                background: p.color,
                animationDelay: `${p.delay}ms`,
              } as React.CSSProperties
            }
          />
        ))}
      </div>
      <p className="text-center text-sm opacity-60">רצף נוכחי</p>

      {current && (
        <div key={index} className="rise mt-8 flex flex-1 flex-col">
          <div dir="ltr" className="text-left text-xl font-semibold leading-snug text-balance">
            {current.stem}
          </div>

          <div className="mt-6 grid gap-3">
            {current.options.map((opt, i) => {
              const isAnswer = i === current.answer;
              const isPicked = i === picked;
              let style = "border-line bg-white hover:border-fg/30";
              if (revealed && isAnswer) style = "border-mint bg-mint/15";
              else if (revealed && isPicked) style = "border-coral bg-coral/15";
              else if (revealed) style = "border-line bg-white opacity-50";
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => choose(i)}
                  disabled={picked !== null}
                  className={`flex min-h-14 items-center gap-3 rounded-2xl border-2 px-5 py-3 text-lg font-semibold transition-colors active:scale-[0.98] ${style}`}
                >
                  <span dir="ltr">{opt}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
