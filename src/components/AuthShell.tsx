import type { ReactNode } from "react";

// Shared frame for sign-in and sign-up: a centered card. Shapes come from the brand
// graphics kit.
export function AuthShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex flex-1 flex-col overflow-hidden">
      {/* The site header (logo, links) is already rendered by SiteChrome, so no second header here */}
      <main className="relative flex flex-1 items-center justify-center px-4 pb-16">
        {/* Decorative shapes, aria-hidden and not interactive */}
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute end-[14%] top-[18%] hidden size-10 text-fg md:block">
          <path fill="currentColor" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" d="M40 4H60V36H96V64H60V96H40V64H4V36H40Z" />
        </svg>
        <svg aria-hidden viewBox="0 0 100 100" className="pointer-events-none absolute start-[16%] bottom-[16%] hidden size-16 text-fg md:block">
          <path d="M12 88A40 40 0 0 1 88 88" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
        </svg>
        <svg aria-hidden viewBox="0 0 120 24" className="pointer-events-none absolute end-[12%] bottom-[22%] hidden w-28 text-marker md:block">
          <path d="M2 16c10-10 20-10 30 0s20 10 30 0 20-10 30 0 20 10 26 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>

        <div className="relative z-10 w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
