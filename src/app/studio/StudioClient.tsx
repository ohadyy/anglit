"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { copy } from "@/content/copy";
import { questions, TYPE_LABELS, type QuestionType } from "@/content/questions";
import { QuestionView, TypeLabel } from "@/components/QuestionView";
import { Mark } from "@/components/Logo";
import { TYPES } from "@/lib/practice";
import { site } from "@/lib/site";
import { useTheme } from "@/lib/theme";
import { useStored } from "@/lib/useStored";

type Filter = QuestionType | "all";

const PREFS = {
  filter: "all" as Filter,
  explanation: true,
  passage: true,
  safeZone: false,
};

export function StudioClient() {
  const [prefs, setPrefs] = useStored("anglit-studio", PREFS);
  const set = <K extends keyof typeof PREFS>(k: K, v: (typeof PREFS)[K]) =>
    setPrefs((p) => ({ ...p, [k]: v }));

  const list = useMemo(
    () => (prefs.filter === "all" ? questions : questions.filter((q) => q.type === prefs.filter)),
    [prefs.filter],
  );
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [controls, setControls] = useState(true);
  const [sheet, setSheet] = useState(false);
  const [hint, setHint] = useState(false);

  const i = Math.min(index, list.length - 1);
  const q = list[i];

  const go = useCallback(
    (n: number) => {
      setIndex(Math.max(0, Math.min(list.length - 1, n)));
      setSelected(null);
      setRevealed(false);
    },
    [list.length],
  );

  const pick = useCallback((n: number) => {
    setSelected(n);
    setRevealed(true);
  }, []);

  const hideControls = () => {
    setControls(false);
    setHint(true);
    setTimeout(() => setHint(false), 2600);
  };

  // Desktop keyboard shortcuts (the phone uses taps and swipes)
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey || sheet) return;
      const k = e.key.toLowerCase();
      const n = Number(e.key);
      if (n >= 1 && n <= 4) pick(n - 1);
      else if (k === " ") {
        e.preventDefault();
        setRevealed(true);
      } else if (k === "arrowleft") go(i + 1);
      else if (k === "arrowright") go(i - 1);
      else if (k === "r") go(i);
      else if (k === "h") setControls((v) => !v);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, i, pick, sheet]);

  // Swipe left → next question, swipe right → previous
  const start = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    start.current = { x: e.clientX, y: e.clientY };
  };
  const onPointerUp = (e: React.PointerEvent) => {
    const s = start.current;
    start.current = null;
    if (!s || sheet) return;
    const dx = e.clientX - s.x;
    const dy = e.clientY - s.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) go(dx < 0 ? i + 1 : i - 1);
  };

  return (
    <div className="fixed inset-0 flex justify-center bg-black">
      <div
        className="relative flex h-full w-full max-w-[calc(100dvh*9/16)] select-none flex-col overflow-hidden bg-bg text-fg [container-type:size]"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <header
          className="flex items-center justify-between px-[6cqw] pb-[4cqw]"
          style={{ paddingTop: "max(7cqw, env(safe-area-inset-top))" }}
        >
          <div className="flex items-center gap-[3cqw]">
            {/* The logo doubles as the hidden way back to the controls */}
            <button
              type="button"
              onClick={() => setControls((v) => !v)}
              aria-label={controls ? "הסתרת הכפתורים" : "הצגת הכפתורים"}
              className="-m-[2cqw] p-[2cqw]"
            >
              <Mark className="size-[8cqw]" />
            </button>
            <TypeLabel q={q} size="stage" />
          </div>
          <span dir="ltr" className="text-[3.4cqw] font-medium opacity-60">
            @{site.handle}
          </span>
        </header>

        <main
          className={`min-h-0 overflow-y-auto px-[6cqw] pb-[4cqw] [scrollbar-width:none] ${
            prefs.safeZone ? "h-[58%] flex-none" : "flex-1"
          }`}
        >
          <QuestionView
            key={q.id}
            q={q}
            size="stage"
            selected={selected}
            revealed={revealed}
            onSelect={pick}
            showExplanation={prefs.explanation}
            showPassage={prefs.passage}
          />
        </main>

        {!prefs.safeZone && (
          <footer
            className="px-[6cqw] pt-[3cqw] text-center text-[3.4cqw] opacity-60"
            style={{ paddingBottom: "max(6cqw, env(safe-area-inset-bottom))" }}
          >
            {copy.studioTagline}
          </footer>
        )}

        {controls && (
          <nav
            aria-label="שליטה"
            className="absolute inset-x-0 bottom-0 flex justify-center px-3"
            style={{ paddingBottom: "max(14px, env(safe-area-inset-bottom))" }}
          >
            <div className="flex w-full max-w-sm items-stretch gap-1 rounded-full bg-fg p-1.5 text-bg shadow-lg">
              <BarButton label="הקודמת" onClick={() => go(i - 1)} disabled={i === 0}>
                <path d="M9 6l6 6-6 6" />
              </BarButton>
              <BarButton label="איפוס" onClick={() => go(i)}>
                <path d="M4 12a8 8 0 1 0 2.4-5.7M4 4v4h4" />
              </BarButton>
              <button
                type="button"
                onClick={() => setSheet(true)}
                className="flex flex-1 flex-col items-center justify-center rounded-full py-1.5 text-xs font-semibold tabular-nums hover:bg-bg/10"
              >
                <span dir="ltr" className="text-sm">
                  {i + 1}/{list.length}
                </span>
                <span className="opacity-70">הגדרות</span>
              </button>
              <BarButton label="הסתרה" onClick={hideControls}>
                <path d="M3 3l18 18M10.6 5.1A10 10 0 0 1 12 5c5 0 9 5 9 7a11 11 0 0 1-2.2 3.3M6.6 6.6C4.4 8 3 10.4 3 12c0 2 4 7 9 7a9.7 9.7 0 0 0 4.4-1" />
              </BarButton>
              <BarButton label="הבאה" onClick={() => go(i + 1)} disabled={i === list.length - 1}>
                <path d="M15 6l-6 6 6 6" />
              </BarButton>
            </div>
          </nav>
        )}

        {hint && (
          <p className="rise pointer-events-none absolute inset-x-0 top-[22cqw] mx-auto w-fit rounded-full bg-fg px-4 py-2 text-sm text-bg">
            הקישו על הלוגו כדי להחזיר את הכפתורים
          </p>
        )}

        {sheet && (
          <Settings
            prefs={prefs}
            set={set}
            list={list}
            index={i}
            onJump={(n) => {
              go(n);
              setSheet(false);
            }}
            onFilter={(f) => {
              set("filter", f);
              setIndex(0);
              setSelected(null);
              setRevealed(false);
            }}
            onClose={() => setSheet(false)}
          />
        )}
      </div>
    </div>
  );
}

function BarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full py-1.5 text-[11px] font-medium hover:bg-bg/10 disabled:opacity-30"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        {children}
      </svg>
      {label}
    </button>
  );
}

function Settings({
  prefs,
  set,
  list,
  index,
  onJump,
  onFilter,
  onClose,
}: {
  prefs: typeof PREFS;
  set: <K extends keyof typeof PREFS>(k: K, v: (typeof PREFS)[K]) => void;
  list: typeof questions;
  index: number;
  onJump: (n: number) => void;
  onFilter: (f: Filter) => void;
  onClose: () => void;
}) {
  const { theme, setTheme } = useTheme();
  const filters: Filter[] = ["all", ...TYPES];

  return (
    <div
      className="absolute inset-0 z-10 flex items-end bg-black/40"
      onClick={onClose}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
    >
      <div
        role="dialog"
        aria-label="הגדרות צילום"
        onClick={(e) => e.stopPropagation()}
        className="rise max-h-[85%] w-full overflow-y-auto rounded-t-3xl bg-bg p-5 text-fg shadow-2xl"
        style={{ paddingBottom: "max(20px, env(safe-area-inset-bottom))" }}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">הגדרות צילום</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg"
          >
            סגירה
          </button>
        </div>

        <p className="mt-5 text-sm opacity-60">סוג שאלה</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilter(f)}
              className={`rounded-full border px-3.5 py-2 text-sm ${
                prefs.filter === f ? "border-fg bg-fg text-bg" : "border-line"
              }`}
            >
              {f === "all" ? "הכול" : TYPE_LABELS[f].he}
            </button>
          ))}
        </div>

        <p className="mt-5 text-sm opacity-60">צבעים</p>
        <div className="mt-2 grid grid-cols-2 gap-2">
          {(["light", "ink"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTheme(t)}
              className={`rounded-2xl border-2 p-3 text-sm font-semibold ${
                theme === t ? "border-fg" : "border-transparent"
              } ${t === "light" ? "bg-mist text-ink" : "bg-ink text-mist"}`}
            >
              {theme === t && "✓ "}
              {t === "light" ? "רקע בהיר" : "רקע כחול"}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-col divide-y divide-line rounded-2xl border border-line">
          <Switch on={prefs.explanation} set={(v) => set("explanation", v)} label="הסבר אחרי תשובה" />
          <Switch on={prefs.passage} set={(v) => set("passage", v)} label="קטע הקריאה" />
          <Switch
            on={prefs.safeZone}
            set={(v) => set("safeZone", v)}
            label="מקום לגוף"
            sub="משאיר את החלק התחתון של המסך ריק, בשביל הגרין סקרין"
          />
        </div>

        <p className="mt-5 text-sm opacity-60">שאלה</p>
        <ol className="mt-2 flex flex-col gap-1.5">
          {list.map((x, n) => (
            <li key={x.id}>
              <button
                type="button"
                onClick={() => onJump(n)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-start ${
                  n === index ? "border-fg" : "border-line"
                }`}
              >
                <span className="w-6 shrink-0 text-sm font-semibold tabular-nums opacity-60">{n + 1}</span>
                <span dir="ltr" className="flex-1 truncate text-left text-sm">
                  {x.stem}
                </span>
              </button>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-2xl bg-raise p-4 text-sm leading-relaxed">
          <b>טיפ לצילום נקי:</b> באייפון, שיתוף ← &quot;הוספה למסך הבית&quot;, ופותחים את הסטודיו מהאייקון.
          ככה אין שורת כתובת בצילום. מחליפים שאלה בהחלקה ימינה ושמאלה, גם כשהכפתורים מוסתרים.
        </p>
      </div>
    </div>
  );
}

function Switch({
  on,
  set,
  label,
  sub,
}: {
  on: boolean;
  set: (v: boolean) => void;
  label: string;
  sub?: string;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 px-4 py-3">
      <span className="flex-1">
        <span className="block text-sm font-medium">{label}</span>
        {sub && <span className="block text-xs opacity-60">{sub}</span>}
      </span>
      <input type="checkbox" checked={on} onChange={(e) => set(e.target.checked)} className="peer sr-only" />
      <span
        aria-hidden
        className={`relative h-7 w-12 shrink-0 rounded-full transition-colors peer-focus-visible:outline-3 peer-focus-visible:outline-marker ${
          on ? "bg-fg" : "bg-fg/20"
        }`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-bg shadow transition-[inset-inline-start] ${
            on ? "start-6" : "start-1"
          }`}
        />
      </span>
    </label>
  );
}
