"use client";

import { useEffect, useRef, useState } from "react";
import { calmCopy } from "@/content/calm";
import { SESSIONS } from "@/content/calmSessions";
import { TIMINGS } from "@/content/calmTimings";

// Transcript paragraphs: the script without its [n] pause marks.
function paragraphs(script: string) {
  return script.split("\n\n").map((p) => p.replace(/\s*\[\d+\]/g, "").trim());
}

function clock(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

export function SessionsPlayer() {
  const [index, setIndex] = useState<number | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showText, setShowText] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const lines = useRef<(HTMLButtonElement | null)[]>([]);

  const session = index === null ? null : SESSIONS[index];
  const starts = session ? TIMINGS[session.id] : [];
  const active = starts.filter((t) => t <= time + 0.2).length - 1;

  // Keep the paragraph being read in the middle of the transcript
  useEffect(() => {
    if (showText) lines.current[active]?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active, showText]);

  function open(i: number) {
    setIndex(i);
    setPlaying(false);
    setTime(0);
    setDuration(0);
    setShowText(false);
  }

  function toggle() {
    const a = audio.current;
    if (!a) return;
    if (a.paused) a.play();
    else a.pause();
  }

  function seek(t: number) {
    if (audio.current) audio.current.currentTime = t;
    setTime(t);
  }

  if (!session) {
    return (
      <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-6 pb-20 pt-24">
        <h1 className="font-display text-center text-3xl font-bold leading-snug">{calmCopy.sessionsTitle}</h1>
        <p className="mt-3 text-center text-sm leading-relaxed opacity-70">{calmCopy.sessionsText}</p>
        <ul className="mt-12 flex flex-col gap-3">
          {SESSIONS.map((s, i) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => open(i)}
                className="flex w-full items-center gap-4 rounded-[2rem] bg-fg/[0.06] p-6 text-start hover:bg-fg/10"
              >
                <span aria-hidden className="grid size-12 shrink-0 place-items-center rounded-full bg-fg text-bg">
                  <PlayIcon />
                </span>
                <span>
                  <span className="font-display block text-xl font-bold">{s.title}</span>
                  <span className="mt-1 block text-sm opacity-70">{s.when}</span>
                  <span className="mt-1 block text-xs opacity-50">
                    <bdi dir="ltr">{s.minutes}</bdi> {calmCopy.minutesUnit}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const text = paragraphs(session.script);

  const progress = (
    <div className="w-full">
      <input
        type="range"
        dir="ltr"
        min={0}
        max={duration || 1}
        step={0.1}
        value={time}
        onChange={(e) => seek(Number(e.target.value))}
        aria-label={session.title}
        className="h-8 w-full cursor-pointer accent-[var(--fg)]"
      />
      <div dir="ltr" className="flex justify-between text-xs tabular-nums opacity-60">
        <span>{clock(time)}</span>
        <span>{clock(duration)}</span>
      </div>
    </div>
  );

  const playButton = (size: string) => (
    <button
      type="button"
      onClick={toggle}
      aria-label={playing ? calmCopy.pauseLabel : calmCopy.playLabel}
      className={`grid shrink-0 place-items-center rounded-full bg-fg text-bg active:scale-95 ${size}`}
    >
      {playing ? <PauseIcon /> : <PlayIcon />}
    </button>
  );

  return (
    <div className={`mx-auto flex w-full max-w-md flex-col px-6 pb-8 pt-24 ${showText ? "h-dvh" : "min-h-dvh"}`}>
      <audio
        ref={audio}
        key={session.id}
        src={`/audio/calm/${session.id}.mp3`}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => setPlaying(false)}
      />

      <button type="button" onClick={() => setIndex(null)} className="self-start text-sm opacity-70 hover:opacity-100">
        → {calmCopy.sessionsBack}
      </button>

      {showText ? (
        <>
          <h1 className="font-display mt-4 text-2xl font-bold">{session.title}</h1>
          <p className="font-hand text-lg opacity-60">{calmCopy.sessionsAuthor}</p>
          <div className="mt-6 min-h-0 flex-1 basis-0 overflow-hidden [mask-image:linear-gradient(transparent,#000_15%,#000_85%,transparent)]">
            <div className="h-full overflow-y-auto py-[25dvh] [scrollbar-width:none]">
              {text.map((p, i) => (
                <button
                  key={i}
                  ref={(el) => {
                    lines.current[i] = el;
                  }}
                  type="button"
                  onClick={() => seek(starts[i])}
                  className={`block w-full whitespace-pre-line py-3 text-start text-xl leading-relaxed transition-opacity duration-500 ${i === active ? "font-bold opacity-100" : "opacity-35"}`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center gap-4">
            {playButton("size-14")}
            {progress}
          </div>
        </>
      ) : (
        <>
          <div className="relative mx-auto mt-10 grid size-64 place-items-center">
            {[0, 1, 2].map((r) => (
              <span
                key={r}
                aria-hidden
                className={`absolute rounded-full border border-fg/25 ${playing ? "calm-ring" : ""}`}
                style={{ inset: `${r * 14}%`, animationDelay: `${r * 0.8}s` }}
              />
            ))}
            {playButton("size-24")}
          </div>
          <h1 className="font-display mt-10 text-center text-3xl font-bold leading-snug">{session.title}</h1>
          <p className="font-hand mt-1 text-center text-xl opacity-60">{calmCopy.sessionsAuthor}</p>
          <p className="mt-2 text-center text-sm opacity-60">{session.when}</p>
          <div className="mt-auto pt-10">{progress}</div>
        </>
      )}

      <div className="mx-auto mt-6 flex rounded-full bg-fg/[0.06] p-1 text-sm">
        {([false, true] as const).map((t) => (
          <button
            key={String(t)}
            type="button"
            onClick={() => setShowText(t)}
            className={`rounded-full px-6 py-2 ${showText === t ? "bg-fg text-bg" : "opacity-70"}`}
          >
            {t ? calmCopy.tabText : calmCopy.tabPlayer}
          </button>
        ))}
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[40%] translate-x-[8%]" fill="currentColor">
      <path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5Z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="size-[40%]" fill="currentColor">
      <rect x="5" y="4" width="5" height="16" rx="1.5" />
      <rect x="14" y="4" width="5" height="16" rx="1.5" />
    </svg>
  );
}
