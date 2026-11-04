import type { ReactNode } from "react";
import type { FreeActivityId } from "@/content/freePractice";

function Bar({ w = "100%" }: { w?: string }) {
  return <i className="block h-2 rounded-full bg-line" style={{ width: w }} />;
}

function Opt({ children, on }: { children: ReactNode; on?: boolean }) {
  return <div className={`rounded-lg border px-3 py-1.5 text-sm ${on ? "border-mint bg-mint/25 font-semibold" : "border-line bg-white"}`}>{children}</div>;
}

function Dot({ on }: { on?: boolean }) {
  return on ? (
    <span className="grid size-6 place-items-center rounded-full bg-mint text-ink-deep">
      <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="m5 12.5 4.5 4.5L19 7.5" />
      </svg>
    </span>
  ) : (
    <span className="size-6 rounded-full border border-line bg-white" />
  );
}

// Each free practice shown as a miniature of its own screen, so the card says what you will do before you open it
const PREVIEWS: Record<FreeActivityId, ReactNode> = {
  daily: (
    <div className="w-full">
      <p className="text-sm font-semibold">She ____ to school.</p>
      <div className="mt-3 flex justify-between">
        {[1, 1, 1, 1, 1, 0, 0].map((on, i) => (
          <Dot key={i} on={!!on} />
        ))}
      </div>
    </div>
  ),
  questions: (
    <div className="grid w-full gap-1.5">
      <p className="text-sm font-semibold">It is too cold to swim.</p>
      <Opt on>It is so cold that we can&apos;t swim.</Opt>
      <Opt>It is cold enough to swim.</Opt>
    </div>
  ),
  exam: (
    <div className="w-full">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-ink px-3 py-1 text-sm font-bold tabular-nums text-mist">38:20</span>
        <span className="text-xs opacity-60">3 / 8</span>
      </div>
      <div className="mt-3 flex gap-1.5">
        {[1, 1, 1, 0, 0, 0, 0, 0].map((on, i) => (
          <i key={i} className={`h-2 flex-1 rounded-full ${on ? "bg-ink" : "bg-line"}`} />
        ))}
      </div>
      <div className="mt-3 space-y-2">
        <Bar />
        <Bar w="70%" />
      </div>
    </div>
  ),
  words: (
    <div className="flex w-full items-center justify-center gap-2 text-sm font-semibold">
      <span className="rounded-full border border-line bg-white px-3 py-1.5">happy</span>
      <span className="opacity-40">→</span>
      <span className="rounded-full border border-mint bg-mint/25 px-3 py-1.5">glad</span>
      <span className="opacity-40">→</span>
      <span className="rounded-full border border-dashed border-line px-3 py-1.5 opacity-50">?</span>
    </div>
  ),
  vocab: (
    <div className="mx-auto w-40 rounded-xl border border-line bg-white p-4 text-center">
      <p className="text-xl font-bold">reluctant</p>
      <div className="mx-auto mt-3 w-16">
        <Bar />
      </div>
    </div>
  ),
};

export function FreePreview({ id }: { id: FreeActivityId }) {
  return (
    <div dir="ltr" aria-hidden="true" className="flex h-32 items-center overflow-hidden border-b border-line bg-raise px-5 text-ink">
      {PREVIEWS[id]}
    </div>
  );
}
