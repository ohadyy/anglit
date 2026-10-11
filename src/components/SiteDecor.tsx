// Behind every public page: a soft gradient with a few faint brand shapes from the
// graphics kit. Three variants share one style but place the gradient and shapes
// differently, so pages feel related without being identical. Decorative only.

const GRADIENTS = [
  // corners: top-left ink, top-right light, bottom-center ink, bottom-right light
  "radial-gradient(circle at 12% 12%, color-mix(in srgb, var(--fg) 13%, transparent), transparent 55%), radial-gradient(circle at 88% 10%, color-mix(in srgb, var(--fg) 9%, transparent), transparent 50%), radial-gradient(circle at 50% 110%, color-mix(in srgb, var(--fg) 11%, transparent), transparent 60%), radial-gradient(circle at 92% 92%, color-mix(in srgb, var(--fg) 7%, transparent), transparent 45%)",
  // ink moved to the right side and bottom-left
  "radial-gradient(circle at 85% 18%, color-mix(in srgb, var(--fg) 12%, transparent), transparent 55%), radial-gradient(circle at 10% 85%, color-mix(in srgb, var(--fg) 10%, transparent), transparent 52%), radial-gradient(circle at 70% 105%, color-mix(in srgb, var(--fg) 8%, transparent), transparent 55%), radial-gradient(circle at 20% 35%, color-mix(in srgb, var(--fg) 6%, transparent), transparent 40%)",
  // ink across the top, softer at the bottom
  "radial-gradient(circle at 30% 0%, color-mix(in srgb, var(--fg) 14%, transparent), transparent 55%), radial-gradient(circle at 95% 55%, color-mix(in srgb, var(--fg) 9%, transparent), transparent 48%), radial-gradient(circle at 5% 100%, color-mix(in srgb, var(--fg) 8%, transparent), transparent 50%), radial-gradient(circle at 70% 80%, color-mix(in srgb, var(--fg) 6%, transparent), transparent 42%)",
];

// Shape positions per variant (Tailwind classes; the full class names stay in this file)
const SHAPES = [
  {
    plus: "end-[7%] top-[58%]",
    arc: "start-[10%] bottom-[12%]",
    wave: "end-[10%] top-[30%]",
  },
  {
    plus: "start-[12%] top-[20%]",
    arc: "end-[14%] bottom-[10%]",
    wave: "start-[8%] bottom-[30%]",
  },
  {
    plus: "end-[16%] top-[14%]",
    arc: "start-[40%] top-[8%]",
    wave: "end-[24%] bottom-[16%]",
  },
] as const;

export function SiteDecor({ variant = 0 }: { variant?: number }) {
  const v = ((variant % 3) + 3) % 3;
  const s = SHAPES[v];
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden select-none"
      style={{ backgroundImage: GRADIENTS[v] }}
    >
      <svg viewBox="0 0 100 100" className={`absolute ${s.plus} hidden size-10 text-fg opacity-15 md:block`}>
        <path fill="currentColor" stroke="currentColor" strokeWidth="8" strokeLinejoin="round" d="M40 4H60V36H96V64H60V96H40V64H4V36H40Z" />
      </svg>
      <svg viewBox="0 0 100 100" className={`absolute ${s.arc} hidden size-20 text-fg opacity-10 md:block`}>
        <path d="M12 88A40 40 0 0 1 88 88" fill="none" stroke="currentColor" strokeWidth="18" strokeLinecap="round" />
      </svg>
      <svg viewBox="0 0 120 24" className={`absolute ${s.wave} hidden w-24 text-marker opacity-40 md:block`}>
        <path d="M2 16c10-10 20-10 30 0s20 10 30 0 20-10 30 0 20 10 26 2" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      </svg>
    </div>
  );
}
