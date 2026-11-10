"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/**
 * True when the visitor asked for less motion: either the system setting, or the
 * "stop animations" switch of the accessibility panel (it puts data-still on <html>).
 * Every animation driven from JS asks this, so both switches stop it.
 */
export function prefersReducedMotion() {
  return window.matchMedia(QUERY).matches || document.documentElement.hasAttribute("data-still");
}

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-still"] });
  return () => {
    mq.removeEventListener("change", onChange);
    mo.disconnect();
  };
}

export function useReducedMotion() {
  return useSyncExternalStore(subscribe, prefersReducedMotion, () => false);
}
