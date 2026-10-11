"use client";

import { useEffect, type ReactNode } from "react";

// A short message that appears at the bottom of the screen and can be closed.
// It is announced to screen readers without moving focus. Pass `seconds` to hide it by itself.
export function Toast({
  message,
  onClose,
  seconds,
}: {
  message: ReactNode;
  onClose: () => void;
  seconds?: number;
}) {
  useEffect(() => {
    if (!seconds) return;
    const timer = window.setTimeout(onClose, seconds * 1000);
    return () => window.clearTimeout(timer);
  }, [seconds, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="toast-in fixed inset-x-3 bottom-4 z-40 mx-auto flex max-w-md items-start gap-3 rounded-2xl border border-line bg-fg p-4 text-bg shadow-2xl sm:bottom-6"
      style={{ marginBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex-1 text-sm leading-relaxed">{message}</div>
      <button
        type="button"
        onClick={onClose}
        className="grid size-11 shrink-0 place-items-center rounded-full bg-bg/15 hover:bg-bg/25"
      >
        <span aria-hidden className="text-lg leading-none">×</span>
        <span className="sr-only">סגירת ההודעה</span>
      </button>
    </div>
  );
}
