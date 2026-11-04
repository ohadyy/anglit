"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Minimal top bar for the calm area. The review page has its own header.
export function CalmTop() {
  const path = usePathname();
  if (path === "/calm/review") return null;
  const hub = path === "/calm";
  return (
    <div className="fixed inset-x-0 top-0 z-10 flex items-center justify-between px-5 py-4 text-sm">
      <Link href={hub ? "/" : "/calm"} className="inline-flex min-h-11 items-center opacity-70">
        {hub ? "→ לאתר" : "→ אנג'לה"}
      </Link>
      <span className="font-hand text-xl opacity-60">אנג&apos;לה</span>
    </div>
  );
}
