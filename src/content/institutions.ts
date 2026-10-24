// Per-institution English placement facts for /amirnet/[slug] (SEO pages).
// RULE: every number here was read off the institution's own official page on `checkedAt`.
// Never add an institution from memory, a forum or a course-seller's site: a wrong threshold
// costs more trust than the page earns. To add one, open its official English-unit page,
// copy the table, fill `sourceUrl` + `checkedAt`. Institutions set levels themselves (NITE says so).
// Not added yet because the official page could not be read: Reichman, Sapir, Ariel.

export type InstitutionBand = {
  level: string;
  /** Score range as the institution prints it, e.g. "120–133" */
  range: string;
  note?: string;
};

export type Institution = {
  slug: string;
  name: string;
  /** Name with the "in" prefix attached, e.g. "בטכניון", for headlines */
  inName: string;
  sourceLabel: string;
  sourceUrl: string;
  checkedAt: string;
  /** One sentence answering "what score do I need", used as the page's lead */
  answer: string;
  bands: InstitutionBand[];
  /** Extra rules worth knowing, each one stated on the source page */
  facts: string[];
};

const CHECKED = "20.10.2026";

export const institutions: Institution[] = [
  {
    slug: "hebrew-university",
    name: "האוניברסיטה העברית",
    inName: "באוניברסיטה העברית",
    sourceLabel: "סיווג לרמות, היחידה ללימודי אנגלית כשפה זרה",
    sourceUrl: "https://efl.huji.ac.il/book/%D7%A1%D7%99%D7%95%D7%95%D7%92-%D7%9C%D7%A8%D7%9E%D7%95%D7%AA-0",
    checkedAt: CHECKED,
    answer: "באוניברסיטה העברית ציון 134 ומעלה באמירנט נותן פטור מלימודי אנגלית. עם ציון של 84 ומטה לא ניתן להתקבל לאוניברסיטה.",
    bands: [
      { level: "פטור", range: "134 ומעלה" },
      { level: "מתקדמים ב׳", range: "120–133", note: "4 ש״ש" },
      { level: "מתקדמים א׳", range: "100–119", note: "4 ש״ש" },
      { level: "בסיסי", range: "85–99", note: "6 ש״ש" },
      { level: "לא ניתן להתקבל לאוניברסיטה", range: "84 ומטה" },
    ],
    facts: ["מי שניגש ליותר ממבחן אחד לסיווג רמת האנגלית: הציון הגבוה קובע."],
  },
  {
    slug: "tel-aviv-university",
    name: "אוניברסיטת תל אביב",
    inName: "באוניברסיטת תל אביב",
    sourceLabel: "ידיעת השפה האנגלית, אתר ההרשמה של אוניברסיטת תל אביב",
    sourceUrl: "https://go.tau.ac.il/he/ba/english",
    checkedAt: CHECKED,
    answer:
      "באוניברסיטת תל אביב ציון 134 ומעלה באמירנט נותן פטור. כדי להתקבל צריך להגיע לפחות לרמת מתקדמים א׳ (100) עד תחילת שנת הלימודים.",
    bands: [
      { level: "פטור", range: "134 ומעלה" },
      { level: "מתקדמים ב׳", range: "120–133" },
      { level: "מתקדמים א׳", range: "100–119" },
      { level: "בסיסי", range: "85–99" },
      { level: "טרום בסיסי", range: "עד 84" },
    ],
    facts: [
      "כל המועמדים נדרשים להגיע לרמת מתקדמים א׳ לפחות עד תחילת שנת הלימודים, אלא אם בטבלת הקבלה של היחידה כתוב אחרת. מי שסווג טרום בסיסי נדחה.",
      "מ-1.5.2024 אפשר להיבחן רק באמירנט. ציוני אמיר ואמירם ממבחנים שנערכו לפני התאריך הזה עדיין מתקבלים.",
      "מותר להיבחן באמירנט גם אם כבר יש לכם רמת אנגלית בתוקף. בין מבחן למבחן צריך לעבור לפחות 35 יום, ומבחן שנערך מוקדם יותר מתבטל בלי החזר כספי.",
    ],
  },
  {
    slug: "technion",
    name: "הטכניון",
    inName: "בטכניון",
    sourceLabel: "תקנת האנגלית, פורטל ההוראה של הטכניון",
    sourceUrl: "https://ugportal.technion.ac.il/?p=19464",
    checkedAt: CHECKED,
    answer: "בטכניון ציון 134 ומעלה נותן פטור מקורסי ההכשרה באנגלית. עם ציון של 103 ומטה לא ניתן להתקבל לטכניון.",
    bands: [
      { level: "פטור", range: "134–150" },
      { level: "אנגלית טכנית, מתקדמים ב׳", range: "120–133" },
      { level: "אנגלית למתקדמים א׳", range: "104–119" },
      { level: "לא ניתן להתקבל לטכניון", range: "103 ומטה" },
    ],
    facts: [
      "מתשפ״ב, כל סטודנט בתואר ראשון חייב ללמוד לפחות שני קורסים בשפה האנגלית: שני קורסי הכשרה, שני קורסי תוכן באנגלית, או אחד מכל סוג.",
      "מי שפטור לא יכול לקחת את קורסי ההכשרה, ולכן משלים את הדרישה בקורסי תוכן באנגלית.",
      "את קורסי ההכשרה צריך להשלים תוך ארבעה סמסטרים לכל היותר. מי שלא משלים את שני הקורסים לא יוכל לסיים את התואר.",
    ],
  },
  {
    slug: "bar-ilan",
    name: "אוניברסיטת בר-אילן",
    inName: "באוניברסיטת בר-אילן",
    sourceLabel: "Exemption Criteria, היחידה ללימודי אנגלית כשפה זרה (EFL)",
    sourceUrl: "https://efl.biu.ac.il/en/node/2230",
    checkedAt: CHECKED,
    answer:
      "בבר-אילן ציון 134 ומעלה באמירנט (או בחלק האנגלית של הפסיכומטרי) מזכה בפטור, אבל הפטור לא ניתן אוטומטית: צריך להגיש תיעוד ליחידה.",
    bands: [
      { level: "פטור", range: "134 ומעלה" },
      { level: "מתקדמים ב׳", range: "120–133" },
      { level: "מתקדמים א׳", range: "100–119" },
      { level: "בסיסי", range: "85–99" },
    ],
    facts: [
      "הפטור לא אוטומטי. צריך להגיש ליחידה ללימודי אנגלית כשפה זרה תיעוד מתאים.",
      "פטור אפשר לקבל גם עם תעודת בגרות ממדינה דוברת אנגלית, או עם תואר ראשון ממוסד ישראלי מוכר על ידי המועצה להשכלה גבוהה (גם כאן בהגשת תיעוד).",
    ],
  },
  {
    slug: "haifa-university",
    name: "אוניברסיטת חיפה",
    inName: "באוניברסיטת חיפה",
    sourceLabel: "ידיעת השפה האנגלית, אתר המתעניינים של אוניברסיטת חיפה",
    sourceUrl: "https://admissions.haifa.ac.il/english-language-proficiency/",
    checkedAt: CHECKED,
    answer:
      "באוניברסיטת חיפה ציון 134 באמירנט נותן פטור מקורסי הרמה. גם עם פטור צריך ללמוד שני קורסי תוכן באנגלית.",
    bands: [
      { level: "פטור", range: "134 ומעלה", note: "שני קורסי תוכן באנגלית" },
      { level: "מתקדמים ב׳", range: "120–133", note: "קורס מתקדמים ב׳ וקורס תוכן אחד באנגלית" },
      { level: "מתקדמים א׳", range: "100–119", note: "מתקדמים א׳ ומתקדמים ב׳" },
      { level: "בסיסי", range: "85–99", note: "בסיסי, מתקדמים א׳ ומתקדמים ב׳" },
      { level: "טרום בסיסי ב׳", range: "70–84" },
      { level: "טרום בסיסי א׳", range: "50–69" },
    ],
    facts: [
      "הרמה נקבעת לפי החלק האנגלי של הפסיכומטרי, אמירם או אמירנט.",
      "מי שסווג טרום בסיסי (א׳ או ב׳) לומד גם את הרמות שמעליו: בסיסי, מתקדמים א׳ ומתקדמים ב׳.",
      "הדף לא מציין ציון מינימום לקבלה, ולא מועדים. הפרטים נמצאים במזכירות החוג וביחידה לאנגלית.",
    ],
  },
  {
    slug: "open-university",
    name: "האוניברסיטה הפתוחה",
    inName: "באוניברסיטה הפתוחה",
    sourceLabel: "סיווג רמה ובחינות מיון, היחידה לאנגלית כשפה בין-לאומית",
    sourceUrl: "https://academic.openu.ac.il/english/pages/classification.aspx",
    checkedAt: CHECKED,
    answer:
      "באוניברסיטה הפתוחה ציון 134 ומעלה באמירנט מסווג לרמת פטור, שדורשת בכל זאת להשלים שני קורסי תוכן באנגלית.",
    bands: [
      { level: "פטור", range: "134 ומעלה", note: "שני קורסי תוכן באנגלית" },
      { level: "מתקדמים ב׳", range: "120–133", note: "קורס תוכן אחד באנגלית" },
      { level: "מתקדמים א׳", range: "100–119" },
      { level: "בסיסי", range: "85–99" },
      { level: "טרום בסיסי ב׳", range: "70–84" },
      { level: "טרום בסיסי א׳", range: "60–69" },
      { level: "סדנת גישור", range: "56–59" },
      { level: "טרום סדנת גישור", range: "50–55", note: "לפני הקורס עוברים מבחן מיון פנימי" },
    ],
    facts: [
      "הסיווג נקבע בדיוק לפי הציון, גם כשההפרש בין רמות הוא נקודה אחת.",
      "אפשר להיבחן שוב, והציון הגבוה קובע.",
      "מסמסטר א׳ תשפ״ד, סיווג תקף שבע שנים ממועד המבחן או מסיום הקורס האחרון.",
      "אמירנט החליף את אמירם ממאי 2024.",
    ],
  },
  {
    slug: "ben-gurion-university",
    name: "אוניברסיטת בן-גוריון בנגב",
    inName: "באוניברסיטת בן-גוריון בנגב",
    sourceLabel: "קורסי אנגלית כשפה זרה, פטור מאנגלית, אוניברסיטת בן-גוריון",
    sourceUrl: "https://www.bgu.ac.il/welcome/contents/pre-registration/english-courses/",
    checkedAt: CHECKED,
    answer:
      "בבן-גוריון ציון 134 ומעלה בפרק האנגלית של הפסיכומטרי או באמירנט פוטר מלימודי אנגלית. אפשר להגיע לפטור גם דרך קורס מתקדמים ב׳ באוניברסיטה.",
    bands: [
      { level: "פטור", range: "134 ומעלה" },
      { level: "מתקדמים ב׳", range: "120–133", note: "קורס של 4 ש״ש, וסיומו מעניק פטור" },
      { level: "מתקדמים א׳", range: "100–119", note: "4 ש״ש" },
      { level: "בסיסי", range: "85–99", note: "6 ש״ש" },
    ],
    facts: [
      "קורס מתקדמים ב׳ מעניק פטור מלימודי אנגלית ושווה 2 נק״ז. ציון הקורס נכנס לממוצע התואר.",
      "סטודנט שיש לו פטור ונרשם בכל זאת לקורס אנגלית, מאבד את הפטור ויידרש ללמוד את הקורס.",
      "לא ניתן להכיר בקורס בודד שנלמד באוניברסיטה הפתוחה, באריאל, ברייכמן או בתל-חי.",
    ],
  },
  {
    slug: "tel-hai",
    name: "מכללת תל-חי",
    inName: "במכללת תל-חי",
    sourceLabel: "לימודי אנגלית כשפה בינלאומית, תל-חי",
    sourceUrl: "https://www.telhai.ac.il/%D7%9C%D7%99%D7%9E%D7%95%D7%93%D7%99_%D7%90%D7%A0%D7%92%D7%9C%D7%99%D7%AA_%D7%9B%D7%A9%D7%A4%D7%94_%D7%91%D7%99%D7%A0%D7%9C%D7%90%D7%95%D7%9E%D7%99%D7%AA",
    checkedAt: CHECKED,
    answer:
      "בתל-חי הציון הנדרש לקבלה הוא 85 לפחות באמירנט (בחלק מהחוגים נדרשת רמה גבוהה יותר), וציון 134 ומעלה נותן פטור מלימודי אנגלית.",
    bands: [
      { level: "פטור", range: "134 ומעלה" },
      { level: "מתקדמים ב׳", range: "120–133", note: "4 ש״ש פרונטלי" },
      { level: "מתקדמים א׳", range: "100–119", note: "4 ש״ש פרונטלי" },
      { level: "בסיסי", range: "85–99", note: "6 ש״ש (4 פרונטלי, 2 מקוון)" },
      { level: "טרום בסיסי ב׳", range: "70–84", note: "6 ש״ש (4 פרונטלי, 2 מקוון)" },
      { level: "טרום בסיסי א׳", range: "50–69", note: "8 ש״ש (6 פרונטלי, 2 מקוון)" },
    ],
    facts: [
      "מועמד עם ציון נמוך מ-85, שעומד בדרישות החוג, מתקבל על תנאי: צריך להשלים בהצלחה את רמת טרום בסיסי עד סוף שנה א׳, אחרת הלימודים יופסקו.",
      "לפי דרישות המועצה להשכלה גבוהה, צריך להגיע לרמת פטור עד סוף שנה ב׳, ובכל מקרה לפני הרישום לסמינר, לקורסים מתקדמים או לעבודת גמר.",
      "שיפור רמה אפשרי רק עם ציון חדש באמירנט או בפסיכומטרי, לפני פתיחת שנת הלימודים או בין הסמסטרים.",
    ],
  },
];

export function getInstitution(slug: string): Institution | undefined {
  return institutions.find((i) => i.slug === slug);
}
