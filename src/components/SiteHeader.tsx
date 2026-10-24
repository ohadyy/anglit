"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Logo";
import { ScrambleLink } from "@/components/ScrambleLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/lib/site";

const links = [
  { href: "/practice", label: "תרגול" },
  { href: "/pricing", label: "מחיר" },
  { href: "/exam-dates", label: "מועדים" },
  { href: "/blog", label: "בלוג" },
  { href: "/account", label: "אזור אישי" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  // Paid-traffic landing page: nothing in the header may lead away from it
  const focused = usePathname() === "/ads";

  // Escape closes the mobile menu
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="enter fixed inset-x-0 top-4 z-30 mx-auto w-[calc(100%-2rem)] max-w-3xl rounded-2xl border border-line bg-bg/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
        {focused ? (
          <Wordmark className="h-6 w-auto" />
        ) : (
          <Link href="/" aria-label="לעמוד הבית" className="flex min-h-11 items-center">
            <Wordmark className="h-6 w-auto" />
          </Link>
        )}

        {!focused && <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          <ScrambleLink href="/practice" label="תרגול" />
          <ScrambleLink href="/pricing" label="מחיר" />
          <ScrambleLink href="/exam-dates" label="מועדים" />
          <ScrambleLink href="/blog" label="בלוג" />
          <ScrambleLink href="/account" label="אזור אישי" />
          <ScrambleLink href={site.instagramUrl} label="אינסטגרם" external />
        </nav>}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!focused && <><Link href="/start" className="flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg sm:hidden">
            תרגול חינם
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
            onClick={() => setOpen((o) => !o)}
            className="grid size-11 place-items-center rounded-full border border-line sm:hidden"
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button></>}
        </div>
      </div>

      {open && !focused && (
        <nav id="mobile-menu" aria-label="תפריט" className="flex flex-col gap-1 border-t border-line bg-bg px-3 py-3 sm:hidden">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-xl px-3 py-3 text-base font-medium hover:bg-fg/5"
            >
              {l.label}
            </Link>
          ))}
          <a
            href={site.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-base font-medium hover:bg-fg/5"
          >
            אינסטגרם
          </a>
        </nav>
      )}
    </header>
  );
}
