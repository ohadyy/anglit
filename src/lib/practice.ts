import { questions, type Question, type QuestionType } from "@/content/questions";
import { affixQuestions } from "@/content/affixesBank";
import { FREE_QUESTION_COUNT, LEVEL_GROUPS, type LevelGroup } from "@/content/practiceFacts";
import { levelOf } from "@/content/difficulty";

export function buildSet(type: QuestionType): Question[] {
  return questions.filter((q) => q.type === type);
}

/** The single-stem questions (no passage or audio needed): the question of the day and the timed challenge draw from these */
export function buildSingleStemPool(): Question[] {
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

/** The FREE_QUESTION_COUNT questions anyone can try without paying: two sentence completions,
 * two restatements and one reading question */
export function buildFreeSet(): Question[] {
  const sc = buildSet("sentence").slice(0, 2);
  const rs = buildSet("restatement").slice(0, 2);
  const rc = questions.filter((q) => q.type === "reading" && q.passageId === "heat").slice(0, 1);
  const free = [...sc, ...rs, ...rc];
  if (free.length !== FREE_QUESTION_COUNT) throw new Error(`buildFreeSet returned ${free.length} questions, FREE_QUESTION_COUNT is ${FREE_QUESTION_COUNT}`);
  return free;
}

/** Questions of one level group. Types with no rated questions (grammar, listening) return [] and get no picker. */
export function filterByLevel(set: Question[], group: LevelGroup): Question[] {
  const levels = LEVEL_GROUPS.find((g) => g.id === group)!.levels as readonly number[];
  return set.filter((q) => levels.includes(levelOf(q.id) ?? 0));
}

export function levelCounts(set: Question[]): Record<LevelGroup, number> {
  return Object.fromEntries(LEVEL_GROUPS.map((g) => [g.id, filterByLevel(set, g.id).length])) as Record<LevelGroup, number>;
}
