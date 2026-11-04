"use client";

import { useState } from "react";
import { Dot } from "./Badge";
import { STATUS_LABEL, type CrmStatus } from "./labels";

const OPTIONS = Object.keys(STATUS_LABEL) as CrmStatus[];

// A dropdown with a colored dot per status, built for a thumb: tall rows, tap the button again to close.
// With no value it acts as an action menu (the placeholder shows, and no row is highlighted).
export function StatusSelect({
  value,
  placeholder,
  disabled,
  onChange,
}: {
  value: CrmStatus | null;
  placeholder?: string;
  disabled?: boolean;
  onChange: (status: CrmStatus) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border border-line bg-white px-4 text-base font-semibold disabled:opacity-50"
      >
        <span className="flex items-center gap-2.5">
          {value ? (
            <>
              <Dot stage={value} />
              {STATUS_LABEL[value]}
            </>
          ) : (
            <span className="opacity-70">{placeholder}</span>
          )}
        </span>
        <svg aria-hidden viewBox="0 0 16 16" className={`size-4 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
          <path d="M3.5 6l4.5 4.5L12.5 6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* In the page flow, not floating: a floating list gets cut off by the fixed tab bar at the bottom of a phone */}
      {open && (
        <ul role="listbox" className="mt-2 rounded-2xl border border-line bg-white p-1.5 shadow-[0_18px_40px_-18px_rgb(14_8_82/0.35)]">
          {OPTIONS.map((s) => (
            <li key={s} role="option" aria-selected={s === value}>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  if (s !== value) onChange(s);
                }}
                className={`flex min-h-12 w-full items-center gap-2.5 rounded-xl px-3 text-start text-base ${s === value ? "bg-sunk font-semibold" : ""}`}
              >
                <Dot stage={s} />
                {STATUS_LABEL[s]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
