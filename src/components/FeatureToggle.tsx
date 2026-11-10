"use client";

import { useState } from "react";

export function FeatureToggle({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="mt-4 flex min-h-11 items-center justify-center gap-1.5 text-sm font-semibold underline underline-offset-4 lg:hidden"
      >
        {label}
      </button>
      <div className={`${open ? "flex" : "hidden"} flex-1 flex-col lg:flex`}>{children}</div>
    </>
  );
}
