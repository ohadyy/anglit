import {
  GUARANTEE_CONDITION,
  GUARANTEE_DETAILS,
  GUARANTEE_TITLE,
  REFUND_SUMMARY,
  SUPPORT_TEXT,
} from "./facts";
import type { ProductId } from "@/lib/enums";

export type Product = {
  id: ProductId;
  name: string;
  priceIls: number;
  priceUnit: string;
  badge?: string;
  /** Crossed-out "before" price shown next to the real one */
  listPriceIls?: number;
  note?: string;
  included: string[];
  excluded: string[];
  /** Sold only through a direct /checkout?product=<id> link, never shown on /pricing */
  unlisted?: boolean;
};

/** The products shown as cards on /pricing */
export type ListedId = Exclude<ProductId, "honors" | "success">;

// One shared list of rows for all three cards. Each row is the same kind of thing on every card,
// so the same row sits at the same height. A card without that row shows it as not included.
// Row order: the access row first, then the practice, the lessons, the follow-up.
// A cell is either the text the card includes, or { missing } with the text the card does not include
type FeatureCell = string | { missing: string };

export const featureRows: Record<ListedId, FeatureCell>[] = [
  {
    access: "גישה מלאה לאתר, כולל התרגולים והסימולציות, ללא הגבלת זמן",
    course: "גישה מלאה לאתר, כולל התרגולים והסימולציות, ללא הגבלת זמן",
    private: "גישה מלאה לאתר, כולל התרגולים והסימולציות, ללא הגבלת זמן",
  },
  {
    access: "הסבר מלא לכל תשובה",
    course: "הסבר מלא לכל תשובה",
    private: "הסבר מלא לכל תשובה",
  },
  {
    access: { missing: "שיעורים עם מורה, בזום או פרטיים" },
    course: "שלושה מפגשי זום בקבוצה קטנה",
    private: "שישה שיעורים פרטיים, פרונטליים, אחד על אחד",
  },
  {
    access: { missing: "הקלטה של כל מפגש" },
    course: "הקלטה של כל מפגש",
    private: { missing: "הקלטה של כל מפגש" },
  },
  {
    access: { missing: "קבוצת וואטסאפ עם המחזור שלכם" },
    course: "קבוצת וואטסאפ עם המחזור שלכם",
    private: "קשר ישיר בוואטסאפ עם המורה",
  },
  {
    access: { missing: SUPPORT_TEXT },
    course: SUPPORT_TEXT,
    private: SUPPORT_TEXT,
  },
  {
    access: { missing: "מבחן פתיחה ומבחן סיום, עם מדידה" },
    course: "מדידת ביצועים: מבחן פתיחה ומבחן סיום",
    private: "מעקב אחרי ההתקדמות שלכם",
  },
  {
    access: { missing: "החזר כספי מלא או מחזור חינם אם לא השתפרתם" },
    course: "לא השתפרתם? החזר כספי מלא או מחזור חינם (בתנאים)",
    private: { missing: "החזר כספי מלא או מחזור חינם אם לא השתפרתם" },
  },
];

function includedFor(id: ListedId): string[] {
  return featureRows.map((row) => row[id]).filter((c): c is string => typeof c === "string");
}

export const products: Product[] = [
  {
    id: "access",
    name: "גישה לאתר",
    priceIls: 97,
    priceUnit: "גישה מלאה לאתר ללא הגבלת זמן, תשלום חד פעמי",
    note: "מתאים למי שרוצה להתאמן בעצמו, בקצב שלו, בלי לקבוע שיעורים.",
    included: includedFor("access"),
    excluded: [],
  },
  {
    id: "course",
    name: "7 ימים לאמירנט",
    priceIls: 347,
    listPriceIls: 500,
    priceUnit: "לכל הסמינר, תשלום חד פעמי",
    badge: "הבחירה המומלצת",
    note: "מתאים לאנשים שרוצים לשפר את הרמה שלהם בצורה כמעט מיידית, עם תרגול יומי וחברים ללמידה.",
    included: includedFor("course"),
    excluded: [],
  },
  {
    id: "private",
    name: "שיעורים פרטיים",
    priceIls: 1297,
    priceUnit: "ל-6 שיעורים פרטיים, תשלום חד פעמי",
    note: "מתאים במיוחד למי שמתקשה ללמוד מרחוק, ומעדיף ללמוד פנים מול פנים.",
    included: includedFor("private"),
    excluded: [],
  },
  {
    // A personal offer for one student who is close to exemption. Sent as a link, not listed.
    id: "honors",
    name: "מסלול הצטיינות",
    priceIls: 550,
    priceUnit: "ל-4 שיעורים פרטיים בזום, תשלום חד פעמי",
    included: [
      "ארבעה שיעורים פרטיים בזום, אחד על אחד",
      "שיעור אבחון: עוברים ביחד על הטעויות ומוצאים איפה הולכות הנקודות",
      "תוכנית אישית עד המבחן, וסיכום כתוב אחרי כל שיעור",
      "גישה מלאה לאתר, כולל התרגולים והסימולציות, ללא הגבלת זמן",
      "קשר ישיר בוואטסאפ עם המורה",
    ],
    excluded: [],
    unlisted: true,
  },
  {
    // A personal offer: six weekly Zoom lessons with weekly practice sheets, for a student below ~100. Sent as a link.
    id: "success",
    name: "מסלול הצלחה",
    priceIls: 600,
    priceUnit: "ל-6 שיעורים פרטיים בזום, תשלום חד פעמי",
    included: [
      "שישה שיעורים פרטיים בזום, אחד על אחד, עם הקלטה",
      "דף תרגול ומשימות לכל שבוע",
      "גישה מלאה לאתר, כולל התרגולים והסימולציות, ללא הגבלת זמן",
      "קשר ישיר בוואטסאפ עם המורה, עד המבחן",
    ],
    excluded: [],
    unlisted: true,
  },
];

