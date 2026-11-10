import Link from "next/link";
import { accountProgress as t } from "@/content/copy";
import { scoreLevel } from "@/lib/scoreLevels";

// The result leads the page: the opening score, the latest score, how far it moved, and one short line about it.
// `latest` is the most recent regular test (null when there is only the opening one).
export function ProgressCard({ open, latest }: { open: number | null; latest: number | null }) {
  const delta = open !== null && latest !== null ? latest - open : null;
  const shown = latest ?? open;
  const message = delta === null ? t.onlyOpen : t.tiers.findLast((tier) => delta >= tier.from)!.text;

  return (
    <div data-invert="" className="mt-8 rounded-[2rem] p-5 shadow-[0_30px_60px_-24px_rgb(14_8_82/0.5)]">
      <div className="flex items-center justify-between text-sm opacity-70">
        <span>{t.title}</span>
        {shown !== null && <span className="rounded-full bg-mint px-2.5 py-0.5 text-xs font-bold text-ink-deep">{scoreLevel(shown).label}</span>}
      </div>

      <div className="mt-4 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-center">
        <div>
          <p className="text-xs opacity-70">{t.openLabel}</p>
          <p className="mt-1 text-5xl font-bold tabular-nums">{open === null ? <span className="opacity-30">?</span> : <bdi dir="ltr">{open}</bdi>}</p>
        </div>
        <span aria-hidden className="text-2xl opacity-40">←</span>
        <div className={latest === null ? "rounded-2xl border border-dashed border-current/30 py-3" : ""}>
          <p className="text-xs opacity-70">{t.latestLabel}</p>
          <p className="mt-1 text-5xl font-bold tabular-nums">{latest === null ? <span className="opacity-30">?</span> : <bdi dir="ltr">{latest}</bdi>}</p>
        </div>
      </div>

      {delta !== null && delta > 0 && (
        <p className="mt-3 text-center">
          <span className="inline-block rounded-full bg-mint px-3 py-1 text-sm font-bold text-ink-deep">
            <bdi dir="ltr">+{delta}</bdi> {t.pointsLabel}
          </span>
        </p>
      )}

      {open === null ? (
        <Link href="/exam" className="mt-5 flex items-center justify-between rounded-2xl bg-fg px-5 py-3.5 font-semibold text-bg">
          <span>{t.noOpen.cta}</span>
          <span aria-hidden>←</span>
        </Link>
      ) : (
        <p className="mt-5 rounded-2xl bg-fg/10 px-5 py-3.5 text-center font-semibold">{message}</p>
      )}
      {open === null && <p className="mt-3 text-center text-sm opacity-70">{t.noOpen.text}</p>}
    </div>
  );
}
