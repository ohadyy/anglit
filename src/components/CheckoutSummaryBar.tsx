"use client";

import { useState } from "react";
import SmoothDrawer from "@/components/SmoothDrawer";

// Phone-only order summary: a bar pinned to the bottom with the product and price, which opens the
// Smooth Drawer (a sheet that peeks, then expands to the full list). Keeps the payment steps at the
// top of the screen instead of under a tall card.
export function CheckoutSummaryBar({
  name,
  price,
  note,
  included,
  excluded,
}: {
  name: string;
  price: string;
  note?: string;
  included: string[];
  excluded: string[];
}) {
  const [open, setOpen] = useState(false);
  // A swipe up on the bar opens the sheet, so it can be pulled up like a drawer and not only tapped
  const startSwipe = (startY: number) => {
    let swiped = false;
    const move = (e: PointerEvent) => {
      if (startY - e.clientY > 24) swiped = true;
    };
    // Opens when the finger lifts, so the same gesture can't count as a tap outside the new sheet and close it
    const end = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", end);
      window.removeEventListener("pointercancel", end);
      if (swiped) setOpen(true);
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", end);
    window.addEventListener("pointercancel", end);
  };
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-30 touch-none border-t border-line bg-bg/95 backdrop-blur lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      onPointerDown={(e) => startSwipe(e.clientY)}
    >
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
        <div className="min-w-0">
          <p className="truncate text-sm opacity-70">{name}</p>
          <p className="text-2xl font-bold tabular-nums">{price} ₪</p>
        </div>
        <SmoothDrawer
          title={name}
          description={note}
          total={`${price} ₪`}
          included={included}
          excluded={excluded}
          note={note}
          confirmLabel="להמשך לתשלום"
          detailsLabel="מה כלול בהזמנה"
          hideDetailsLabel="להסתיר פרטים"
          closeLabel="סגירה"
          open={open}
          onOpenChange={setOpen}
          trigger={
            <button
              type="button"
              aria-haspopup="dialog"
              className="flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-fg/25 px-5 font-semibold hover:bg-fg/5"
            >
              מה כלול בהזמנה
              <svg aria-hidden viewBox="0 0 20 20" fill="none" className="size-4">
                <path d="M5 12.5l5-5 5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          }
        />
      </div>
    </div>
  );
}
