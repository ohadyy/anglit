"use client";

import { useEffect, useRef, useState } from "react";

// The Anglit "A" mark, vectorized from public/brand/mark-dark.png (potrace, even-odd fill
// so the triangular counter stays a hole). One compound path serves both the traced
// outline and the filled logo.
const LOGO_VIEW_BOX = "0 0 938 896";
const LOGO_ASPECT = 896 / 938;

const LOGO_PATH =
  "M 197 17.842 L 197 35 202.340 35 C 205.277 35, 211.103 35.875, 215.287 36.945 C 252.498 46.463, 274.696 81.066, 305.451 177.500 C 310.807 194.295, 311.925 198.861, 311.034 200.301 C 310.421 201.291, 306.181 206.691, 301.611 212.301 C 222.320 309.634, 151.852 422.470, 94.819 543.425 C 35.436 669.363, 5.099 775.117, 0.491 872.250 L -0.161 886 191.420 886 C 296.789 886, 383 885.620, 383 885.155 C 383 884.690, 382.041 883.453, 380.870 882.405 C 379.698 881.357, 375.045 876, 370.529 870.500 C 324.812 814.818, 286.563 744.428, 260.629 668.250 L 254.075 649 350.569 649 C 441.572 649, 447.097 649.100, 447.665 650.750 C 468.320 710.800, 501.785 766.275, 542.431 807.843 C 589.377 855.854, 640.780 883.360, 701 892.693 C 717.018 895.176, 756.488 895.151, 773.500 892.648 C 840.054 882.856, 895.895 852.028, 931.659 805.335 L 937.244 798.043 926.499 786.522 C 920.589 780.185, 915.414 775, 914.999 775 C 914.584 775, 913.627 775.753, 912.872 776.673 C 907.016 783.814, 889.414 794.823, 877.389 798.865 C 839.523 811.593, 799.447 790.069, 778.030 745.500 C 758.183 704.201, 737.687 640.475, 701.481 507.500 C 643.815 295.712, 627.979 251.744, 587.487 191 C 559.601 149.168, 519.018 108.030, 478.285 80.307 C 405.372 30.681, 318.527 4.300, 218.250 1.316 L 197 0.683 197 17.842 M 305.272 262.250 C 267.426 315.164, 256.751 334.311, 245.200 370 C 223.054 438.423, 222.888 523.969, 244.733 610.500 L 246.500 617.500 341.636 617.755 L 436.772 618.010 433.847 608.755 C 415.227 549.846, 406.288 519.630, 372.678 402 C 341.615 293.282, 325.007 237, 323.988 237 C 323.627 237, 315.204 248.363, 305.272 262.250";

type Phase = "loop" | "closingOutline" | "fadingFill" | "done";

export function LogoTraceLoader({
  loading = true,
  size = 96,
  strokeWidth = 14,
  loopDurationSeconds = 1.6,
  fillFadeSeconds = 0.5,
  className = "",
  ariaLabel = "טוען",
  onDone,
}: {
  loading?: boolean;
  size?: number;
  strokeWidth?: number;
  loopDurationSeconds?: number;
  fillFadeSeconds?: number;
  className?: string;
  ariaLabel?: string;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState<Phase>("loop");
  const doneCalledRef = useRef(false);

  const callDone = () => {
    if (doneCalledRef.current) return;
    doneCalledRef.current = true;
    onDone?.();
  };

  // Reduced motion: skip straight to the finished mark.
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reads a platform API once on mount
      setPhase("done");
      callDone();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- read once on mount
  }, []);

  // Loading finished: close the outline, then fade in the fill. Timed with
  // plain setTimeout, so it never depends only on an animation callback firing.
  useEffect(() => {
    if (loading || phase === "done" || doneCalledRef.current) return;
    setPhase("closingOutline");
    const closeMs = (loopDurationSeconds * 500) | 0;
    const toFill = setTimeout(() => setPhase("fadingFill"), closeMs);
    const toDone = setTimeout(() => {
      setPhase("done");
      callDone();
    }, closeMs + fillFadeSeconds * 1000);
    return () => {
      clearTimeout(toFill);
      clearTimeout(toDone);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-run only when loading flips
  }, [loading]);

  const height = Math.round(size * LOGO_ASPECT);

  return (
    <svg
      role="status"
      aria-label={ariaLabel}
      viewBox={LOGO_VIEW_BOX}
      width={size}
      height={height}
      className={className}
    >
      <g opacity="0.18">
        <path d={LOGO_PATH} fill="none" stroke="currentColor" strokeWidth={Math.max(1, strokeWidth / 2)} />
      </g>

      {phase === "loop" && (
        <path
          d={LOGO_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="0.16 0.84"
          style={{ animation: `logo-trace-loader-loop ${loopDurationSeconds}s linear infinite` }}
        />
      )}

      {phase === "closingOutline" && (
        <path
          d={LOGO_PATH}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray="1 0"
          style={{
            animation: `logo-trace-loader-close ${loopDurationSeconds / 2}s cubic-bezier(0.22,1,0.36,1) both`,
          }}
        />
      )}

      {(phase === "fadingFill" || phase === "done") && (
        <path
          d={LOGO_PATH}
          fill="currentColor"
          fillRule="evenodd"
          style={phase === "fadingFill" ? { animation: `logo-trace-loader-fill ${fillFadeSeconds}s ease-out both` } : undefined}
        />
      )}
    </svg>
  );
}
