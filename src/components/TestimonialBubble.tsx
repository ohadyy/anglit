"use client";

import { useEffect, useState } from "react";
import { testimonials } from "@/content/testimonials";
import { randomOrder } from "@/lib/shuffle";

const SHOW_MS = 5000;
const TYPING_MS = 900;

// A WhatsApp-style bubble that swaps to the next student message every few seconds,
// with three typing dots in between
export function TestimonialBubble() {
  // Shuffled on the client only, so the server and first render never disagree; empty until then
  const [list, setList] = useState<typeof testimonials | null>(null);
  const [i, setI] = useState(0);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- shuffle after mount so server and client agree on first paint
    setList(randomOrder(testimonials));
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let inner: ReturnType<typeof setTimeout>;
    const outer = setInterval(() => {
      if (reduced) return setI((n) => (n + 1) % testimonials.length);
      setTyping(true);
      inner = setTimeout(() => {
        setI((n) => (n + 1) % testimonials.length);
        setTyping(false);
      }, TYPING_MS);
    }, SHOW_MS);
    return () => {
      clearInterval(outer);
      clearTimeout(inner);
    };
  }, []);

  const t = list?.[i];

  return (
    <div className="mx-auto mt-6 flex min-h-24 w-full max-w-xs items-start">
      {t && (
      <div key={typing ? "typing" : i} className="rise flex items-start gap-2" aria-live="polite">
        {/* Fixed light-green bubble on purpose: it should look like WhatsApp in both colour themes */}
        <div className="rounded-2xl rounded-tr-sm bg-[#d9fdd3] px-4 py-2.5 text-start text-[#111b21] shadow-[0_1px_2px_rgb(0_0_0/0.15)]">
          {typing ? (
            <span className="flex h-6 items-center gap-1" aria-label="מקליד">
              {[0, 1, 2].map((d) => (
                <span key={d} className="size-2 animate-pulse rounded-full bg-[#111b21]/40" style={{ animationDelay: `${d * 180}ms` }} />
              ))}
            </span>
          ) : (
            <>
              <span className="block text-sm font-bold text-[#06795a]">{t.letter}׳</span>
              <span className="block leading-snug">{t.text}</span>
            </>
          )}
        </div>
      </div>
      )}
    </div>
  );
}
