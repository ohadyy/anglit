"use client";

import Image from "next/image";
import Link from "next/link";
import { FreeNextCard } from "@/components/FreeNextCard";
import { useMemo, useState } from "react";
import { useStored } from "@/lib/useStored";
import { randomOrder } from "@/lib/shuffle";

type GameWord = { id: string; word: string; translation: string; example: string };

const ROUND_LIMIT = 30; // the round never grows past this many questions
const OFFSET = 3; // a missed word comes back three questions later
const MAX_REQUEUE = 2; // and at most twice per word

// Deterministic shuffle, so the options of one question do not reorder on each render
function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Shows the example sentence with the target word highlighted
function Example({ sentence, word }: { sentence: string; word: string }) {
  const parts = sentence.split(new RegExp(`(${word})`, "i"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === word.toLowerCase() ? (
          <mark key={i} className="pink">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export function WordChain({ words, paid }: { words: GameWord[]; paid: boolean }) {
  const [started, setStarted] = useState(false);
  const [queue, setQueue] = useState<GameWord[]>(words);
  const [requeued, setRequeued] = useState<Record<string, number>>({});
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [missed, setMissed] = useState<string[]>([]);
  const [best, setBest] = useStored("anglit-chain-best", 0);

  const done = started && index >= queue.length;
  const current = queue[index];

  const options = useMemo(() => {
    if (!current) return [];
    const others = words.filter((w) => w.id !== current.id);
    const seed = index * 7919 + current.word.length;
    const wrong = shuffle(others, seed).slice(0, 3);
    return shuffle([current, ...wrong], seed + 1);
  }, [current, index, words]);

  function choose(option: GameWord) {
    if (picked || !current) return;
    setPicked(option.id);
    const knew = option.id === current.id;
    // Same endpoint /vocabulary uses, so a word missed here also comes back there. Best-effort:
    // signed-out guests get 401 and nothing is lost, since this is only a backup to the in-round chain.
    fetch("/api/vocab/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: current.id, knew }),
      keepalive: true,
    }).catch(() => {});
    if (knew) {
      setCorrect((c) => c + 1);
      const next = streak + 1;
      setStreak(next);
      if (next > best) setBest(next);
      return;
    }
    setStreak(0);
    if (!missed.includes(current.word)) setMissed((m) => [...m, current.word]);
    // A missed word comes back a few questions later, so it is recalled again before it fades
    const times = requeued[current.id] ?? 0;
    if (times < MAX_REQUEUE && queue.length < ROUND_LIMIT) {
      setRequeued((r) => ({ ...r, [current.id]: times + 1 }));
      setQueue((q) => {
        const at = Math.min(index + 1 + OFFSET, q.length);
        return [...q.slice(0, at), current, ...q.slice(at)];
      });
    }
  }

  function next() {
    if (!picked) return;
    setPicked(null);
    setIndex((i) => i + 1);
  }

  function restart() {
    setQueue(randomOrder(words));
    setRequeued({});
    setIndex(0);
    setPicked(null);
    setStreak(0);
    setCorrect(0);
    setMissed([]);
  }

  if (!started) {
    return (
      <div className="mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="font-display text-4xl font-bold leading-tight">שרשרת מילים</h1>
        <p className="mt-4 max-w-sm text-lg leading-relaxed opacity-80">
          תקבלו מילה בעברית ותבחרו את המילה באנגלית. כל תשובה נכונה מוסיפה חוליה לשרשרת. מילה שטעיתם בה תחזור אליכם מוקדם יותר.
        </p>
        <button
          type="button"
          onClick={() => {
            setQueue(randomOrder(words));
            setStarted(true);
          }}
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

  if (done) {
    return (
      <div className="mx-auto flex flex-1 max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
        <Image src="/winning.svg" alt="" width={2825} height={1910} className="mb-6 h-auto w-64 sm:w-80" />
        <h1 className="font-display text-4xl font-bold">סיימתם את השרשרת</h1>
        <p className="mt-4 text-6xl font-bold tabular-nums">
          {correct}
          <span className="opacity-40">/{words.length}</span>
        </p>
        <p className="mt-3 text-lg opacity-80">השרשרת הארוכה ביותר שלכם: {best} חוליות</p>
        {missed.length > 0 && (
          <div className="mt-8 w-full rounded-3xl border border-line bg-white p-5 text-start">
            <p className="font-semibold">כדאי לחזור על המילים האלה</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {missed.map((w) => (
                <li key={w} dir="ltr" className="rounded-full border border-line px-4 py-2 font-semibold">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="mt-8 grid w-full max-w-xs gap-3">
          <button
            type="button"
            onClick={restart}
            className="rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-transform active:scale-[0.97]"
          >
            לשחק שוב
          </button>
          <Link
            href="/practice"
            className="flex min-h-11 items-center justify-center rounded-full border border-fg/25 font-semibold hover:bg-fg/5"
          >
            חזרה לתרגול
          </Link>
        </div>
        {!paid && <FreeNextCard current="words" />}
      </div>
    );
  }

  const isCorrect = picked !== null && current !== undefined && picked === current.id;

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col px-4 py-6 sm:px-6">
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/practice" className="inline-flex min-h-11 items-center opacity-70 underline underline-offset-4">
          לתרגול
        </Link>
        <span className="tabular-nums opacity-70">
          {Math.min(index + 1, queue.length)} מתוך {queue.length}
        </span>
      </div>

      {/* The chain: one link per correct answer in a row, so the streak shows at a glance */}
      <div className="mt-4 flex h-3 items-center gap-1.5" role="img" aria-label={`שרשרת: ${streak} חוליות`}>
        {Array.from({ length: Math.max(streak, 1) }).map((_, i) => (
          <span
            key={i}
            className={`h-3 flex-1 rounded-full transition-colors duration-200 ${i < streak ? "bg-fg" : "bg-fg/12"}`}
          />
        ))}
      </div>

      {current && (
        <div key={index} className="rise mt-10 flex flex-1 flex-col">
          <p className="text-sm opacity-70">מה המילה באנגלית?</p>
          <h1 className="font-display mt-3 text-5xl font-bold leading-tight">{current.translation}</h1>

          <div className="mt-8 grid gap-3">
            {options.map((option, i) => {
              const show = picked !== null;
              const isThis = picked === option.id;
              const isAnswer = option.id === current.id;
              let style = "border-line bg-white hover:border-fg/30";
              if (show && isAnswer) style = "border-ok bg-ok/15";
              else if (show && isThis) style = "border-coral bg-coral/15";
              else if (show) style = "border-line bg-white opacity-50";
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => choose(option)}
                  disabled={show}
                  className={`flex min-h-14 items-center justify-between gap-3 rounded-2xl border-2 px-5 py-3 text-lg font-semibold transition-colors active:scale-[0.98] ${style}`}
                >
                  <span dir="ltr">{option.word}</span>
                  <span className="text-sm opacity-50" aria-hidden>
                    {i + 1}
                  </span>
                </button>
              );
            })}
          </div>

          {picked && (
            <div className="rise mt-6 rounded-3xl bg-fg/5 p-5">
              <p className="font-semibold">
                {isCorrect ? "נכון! חוליה חדשה." : "לא בדיוק. התשובה היא:"}
                {!isCorrect && (
                  <span dir="ltr" className="ms-2">
                    {current.word}
                  </span>
                )}
              </p>
              <p dir="ltr" className="mt-3 text-left leading-relaxed opacity-90">
                <Example sentence={current.example} word={current.word} />
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={next}
            disabled={!picked}
            className="mt-auto w-full rounded-full bg-fg px-7 py-4 font-semibold text-bg transition-opacity disabled:opacity-30 sm:mt-10"
          >
            {index === queue.length - 1 ? "לתוצאות" : "הבאה"}
          </button>
        </div>
      )}
    </div>
  );
}
