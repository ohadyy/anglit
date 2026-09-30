"use client";

import { useCallback, useSyncExternalStore } from "react";
import { THEME_KEY as KEY } from "./themeScript";

export type Theme = "light" | "ink";

function read(): Theme {
  return document.documentElement.dataset.theme === "ink" ? "ink" : "light";
}

function subscribe(onChange: () => void) {
  const mo = new MutationObserver(onChange);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}

export function useTheme() {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const setTheme = useCallback((t: Theme) => {
    document.documentElement.dataset.theme = t;
    try {
      localStorage.setItem(KEY, t);
    } catch {}
  }, []);
  const toggle = useCallback(() => setTheme(read() === "ink" ? "light" : "ink"), [setTheme]);
  return { theme, setTheme, toggle };
}
