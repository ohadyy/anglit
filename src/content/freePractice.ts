// The four practices open to everyone, shared by /start and the "what next" card shown after one of them ends.
export type FreeActivityId = "questions" | "exam" | "words" | "vocab";

export const FREE_ACTIVITIES: { id: FreeActivityId; href: string; title: string; text: string }[] = [
  { id: "questions", href: "/practice?type=free", title: "5 שאלות חינם", text: "דוגמה קצרה מהמאגר, עם הסבר מלא לכל תשובה." },
  { id: "exam", href: "/exam", title: "סימולציית מבחן חינם", text: "מבחן תרגול שלם אחד, באותו מבנה ותזמון של האמירנט." },
  { id: "words", href: "/practice/words", title: "שרשרת מילים חינם", text: "משחק קצר לזכירת מילים, עד 20 מילים." },
  { id: "vocab", href: "/vocabulary", title: "אוצר מילים חינם", text: "כרטיסיות הפוכות ללמידת מילים, עד 20 מילים." },
];
