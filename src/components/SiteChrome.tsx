"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteDecor } from "@/components/SiteDecor";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";
import { MobileTabBar } from "@/components/MobileTabBar";

// Internal tools keep their own chrome. The homepage hero runs under the header.
const OWN_CHROME = ["/studio", "/review", "/content"];
const FULL_BLEED = ["/"];
// Focused pages: practice and exam sessions have their own bottom bar or a timer, the campaign
// landing pages have one call to action, and the sign-in / sign-up / checkout forms need full attention.
// The homepage is its own full-bleed hero with its own CTAs — the tab bar has no room to sit well there.
const NO_TAB_BAR = ["/practice", "/exam", "/ads", "/bio", "/sign-in", "/sign-up", "/checkout", "/start", "/diploactjoin"];

function hasTabBar(path: string) {
  if (path === "/") return false;
  return !NO_TAB_BAR.some((p) => path === p || path.startsWith(`${p}/`));
}

// Each page gets one of three decoration variants, chosen by its path, so neighbouring pages differ slightly
function variantFor(path: string) {
  let sum = 0;
  for (const ch of path) sum += ch.charCodeAt(0);
  return sum % 3;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (OWN_CHROME.includes(path)) return <>{children}</>;

  return (
    <>
      <SiteDecor variant={variantFor(path)} />
      <SiteHeader />
      {FULL_BLEED.includes(path) ? children : <div className="flex flex-1 flex-col pt-24">{children}</div>}
      <SiteFooter />
      {hasTabBar(path) && <MobileTabBar />}
      <AccessibilityWidget />
    </>
  );
}
