import { STAGE_DOT, STAGE_LABEL, type Stage } from "./labels";

export function Dot({ stage }: { stage: Stage }) {
  return <span aria-hidden className={`size-2.5 shrink-0 rounded-full ${STAGE_DOT[stage]}`} />;
}

// A pill with the stage's colored dot, same look in the list, the filters and the status picker
export function StageBadge({ stage }: { stage: Stage }) {
  return (
    <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border border-line bg-white px-2.5 py-0.5 text-xs font-semibold">
      <Dot stage={stage} />
      {STAGE_LABEL[stage]}
    </span>
  );
}

export function Badge({ tone, children }: { tone: "ok" | "warn" | "neutral"; children: React.ReactNode }) {
  const toneClass =
    tone === "ok" ? "border-ok/30 bg-ok/10 text-ok" : tone === "warn" ? "border-warn/40 bg-warn/10 text-warn" : "border-line opacity-70";
  return (
    <span className={`inline-flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-semibold ${toneClass}`}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}
