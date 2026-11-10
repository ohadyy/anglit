import { passages, questions, wordFormationQuestions, type ExamQuestion, type Passage } from "@/content/questions";
import { poolPassages, poolReading, poolRestatement, poolSentence } from "@/content/examPool";

// Every question an exam can ask, by id: the practice bank, word formation and the exam-only pool.
// Saved reviews, scoring and the test builder all look questions up here.
const byId = new Map<string, ExamQuestion>([
  ...questions,
  ...wordFormationQuestions,
  ...poolSentence,
  ...poolRestatement,
  ...Object.values(poolReading).flat(),
].map((q) => [q.id, q] as const));

export function findQuestion(id: string): ExamQuestion | undefined {
  return byId.get(id);
}

const TYPE_ORDER = ["sentence", "restatement", "reading", "listening", "audiocomplete", "wordformation", "grammar"];

/** The questions of a saved attempt, grouped by type. The database does not keep the order
 * the questions were asked in, so this is the closest stable order. */
export function reviewItems(answers: Record<string, number | string | null>) {
  return Object.entries(answers)
    .flatMap(([id, value]) => {
      const q = byId.get(id);
      return q ? [{ q, value }] : [];
    })
    .sort((a, b) => TYPE_ORDER.indexOf(a.q.type) - TYPE_ORDER.indexOf(b.q.type) || a.q.id.localeCompare(b.q.id, "en", { numeric: true }));
}

const passageIdsOf = (list: ExamQuestion[]) => new Set(list.flatMap((q) => ("passageId" in q ? [q.passageId] : [])));

/** Only the passages that these questions refer to, so the rest never reach the browser */
export function passagesFor(list: ExamQuestion[]): Passage[] {
  const ids = passageIdsOf(list);
  return [...passages, ...poolPassages].filter((p) => ids.has(p.id));
}

/** The passages an adaptive test page needs: the ones its first chapters use, plus every pool
 * passage, because the test picks its reading passage while it runs. */
export function passagesForAdaptiveExam(list: ExamQuestion[]): Passage[] {
  const ids = passageIdsOf(list);
  return [...passages.filter((p) => ids.has(p.id)), ...poolPassages];
}
