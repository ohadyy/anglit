// Facts that appear in several texts. Texts interpolate these so they cannot drift apart.

export const GROUP_SIZE_TEXT = "עד 6 אנשים";

export const GUARANTEE_CONDITION = "בתנאי שהשתתפתם בכל המפגשים והגשתם את התרגולים";

export const REFUND_DAYS = 14;

export const REFUND_SUMMARY = `אפשר לבטל תוך ${REFUND_DAYS} יום מהתשלום, וההחזר מלא. הפרטים המלאים נמצאים במדיניות הביטול באתר.`;

// The official exam, as published by NITE (checked dates stay next to the pages that show them)
export const NITE_FACTS = {
  registrationFeeIls: 315,
  rescheduleFeeIls: 142,
  /** Minimum days between two exams, counted from the day after the first one */
  minDaysBetweenTests: 35,
  /** Score that exempts from English level courses in most institutions */
  exemptionScore: 134,
};

/** The Amirnet score scale. */
export const SCORE_MIN = 50;
export const SCORE_MAX = 150;
export const SCORE_RANGE_TEXT = `${SCORE_MIN}–${SCORE_MAX}`;

/** The average cost of one English course at a university, used by the score calculator and the sprint FAQ */
export const COST_PER_COURSE = 2000;
export const COST_PER_COURSE_TEXT = `כ-${COST_PER_COURSE.toLocaleString("en-US")} ₪`;

// Exam format, as the real exam and our practice tests show it
export const EXAM_FORMAT = {
  minutes: "כ-50 דקות",
  chapters: "7 או 8 פרקים",
  practiceChapters: "8 פרקים",
  practiceQuestions: "32 שאלות",
};

// Hebrew number words for counts of 2-9 (digits for anything else), so texts that say "three recordings"
// follow the list length. "f" = feminine noun ("שלוש הקלטות"), "construct" = masculine construct ("שלושת הרגעים").
const COUNT_M = [, , "שניים", "שלושה", "ארבעה", "חמישה", "שישה", "שבעה", "שמונה", "תשעה"];
const COUNT_F = [, , "שתי", "שלוש", "ארבע", "חמש", "שש", "שבע", "שמונה", "תשע"];
const COUNT_CONSTRUCT = [, , "שני", "שלושת", "ארבעת", "חמשת", "ששת", "שבעת", "שמונת", "תשעת"];
export function countWord(n: number, form: "f" | "m" | "construct"): string {
  return (form === "f" ? COUNT_F : form === "m" ? COUNT_M : COUNT_CONSTRUCT)[n] ?? String(n);
}

/** The seminar's shape: live Zoom sessions inside one week */
export const SEMINAR = { sessions: 3, days: 7 };
/** "שלושה מפגשי זום" */
export const SEMINAR_SESSIONS_TEXT = `${countWord(SEMINAR.sessions, "m")} מפגשי זום`;

// Steps of "how the week works" that the home page and the ads page word identically
export const PERSONAL_GUIDANCE_STEP = {
  step: "ליווי והתייעצות אישית עם אהד",
  text: "אהד זמין לכל שאלה ולכל עזרה שצריך, ויש גם התייעצות אישית איתו לאורך השבוע.",
};
export const GROUP_CHAT_STEP = {
  step: "קבוצה משותפת",
  text: "קבוצת וואטסאפ של המחזור, שבה שואלים, עוזרים ומתרגלים יחד.",
};

// Official NITE pages. The bare host (nite.org.il) and www are kept exactly as each link was first written.
const NITE_AMIRNET = "https://www.nite.org.il/other-tests/amirnet";
export const NITE_URLS = {
  home: `${NITE_AMIRNET}/`,
  accommodations: `${NITE_AMIRNET}/special-test-accommodations`,
  possibleAccommodations: `${NITE_AMIRNET}/special-test-accommodations/possible-accommodations/`,
  requestSubmission: `${NITE_AMIRNET}/special-test-accommodations/request-submission/`,
  scoreSignificance: `${NITE_AMIRNET}/scores/significance/`,
  faq: "https://nite.org.il/other-tests/amirnet/faq/",
  tips: "https://nite.org.il/other-tests/amirnet/tips/",
  practiceTest: "https://nite.org.il/other-tests/amirnet/practice-test/",
  registration: "https://niteop.nite.org.il/#/net-registration/J,2",
};
