import { getProduct } from "@/content/pricingCopy";
import { FREE_QUESTION_COUNT } from "@/content/practiceFacts";

// Every page the site links to from its chrome or lists for crawlers, in one place.
// Header, footer, tab bar, sitemap.xml, llms.txt and /llm-information all read from here,
// so a new page is added once.

type ChangeFrequency = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

type Page = {
  path: string;
  /** Full name: footer link text, and the entry in llms.txt and /llm-information */
  title: string;
  /** Short name in the header and tab bar */
  nav?: string;
  /** One line for crawlers (llms.txt, /llm-information). Needed for every indexed page. */
  description?: string;
  /** Present only for public, indexable pages: they go in the sitemap, llms.txt and /llm-information */
  sitemap?: { priority: number; changeFrequency: ChangeFrequency };
};

export const PAGE = {
  home: {
    path: "/",
    title: "דף הבית",
    description: "ההצעה, ההתחייבות, שלושת סוגי השאלות",
    sitemap: { priority: 1, changeFrequency: "weekly" },
  },
  start: {
    path: "/start",
    title: "תרגול חינמי",
    description: "שאלת היום, שאלות לדוגמה, סימולציה מלאה ומשחקי מילים, בלי תשלום",
    sitemap: { priority: 0.9, changeFrequency: "weekly" },
  },
  sampleTest: {
    path: "/sample-test",
    title: "מבחן אמירנט לדוגמה",
    description: `${FREE_QUESTION_COUNT} שאלות מקוריות עם תשובות והסבר, ומבנה המבחן`,
    sitemap: { priority: 0.8, changeFrequency: "monthly" },
  },
  words: {
    path: "/amirnet-words",
    title: "אוצר מילים לאמירנט",
    description: "מילים חשובות עם תרגום ומשפט לדוגמה",
    sitemap: { priority: 0.8, changeFrequency: "monthly" },
  },
  daily: {
    path: "/practice/daily",
    title: "שאלת היום",
    description: "שאלה אחת ביום עם הסבר מלא, רצף ימים וספירה לאחור עד המבחן",
    sitemap: { priority: 0.6, changeFrequency: "daily" },
  },
  amirnet: {
    path: "/amirnet",
    title: "מה צריך לדעת על המבחן",
    description: "מבנה המבחן, ציון, הרשמה ומחיר",
    sitemap: { priority: 0.8, changeFrequency: "monthly" },
  },
  guide: {
    path: "/guide",
    title: "מדריך קצר להורדה",
    description: "חמישה טיפים לפני המבחן, בקובץ PDF קצר ובחינם",
    sitemap: { priority: 0.6, changeFrequency: "monthly" },
  },
  connectors: {
    path: "/learn/connectors",
    title: "מילות קישור באמירנט",
    description: "שיעור קצר ותרגול",
    sitemap: { priority: 0.7, changeFrequency: "monthly" },
  },
  affixes: {
    path: "/learn/affixes",
    title: "תחיליות וסופיות באמירנט",
    description: "שיעור קצר ותרגול",
    sitemap: { priority: 0.7, changeFrequency: "monthly" },
  },
  score: {
    path: "/score",
    title: "מחשבון ציון",
    description: "ציון אמירנט ← רמת שיבוץ",
    sitemap: { priority: 0.7, changeFrequency: "monthly" },
  },
  examDates: {
    path: "/exam-dates",
    title: "מועדי הבחינה",
    nav: "מועדים",
    description: "המועדים הפנויים לפי מרכז בחינה",
    sitemap: { priority: 0.7, changeFrequency: "daily" },
  },
  pricing: {
    path: "/pricing",
    title: "מסלולים ומחירים",
    nav: "מחיר",
    description: "המסלולים ומה כלול בכל אחד",
    sitemap: { priority: 0.7, changeFrequency: "monthly" },
  },
  tutor: {
    path: "/private-tutor",
    title: "מורה פרטי לאמירנט",
    description: "מורה אמיתי, לא אפליקציה - איך זה עובד",
    sitemap: { priority: 0.7, changeFrequency: "monthly" },
  },
  seminar: {
    path: "/ads",
    title: getProduct("course")?.name ?? "הסמינר",
    description: "הסמינר של שבוע: קבוצת זום קטנה, תרגול יומי ומבחן פתיחה ומבחן סיום",
    sitemap: { priority: 0.6, changeFrequency: "weekly" },
  },
  blog: {
    path: "/blog",
    title: "בלוג",
    nav: "בלוג",
    description: "מאמרים מקוריים על הכנה לאמירנט",
    sitemap: { priority: 0.6, changeFrequency: "weekly" },
  },
  llm: {
    path: "/llm-information",
    title: "מידע מובנה ל-AI",
    description: "כל העובדות על Anglit במקום אחד, לציטוט",
    sitemap: { priority: 0.5, changeFrequency: "monthly" },
  },
  // Linked from the chrome but not indexed
  practice: { path: "/practice", title: "תרגול", nav: "תרגול" },
  account: { path: "/account", title: "האזור האישי", nav: "אזור אישי" },
} as const satisfies Record<string, Page>;

type IndexedPage = Page & Required<Pick<Page, "description" | "sitemap">>;

/** Public, indexable pages: sitemap.xml, llms.txt and /llm-information */
export const INDEXED_PAGES: IndexedPage[] = (Object.values(PAGE) as Page[]).filter((p): p is IndexedPage => "sitemap" in p);

/** The sitemap URL of a page ("/" is the bare site address) */
export function pageUrl(base: string, path: string) {
  return path === "/" ? base : `${base}${path}`;
}

const link = (p: Page, label: string) => ({ href: p.path, label });

export const HEADER_LINKS = [PAGE.practice, PAGE.pricing, PAGE.examDates, PAGE.blog, PAGE.account].map((p) => link(p, p.nav));

export const FOOTER_LINKS = [
  PAGE.start,
  PAGE.sampleTest,
  PAGE.words,
  PAGE.pricing,
  PAGE.tutor,
  PAGE.blog,
  PAGE.examDates,
  PAGE.amirnet,
  PAGE.score,
  PAGE.account,
].map((p) => link(p, p.title));
