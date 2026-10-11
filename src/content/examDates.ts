// Exam dates copied by hand from the NITE registration site. Update them regularly
// and change `asOf` each time. Nothing here is registration: the link sends people
// to the official site.

export const examDatesAsOf = "4.10.2026";
export const NITE_REGISTRATION_URL = "https://niteop.nite.org.il/#/net-registration/J,2";

export type CenterId = "beersheba" | "haifa" | "jerusalem";

export const examCenters: Record<CenterId, { name: string; address: string }> = {
  beersheba: { name: "באר שבע", address: "מגדל M-Tower, רחוב רחה פריאר 9, קומה 5" },
  haifa: { name: "חיפה", address: "דרך יפו 145, חיפה, קומה 6" },
  jerusalem: { name: "ירושלים", address: "כנפי נשרים 35, גבעת שאול" },
};

// Date (YYYY-MM-DD) -> centers that have a seat that day
export const examDates: Record<string, CenterId[]> = {
  "2026-10-06": ["beersheba"],
  "2026-10-07": ["beersheba"],
  "2026-10-16": ["haifa"],
  "2026-10-21": ["beersheba", "jerusalem"],
  "2026-10-25": ["beersheba"],
  "2026-10-26": ["beersheba", "jerusalem"],
  "2026-10-28": ["jerusalem"],
  "2026-10-29": ["beersheba", "jerusalem"],
};

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
    "המועדים הועתקו ידנית מאתר המרכז הארצי לבחינות והערכה ועשויים להשתנות. בדקו את המועד המעודכן לפני שנרשמים.",
  asOfLabel: "עודכן לאחרונה:",
  homeLink: "למועדי הבחינה הקרובים",
};
