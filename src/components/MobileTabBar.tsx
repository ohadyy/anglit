"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Bottom tab bar for phones (the common pattern from the app guide): the two main areas
// are always one thumb-tap away. Hidden from sm up, where the header nav does the job.
const tabs = [
  { href: "/practice", label: "תרגול", icon: <path d="M8 12.5l2.5 2.5L16 9.5" /> },
  { href: "/account", label: "אזור אישי", icon: <path d="M12 12a3.5 3.5 0 100-7 3.5 3.5 0 000 7zM5 20c1-3.5 3.8-5 7-5s6 1.5 7 5" /> },
];

export function MobileTabBar() {
  const path = usePathname();

  return (
    <nav aria-label="ניווט ראשי" className="fixed inset-x-3 bottom-3 z-30 sm:hidden">
      <ul
        className="mx-auto grid max-w-md grid-cols-2 gap-1 rounded-2xl border border-line bg-bg/90 p-1.5 shadow-[0_18px_40px_-20px_rgb(14_8_82/0.4)] backdrop-blur-md"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {tabs.map((t) => {
          const active = path === t.href || path.startsWith(`${t.href}/`);
          return (
            <li key={t.href}>
              <Link
                href={t.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-sm transition-[transform,background-color,color] duration-150 ease-out active:scale-[0.96] ${
                  active ? "bg-fg text-bg font-semibold" : "opacity-75 hover:bg-fg/5"
                }`}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  {t.icon}
                </svg>
                {t.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
