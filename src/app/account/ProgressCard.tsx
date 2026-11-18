import Link from "next/link";
import { accountPath as p, accountProgress as t, accountVoice as v } from "@/content/copy";
import { pick } from "@/lib/gender";
import { scoreLevel } from "@/lib/scoreLevels";

// The score the student is at now: the latest test, or the opening one
const shown_ = (open: number | null, latest: number | null) => latest ?? open;

// The result leads the page: the opening score, the latest score, how far it moved, and one short line about it.
// `latest` is the most recent regular test (null when there is only the opening one).
export function ProgressCard({
  open,
  latest,
  prior = null,
  target = null,
  daysLeft = null,
  gender = null,
}: {
  open: number | null;
  latest: number | null;
  /** From sign-up: previous real score, target score, days to the exam */
  prior?: number | null;
  target?: number | null;
  daysLeft?: number | null;
  gender?: string | null;
}) {
  const gap = target !== null && shown_(open, latest) !== null ? target - shown_(open, latest)! : null;
  const examSoon = daysLeft !== null && daysLeft >= 0 && daysLeft <= p.mistakesWithin;
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

      {(prior !== null || target !== null || (daysLeft !== null && daysLeft >= 0)) && (
        <div className="mt-4 rounded-2xl border border-current/20 px-4 py-3 text-sm leading-relaxed">
          {(prior !== null || target !== null) && (
            <p className="flex flex-wrap items-center justify-between gap-x-3">
              {prior !== null && <span>{p.prior} <bdi dir="ltr" className="font-bold">{prior}</bdi></span>}
              {target !== null && <span>{p.target} <bdi dir="ltr" className="font-bold">{target}</bdi></span>}
              {gap !== null && <span className="font-semibold">{gap > 0 ? p.gap(gap) : pick(gender, v.reached)}</span>}
            </p>
          )}
          {daysLeft !== null && daysLeft >= 0 && <p className="mt-1 font-semibold">{p.days(daysLeft)}</p>}
          {examSoon && (
            <Link href="/practice?type=mistakes" className="mt-2 inline-flex min-h-11 items-center rounded-full bg-fg px-5 text-sm font-semibold text-bg">
              {p.mistakes}
            </Link>
          )}
        </div>
      )}

      {open === null ? (
        <Link href="/exam" className="mt-5 flex items-center justify-between rounded-2xl bg-fg px-5 py-3.5 font-semibold text-bg">
          <span>{t.noOpen.cta}</span>
          <span aria-hidden>←</span>
        </Link>
      ) : (
        <p className="mt-5 rounded-2xl bg-fg/10 px-5 py-3.5 text-center font-semibold">{message}</p>
      )}
      {open === null && <p className="mt-3 text-center text-sm opacity-70">{pick(gender, v.noOpen)}</p>}
    </div>
  );
}
