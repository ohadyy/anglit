"use client";

import { useEffect, useState } from "react";
import { LogoTraceLoader } from "@/components/LogoTraceLoader";
import { STORAGE_KEYS } from "@/lib/storageKeys";
import { getItem, setItem } from "@/lib/safeStorage";

const SEEN_KEY = STORAGE_KEYS.introSeen;

// ~1.35s end to end (was ~2s): same animation, shorter steps, so the page shows sooner
const MIN_LOOP_MS = 500;
const FADE_MS = 200;

// A short logo-trace splash on first visit this tab session only — repeat
// visits (back button, re-navigation) skip straight to the page. The overlay is part of
// the server HTML, so it covers the page from the very first paint; for repeat visits
// introScript (layout) hides it via CSS before paint.
export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (getItem(SEEN_KEY, "session") === "1") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once on mount, gated by sessionStorage
      setMounted(false);
      return;
    }
    // The session flag is only written once the loader actually finished its
    // minimum run, not here — so a dev StrictMode double-invoke (which mounts,
    // cleans up, and remounts this effect) can't skip the real timer.
    const t = setTimeout(() => {
      setLoading(false);
      setItem(SEEN_KEY, "1", "session");
    }, MIN_LOOP_MS);
    return () => clearTimeout(t);
  }, []);

  function handleDone() {
    setVisible(false);
    setTimeout(() => setMounted(false), FADE_MS);
  }

  return (
    <>
      {mounted && (
        <div
          data-home-intro
          className="fixed inset-0 z-(--z-overlay) flex items-center justify-center bg-bg transition-opacity"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <LogoTraceLoader loading={loading} size={96} loopDurationSeconds={0.8} fillFadeSeconds={0.25} className="text-fg" onDone={handleDone} />
        </div>
      )}
      {children}
    </>
  );
}
