"use client";

import { useEffect, useState } from "react";

/**
 * useState that persists to localStorage. Loads after mount (so server and
 * client render the same markup) and fails silently where storage is blocked.
 */
export function useStored<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- hydrate from storage once
      if (raw) setValue({ ...initial, ...JSON.parse(raw) });
    } catch {}
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {}
  }, [key, value, loaded]);

  const reset = () => {
    try {
      localStorage.removeItem(key);
    } catch {}
    setValue(initial);
  };

  return [value, setValue, reset] as const;
}
