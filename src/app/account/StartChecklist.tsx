"use client";

import Link from "next/link";
import { useStored } from "@/lib/useStored";

export type ChecklistStep = { label: string; done: boolean; href: string };

// First steps for a new member. The server decides which steps apply and which are done;
// this component only shows them and remembers on this device if the member closed the card.
export function StartChecklist({ steps }: { steps: ChecklistStep[] }) {
  const [dismissed, setDismissed] = useStored("anglit-start-checklist", false);
  const doneCount = steps.filter((s) => s.done).length;
  const allDone = doneCount === steps.length;

  // Hidden once every step is done, or when the member closed it on this device
  if (allDone || dismissed) return null;

  return (
    <section aria-labelledby="start-checklist-title" className="mt-8 rounded-3xl border border-line bg-white p-5 shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 id="start-checklist-title" className="font-display text-xl font-bold">
            הצעדים הבאים
          </h2>
          <p className="mt-1 text-sm tabular-nums opacity-70">
            {doneCount} מתוך {steps.length} הושלמו
          </p>
        </div>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          className="shrink-0 rounded-full px-3 py-2 text-sm font-semibold opacity-70 hover:bg-fg/5 hover:opacity-100"
        >
          הסתר
        </button>
      </div>

      {/* Progress bar: the same style as the practice bar */}
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-fg/12" aria-hidden>
        <div className="h-full rounded-full bg-fg transition-[width] duration-300" style={{ width: `${(doneCount / steps.length) * 100}%` }} />
      </div>

      <ol className="mt-5 flex flex-col gap-2">
        {steps.map((s) => (
          <li key={s.label}>
            <Link
              href={s.href}
              className="flex items-center gap-3 rounded-2xl px-3 py-3 hover:bg-fg/5"
              aria-label={`${s.label}${s.done ? ", הושלם" : ""}`}
            >
              <span
                aria-hidden
                className={`grid size-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                  s.done ? "border-fg bg-fg text-bg" : "border-fg/25"
                }`}
              >
                {s.done ? "✓" : ""}
              </span>
              <span className={s.done ? "opacity-60 line-through" : "font-semibold"}>{s.label}</span>
              {!s.done && <span className="ms-auto text-sm opacity-70" aria-hidden>←</span>}
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
