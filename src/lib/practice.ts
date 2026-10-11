import { questions, type Question, type QuestionType } from "@/content/questions";

export { TYPES, ALL_TYPES, isQuestionType } from "@/content/questionLabels";

/** Every question of one type, in bank order */
export function buildSet(type: QuestionType): Question[] {
  return questions.filter((q) => q.type === type);
}

/** The five questions anyone can try without paying: two sentence completions,
 * two restatements and one reading question */
export function buildFreeSet(): Question[] {
  const sc = buildSet("sentence").slice(0, 2);
  const rs = buildSet("restatement").slice(0, 2);
  const rc = questions.filter((q) => q.type === "reading" && q.passageId === "heat").slice(0, 1);
  return [...sc, ...rs, ...rc];
}
