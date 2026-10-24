"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { TactileButton } from "@/components/TactileButton";

// A press-and-hold confirm button: a fill grows across the face and the action fires only
// when the fill is full. Keeps the tactile look of TactileButton. Inspired by Kokonut UI's Hold Button.
export function HoldButton({
  onComplete,
  holdMs = 600,
  size,
  fullWidth,
  className,
  children,
}: {
  onComplete: () => void;
  holdMs?: number;
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
}) {
  const [holding, setHolding] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function start() {
    if (timer.current) return;
    setHolding(true);
    timer.current = setTimeout(() => {
      timer.current = null;
      setHolding(false);
      onComplete();
    }, holdMs);
  }

  function cancel() {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    setHolding(false);
  }

  useEffect(() => cancel, []);

  return (
    <TactileButton
      size={size}
      fullWidth={fullWidth}
      className={`touch-none ${className ?? ""}`}
      onPointerDown={start}
      onPointerUp={cancel}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onContextMenu={(e) => e.preventDefault()}
      // Keyboard: hold Enter or Space, same as a pointer
      onKeyDown={(e) => {
        if (e.key !== "Enter" && e.key !== " ") return;
        e.preventDefault();
        if (!e.repeat) start();
      }}
      onKeyUp={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cancel();
        }
      }}
      onBlur={cancel}
      // Screen readers activate with a click that has no pointer (detail 0): no hold possible, so it confirms directly
      onClick={(e) => {
        if (e.detail === 0) onComplete();
      }}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
        <span
          className="absolute inset-y-0 start-0 bg-white/25 ease-linear"
          style={{ width: holding ? "100%" : "0%", transitionProperty: "width", transitionDuration: holding ? `${holdMs}ms` : "150ms" }}
        />
      </span>
      <span className="relative">{children}</span>
    </TactileButton>
  );
}
