"use client";

import { useEffect, useRef, type ReactNode } from "react";

// A panel that slides up from the bottom of the phone screen, for details and confirmations.
// The page behind stays where it is; closing is by the button, the backdrop or Escape.
export function BottomSheet({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  // The latest close handler, so a parent that re-renders does not re-run the focus setup below
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    // Keep the page behind from scrolling while the sheet is open
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40">
      <button type="button" aria-label="סגירה" tabIndex={-1} onClick={onClose} className="fade-in absolute inset-0 bg-fg/40" />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="bottom-sheet-title"
        className="sheet-in absolute inset-x-0 bottom-0 max-h-[85dvh] overflow-y-auto rounded-t-3xl border-t border-line bg-bg p-6 pb-10 shadow-2xl sm:mx-auto sm:max-w-md sm:rounded-3xl sm:bottom-6 sm:border"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}
      >
        <div aria-hidden className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-fg/20 sm:hidden" />
        <div className="flex items-start justify-between gap-4">
          <h2 id="bottom-sheet-title" className="font-display text-xl font-bold">
            {title}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="grid size-11 shrink-0 place-items-center rounded-full border border-line hover:bg-fg/5"
          >
            <span aria-hidden className="text-xl leading-none">×</span>
            <span className="sr-only">סגירה</span>
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </section>
    </div>
  );
}
