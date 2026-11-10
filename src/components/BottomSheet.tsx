"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useModalLock } from "@/lib/useModalLock";

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
  const sheetRef = useRef<HTMLElement>(null);
  useModalLock(open, onClose, sheetRef);

  useEffect(() => {
    if (open) closeRef.current?.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-(--z-modal)">
      <button type="button" aria-label="סגירה" tabIndex={-1} onClick={onClose} className="fade-in absolute inset-0 bg-fg/40" />
      <section
        ref={sheetRef}
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
