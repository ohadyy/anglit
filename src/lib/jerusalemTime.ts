// Cohort start/exam times are stored as Israeli wall-clock time written into a timezone-less column
// and read back as if it were UTC (a Sunday 19:00 lesson is stored as 19:00). So the "UTC" fields of
// the Date ARE the Israeli clock: no zone conversion in either direction, and dates must be
// formatted with timeZone "UTC". Pure and db-free, so client components can import it.

export function toLocalInput(date: Date): string {
  return date.toISOString().slice(0, 16);
}

/** Null when the string is not a valid datetime-local value */
export function fromLocalInput(local: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(local)) return null;
  const d = new Date(`${local}:00Z`);
  // Rejects rolled-over dates such as month 13 or Feb 31
  return isNaN(d.getTime()) || toLocalInput(d) !== local ? null : d;
}

export function plusDays(local: string, days: number): string {
  const d = new Date(`${local}:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return toLocalInput(d);
}

// Cohort dates read back as "UTC" fields that are really the Israeli clock, so they are formatted in UTC.
const dateFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const dayFmt = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", timeZone: "UTC" });
const dateTimeFmt = new Intl.DateTimeFormat("he-IL", {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

export const formatCohortDate = (date: Date) => dateFmt.format(date);
export const formatCohortDay = (date: Date) => dayFmt.format(date);
export const formatCohortDateTime = (date: Date) => dateTimeFmt.format(date);
