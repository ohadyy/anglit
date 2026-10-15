"use client";

import { useEffect, useState } from "react";
import { LogoTraceLoader } from "@/components/LogoTraceLoader";

const SEEN_KEY = "anglit-intro-seen";
const MIN_LOOP_MS = 1200;
const FADE_MS = 300;

// A short logo-trace splash on first visit this tab session only — repeat
// visits (back button, re-navigation) skip straight to the page.
export function HomeIntro({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}
    if (seen) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- runs once on mount, gated by sessionStorage above
    setShow(true);
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

  if (!show) return <>{children}</>;

  return (
    <>
      {mounted && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-bg transition-opacity"
          style={{ opacity: visible ? 1 : 0, transitionDuration: `${FADE_MS}ms` }}
        >
          <LogoTraceLoader loading={loading} size={96} className="text-fg" onDone={handleDone} />
        </div>
      )}
      {children}
    </>
  );
}
