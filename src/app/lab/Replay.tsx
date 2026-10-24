"use client";

import { useState, type ReactNode } from "react";

// Remounts its children on click, so an entrance animation can be watched again
export function Replay({ children, label = "להפעיל שוב" }: { children: ReactNode; label?: string }) {
  const [run, setRun] = useState(0);
  return (
    <>
      <div key={run}>{children}</div>
      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        className="mx-auto mt-5 flex min-h-11 items-center rounded-full border border-fg/25 px-6 font-semibold hover:bg-fg/5"
      >
        {label}
      </button>
    </>
  );
}
