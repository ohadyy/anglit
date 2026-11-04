import { AngelaDrawing } from "./AngelaDrawing";

// Soft hand-drawn shapes for the calm area: organic blobs, contour lines and ring stamps. They use the theme colors, so they follow light and ink.

const BLOB = "M40,-52C52,-44,60,-30,64,-14C68,2,68,20,59,33C50,46,32,54,14,61C-4,68,-22,74,-38,67C-54,60,-68,40,-70,21C-72,2,-62,-16,-50,-31C-38,-46,-24,-58,-6,-61C12,-64,28,-60,40,-52Z";

export function CalmBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-0 overflow-hidden text-fg">
      <svg viewBox="-100 -100 200 200" className="absolute -right-24 -top-20 w-80 opacity-[0.07]">
        <path d={BLOB} fill="currentColor" />
      </svg>
      <svg viewBox="-100 -100 200 200" className="absolute -bottom-28 -left-24 w-80 rotate-90 opacity-[0.06]">
        <path d={BLOB} fill="currentColor" />
      </svg>
      <svg viewBox="0 0 100 40" className="absolute left-6 top-28 w-24 opacity-20" fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="14" cy="22" r="12" />
        <circle cx="32" cy="14" r="10" />
        <circle cx="46" cy="24" r="8" />
      </svg>
    </div>
  );
}

// Angela: a woman's profile in a few flowing lines inside a breathing bubble. The lines draw themselves in, the hair sways.
export function AngelaFace({ className = "" }: { className?: string }) {
  const line = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, pathLength: 1 };
  return (
    <svg viewBox="0 0 240 240" role="img" aria-label="אנג'לה" className={`mx-auto size-56 text-fg ${className}`}>
      <circle cx="120" cy="120" r="88" className="calm-disc" fill="currentColor" fillOpacity="0.1" />
      <g fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1.2">
        <ellipse cx="120" cy="120" rx="70" ry="68" />
        <ellipse cx="122" cy="119" rx="52" ry="50" />
      </g>
      <g className="calm-sway">
        <path {...line} className="calm-draw" style={{ ["--d" as string]: "0.2s" }} d="M118 64C88 64 66 92 70 128C72 152 64 172 50 190" />
        <path {...line} className="calm-draw" style={{ ["--d" as string]: "0.5s" }} d="M112 70C90 74 80 98 84 128C86 148 82 166 74 182" />
        <path {...line} className="calm-draw" style={{ ["--d" as string]: "0.8s" }} d="M104 76C94 84 92 102 96 122" />
        <path {...line} className="calm-draw" style={{ ["--d" as string]: "1.1s" }} d="M118 64C148 52 178 66 188 96" />
      </g>
      <path {...line} className="calm-draw" style={{ ["--d" as string]: "0.6s" }} d="M118 66C132 70 141 82 140 96C140 104 147 112 153 118C151 122 146 123 144 124C147 129 148 132 145 135C149 139 148 143 144 145C146 152 141 158 131 161C125 163 121 172 120 192" />
      <path {...line} className="calm-draw" style={{ ["--d" as string]: "1.4s" }} d="M127 99C131 102 135 102 139 99" />
      <path {...line} className="calm-draw" style={{ ["--d" as string]: "1.6s" }} d="M125 91C130 88 136 88 140 91" />
      <path {...line} className="calm-draw" style={{ ["--d" as string]: "1.8s" }} d="M100 132C102 150 110 164 114 192" />
    </svg>
  );
}

// Angela inside the breathing bubble. The drawing traces itself, then floats.
export function AngelaFigure() {
  return (
    <div className="relative mx-auto size-60">
      <div aria-hidden className="calm-disc absolute inset-0 rounded-full bg-fg/10" />
      <div aria-hidden className="absolute inset-[6%] rounded-full border border-fg/15" />
      <AngelaDrawing className="calm-figure absolute inset-[14%] size-[72%]" />
    </div>
  );
}

export function CalmIcon({ name }: { name: "thoughts" | "eliminate" | "blackout" | "sessions" }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg viewBox="0 0 32 32" aria-hidden className="size-9 shrink-0">
      {name === "thoughts" && (
        <>
          <path {...common} d="M6 8h14a4 4 0 0 1 4 4v4a4 4 0 0 1-4 4h-6l-5 4v-4H6a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4Z" transform="translate(2 -2)" />
          <path {...common} d="M12 12l6 6M18 12l-6 6" />
        </>
      )}
      {name === "eliminate" && (
        <>
          <path {...common} d="M5 9h22M5 16h22M5 23h22" opacity="0.35" />
          <path {...common} d="M4 16h24" />
          <path {...common} d="M10 23c4-2 8-2 12 0" />
        </>
      )}
      {name === "sessions" && (
        <>
          <circle {...common} cx="16" cy="16" r="5" />
          <circle {...common} cx="16" cy="16" r="10" opacity="0.4" />
          <circle {...common} cx="16" cy="16" r="14" opacity="0.2" />
        </>
      )}
      {name === "blackout" && (
        <>
          <path {...common} d="M3 16c3-6 5-6 8 0s5 6 8 0 5-6 8 0" />
          <path {...common} d="M3 23c3-4 5-4 8 0s5 4 8 0 5-4 8 0" opacity="0.4" />
        </>
      )}
    </svg>
  );
}