export function getProduct(id: string | null | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

// Anyone who already paid for something gets this much off the seminar. The checkout API charges the same number.
const LOYALTY_PERCENT = 10;
export const loyaltyPrice = (ils: number) => Math.round((ils * (100 - LOYALTY_PERCENT)) / 100);
export const loyaltyLabel = `${LOYALTY_PERCENT}% הנחה ללקוחות קיימים`;

export const checkoutCopy = {
  title: "השלמת הרכישה",
  summaryTitle: "מה אתם רוכשים",
  changeProduct: "החלפת אפשרות",

  accountTitle: "חשבון",
  accountSignedIn: "מחוברים לחשבון, אז אפשר להמשיך לתשלום.",
  accountWhy:
    "כדי לשלם צריך חשבון. אחרי התשלום אתם נכנסים לאזור האישי ורואים שם את התרגול והמבחנים. ההרשמה לוקחת רגע: טלפון ותאריך לידה, בלי אימייל ובלי סיסמה חדשה.",
  signUp: "הרשמה",
  signIn: "כבר נרשמתי — התחברות",

  payTitle: "תשלום",
  payNote: "התשלום מתבצע בדף מאובטח של קארדקום. פרטי הכרטיס לא עוברים דרכנו.",
  payCta: "לתשלום מאובטח",
  couponLabel: "קוד קופון (אם יש)",
  couponBad: "קוד הקופון לא תקין. אפשר לבדוק שוב, או להמשיך בלי קופון.",

  nextTitle: "מה קורה אחרי התשלום?",
  nextSteps: {
    access: "הגישה לאתר נפתחת מיד אחרי התשלום, כולל הסימולציות והתרגול.",
    course:
      "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך אהד מתקשר אליכם לתאם את המחזור.",
    private:
      "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך נחזור אליכם לתאם את השיעורים הפרטיים.",
    honors: "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך אהד חוזר אליכם לקבוע את שיעור האבחון.",
    success: "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך אהד חוזר אליכם לקבוע את השיעור הראשון.",
  } satisfies Record<ProductId, string>,
  backToPricing: "חזרה למחירים",
};

export const pricingCopy = {
  eyebrow: "המחיר",
  title: "איך תרצו להתאמן?",
  sub: "משלמים פעם אחת. בלי מנוי.",

  payCta: "לתשלום",
  cta: "הרשמה למחזור הקרוב",

  member: {
    yourPlan: "המסלול שלכם",
    accessTitle: "הצעד הבא: הסמינר",
    accessSub:
      "כבר יש לכם גישה לאתר. בסמינר מוסיפים שבוע בקבוצה קטנה בזום, ליווי אישי, ומבחן פתיחה ומבחן סיום שמראים כמה השתפרתם.",
    accessCta: "להצטרפות לסמינר עם ההנחה",
    courseTitle: "אתם כבר בסמינר",
    courseSub: "הגישה לאתר כלולה בסמינר, אז אין מה לשלם שוב. כל מה שצריך מחכה באזור האישי.",
    courseCta: "לאזור האישי",
    privateTitle: "רוצים גם שיעורים פרטיים?",
    privateSub: "אחד על אחד עם אהד, על מה שהכי קשה לכם. למי שרוצה עוד דחיפה לפני המבחן.",
    allSetTitle: "יש לכם הכול",
    allSetSub: "הסמינר, השיעורים הפרטיים והגישה לאתר. נשאר רק להתאמן.",
  },

  faqTitle: "שאלות על המחיר",
  faq: [
    {
      q: "מה כלול בכל אפשרות?",
      a: `בסמינר: מפגשי זום בקבוצה קטנה עם הקלטה לכל מפגש, תרגול יומי באתר, מבחן פתיחה ומבחן סיום, קבוצת וואטסאפ עם המחזור, ו${SUPPORT_TEXT}.`,
    },
    {
      q: "מה אם לא השתפרתי?",
      a: `${GUARANTEE_TITLE} ${GUARANTEE_CONDITION}. ${GUARANTEE_DETAILS}`,
    },
    {
      q: "מה אם אני צריך לבטל?",
      a: REFUND_SUMMARY,
    },
  ],
};

