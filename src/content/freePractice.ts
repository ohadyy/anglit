import { FREE_QUESTION_COUNT, FREE_WORD_LIMIT } from "./practiceFacts";

export type FreeActivityId = "questions" | "exam" | "words" | "vocab" | "daily";

export const FREE_ACTIVITIES: { id: FreeActivityId; href: string; title: string; text: string }[] = [
  { id: "daily", href: "/practice/daily", title: "שאלת היום", text: "שאלה אחת ביום עם הסבר. עונים כל יום ושומרים על הרצף." },
  { id: "questions", href: "/practice?type=free", title: `${FREE_QUESTION_COUNT} שאלות חינם`, text: "דוגמה קצרה מהמאגר, עם הסבר מלא לכל תשובה." },
  { id: "exam", href: "/exam", title: "סימולציית מבחן חינם", text: "מבחן תרגול שלם אחד, באותו מבנה ותזמון של האמירנט." },
  { id: "words", href: "/practice/words", title: "שרשרת מילים חינם", text: `משחק קצר לזכירת מילים, עד ${FREE_WORD_LIMIT} מילים.` },
  { id: "vocab", href: "/vocabulary", title: "אוצר מילים חינם", text: `כרטיסיות הפוכות ללמידת מילים, עד ${FREE_WORD_LIMIT} מילים.` },
];
