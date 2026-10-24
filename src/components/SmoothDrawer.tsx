"use client";

/**
 * Smooth Drawer, from Kokonut UI (https://kokonutui.com), by @dorianbaffier. MIT license.
 * Adapted for Anglit: Hebrew, brand colours, an order summary with included / not-included lines
 * in place of the shop items, delivery and tax (the course has none), the sheet's own Vaul parts
 * in place of the shadcn wrappers, and an opening element passed in. The snap and drag logic is unchanged.
 */

import { type ReactNode, type PointerEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Drawer } from "vaul";

export interface SmoothDrawerProps {
  title: string;
  /** Line under the title, e.g. what the order is for. */
  description?: string;
  /** The price, already formatted, shown top end of the sheet. */
  total: string;
  totalLabel?: string;
  included: string[];
  excluded?: string[];
  /** Small line under the lists, e.g. "back to full price next cohort". */
  note?: string;
  /** The element that opens the sheet. */
  trigger: ReactNode;
  confirmLabel: string;
  detailsLabel: string;
  hideDetailsLabel: string;
  closeLabel: string;
  /** Called when the main button is pressed; the sheet closes afterwards. */
  onConfirm?: () => void;
  /** Controlled open state, for opening the sheet from outside (e.g. a swipe on the bar). */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Visible height of the sheet at its first snap point. */
const PEEK_HEIGHT = 200;
/** Tallest the sheet gets, and the gap it keeps from the top of the screen. */
const MAX_SHEET_HEIGHT = 680;
const TOP_GAP = 24;

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export default function SmoothDrawer({
  title,
  description,
  total,
  totalLabel = "סך הכול",
  included,
  excluded = [],
  note,
  trigger,
  confirmLabel,
  detailsLabel,
  hideDetailsLabel,
  closeLabel,
  onConfirm,
  open,
  onOpenChange,
}: SmoothDrawerProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = open ?? internalOpen;
  const [expanded, setExpanded] = useState(false);
  const [viewportHeight, setViewportHeight] = useState(0);
  const detailsRef = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  useEffect(() => {
    const measure = () => setViewportHeight(window.innerHeight);
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Vaul measures snap points from the top of the window, so the sheet is
  // given an explicit height and the peek point is offset by the gap above it.
  const sheetHeight = Math.max(PEEK_HEIGHT, Math.min(MAX_SHEET_HEIGHT, viewportHeight - TOP_GAP));
  const snapPoints = useMemo(
    () => [`${PEEK_HEIGHT + Math.max(0, viewportHeight - sheetHeight)}px`, 1],
    [viewportHeight, sheetHeight],
  );

  const handleOpenChange = (next: boolean) => {
    if (open === undefined) {
      setInternalOpen(next);
    }
    if (next) {
      setExpanded(false);
    }
    onOpenChange?.(next);
  };

  const clearDragStyles = useCallback(() => {
    cancelAnimationFrame(frame.current);
    const details = detailsRef.current;
    if (details) {
      details.style.transition = "";
      details.style.opacity = "";
      details.style.translate = "";
    }
  }, []);

  // Hand the details back to their class-driven transition.
  const setSnap = (next: boolean) => {
    clearDragStyles();
    setExpanded(next);
  };

  // While Vaul drags the sheet, the details track its position directly.
  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const sheet = event.currentTarget;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      const details = detailsRef.current;
      if (!(details && sheet.classList.contains("vaul-dragging"))) {
        return;
      }
      const peekTop = window.innerHeight - PEEK_HEIGHT;
      const fullTop = window.innerHeight - sheetHeight;
      const top = sheet.getBoundingClientRect().top;
      const progress = clamp01((peekTop - top) / (peekTop - fullTop || 1));
      details.style.transition = "none";
      details.style.opacity = String(progress);
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      details.style.translate = reduceMotion ? "" : `0 ${Math.round((1 - progress) * 12)}px`;
    });
  };

  const handleConfirm = () => {
    onConfirm?.();
    handleOpenChange(false);
  };

  return (
    <Drawer.Root
      activeSnapPoint={snapPoints[expanded ? 1 : 0]}
      fadeFromIndex={0}
      onOpenChange={handleOpenChange}
      open={isOpen}
      setActiveSnapPoint={(point) => setSnap(point === 1)}
      snapPoints={snapPoints}
    >
      <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-40 bg-fg/40" />
        <Drawer.Content
          className="fixed inset-x-0 bottom-0 z-50 mx-auto flex w-full max-w-[420px] flex-col rounded-t-3xl border border-b-0 border-line bg-bg text-fg outline-none"
          onPointerCancel={clearDragStyles}
          onPointerMove={handlePointerMove}
          onPointerUp={clearDragStyles}
          style={{ height: sheetHeight }}
        >
          <div className="flex h-full flex-col">
            <div aria-hidden="true" className="flex h-6 shrink-0 items-center justify-center">
              <span className="h-1 w-9 rounded-full bg-fg/20" />
            </div>

            <div className="shrink-0 px-5 pt-1">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Drawer.Title className="font-display text-[17px] font-bold tracking-tight">{title}</Drawer.Title>
                  <Drawer.Description className="mt-0.5 text-[13px] opacity-70">{description ?? title}</Drawer.Description>
                </div>
                <div className="shrink-0 text-end">
                  <p className="text-[13px] opacity-70">{totalLabel}</p>
                  <p className="mt-0.5 text-xl font-bold leading-6 tabular-nums">{total}</p>
                </div>
              </div>

              <button
                className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-fg font-semibold text-bg outline-none transition-colors duration-150 ease-out hover:bg-ink-deep focus-visible:ring-2 focus-visible:ring-fg focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                onClick={handleConfirm}
                type="button"
              >
                {confirmLabel}
              </button>

              <button
                aria-expanded={expanded}
                className="mt-1 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg text-[13px] opacity-70 outline-none transition-opacity duration-150 hover:opacity-100 focus-visible:ring-2 focus-visible:ring-fg"
                onClick={() => setSnap(!expanded)}
                type="button"
              >
                {expanded ? hideDetailsLabel : detailsLabel}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 20 20"
                  fill="none"
                  className={`size-3.5 transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:transition-none ${expanded ? "rotate-180" : ""}`}
                >
                  <path d="M5 12.5l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>

            <div
              className={`min-h-0 flex-1 px-5 pb-6 transition-[opacity,translate] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] motion-reduce:translate-y-0 ${
                expanded ? "translate-y-0 touch-pan-y overflow-y-auto opacity-100" : "translate-y-3 touch-none overflow-hidden opacity-0"
              }`}
              inert={!expanded}
              ref={detailsRef}
            >
              <ul className="flex flex-col gap-2.5 border-t border-line pt-4 text-start">
                {included.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 size-5 shrink-0 text-ok">
                      <path d="M4 10.5l3.5 3.5L16 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm leading-snug opacity-90">{f}</span>
                  </li>
                ))}
                {excluded.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 opacity-70">
                    <svg viewBox="0 0 20 20" fill="none" className="mt-0.5 size-5 shrink-0">
                      <path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    <span className="text-sm leading-snug">{f}</span>
                  </li>
                ))}
              </ul>
              {note && <p className="mt-4 text-[13px] opacity-70">{note}</p>}
              <Drawer.Close className="mt-5 flex min-h-11 w-full items-center justify-center text-sm underline underline-offset-4 opacity-70">
                {closeLabel}
              </Drawer.Close>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
