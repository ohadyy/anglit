import { SESSIONS } from "./calmSessions";
import { countWord } from "./facts";

// Texts for the /calm mindset area, voiced by Angela. Wording is gender-neutral on purpose (owner request).

export const calmCopy = {
  greeting: "אני אנג'לה.",
  ask: "ואני כאן כדי לשמור לכם על האיזון המנטלי במבחן.",
  thoughtsTitle: "לסנן את הרעש",
  thoughtsText: "דקה של מחשבות. מחליקים החוצה את המחשבות שמעכבות, ושומרים את אלו שעוזרות.",
  eliminateTitle: "לפסול ולהמשיך",
  eliminateText: "שתי תשובות שאי אפשר שיהיו נכונות בכל שאלה. מתרגלים לפסול אותן במקום להיתקע.",
  blackoutTitle: "מה עושים כשנתקעים",
  blackoutText: "שלושה רגעים שקורים בכל מבחן, ומה כדאי לעשות בכל אחד. בלי ציון.",
  sessionsTitle: "סשנים קוליים",
  sessionsText: `${countWord(SESSIONS.length, "f")} הקלטות קצרות עם אנג'לה. מומלץ עם אוזניות, ואפשר לעצום עיניים.`,
  sessionsBack: "כל הסשנים",
  sessionsAuthor: "אנג'לה",
  playLabel: "ניגון",
  pauseLabel: "השהיה",
  tabPlayer: "נגן",
  tabText: "טקסט",
  minutesUnit: "דקות",
  disclaimer: "זה אימון קצר, לא טיפול. אם הלחץ מרגיש גדול מדי, שווה לדבר עם איש מקצוע.",
};

/** Length of one thoughts round; the texts say "דקה" (thoughtsText, intro), so change them together */
export const THOUGHTS_ROUND_SECONDS = 60;

export const thoughtsCopy = {
  intro: "תוך דקה יופיעו מחשבות, אחת אחרי השנייה. מחשבה שמעכבת: לפח. מחשבה שעוזרת: שומרים.",
  start: "מתחילים",
  trash: "לפח",
  keep: "שומרים",
  fix: "לא בדיוק. נסו שוב.",
  again: "עוד סיבוב",
  back: "חזרה",
};

export type Thought = { id: string; text: string; heavy: boolean };

// heavy: true = a thought that slows you down. false = an anchor that helps.
export const THOUGHTS: Thought[] = [
  { id: "h01", text: "כולם מסיימים לפניי", heavy: true },
  { id: "h02", text: "אני לא אזכור כלום", heavy: true },
  { id: "h03", text: "אוף, שוב טעיתי", heavy: true },
  { id: "h04", text: "הלך לי הפוקוס, הכול הלך", heavy: true },
  { id: "h05", text: "אם אכשל, ילך לי התואר", heavy: true },
  { id: "h06", text: "כל השאלות האלה קשות מדי", heavy: true },
  { id: "h07", text: "חובה שאדע כל תשובה", heavy: true },
  { id: "h08", text: "כולם יודעים יותר ממני", heavy: true },
  { id: "h09", text: "אין לי זמן לשום דבר", heavy: true },
  { id: "h10", text: "הלב דופק, סימן שההכנה לא הייתה מספיקה", heavy: true },
  { id: "h11", text: "אם לא הבנתי את השאלה הזאת, הלך המבחן", heavy: true },
  { id: "h12", text: "שכחתי את כל המילים", heavy: true },
  { id: "h13", text: "בכל מבחן זה קורה לי שוב: בלאקאאוט", heavy: true },
  { id: "h14", text: "כל הלמידה שלי הייתה בשביל כלום", heavy: true },
  { id: "h15", text: "חובה שאצליח בניסיון הראשון", heavy: true },
  { id: "k01", text: "טעיתי בשאלה הזאת, אבל השאלה הבאה היא הזדמנות חדשה", heavy: false },
  { id: "k02", text: "לנשום, לדלג, לחזור", heavy: false },
  { id: "k03", text: "התכוננתי לשאלות האלה, הכול בסדר", heavy: false },
  { id: "k04", text: "שאלה אחת היא רק אחת, היא לא משפיעה על כל המבחן", heavy: false },
  { id: "k05", text: "אפשר לפסול שתי תשובות גם כשלא בטוחים", heavy: false },
  { id: "k06", text: "לא חייבים לדעת הכול, מספיק לדעת מספיק", heavy: false },
  { id: "k07", text: "לחץ בגוף הוא אנרגיה, לא סימן לכישלון", heavy: false },
  { id: "k08", text: "מותר לעצור שנייה ולנשום לפני שממשיכים", heavy: false },
  { id: "k09", text: "מה שלא ברור עכשיו, אחזור אליו בסוף", heavy: false },
  { id: "k10", text: "קריאה רגועה חוסכת זמן", heavy: false },
  { id: "k12", text: "המילים שלמדתי עדיין שם, גם אם לא עולות מיד", heavy: false },
  { id: "k13", text: "אני עושה את הכי טוב שאפשר ברגע הזה", heavy: false },
  { id: "k14", text: "גם אם טעיתי בשאלה הקודמת, שאלה חדשה היא דף חדש", heavy: false },
  { id: "k15", text: "אפשר לנסות שוב בפעם הבאה, וזה בסדר", heavy: false },
  { id: "k16", text: "קודם הקלות, אחר כך הקשות", heavy: false },
];
