"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

// Read-aloud uses the browser's built-in speech synthesis, so there is no server cost.
// It reads English only. Many devices have no Hebrew voice, and then Hebrew text is
// silent, so the toolbar stays hidden for Hebrew selections.

const HEBREW = /[֐-׿]/;

export function speak(text: string, onEnd: () => void) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.7; // slower than default, like the real exam's read-aloud (0.6)
  const voice = window.speechSynthesis.getVoices().find((v) => v.lang.startsWith("en"));
  if (voice) utterance.voice = voice;
  utterance.onend = onEnd;
  utterance.onerror = onEnd;
  window.speechSynthesis.speak(utterance);
}

const supported = () => typeof window !== "undefined" && "speechSynthesis" in window;

// A speaker button beside an answer: tapping the answer itself selects it, so it cannot be
// selected as text to read. Always visible, so it also works on phones.
export function SpeakButton({ text, label }: { text: string; label: string }) {
  const [playing, setPlaying] = useState(false);
  // Decided after mount, so the server and first client render match
  const ok = useSyncExternalStore(() => () => {}, supported, () => false);
  if (!ok) return null;
  return (
    <button
      type="button"
      aria-label={label}
      data-readaloud
      onClick={() => {
        window.speechSynthesis.cancel();
        if (playing) return setPlaying(false);
        setPlaying(true);
        speak(text, () => setPlaying(false));
      }}
      className="grid size-11 shrink-0 touch-manipulation place-items-center rounded-full border border-line bg-white text-ink"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {playing ? <rect x="7" y="7" width="10" height="10" /> : <path d="M4 9v6h4l5 4V5L8 9H4zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" />}
      </svg>
    </button>
  );
}

export function ReadAloud() {
  const [text, setText] = useState("");
  const [pos, setPos] = useState<{ x: number; top: number; bottom: number } | null>(null);
  const [status, setStatus] = useState<"idle" | "playing" | "paused">("idle");
  const textRef = useRef("");
  // Tapping a toolbar button makes iOS clear the text selection; don't hide the toolbar for that
  const touchingBar = useRef(false);

  useEffect(() => {
    function update(e: Event) {
      if (e.target instanceof Element && e.target.closest("[data-readaloud]")) return;
      const selection = window.getSelection();
      const selected = selection?.toString().trim() ?? "";
      if (!selection || selected.length < 2 || selection.rangeCount === 0) {
        if (window.speechSynthesis?.speaking || touchingBar.current) return;
        setText("");
        setPos(null);
        return;
      }
      if (HEBREW.test(selected)) {
        window.speechSynthesis?.cancel();
        setText("");
        setPos(null);
        return;
      }
      const rect = selection.getRangeAt(0).getBoundingClientRect();
      const next = selected.slice(0, 1200);
      if (next !== textRef.current) window.speechSynthesis?.cancel();
      textRef.current = next;
      setText(next);
      setStatus("idle");
      setPos({ x: rect.left + rect.width / 2, top: rect.top, bottom: rect.bottom });
    }

    // A tap anywhere outside the toolbar and the speaker buttons stops the reading and closes
    // the toolbar. A drag (scrolling, selecting) is not a tap, so it is ignored.
    let down: { x: number; y: number } | null = null;
    function onDown(e: PointerEvent) {
      down = { x: e.clientX, y: e.clientY };
    }
    function onTap(e: PointerEvent) {
      const moved = down ? Math.hypot(e.clientX - down.x, e.clientY - down.y) : 0;
      down = null;
      if (moved > 10) return;
      if (e.target instanceof Element && e.target.closest("[data-readaloud]")) return;
      window.speechSynthesis?.cancel();
      textRef.current = "";
      setStatus("idle");
      setText("");
      setPos(null);
    }
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("pointerup", onTap);

    // Touch screens select text by long-press and fire no mouseup, only selectionchange
    document.addEventListener("mouseup", update);
    document.addEventListener("keyup", update);
    document.addEventListener("selectionchange", update);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onTap);
      document.removeEventListener("mouseup", update);
      document.removeEventListener("keyup", update);
      document.removeEventListener("selectionchange", update);
      window.speechSynthesis?.cancel();
    };
  }, []);

  if (!text || !pos || !supported()) return null;

  const x = Math.min(Math.max(pos.x, 140), window.innerWidth - 140);
  // On touch screens the system menu (Copy, Look Up) sits right above or right below the
  // selection and we cannot read which. Measured on an iPhone: a selection in the upper part
  // of the screen gets the menu below it, so the bar goes above; lower down it is guessed
  // that the menu moves above, so the bar goes below, past where the menu ends.
  const touch = window.matchMedia("(pointer: coarse)").matches;
  const aboveBar = Math.max(pos.top - 56, 8);
  const y = touch && pos.top > 320 ? Math.min(pos.bottom + 118, window.innerHeight - 190) : aboveBar;

  function play() {
    if (status === "paused") {
      window.speechSynthesis.resume();
      setStatus("playing");
      return;
    }
    window.speechSynthesis.cancel();
    setStatus("playing");
    speak(textRef.current, () => setStatus("idle"));
  }

  function pause() {
    window.speechSynthesis.pause();
    setStatus("paused");
  }

  function stop() {
    window.speechSynthesis.cancel();
    setStatus("idle");
  }

  return (
    <div
      data-readaloud
      role="toolbar"
      aria-label="הקראה"
      onPointerDown={() => {
        touchingBar.current = true;
        setTimeout(() => (touchingBar.current = false), 800);
      }}
      style={{ left: x, top: y }}
      className="fixed z-(--z-overlay) flex -translate-x-1/2 items-center gap-1 rounded-full border border-line bg-white p-1.5 shadow-[0_12px_30px_-10px_rgb(14_8_82/0.4)]"
    >
      <button
        type="button"
        onClick={play}
        disabled={status === "playing"}
        className="rounded-full bg-fg px-4 py-1.5 text-sm font-semibold text-bg disabled:opacity-50"
      >
        {status === "paused" ? "המשך" : "הקראה"}
      </button>
      <button
        type="button"
        onClick={pause}
        disabled={status !== "playing"}
        className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-fg/5 disabled:opacity-50"
      >
        השהיה
      </button>
      <button
        type="button"
        onClick={stop}
        disabled={status === "idle"}
        className="rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-fg/5 disabled:opacity-50"
      >
        עצירה
      </button>
    </div>
  );
}

