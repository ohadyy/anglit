"use client";

import Link from "next/link";

// Shown when a page crashes, instead of Next's default English error screen
export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="mx-auto flex min-h-[60dvh] max-w-md flex-col items-center justify-center gap-5 px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold">משהו השתבש</h1>
      <p className="leading-relaxed opacity-80">אפשר לנסות שוב, או לחזור לעמוד הבית.</p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={reset}
          className="rounded-full bg-fg px-6 py-3 font-semibold text-bg"
        >
          נסו שוב
        </button>
        <Link href="/" className="rounded-full border border-fg/25 px-6 py-3 font-semibold hover:bg-fg/5">
          לדף הבית
        </Link>
      </div>
    </main>
  );
}
