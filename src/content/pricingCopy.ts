// Copy and products for /pricing. Kept separate from copy.ts for the same reason as
// sprintCopy.ts — this isn't part of the homepage's /content review flow.

export type ProductId = "access" | "course" | "private";

export type Product = {
  id: ProductId;
  name: string;
  price: string;
  originalPrice?: string;
  priceUnit: string;
  badge?: string;
  note?: string;
  scarcity?: string;
  included: string[];
  excluded: string[];
};

// One shared list of rows for all three cards. Each row is the same kind of thing on every card,
// so the same row sits at the same height. A card without that row shows it as not included.
// Row order: the access row first, then the practice, the lessons, the follow-up.
// A cell is either the text the card includes, or { missing } with the text the card does not include
export type FeatureCell = string | { missing: string };

export const featureRows: Record<ProductId, FeatureCell>[] = [
  {
    access: "גישה מלאה לאתר, כולל התרגולים והסימולציות",
    course: "גישה מלאה לאתר, כולל התרגולים והסימולציות",
    private: "גישה מלאה לאתר, כולל התרגולים והסימולציות",
  },
  {
    access: "הסבר מלא לכל תשובה",
    course: "הסבר מלא לכל תשובה בתרגול היומי",
    private: "הסבר מלא לכל תשובה",
  },
  {
    access: { missing: "שיעורים עם מורה, בזום או פרטיים" },
    course: "מפגשי זום בקבוצה קטנה",
    private: "שישה שיעורים פרטיים, פרונטליים, אחד על אחד",
  },
  {
    access: { missing: "הקלטה של כל מפגש, לצפייה חוזרת" },
    course: "הקלטה של כל מפגש, לצפייה חוזרת",
    private: { missing: "הקלטה של כל מפגש, לצפייה חוזרת" },
  },
  {
    access: { missing: "קבוצת וואטסאפ עם המחזור שלכם" },
    course: "קבוצת וואטסאפ עם המחזור שלכם",
    private: { missing: "קבוצת וואטסאפ עם המחזור שלכם" },
  },
  {
    access: { missing: "מענה לשאלות במהלך השבוע" },
    course: "מענה לשאלות במהלך השבוע",
    private: "מענה לשאלות בין השיעורים",
  },
  {
    access: { missing: "מבחן פתיחה ומבחן סיום, עם מדידה" },
    course: "מדידת ביצועים: מבחן פתיחה ומבחן סיום",
    private: "מעקב אחרי ההתקדמות שלכם",
  },
];

// The text a product includes in the shared rows, in order (used on the checkout page)
export function includedFor(id: ProductId): string[] {
  return featureRows.map((row) => row[id]).filter((c): c is string => typeof c === "string");
}

export const products: Product[] = [
  {
    id: "access",
    name: "גישה לאתר",
    price: "97",
    priceUnit: "גישה מלאה לאתר, תשלום חד פעמי",
    note: "מתאים למי שרוצה להתאמן בעצמו, בקצב שלו, בלי לקבוע שיעורים.",
    included: includedFor("access"),
    excluded: [],
  },
  {
    id: "course",
    name: "7 ימים לאמירנט",
    price: "347",
    priceUnit: "לכל הסמינר, תשלום חד פעמי",
    badge: "הבחירה המומלצת",
    note: "מתאים לאנשים שרוצים לשפר את הרמה שלהם בצורה כמעט מיידית, עם תרגול יומי וחברים ללמידה.",
    included: includedFor("course"),
    excluded: [],
  },
  {
    id: "private",
    name: "שיעורים פרטיים",
    price: "897",
    priceUnit: "ל-6 שיעורים פרטיים, תשלום חד פעמי",
    note: "מתאים במיוחד למי שמתקשה ללמוד מרחוק, ומעדיף ללמוד פנים מול פנים.",
    included: includedFor("private"),
    excluded: [],
  },
];

export function getProduct(id: string | null | undefined): Product | undefined {
  return products.find((p) => p.id === id);
}

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

  nextTitle: "מה קורה אחרי התשלום?",
  nextSteps: {
    access: "הגישה לאתר נפתחת מיד אחרי התשלום, כולל הסימולציות והתרגול.",
    course:
      "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך אהד מתקשר אליכם לתאם את המחזור.",
    private:
      "הגישה לאתר נפתחת מיד אחרי התשלום. אחר כך נחזור אליכם לתאם את השיעורים הפרטיים.",
  } satisfies Record<ProductId, string>,
  backToPricing: "חזרה למחירים",
};

export const pricingCopy = {
  eyebrow: "המחיר",
  title: "איך תרצו להתאמן?",
  sub: "משלמים פעם אחת. בלי מנוי.",

  payCta: "לתשלום",
  cta: "הרשמה למחזור הקרוב",

  faqTitle: "שאלות על המחיר",
  faq: [
    {
      q: "מה כלול בכל אפשרות?",
      a: "בסמינר: מפגשי זום בקבוצה קטנה עם הקלטה לכל מפגש, תרגול יומי באתר, מבחן פתיחה ומבחן סיום, קבוצת וואטסאפ עם המחזור, ומענה לשאלות במהלך השבוע.",
    },
    {
      q: "מה אם אני צריך לבטל?",
      a: "אפשר לבטל תוך 14 יום מהתשלום, וההחזר מלא. הפרטים המלאים נמצאים במדיניות הביטול באתר.",
    },
  ],
};

