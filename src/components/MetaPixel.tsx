"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useSyncExternalStore } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const KEY = "anglit-consent";

type Fbq = (...args: unknown[]) => void;
type Consent = "yes" | "no" | "unknown" | null;

const listeners = new Set<() => void>();
const subscribe = (fn: () => void) => {
  listeners.add(fn);
  return () => void listeners.delete(fn);
};

// Fires a browser pixel event. eventId must match the one sent to the Conversions API.
export function trackMeta(name: "Lead" | "Purchase", eventId: string, params?: Record<string, unknown>) {
  (window as unknown as { fbq?: Fbq }).fbq?.("track", name, params ?? {}, { eventID: eventId });
}

function readConsent(): Consent {
  try {
    const v = localStorage.getItem(KEY);
    return v === "yes" || v === "no" ? v : null;
  } catch {
    return null;
  }
}

// Loads the pixel only after the visitor agrees, and shows a one-line banner until they answer. Renders nothing
// until NEXT_PUBLIC_META_PIXEL_ID is set. The choice is also written to a cookie so the server-side Lead event
// (src/lib/meta.ts) respects it.
export function MetaPixel() {
  // "unknown" on the server and during hydration, so the banner never flashes for someone who already answered
  const consent = useSyncExternalStore(subscribe, readConsent, (): Consent => "unknown");

  if (!PIXEL_ID) return null;

  function answer(v: "yes" | "no") {
    try {
      localStorage.setItem(KEY, v);
    } catch {}
    document.cookie = `${KEY}=${v}; path=/; max-age=31536000; samesite=lax`;
    listeners.forEach((fn) => fn());
  }

  return (
    <>
      {consent === "yes" && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${PIXEL_ID}');fbq('track','PageView');`}
        </Script>
      )}
      {consent === null && (
        <div
          role="region"
          aria-label="עוגיות ומדידה"
          className="fixed inset-x-3 bottom-24 z-40 mx-auto flex max-w-md flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-2xl border border-line bg-bg/95 p-3 text-sm shadow-lg backdrop-blur lg:bottom-4"
        >
          <p className="min-w-0 flex-1 basis-48 leading-snug">
            אנחנו משתמשים בעוגיות כדי להבין איך משתמשים באתר ולמדוד את הפרסום שלנו.{" "}
            <Link href="/legal/privacy" className="underline">
              פרטים
            </Link>
          </p>
          <div className="flex shrink-0 gap-2">
            <button type="button" onClick={() => answer("no")} className="min-h-11 rounded-full px-4 font-medium opacity-70">
              לא, תודה
            </button>
            <button type="button" onClick={() => answer("yes")} className="min-h-11 rounded-full bg-fg px-5 font-semibold text-bg">
              מאשר/ת
            </button>
          </div>
        </div>
      )}
    </>
  );
}

// Drop into a server page to fire one event once it has loaded (e.g. Purchase on the thank-you page)
export function MetaEvent({ name, eventId, params }: { name: "Lead" | "Purchase"; eventId: string; params?: Record<string, unknown> }) {
  useEffect(() => {
    // fbq only exists after consent and after the script loads, so wait for it instead of racing it
    const t = setInterval(() => {
      if ((window as unknown as { fbq?: Fbq }).fbq) {
        trackMeta(name, eventId, params);
        clearInterval(t);
      }
    }, 300);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
