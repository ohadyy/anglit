"use client";

import { useState } from "react";
import { signIn } from "@/lib/auth-client";

// New and returning Google users both land on /complete-profile, which sends
// anyone who already has a phone straight on to `next`.
export function GoogleButton({ next }: { next: string }) {
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await signIn.social({
      provider: "google",
      callbackURL: `/complete-profile?next=${encodeURIComponent(next)}`,
      errorCallbackURL: "/sign-in",
    });
    setLoading(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        disabled={loading}
        className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 rounded-full border border-line bg-white px-6 py-3.5 font-semibold disabled:opacity-50"
      >
        <svg aria-hidden="true" viewBox="0 0 48 48" className="size-5">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.9 2.4 30.4 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.9 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        {loading ? "מעביר לגוגל..." : "המשך עם Google"}
      </button>
      <p className="mt-5 text-center text-xs opacity-60">או עם טלפון</p>
    </>
  );
}