// The exam's listening clips are audio files, so the check plays a file the same way.
// The speech voice test above depends on the device having a matching voice, and it
// is silent when there is none (a common case for Hebrew on Windows).
const AUDIO_CHECK_CLIP = "/audio/audio-check.mp3";

export function AudioCheck() {
  const [state, setState] = useState<"idle" | "playing" | "asked" | "heard" | "missed" | "failed">("idle");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => () => audioRef.current?.pause(), []);

  async function test() {
    audioRef.current?.pause();
    const audio = new Audio(AUDIO_CHECK_CLIP);
    audioRef.current = audio;
    setState("playing");
    audio.onended = () => setState("asked");
    audio.onerror = () => setState("failed");
    try {
      await audio.play();
    } catch {
      setState("failed");
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {state === "idle" || state === "playing" || state === "failed" ? (
        <button
          type="button"
          onClick={test}
          disabled={state === "playing"}
          className="border border-fg/25 px-5 py-2.5 text-sm font-semibold hover:bg-fg/5 disabled:opacity-50"
        >
          {state === "failed" ? "נסו שוב" : "בדיקת שמע"}
        </button>
      ) : null}

      {state === "playing" && <p className="text-sm opacity-70">משמיעים קטע בדיקה...</p>}

      {state === "asked" && (
        <div className="flex flex-col items-center gap-3">
          <p className="text-sm">שמעתם את הקול?</p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setState("heard")}
              className="bg-fg px-5 py-2.5 text-sm font-semibold text-bg"
            >
              כן, שמעתי
            </button>
            <button
              type="button"
              onClick={() => setState("missed")}
              className="border border-fg/25 px-5 py-2.5 text-sm font-semibold hover:bg-fg/5"
            >
              לא שמעתי
            </button>
          </div>
        </div>
      )}

      {state === "heard" && <p className="text-sm font-semibold text-ok">מצוין, השמע עובד.</p>}
      {state === "failed" && (
        <p className="max-w-xs text-sm leading-relaxed opacity-80">
          הדפדפן לא הצליח להשמיע את הקטע. בדקו את הרמקול או האוזניות, ונסו שוב. אם זה לא עוזר, נסו דפדפן אחר.
        </p>
      )}
      {state === "missed" && (
        <div className="flex flex-col items-center gap-3">
          <p className="max-w-xs text-center text-sm leading-relaxed opacity-80">
            בדקו שעוצמת הקול מופעלת ושהמכשיר לא במצב שקט, ואז נסו שוב.
          </p>
          <button
            type="button"
            onClick={test}
            className="border border-fg/25 px-5 py-2.5 text-sm font-semibold hover:bg-fg/5"
          >
            נסו שוב
          </button>
        </div>
      )}
    </div>
  );
}
