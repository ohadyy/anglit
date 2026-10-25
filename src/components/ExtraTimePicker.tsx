"use client";

import { useStored } from "@/lib/useStored";

// Extra time for students with approved accommodations, as a percent of each timer
const OPTIONS = [0, 25, 50];

export function useExtraTime() {
  const [stored, setStored] = useStored("anglit-extra-time", { pct: 0 });
  const pct = OPTIONS.includes(stored.pct) ? stored.pct : 0;
  return [pct, (next: number) => setStored({ pct: next })] as const;
}

export const withExtraTime = (amount: number, pct: number) => Math.round(amount * (1 + pct / 100));

export function ExtraTimePicker({
  value,
  onChange,
  className = "",
}: {
  value: number;
  onChange: (pct: number) => void;
  className?: string;
}) {
  return (
    <fieldset className={`w-full text-start ${className}`}>
      <legend className="text-sm font-semibold">יש לכם התאמות? תוספת זמן</legend>
      <div className="mt-2 grid grid-cols-3 gap-2">
        {OPTIONS.map((pct) => (
          <button
            key={pct}
            type="button"
            onClick={() => onChange(pct)}
            aria-pressed={value === pct}
            className={`min-h-11 touch-manipulation rounded-full border border-current px-3 text-sm tabular-nums transition-opacity ${
              value === pct ? "font-semibold ring-1 ring-current" : "opacity-50"
            }`}
          >
            {pct === 0 ? "בלי" : <bdi dir="ltr">+{pct}%</bdi>}
          </button>
        ))}
      </div>
    </fieldset>
  );
}
