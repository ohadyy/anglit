"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { FreeNextCard } from "@/components/FreeNextCard";
import { speak } from "@/components/ReadAloud";
import { vocabCopy, type VocabWord } from "@/content/vocabulary";

export function VocabClient({
  words,
  total,
  known,
  paid,
  header,
}: {
  words: VocabWord[];
  total: number;
  known: number;
  paid: boolean;
  header: ReactNode;
}) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (total === 0) {
    return (
      <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-4 sm:px-6">
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{vocabCopy.title}</h1>
        {header}
        <p className="mt-6 leading-relaxed opacity-80">{vocabCopy.empty}</p>
      </main>
    );
  }

  const done = index >= words.length;
  const current = words[index];

  function answer(knew: boolean) {
    fetch("/api/vocab/answer", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordId: current.id, knew }),
      keepalive: true,
    }).catch(() => {});
    setIndex((i) => i + 1);
    setFlipped(false);
  }

  function pronounce() {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    speak(current.word, () => {});
  }

  const progress = Math.round((known / total) * 100);

  return (
    <main className="mx-auto w-full max-w-xl px-4 pb-16 pt-4 sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">{vocabCopy.title}</h1>
      <p className="mt-3 leading-relaxed opacity-80">{vocabCopy.intro}</p>

      {!paid && (
        <p className="mt-3 text-sm leading-relaxed opacity-70">
          זו טעימה חינמית, {total} מילים מהמאגר. כל אוצר המילים נפתח עם התשלום על הסמינר.
        </p>
      )}

      {header}

      <div className="mt-8">
        <div className="flex items-center justify-between text-sm">
          <span className="tabular-nums opacity-80">
            {known} מתוך {total} {vocabCopy.knownLabel}
          </span>
          {!done && (
            <span className="tabular-nums opacity-70">
              {vocabCopy.progress} {words.length - index}
            </span>
          )}
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-fg/12">
          <span
            className="block h-full origin-right rounded-full bg-fg transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `scaleX(${progress / 100})` }}
          />
        </div>
      </div>

      {done ? (
        <div className="mt-10 border border-line bg-white p-8 text-center shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
          <p className="font-hand text-3xl">{vocabCopy.roundDone}</p>
          <p className="mt-3 leading-relaxed opacity-80">{vocabCopy.roundDoneText}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 bg-fg px-7 py-3.5 font-semibold text-bg"
          >
            {vocabCopy.nextRound}
          </button>
          {!paid && (
            <Link href="/pricing" className="mt-4 block text-sm underline opacity-70">
              לפתיחת כל אוצר המילים
            </Link>
          )}
          {!paid && <FreeNextCard current="vocab" />}
        </div>
      ) : (
        <div className="mt-10 flex flex-col gap-5">
          <div className="relative">
          {/* Sits beside the flip button, not inside it: a button cannot nest a button */}
          <button
            type="button"
            onClick={pronounce}
            aria-label="השמעת המילה"
            className="absolute left-3 top-3 z-10 grid size-11 place-items-center rounded-full border border-line bg-white hover:bg-fg/5"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M11 5 6 9H3v6h3l5 4V5Z" />
              <path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" />
            </svg>
          </button>
          <button
            type="button"
            data-flipped={flipped}
            onClick={() => setFlipped((f) => !f)}
            aria-label={flipped ? current.translation : vocabCopy.reveal}
            className="flip-card w-full text-center"
          >
            <span className="flip-inner w-full">
              <span className="flip-face flex min-h-72 flex-col items-center justify-center gap-3 border border-line bg-white p-8 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
                <span dir="ltr" className="text-5xl font-bold tracking-tight sm:text-6xl">
                  {current.word}
                </span>
                <span className="text-sm opacity-70">{vocabCopy.reveal}</span>
              </span>
              <span className="flip-face flip-face-back flex min-h-72 flex-col items-center justify-center gap-5 border border-line bg-white p-8 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]">
                <span className="text-3xl font-bold sm:text-4xl">{current.translation}</span>
                <span dir="ltr" className="max-w-sm leading-relaxed opacity-80">
                  {current.example}
                </span>
              </span>
            </span>
          </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              disabled={!flipped}
              onClick={() => answer(false)}
              className="border border-fg/25 px-6 py-4 font-semibold hover:bg-fg/5 disabled:opacity-50"
            >
              {vocabCopy.didntKnow}
            </button>
            <button
              type="button"
              onClick={() => answer(true)}
              className="bg-fg px-6 py-4 font-semibold text-bg"
            >
              {vocabCopy.knew}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
