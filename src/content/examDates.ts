// Exam dates read from the shibuts (placement) calendar on the NITE registration site.
// Update them regularly and change `asOf` each time. Nothing here is registration: the
// link sends people to the official site.

import { NITE_URLS } from "./facts";

export const examDatesAsOf = "11.11.2026";
export const NITE_REGISTRATION_URL = NITE_URLS.registration;

export type CenterId = "beersheba" | "haifa" | "jerusalem" | "telaviv" | "ramatgan";

export const examCenters: Record<CenterId, { name: string; address: string }> = {
  beersheba: { name: "באר שבע", address: "מגדל M-Tower, רחוב רחה פריאר 9, קומה 5" },
  haifa: { name: "חיפה", address: "דרך יפו 145, חיפה, קומה 6 (בית גלים)" },
  jerusalem: { name: "ירושלים", address: "כנפי נשרים 35, גבעת שאול" },
  telaviv: { name: "תל אביב (זמני)", address: "מכון מופ״ת, שושנה פרסיץ 13, תל אביב" },
  ramatgan: { name: "רמת גן (זמני)", address: "המרכז האקדמי למשפט ועסקים, רחוב בן גוריון 26, רמת גן, קומה 9" },
};

// Per center: [month (YYYY-MM), days with a free seat]
const byCenter: Record<CenterId, [string, number[]][]> = {
  beersheba: [
    ["2026-11", [15, 16, 18, 19, 22, 23, 24, 26, 30]],
    ["2026-12", [1, 2, 3, 20, 21, 22, 23, 24, 27, 29]],
    ["2027-01", [4, 5, 6, 7, 10, 11, 14, 17, 18, 19, 21, 26, 28]],
  ],
  haifa: [
    ["2026-11", [17]],
    ["2026-12", [1, 22, 24]],
    ["2027-01", [4, 13, 28]],
    ["2027-02", [2, 8, 10, 25]],
    ["2027-03", [25]],
  ],
  jerusalem: [
    ["2026-11", [15, 17, 18, 19, 24, 26]],
    ["2026-12", [3, 20, 22, 23, 24, 27, 30, 31]],
    ["2027-01", [4, 5, 6, 7, 10, 11, 14, 18, 21, 26, 28]],
    ["2027-02", [1, 2, 3, 8, 11, 17, 25, 28]],
    ["2027-03", [14, 18, 25]],
  ],
  telaviv: [
    ["2026-11", [23]],
    ["2026-12", [13, 20]],
  ],
  ramatgan: [
    ["2026-11", [15, 17, 24]],
    ["2026-12", [20, 21, 22, 27]],
    ["2027-01", [4, 5, 10]],
  ],
};

// Date (YYYY-MM-DD) -> centers that have a seat that day
export const examDates: Record<string, CenterId[]> = {};
for (const [center, months] of Object.entries(byCenter) as [CenterId, [string, number[]][]][]) {
  for (const [month, days] of months) {
    for (const d of days) (examDates[`${month}-${String(d).padStart(2, "0")}`] ??= []).push(center);
  }
}

export const examDatesCopy = {
  title: "מועדי מבחן אמירנט",
  intro: "בחרו מרכז בחינה כדי לראות את התאריכים הפנויים בו. ההרשמה נעשית באתר הרשמי.",
  centerLabel: "מרכז בחינה",
  allCenters: "כל המרכזים",
  noDates: "אין מועדים פנויים במרכז הזה בחודש הזה.",
  pickDate: "לחצו על תאריך כדי לראות את פרטי המרכז.",
  registerCta: "להרשמה באתר הרשמי",
  prevMonth: "החודש הקודם",
  nextMonth: "החודש הבא",
  disclaimer:
    "המועדים נלקחו מאתר המרכז הארצי לבחינות והערכה ועשויים להשתנות. בדקו את המועד המעודכן לפני שנרשמים.",
  asOfLabel: "עודכן לאחרונה:",
  homeLink: "למועדי הבחינה הקרובים",
};
