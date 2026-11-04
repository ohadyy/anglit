import { questions, type Question, type QuestionType } from "@/content/questions";
import { affixQuestions } from "@/content/affixesBank";

export { TYPES, ALL_TYPES, isQuestionType } from "@/content/questionLabels";

/** Every question of one type, in bank order */
export function buildSet(type: QuestionType): Question[] {
  return questions.filter((q) => q.type === type);
}

/** The single-stem questions the question of the day draws from (no passage needed) */
export function buildDailyPool(): Question[] {
  return questions.filter((q) => q.type === "sentence" || q.type === "restatement");
}

/** The connector drills (ids cn-01…), a topic cut across sentence completion and restatements */
export function buildConnectors(): Question[] {
  return questions.filter((q) => q.id.startsWith("cn-"));
}

/** The prefix and suffix drills (ids af-01…). Not part of `questions`, so they never reach exams. */
export function buildAffixes(): Question[] {
  return affixQuestions;
}

/** The five questions anyone can try without paying: two sentence completions,
 * two restatements and one reading question */
export function buildFreeSet(): Question[] {
  const sc = buildSet("sentence").slice(0, 2);
  const rs = buildSet("restatement").slice(0, 2);
  const rc = questions.filter((q) => q.type === "reading" && q.passageId === "heat").slice(0, 1);
  return [...sc, ...rs, ...rc];
}
