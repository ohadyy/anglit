// Who needs a personal message from the teacher, worked out from what the student told us at sign-up and what they did since.
// Plain fixed rules, nothing automatic is sent: the teacher looks at the list and writes by hand.

const DAY_MS = 86_400_000;

/** Calendar day in Israel as YYYY-MM-DD */
const israelDay = (ms: number) => new Date(ms).toLocaleDateString("en-CA", { timeZone: "Asia/Jerusalem" });

/** Whole days from today (Israel time) to a YYYY-MM-DD date; negative when it has passed, null without a date */
export function daysUntil(date: string | null | undefined, now: number): number | null {
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  return Math.round((Date.parse(date) - Date.parse(israelDay(now))) / DAY_MS);
}

export type Urgency = {
  daysLeft: number | null;
  /** Points between the best score so far and the target (null when either is unknown) */
  gap: number | null;
  /** Whole days since the student was last seen (null = never) */
  silentDays: number | null;
  /** 0 = fine, 1 = worth a message, 2 = write today */
  level: 0 | 1 | 2;
  reason: string;
};

export function urgencyOf(
  r: { examDate: string | null; targetScore: number | null; paid: boolean; staff: boolean; lastSeen?: Date; best?: number },
  now: number,
): Urgency {
  const daysLeft = daysUntil(r.examDate, now);
  const gap = r.targetScore !== null && r.best !== undefined ? r.targetScore - r.best : null;
  const silentDays = r.lastSeen ? Math.floor((now - r.lastSeen.getTime()) / DAY_MS) : null;
  const base = { daysLeft, gap, silentDays };
  if (!r.paid || r.staff || (daysLeft !== null && daysLeft < 0)) return { ...base, level: 0, reason: "" };

  const close = daysLeft !== null && daysLeft <= 14;
  if (close && gap !== null && gap > 10) return { ...base, level: 2, reason: `המבחן בעוד ${daysLeft} ימים והיעד רחוק ב-${gap} נקודות` };
  if (close && (silentDays === null || silentDays >= 3)) return { ...base, level: 2, reason: `המבחן בעוד ${daysLeft} ימים ולא היו באתר ${silentDays === null ? "מעולם" : `${silentDays} ימים`}` };
  if (silentDays === null || silentDays >= 3) return { ...base, level: 1, reason: silentDays === null ? "שילמו ועוד לא נכנסו" : `לא היו באתר ${silentDays} ימים` };
  return { ...base, level: 0, reason: "" };
}
