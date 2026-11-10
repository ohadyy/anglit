"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { A11Y_SIZES } from "@/lib/themeScript";
import { getJson, setItem } from "@/lib/safeStorage";

type Prefs = { size: 0 | 1 | 2; contrast: boolean; links: boolean; still: boolean };
const KEY = STORAGE_KEYS.accessibility;
const DEFAULTS: Prefs = { size: 0, contrast: false, links: false, still: false };

function readSaved(): Prefs {
  const saved = getJson(KEY) as Partial<Prefs> | null | undefined;
  return saved ? { ...DEFAULTS, ...saved } : DEFAULTS;
}

function applyPrefs(p: Prefs) {
  const root = document.documentElement;
  root.style.fontSize = A11Y_SIZES[p.size];
  root.classList.toggle("a11y-contrast", p.contrast);
  root.classList.toggle("a11y-links", p.links);
  // The one flag for "stop animations": CSS (globals.css) and JS animations (lib/useReducedMotion) both read it
  root.toggleAttribute("data-still", p.still);
}

export function AccessibilityWidget({ aboveTabBar = false }: { aboveTabBar?: boolean }) {
  const [open, setOpen] = useState(false);
  // The panel starts closed, so reading the saved choice on first render does not change the server markup
  const [prefs, setPrefs] = useState<Prefs>(readSaved);

  useEffect(() => {
    applyPrefs(prefs);
    setItem(KEY, JSON.stringify(prefs));
  }, [prefs]);

  const update = (patch: Partial<Prefs>) => setPrefs((p) => ({ ...p, ...patch }));
  const button =
    "rounded-full border border-fg/25 bg-bg px-4 py-2.5 text-sm font-semibold hover:bg-fg/5 aria-pressed:bg-fg aria-pressed:text-bg";

  return (
    // On phones it sits above the tab bar; on wider screens it returns to the corner
    <div className={`fixed end-4 z-(--z-bar) sm:bottom-4 ${aboveTabBar ? "bottom-(--tab-bar-offset)" : "bottom-4"}`}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="a11y-panel"
        onClick={() => setOpen((o) => !o)}
        className="size-11 rounded-full bg-fg text-bg shadow-lg"
        aria-label="תפריט נגישות"
      >
        <svg aria-hidden viewBox="0 0 24 24" className="mx-auto size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="4.5" r="1.8" fill="currentColor" stroke="none" />
          <path d="M5 8.5h14M12 8.5v5M9 21l3-7.5 3 7.5M8.5 13.5l-2 3" />
        </svg>
      </button>

      {open && (
        <section
          id="a11y-panel"
          aria-label="הגדרות נגישות"
          className="absolute bottom-14 end-0 flex w-64 flex-col gap-3 rounded-2xl border border-line bg-bg p-4 shadow-xl"
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
