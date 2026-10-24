"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Cinzel } from "next/font/google";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

// The Anglit Platinum card on /exam. Tapping it dims the rest of the site and asks for a yes first.
export function PlatinumEntry() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full flex-col items-center gap-3 rounded-3xl bg-[#0a0a0a] px-5 py-5 text-[#e8e3d6] shadow-[0_18px_40px_-24px_rgb(0_0_0/0.6)]"
      >
        <span dir="ltr" className={`${cinzel.className} plat-title-glow whitespace-nowrap text-[clamp(1.4rem,7.4vw,2.25rem)] font-bold tracking-wide`}>Anglit Platinum</span>
        <span className="rounded-full bg-gradient-to-b from-[#f3dc9a] to-[#c9a24b] px-7 py-1.5 text-sm font-bold text-[#1a1305]">כניסה</span>
      </button>

      {open && (
        <div
          className="plat-fade fixed inset-0 z-[70] flex items-center justify-center bg-black/80 px-5"
          onClick={() => setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="plat-entry-text"
            onClick={(e) => e.stopPropagation()}
            className="plat-glow-border plat-rise w-full max-w-sm rounded-2xl p-7 text-center text-[#e8e3d6]"
          >
            <p id="plat-entry-text" className="text-lg font-semibold leading-relaxed">
              אזור זה מכיל תוכן סיזיפי, ונועד לאנשים שרוצים להשיג פטור באנגלית. אתם חושבים שאתם מוכנים?
            </p>
            <div className="mt-7 grid grid-cols-2 gap-3">
              <Link
                href="/platinum"
                autoFocus
                className="flex min-h-12 items-center justify-center rounded-full bg-gradient-to-b from-[#f3dc9a] to-[#c9a24b] px-3 text-sm font-bold text-[#1a1305] shadow-[0_0_28px_-6px_rgb(201_162_75/0.8)]"
              >
                בול בשבילי
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="min-h-12 rounded-full border border-[#e8e3d6]/25 px-3 text-sm opacity-80"
              >
                אני רוצה להישאר בינוני
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
