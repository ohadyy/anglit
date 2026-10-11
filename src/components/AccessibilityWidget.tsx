"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

// Small accessibility panel: text size, high contrast, underlined links and stopped animations.
// It works on the page itself (no third-party script) and remembers the choices on this device.
type Prefs = { size: 0 | 1 | 2; contrast: boolean; links: boolean; still: boolean };
const KEY = "anglit-a11y";
const DEFAULTS: Prefs = { size: 0, contrast: false, links: false, still: false };
const SIZES = ["100%", "112%", "125%"];

function readSaved(): Prefs {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Partial<Prefs> | null;
    return saved ? { ...DEFAULTS, ...saved } : DEFAULTS;
  } catch {
    // Storage can be blocked (private window); the defaults still work
    return DEFAULTS;
  }
}

function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  root.style.fontSize = SIZES[p.size];
  root.classList.toggle("a11y-contrast", p.contrast);
  root.classList.toggle("a11y-links", p.links);
  root.classList.toggle("a11y-still", p.still);
}

export function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  // The panel starts closed, so reading the saved choice on first render does not change the server markup
  const [prefs, setPrefs] = useState<Prefs>(readSaved);

  useEffect(() => {
    applyPrefs(prefs);
    try {
      localStorage.setItem(KEY, JSON.stringify(prefs));
    } catch {
      // Same as above: the choice just is not remembered
    }
  }, [prefs]);

  const update = (patch: Partial<Prefs>) => setPrefs((p) => ({ ...p, ...patch }));
  const button =
    "rounded-full border border-fg/25 bg-bg px-4 py-2.5 text-sm font-semibold hover:bg-fg/5 aria-pressed:bg-fg aria-pressed:text-bg";

  return (
    // On phones it sits above the tab bar; on wider screens it returns to the corner
    <div className="fixed bottom-24 start-4 z-30 sm:bottom-4">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
        className="size-12 rounded-full bg-fg text-bg shadow-lg"
        aria-label="תפריט נגישות"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="mx-auto size-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M5 8.5h14M12 8.5v5M9 21l3-7.5 3 7.5M8.5 13.5l-2 3" />
        </svg>
      </button>

      {open && (
        <section
          id="a11y-panel"
          aria-label="הגדרות נגישות"
          className="absolute bottom-16 start-0 flex w-64 flex-col gap-3 rounded-2xl border border-line bg-bg p-4 shadow-xl"
        >
          <p className="font-semibold">נגישות</p>
          <div className="flex flex-wrap gap-2">
            <button type="button" className={button} onClick={() => update({ size: Math.max(0, prefs.size - 1) as Prefs["size"] })}>
              הקטנת טקסט
            </button>
            <button type="button" className={button} onClick={() => update({ size: Math.min(2, prefs.size + 1) as Prefs["size"] })}>
              הגדלת טקסט
            </button>
          </div>
          <button type="button" aria-pressed={prefs.contrast} className={button} onClick={() => update({ contrast: !prefs.contrast })}>
            ניגודיות גבוהה
          </button>
          <button type="button" aria-pressed={prefs.links} className={button} onClick={() => update({ links: !prefs.links })}>
            הדגשת קישורים
          </button>
          <button type="button" aria-pressed={prefs.still} className={button} onClick={() => update({ still: !prefs.still })}>
            עצירת אנימציות
          </button>
          <button
            type="button"
            className="text-sm underline underline-offset-4 opacity-80"
            onClick={() => setPrefs(DEFAULTS)}
          >
            איפוס ההגדרות
          </button>
          <Link href="/legal/accessibility" className="text-sm underline underline-offset-4 opacity-80">
            הצהרת הנגישות
          </Link>
        </section>
      )}
    </div>
  );
}
