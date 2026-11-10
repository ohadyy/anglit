"use client";

import { usePathname } from "next/navigation";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteDecor } from "@/components/SiteDecor";
import { AccessibilityWidget } from "@/components/AccessibilityWidget";
import { MobileTabBar } from "@/components/MobileTabBar";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { hasFab, hasTabBar, isFullBleed, isOwnChrome } from "@/lib/chrome";

// Each page gets one of three decoration variants, chosen by its path, so neighbouring pages differ slightly
function variantFor(path: string) {
  let sum = 0;
  for (const ch of path) sum += ch.charCodeAt(0);
  return sum % 3;
}

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  if (isOwnChrome(path)) return <>{children}</>;
  const tabBar = hasTabBar(path);
  return (
    <>
      <SiteDecor variant={variantFor(path)} />
      <SiteHeader />
      {isFullBleed(path) ? children : <div className="flex min-h-dvh flex-1 flex-col pt-24">{children}</div>}
      <SiteFooter />
      {tabBar && <MobileTabBar />}
      <AccessibilityWidget aboveTabBar={tabBar} />
      {hasFab(path) && <WhatsAppFab aboveTabBar={tabBar} />}
    </>
  );
}
