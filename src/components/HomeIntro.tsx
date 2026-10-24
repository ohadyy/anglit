"use client";

import { useEffect, useState } from "react";
import { LogoTraceLoader } from "@/components/LogoTraceLoader";

import { INTRO_SEEN_KEY as SEEN_KEY } from "@/lib/themeScript";

const MIN_LOOP_MS = 800;
const FADE_MS = 250;

// A short logo-trace splash on first visit this tab session only — repeat
// visits (back button, re-navigation) skip straight to the page. The overlay is part of
// the server HTML, so it covers the page from the very first paint; for repeat visits
// introScript (layout) hides it via CSS before paint.
export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once on mount, gated by sessionStorage
      setMounted(false);
      return;
    }
    // The session flag is only written once the loader actually finished its
    // minimum run, not here — so a dev StrictMode double-invoke (which mounts,
    // cleans up, and remounts this effect) can't skip the real timer.
    const t = setTimeout(() => {
      setLoading(false);
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg transition-opacity"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <LogoTraceLoader loading={loading} size={96} loopDurationSeconds={1.1} fillFadeSeconds={0.35} className="text-fg" onDone={handleDone} />
        </div>
      )}
      {children}
    </>
  );
}
