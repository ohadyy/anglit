const dateFormat = new Intl.DateTimeFormat("he-IL", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Jerusalem" });

/** "9 בנובמבר 2026", in Israel time */
export function formatHebrewDate(date: Date): string {
  return dateFormat.format(date);
}

const shortDateFormat = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", year: "2-digit", timeZone: "Asia/Jerusalem" });
const shortDateTimeFormat = new Intl.DateTimeFormat("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Jerusalem" });

/** "09.11.26", in Israel time (admin tables) */
export const formatShortDate = (date: Date): string => shortDateFormat.format(date);
/** "09.11, 14:30", in Israel time (admin tables) */
export const formatShortDateTime = (date: Date): string => shortDateTimeFormat.format(date);

/** The device's calendar day as "YYYY-MM-DD", `offset` days from today (browser only: uses the device time zone) */
export function localDay(offset = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString("en-CA");
}
