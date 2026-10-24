// Exam dates read from the shibuts (placement) calendar on the NITE registration site.
// Update them regularly and change `asOf` each time. Nothing here is registration: the
// link sends people to the official site.

export const examDatesAsOf = "19.10.2026";
export const NITE_REGISTRATION_URL = "https://niteop.nite.org.il/#/net-registration/J,2";

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
    ["2026-10", [22, 25, 26, 29]],
    ["2026-11", [1, 3, 4, 5, 9, 10, 11, 15, 16, 18, 19, 22, 23, 24, 26, 30]],
    ["2026-12", [1, 27, 29, 31]],
  ],
  haifa: [
    ["2026-10", [21, 22, 23, 26]],
    ["2026-11", [1, 2, 5, 9, 16, 17, 19, 23, 29]],
    ["2027-01", [28]],
    ["2027-02", [25]],
    ["2027-03", [25]],
  ],
  jerusalem: [
    ["2026-11", [1, 2, 3, 5, 8, 9, 10, 12, 15, 17, 18, 19, 22, 24, 26, 30]],
    ["2026-12", [1]],
  ],
  telaviv: [["2026-11", [3, 10, 15]]],
  ramatgan: [["2026-11", [4, 5, 8, 9, 10, 11, 12, 15, 16, 17, 18, 23]]],
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
