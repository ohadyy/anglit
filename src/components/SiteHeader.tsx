"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Wordmark } from "@/components/Logo";
import { ScrambleLink } from "@/components/ScrambleLink";
import { ThemeToggle } from "@/components/ThemeToggle";
import { site } from "@/lib/site";
import { useSession } from "@/lib/auth-client";
import { isFocusedPage } from "@/lib/chrome";
import { HEADER_LINKS, PAGE } from "@/lib/nav";
import { useModalLock } from "@/lib/useModalLock";

const INSTAGRAM = { href: site.instagramUrl, label: "אינסטגרם" };

export function SiteHeader() {
  const pathname = usePathname();
  // The menu belongs to the page it was opened on, so navigating (back/forward included) closes it
  const [openAt, setOpenAt] = useState<string | null>(null);
  const open = openAt === pathname;
  const setOpen = (v: boolean) => setOpenAt(v ? pathname : null);
  const { data: session } = useSession();
  const focused = isFocusedPage(pathname);

  useModalLock(open, () => setOpenAt(null));

  // The phone menu does not exist from the sm breakpoint up (rotation, resize), so it must not stay open and lock scrolling
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    const close = () => mq.matches && setOpenAt(null);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  return (
    // Flush to the top edge: a gap above the header would let scrolled content show over it.
    // No entry animation: the 8px rise left a strip of page background above the header on every load.
    // The safe-area padding keeps it clear of a notch when the site runs as a home-screen app.
    <header
      className="fixed inset-x-0 top-0 z-(--z-bar) border-b border-line bg-bg/90 backdrop-blur-md"
      style={{ paddingTop: "env(safe-area-inset-top)" }}
    >
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-2.5 sm:px-5">
        {focused ? (
          <Wordmark className="h-6 w-auto" />
        ) : (
          <Link href="/" aria-label="לעמוד הבית" className="flex min-h-11 items-center">
            <Wordmark className="h-6 w-auto" />
          </Link>
        )}

        {!focused && <nav className="hidden items-center gap-1 text-sm font-medium sm:flex">
          {HEADER_LINKS.map((l) => (
            <ScrambleLink key={l.href} href={l.href} label={l.label} />
          ))}
          <ScrambleLink href={INSTAGRAM.href} label={INSTAGRAM.label} external />
        </nav>}

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {!focused && <><Link href={session ? PAGE.account.path : PAGE.start.path} className="flex min-h-11 items-center rounded-full bg-fg px-4 text-sm font-medium text-bg sm:hidden">
            {session ? "אזור אישי" : "תרגול חינם"}
          </Link>
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "סגירת התפריט" : "פתיחת התפריט"}
            onClick={() => setOpen(!open)}
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
        <nav id="mobile-menu" aria-label="תפריט" className="mx-auto flex max-w-3xl flex-col gap-1 border-t border-line bg-bg px-3 py-3 sm:hidden">
          {HEADER_LINKS.map((l) => (
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
            href={INSTAGRAM.href}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setOpen(false)}
            className="rounded-xl px-3 py-3 text-base font-medium hover:bg-fg/5"
          >
            {INSTAGRAM.label}
          </a>
        </nav>
      )}
    </header>
  );
}
