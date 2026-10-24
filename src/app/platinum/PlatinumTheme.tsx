"use client";

import { useLayoutEffect } from "react";

// Switches the whole document (overscroll, scrollbars, the area behind the page) to the Platinum
// theme while a Platinum page is open, and puts back whatever theme the visitor had when they leave.
// Never saved to localStorage, so it can't stick as their own choice.
export function PlatinumTheme() {
  useLayoutEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.theme;
    root.dataset.theme = "platinum";
    return () => {
      root.dataset.theme = previous ?? "light";
    };
  }, []);
  return null;
}
