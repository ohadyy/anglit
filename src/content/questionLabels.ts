// Labels and type lists only, with no questions in them. Client components import from here,
// so the answer bank in questions.ts is not sent to the browser on public pages.
import type { QuestionType } from "./questions";

export const TYPE_LABELS: Record<QuestionType, { he: string; en: string }> = {
  sentence: { he: "השלמת משפטים", en: "Sentence Completion" },
  restatement: { he: "ניסוח מחדש", en: "Restatements" },
  reading: { he: "הבנת הנקרא", en: "Reading Comprehension" },
  listening: { he: "הבנת הנשמע", en: "Listening" },
  grammar: { he: "דקדוק בהקשר", en: "Grammar in Context" },
  audiocomplete: { he: "השלמת קטע שמע", en: "Listening Text Continuation" },
  wordformation: { he: "יצירת מילה", en: "Word Formation" },
};

/** The three types the homepage shows as free-practice cards */
export const TYPES = ["sentence", "restatement", "reading"] as const satisfies readonly QuestionType[];

/** Every type a visitor can pick on /practice */
export const ALL_TYPES = ["sentence", "restatement", "reading", "listening", "grammar"] as const satisfies readonly QuestionType[];

export function isQuestionType(v: unknown): v is QuestionType {
  return typeof v === "string" && (ALL_TYPES as readonly string[]).includes(v);
}
