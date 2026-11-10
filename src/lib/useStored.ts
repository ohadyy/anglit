"use client";

import { useEffect, useState } from "react";
import { getJson, removeItem, setItem } from "./safeStorage";

const isObject = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null && !Array.isArray(v);

/** Objects are merged over `initial` (new fields keep their defaults); anything else is used as stored
 * only when it has the same kind as `initial`, so a damaged value falls back to the default. */
function fromStored<T>(initial: T, parsed: unknown): T {
  if (isObject(initial)) return isObject(parsed) ? ({ ...initial, ...parsed } as T) : initial;
  if (Array.isArray(initial)) return Array.isArray(parsed) ? (parsed as T) : initial;
  return typeof parsed === typeof initial ? (parsed as T) : initial;
}

/**
 * useState that persists to localStorage. Loads after mount (so server and
 * client render the same markup) and fails silently where storage is blocked.
 */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = getJson(key);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
    if (stored !== undefined) setValue(fromStored(initial, stored));
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    setItem(key, JSON.stringify(value));
  }, [key, value, loaded]);

  const reset = () => {
    removeItem(key);
    setValue(initial);
  };

  return [value, setValue, reset] as const;
}
