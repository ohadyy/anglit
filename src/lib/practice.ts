import { questions, type Question, type QuestionType } from "@/content/questions";
import { site } from "./site";

export const TYPES: QuestionType[] = ["sentence", "restatement", "reading"];

export function isQuestionType(v: unknown): v is QuestionType {
  return typeof v === "string" && (TYPES as string[]).includes(v);
}

/**
 * Builds a free practice set. Mixed mode mirrors the exam's order:
 * sentence completion, then restatements, then one reading passage.
 */
export function buildSet(type?: QuestionType, limit = site.freeLimit): Question[] {
  if (type) return questions.filter((q) => q.type === type).slice(0, limit);

  const sc = questions.filter((q) => q.type === "sentence").slice(0, 4);
  const rs = questions.filter((q) => q.type === "restatement").slice(0, 3);
  const rc = questions.filter((q) => q.type === "reading" && q.passageId === "heat").slice(0, 3);
  return [...sc, ...rs, ...rc].slice(0, limit);
}
