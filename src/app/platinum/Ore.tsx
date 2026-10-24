import type { PlatinumTone } from "@/content/examTests";

// Each test has its own gem; gold is nudged from orange toward yellow. The platinum one is the blue gem with the color taken out, so it reads as silver.
const FILTER: Partial<Record<PlatinumTone, string>> = {
  gold: "hue-rotate(14deg) saturate(0.9)",
  platinum: "grayscale(1) brightness(1.25) contrast(0.95)",
};

export function Ore({ tone, className = "size-12" }: { tone: PlatinumTone; className?: string }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small decorative SVG, nothing to optimize
    <img src={`/brand/ores/${tone}.svg`} alt="" className={`object-contain ${className}`} style={{ filter: FILTER[tone] }} />
  );
}
