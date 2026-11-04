import Link from "next/link";
import type { ReactNode } from "react";
import { AngelaDrawing } from "@/app/calm/AngelaDrawing";
import { LockIcon } from "@/components/LockIcon";

// Miniatures of the product's own screens, shown on the tiles of /account and /practice.
// Each one says what you will do before you open it. Pure markup: no state, no data.

const CARD = "rounded-3xl border border-line bg-white shadow-[0_18px_40px_-24px_rgb(14_8_82/0.3)]";

export function Bar({ w = "100%" }: { w?: string }) {
  return <i className="block h-2 rounded-full bg-line" style={{ width: w }} />;
}

export function Opt({ children, on }: { children: ReactNode; on?: boolean }) {
  return <div className={`rounded-md border px-2 py-1 text-xs ${on ? "border-mint bg-mint/25 font-semibold" : "border-line bg-white"}`}>{children}</div>;
}

export function Check({ size = 18 }: { size?: number }) {
  return (
    <span className="grid shrink-0 place-items-center rounded-full bg-mint text-ink-deep" style={{ width: size, height: size }} aria-hidden="true">
      <svg viewBox="0 0 24 24" width={size * 0.65} height={size * 0.65} fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  );
}

// A tile: a miniature above the title. Without href it is a plain card (used where the link is elsewhere).
export function MiniTile({
  href,
  title,
  text,
  aside,
  locked,
  children,
}: {
  href: string;
  title: string;
  text?: ReactNode;
  aside?: ReactNode;
  locked?: boolean;
  children: ReactNode;
}) {
  return (
    <Link href={href} data-transition-ignore className={`${CARD} group flex min-w-0 flex-1 flex-col overflow-hidden hover:border-fg/30`}>
      <div dir="ltr" aria-hidden="true" className="flex h-24 items-center overflow-hidden border-b border-line bg-raise px-3 text-ink">
        {children}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-lg font-bold leading-tight">{title}</p>
        {text && <p className="mt-1 text-xs leading-relaxed opacity-70">{text}</p>}
        <p className="mt-auto flex items-center gap-1.5 pt-3 text-xs font-semibold tabular-nums opacity-70 group-hover:opacity-100">
          {locked && <LockIcon className="size-4" />}
          {aside}
        </p>
      </div>
    </Link>
  );
}

export const PREVIEWS = {
  // Account areas
  exams: (
    <div className="w-full">
      <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-bold tabular-nums text-mist">38:20</span>
      <div className="mt-2.5 flex gap-1">
        {[1, 1, 1, 0, 0, 0, 0, 0].map((on, i) => (
          <i key={i} className={`h-1.5 flex-1 rounded-full ${on ? "bg-ink" : "bg-line"}`} />
        ))}
      </div>
    </div>
  ),
  vocab: (
    <div className="mx-auto w-28 rounded-lg border border-line bg-white p-2.5 text-center">
      <p className="text-sm font-bold">reluctant</p>
      <div className="mx-auto mt-2 w-10">
        <Bar />
      </div>
    </div>
  ),
  cohort: (
    <div className="grid w-full grid-cols-7 gap-1">
      {Array.from({ length: 7 }, (_, i) => (
        <i key={i} className={`h-7 rounded ${i === 2 ? "bg-ink" : "bg-line"}`} />
      ))}
    </div>
  ),
  // Question types
  sentence: (
    <div className="grid w-full gap-1">
      <p className="text-xs font-semibold">She ____ to school.</p>
      <Opt on>goes</Opt>
    </div>
  ),
  restatement: (
    <div className="grid w-full gap-1">
      <p className="text-xs font-semibold">It is too cold to swim.</p>
      <Opt on>It is so cold that…</Opt>
    </div>
  ),
  reading: (
    <div className="w-full space-y-1.5">
      <Bar />
      <Bar w="90%" />
      <Bar w="65%" />
      <Opt on>The main idea…</Opt>
    </div>
  ),
  listening: (
    <div className="flex w-full items-center gap-2">
      <span className="grid size-8 shrink-0 place-items-center rounded-full bg-ink text-mist">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      <div className="flex h-8 flex-1 items-center gap-[3px]">
        {[40, 70, 100, 55, 85, 35, 65, 90, 45, 60, 30, 75].map((h, i) => (
          <i key={i} className="w-1 rounded-full bg-ink/60" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  ),
  grammar: (
    <div className="grid w-full gap-1">
      <p className="text-xs font-semibold">
        He <span className="rounded bg-marker/30 px-1">don&apos;t</span> like tea.
      </p>
      <Opt on>doesn&apos;t</Opt>
    </div>
  ),
  mistakes: (
    <div className="grid w-full gap-1">
      <div className="flex items-center justify-between rounded-md border border-coral/60 bg-coral/15 px-2 py-1 text-xs font-semibold">
        <span>go</span>
        <span aria-hidden>✕</span>
      </div>
      <Opt on>goes</Opt>
    </div>
  ),
  // Extra practice
  connectors: (
    <div className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold">
      <span className="rounded-md border border-line bg-white px-2 py-1">It was late</span>
      <span className="rounded-full border border-mint bg-mint/25 px-2 py-1">but</span>
      <span className="rounded-md border border-line bg-white px-2 py-1">we left</span>
    </div>
  ),
  affixes: (
    <div className="flex w-full items-center justify-center gap-1 text-xs font-semibold">
      <span className="rounded-md bg-marker/25 px-2 py-1">un</span>
      <span className="rounded-md border border-line bg-white px-2 py-1">happy</span>
      <span className="rounded-md bg-mint/30 px-2 py-1">ness</span>
    </div>
  ),
  // Games
  words: (
    <div className="flex w-full items-center justify-center gap-1.5 text-xs font-semibold">
      <span className="rounded-full border border-line bg-white px-2 py-1">happy</span>
      <span className="opacity-40">→</span>
      <span className="rounded-full border border-mint bg-mint/25 px-2 py-1">glad</span>
    </div>
  ),
  challenge: <div className="mx-auto grid size-16 place-items-center rounded-full border-4 border-ink/15 border-t-ink text-lg font-bold tabular-nums">20</div>,
  // Mindset: Angela, the calm area's figure
  calm: <AngelaDrawing className="mx-auto h-20 w-20" />,
} satisfies Record<string, ReactNode>;
