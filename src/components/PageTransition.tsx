"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

gsap.registerPlugin(DrawSVGPlugin);

// A squiggly brand-navy line draws itself and thickens into a full-screen cover
// on navigation, then undraws once the new page has actually rendered.
//
// Deliberately does NOT wrap, intercept, or call Next's router: it never calls
// preventDefault, never touches router.push, never delays a click. It only
// *watches* — a capture-phase click listener starts the cover animation
// optimistically (cosmetic only), and usePathname's own change is what starts
// the reveal, which only fires after Next has already completed real
// navigation. If a click doesn't match a normal in-app link, or the pathname
// never changes (redirect, cancelled navigation, same-page link), the only
// consequence is the animation doesn't play — Next's own navigation is
// completely unaffected either way. A timeout guarantees the overlay can
// never get stuck covering the site.
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  // "idle" -> "covering" (leave anim playing) -> "covered" (fully covered, waiting
  // for the new route) -> "revealing" (enter anim playing) -> back to "idle".
  // Prefetched routes often swap the pathname in a few ms — far faster than the
  // ~1.5s cover animation — so the reveal must wait for "covered", never start
  // mid-cover, or the two tweens fight over the same properties and nothing is
  // visibly shown at all (what caused the "no animation" report).
  const stageRef = useRef<"idle" | "covering" | "covered" | "revealing">("idle");
  const pendingRevealRef = useRef(false);
  const safetyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPathname = useRef(pathname);

  useEffect(() => {
    if (pathRef.current) gsap.set(pathRef.current, { drawSVG: "0%", strokeWidth: 2 });
  }, []);

  function reveal() {
    stageRef.current = "revealing";
    if (safetyTimer.current) {
      clearTimeout(safetyTimer.current);
      safetyTimer.current = null;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(overlayRef.current, { opacity: 0 });
      stageRef.current = "idle";
      return;
    }
    // Just fade out: the solid overlay already covers the screen, so re-animating
    // the squiggle here only reads as a second sweep — one pass is enough.
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.4,
      ease: "power2.inOut",
      onComplete: () => {
        gsap.set(pathRef.current, { drawSVG: "0%", strokeWidth: 2 });
        stageRef.current = "idle";
      },
    });
  }

  // The route changed underneath the overlay. Only start revealing once the cover
  // animation has actually finished — if it's still mid-flight, flag it and let the
  // cover's own onComplete (below) trigger the reveal instead.
  useEffect(() => {
    if (prevPathname.current === pathname) return;
    prevPathname.current = pathname;
    if (stageRef.current === "idle") return; // no cover was ever started for this nav
    if (stageRef.current === "covering") {
      pendingRevealRef.current = true;
      return;
    }
    if (stageRef.current === "covered") reveal();
  }, [pathname]);

  // Start the cover purely as a cosmetic guess, on a listener that never calls
  // preventDefault — the link's own default navigation always proceeds untouched.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      // Not checking event.defaultPrevented: Next's own <Link> always calls
      // preventDefault() as part of its normal client-side navigation (it runs its
      // own onClick before this bubble-phase listener), so that flag is already
      // true for every real in-app navigation — checking it would skip all of them.
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

      const el = event.target as HTMLElement | null;
      const link = el?.closest("a[href]") as HTMLAnchorElement | null;
      if (!link || link.target === "_blank" || link.hasAttribute("download") || link.rel === "external") return;
      if (link.dataset.transitionIgnore !== undefined) return;

      let url: URL;
      try {
        url = new URL(link.href, window.location.href);
      } catch {
        return;
      }
      if (url.origin !== window.location.origin) return;
      // Only between top-level sections (/, /practice, /account, ...), not between
      // sub-pages of the same section (e.g. /account -> /account/exams).
      const topSegment = (p: string) => p.split("/")[1] ?? "";
      if (topSegment(url.pathname) === topSegment(window.location.pathname)) return;

      // Entering Anglit Platinum paints the same transition in black and gold
      const toPlatinum = url.pathname === "/platinum" || url.pathname.startsWith("/platinum/");
      if (overlayRef.current) overlayRef.current.style.backgroundColor = toPlatinum ? "#0a0a0a" : "";
      pathRef.current?.setAttribute("stroke", toPlatinum ? "#c9a24b" : "#E4E4E4");

      stageRef.current = "covering";
      pendingRevealRef.current = false;
      gsap.killTweensOf([overlayRef.current, pathRef.current]);
      gsap.set(pathRef.current, { drawSVG: "0%", strokeWidth: 2 });
      gsap
        .timeline({
          onComplete: () => {
            stageRef.current = "covered";
            // The route already changed while we were covering — reveal now.
            if (pendingRevealRef.current) reveal();
          },
        })
        .to(overlayRef.current, { opacity: 1, duration: 0.4, ease: "power2.inOut" })
        .to(pathRef.current, { drawSVG: "100%", strokeWidth: 300, duration: 1.1, ease: "power2.inOut" }, 0);

      if (safetyTimer.current) clearTimeout(safetyTimer.current);
      safetyTimer.current = setTimeout(() => {
        if (stageRef.current !== "idle") {
          gsap.killTweensOf([overlayRef.current, pathRef.current]);
          gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
          stageRef.current = "idle";
        }
      }, 4000);
    }

    document.addEventListener("click", onClick);
    return () => {
      document.removeEventListener("click", onClick);
      if (safetyTimer.current) clearTimeout(safetyTimer.current);
    };
  }, []);

  return (
    <>
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-ink opacity-0"
      >
        <svg
          width="100%"
          height="100%"
          viewBox="0 0 1316 664"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-full w-full scale-[1.3]"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            ref={pathRef}
            d="M13.4746 291.27C13.4746 291.27 100.646 -18.6724 255.617 16.8418C410.588 52.356 61.0296 431.197 233.017 546.326C431.659 679.299 444.494 21.0125 652.73 100.784C860.967 180.556 468.663 430.709 617.216 546.326C765.769 661.944 819.097 48.2722 988.501 120.156C1174.21 198.957 809.424 543.841 988.501 636.726C1189.37 740.915 1301.67 149.213 1301.67 149.213"
            stroke="#E4E4E4"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      {children}
    </>
  );
}
