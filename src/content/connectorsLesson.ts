// Text of the connectors lesson at /learn/connectors. Original writing for Anglit.

import { connectorQuestions } from "./connectorsBank";

export const connectorsLesson = {
  seoTitle: "מילות קישור באמירנט: שיעור קצר ותרגול",
  seoDescription:
    "although, however, therefore ועוד: מה כל מילת קישור אומרת על כיוון המשפט, ארבע מלכודות דקדוק וטריק של שלושה צעדים לפסילת תשובות בהשלמת משפטים ובניסוח מחדש.",
  title: "מילות קישור: להבין לאן המשפט הולך",
  intro:
    "רוב הטעויות בהשלמת משפטים ובניסוח מחדש לא נובעות ממילה קשה. הן נובעות ממילה קטנה שלא שמנו לב אליה. מילת הקישור אומרת לכם לאן המשפט הולך, ועוזרת לפסול תשובות לפני שאתם חושבים על משמעות.",

  groupsTitle: "שמונה תפקידים, ומה כל אחד אומר לתשובה",
  groups: [
    {
      role: "ניגוד",
      words: "but, yet, however, nevertheless, nonetheless, even so, still, on the other hand, in contrast, whereas, while, although, though, even though, despite, in spite of",
      meaning: "החלק השני הפוך מהצפוי, או הפוך מהראשון.",
    },
    {
      role: "סיבה",
      words: "because, since, as, because of, due to, owing to, thanks to",
      meaning: "מה שבא אחרי המילה מסביר למה.",
    },
    {
      role: "תוצאה",
      words: "so, therefore, thus, hence, consequently, as a result, accordingly",
      meaning: "מה שבא אחרי המילה נובע ממה שלפניה.",
    },
    {
      role: "הוספה",
      words: "moreover, furthermore, in addition, besides, also, what is more",
      meaning: "עוד נקודה, באותו כיוון.",
    },
    {
      role: "דוגמה והבהרה",
      words: "for example, for instance, such as, namely, in other words, that is",
      meaning: "מפרטות או מסבירות את מה שנאמר.",
    },
    {
      role: "תנאי",
      words: "if, unless, provided that, as long as, otherwise, in case",
      meaning: "דבר אחד תלוי בשני. unless = אם לא. otherwise = אחרת.",
    },
    {
      role: "זמן",
      words: "before, after, once, until, while, meanwhile, eventually, subsequently",
      meaning: "סדר האירועים.",
    },
    {
      role: "חלופה והדגשה",
      words: "instead, rather than, not only … but also, in fact, indeed",
      meaning: "במקום משהו אחר, או חיזוק של מה שנאמר.",
    },
  ],

  trapsTitle: "ארבע מלכודות דקדוק שפוסלות תשובות מהר",
  traps: [
    "despite, in spite of, because of ו-due to באות לפני שם עצם או פועל עם ing. although, because, since ו-whereas באות לפני משפט שלם.",
    "however, therefore ו-moreover חוברות בין שני משפטים, אחרי נקודה או נקודה-פסיק, ופסיק אחריהן. הן לא עובדות כמו but.",
    "unless = if … not. \"Unless you hurry\" שווה ל\"If you don't hurry\".",
    "whereas ו-while מציגות ניגוד בין שני דברים, לא סיבה.",
  ],

  trickTitle: "הטריק בשלושה צעדים",
  trick: [
    "מסמנים את מילת הקישור לפני שמסתכלים על התשובות.",
    "קובעים את הכיוון: אותו כיוון, הפוך, סיבה או תוצאה.",
    "פוסלים כל תשובה שהולכת לכיוון הלא נכון, לפני שחושבים על מילים קשות.",
  ],

  tryTitle: "נסו בעצמכם",
  tryText: "שתי שאלות מהתרגול, עם הסבר אחרי כל תשובה.",

  ctaTitle: `${connectorQuestions.length} שאלות על מילות קישור`,
  ctaText: "תרגול ממוקד בהשלמת משפטים ובניסוח מחדש, עם הסבר לכל תשובה. הטעויות נשמרות ב\"הטעויות שלי\" עד שעונים נכון.",
  ctaButton: "לתרגול המלא",
  ctaNote: "התרגול המלא במסלול בתשלום.",
};
