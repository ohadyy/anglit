import { isCorrectAnswer, questions, wordFormationQuestions, type ExamQuestion, type QuestionType } from "@/content/questions";
import { audioCompletionSets, lectureSets, wordFormationSets } from "@/content/pilotBank";
import { findExamTest, grammarSetIds } from "@/content/examTests";
import { frozenTests } from "@/content/frozenTests";
import { poolPassages, poolReading, poolRestatement, poolSentence } from "@/content/examPool";
import { difficultyOf, estimateAbility } from "@/lib/examScore";
import { WRITING_MINUTES, writingTasks } from "@/content/writingTasks";

// The structure follows NITE's published format (see the practice-test guide):
// six core chapters, the same in every test, then two experimental chapters.
// Each experimental chapter is one of four types, drawn at random, and the same
// type can appear twice. The student cannot choose them.
// This is a timing and format simulation with our own original questions, not a
// reproduction of NITE's content.
// Two kinds of test:
// - frozen: the 20 original tests, served exactly as on 2026-11-04 (content/frozenTests.ts);
// - adaptive: like the real exam, the first chapter is medium and each later chapter is
//   picked by the ability estimated so far (see buildAdaptive below).
export type ExamSection = {
  type: QuestionType;
  count: number;
  minutes: number;
  pilot: boolean;
};

/** The four experimental chapter types, with their size from the published format */
export const PILOT_CHAPTER_TYPES = ["listening", "audiocomplete", "wordformation", "grammar"] as const;
export type PilotChapterType = (typeof PILOT_CHAPTER_TYPES)[number];

export const PILOT_CHAPTER: Record<PilotChapterType, { count: number; minutes: number }> = {
  listening: { count: 5, minutes: 7 },
  audiocomplete: { count: 4, minutes: 4 },
  wordformation: { count: 4, minutes: 3 },
  grammar: { count: 4, minutes: 4 },
};

export const CORE_SECTIONS: ExamSection[] = [
  { type: "sentence", count: 4, minutes: 4, pilot: false },
  { type: "sentence", count: 4, minutes: 4, pilot: false },
  { type: "reading", count: 5, minutes: 15, pilot: false },
  { type: "restatement", count: 3, minutes: 6, pilot: false },
  { type: "restatement", count: 3, minutes: 6, pilot: false },
  { type: "sentence", count: 4, minutes: 4, pilot: false },
];

export const EXAM_CORE_QUESTIONS = CORE_SECTIONS.reduce((sum, s) => sum + s.count, 0);
export const EXAM_CORE_MINUTES = CORE_SECTIONS.reduce((sum, s) => sum + s.minutes, 0);

// Two experimental chapters, so 8 to 10 questions in total
const pilotCounts = PILOT_CHAPTER_TYPES.map((t) => PILOT_CHAPTER[t].count);
export const EXAM_PILOT_QUESTIONS_RANGE = `${2 * Math.min(...pilotCounts)}–${2 * Math.max(...pilotCounts)}`;

/** One section of a fixed test, with its questions */
/** `prompt` is set only on a writing chapter, which has no questions */
export type ExamPlanItem = { section: ExamSection; questions: ExamQuestion[]; prompt?: string };

/** The writing task of the 7-chapter version. It replaces the two pilot chapters, never joins them.
 * Like the pilot chapters it is experimental: nothing in it is scored. */
function writingChapter(testNumber: string): ExamPlanItem {
  return {
    section: { type: "writing", count: 0, minutes: WRITING_MINUTES, pilot: true },
    questions: [],
    prompt: writingTasks[Number(testNumber) % writingTasks.length].prompt,
  };
}

/** Questions and minutes for a test, with or without the pilot sections */
export function planTotals(plan: ExamPlanItem[], includePilot: boolean) {
  const included = plan.filter((p) => includePilot || !p.section.pilot);
  return {
    sections: included.length,
    questions: included.reduce((sum, p) => sum + p.questions.length, 0),
    minutes: included.reduce((sum, p) => sum + p.section.minutes, 0),
  };
}

/** Small seeded PRNG (mulberry32), so one test number always gives the same order */
function seededRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rand: () => number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Every set a pilot chapter can draw from, by type
const byId = new Map<string, ExamQuestion>([
  ...questions.map((q) => [q.id, q] as const),
  ...wordFormationQuestions.map((q) => [q.id, q] as const),
]);
const pilotSetsByType: Record<PilotChapterType, ExamQuestion[][]> = {
  listening: lectureSets,
  audiocomplete: audioCompletionSets,
  wordformation: wordFormationSets,
  grammar: grammarSetIds.map((ids) => ids.map((id) => byId.get(id)!)),
};

/** The two experimental chapters of one test. The number decides the types and the sets.
 * A set never repeats inside one test, even when the two chapters have the same type. */
function pilotChapters(testNumber: string): ExamPlanItem[] {
  const rand = seededRandom(Number(testNumber) * 7919 + 17);
  const pickIndex = (n: number) => Math.floor(rand() * n);

  const types = [0, 1].map(() => PILOT_CHAPTER_TYPES[pickIndex(PILOT_CHAPTER_TYPES.length)]);
  const usedSets = new Map<PilotChapterType, number[]>();

  return types.map((type) => {
    const sets = pilotSetsByType[type];
    const taken = usedSets.get(type) ?? [];
    let index = pickIndex(sets.length);
    if (taken.includes(index)) index = (index + 1) % sets.length;
    usedSets.set(type, [...taken, index]);

    const spec = PILOT_CHAPTER[type];
    return {
      section: { type, count: spec.count, minutes: spec.minutes, pilot: true },
      questions: sets[index],
    };
  });
}

type Answers = Record<string, number | string | null | undefined>;

/** Order inside a chapter: easier first, as in the real exam */
const byDifficulty = (a: ExamQuestion, b: ExamQuestion) => difficultyOf(a.id) - difficultyOf(b.id);

/** The core chapters of an adaptive test. Chapter 1 is drawn around the national mean.
 * Before each later chapter, the ability is estimated (EAP) from every core answer so far,
 * and the chapter takes the unused pool items whose difficulty is closest to it. An answer
 * that is missing counts as wrong, as in the real exam. The test number seeds the draw, so
 * the same number and the same answers always rebuild the same test: the browser builds it
 * chapter by chapter, and the server rebuilds it from the final answers to score it.
 *
 * `seen` holds the pool items this student met in earlier tests, once per time met. Each
 * meeting counts as SEEN_PENALTY of distance from the student's level, so a fresh item at
 * about the right level always wins, a seen one comes back only once the nearby fresh items
 * run out, and then the least-met ones come back first. */
const SEEN_PENALTY = 1;

function buildAdaptive(testNumber: string, answers: Answers, seen: ReadonlyMap<string, number>): ExamPlanItem[] {
  const used = new Set<string>();
  const asked: { b: number; correct: boolean }[] = [];

  return CORE_SECTIONS.map((section, k): ExamPlanItem => {
    const theta = estimateAbility(asked);
    const rand = seededRandom(Number(testNumber) * 31 + k);
    const gap = (b: number, ids: string[]) => Math.abs(b - theta) + SEEN_PENALTY * Math.max(...ids.map((id) => seen.get(id) ?? 0));

    let picked: ExamQuestion[];
    if (section.type === "reading") {
      const meanB = (id: string) => {
        const qs = poolReading[id];
        return qs.reduce((sum, q) => sum + difficultyOf(q.id), 0) / qs.length;
      };
      const ids = (id: string) => poolReading[id].map((q) => q.id);
      const passage = shuffle(poolPassages, rand).sort((a, b) => gap(meanB(a.id), ids(a.id)) - gap(meanB(b.id), ids(b.id)))[0];
      picked = poolReading[passage.id].slice(0, section.count);
    } else {
      const pool = section.type === "sentence" ? poolSentence : poolRestatement;
      picked = shuffle(pool.filter((q) => !used.has(q.id)), rand)
        .sort((a, b) => gap(difficultyOf(a.id), [a.id]) - gap(difficultyOf(b.id), [b.id]))
        .slice(0, section.count)
        .sort(byDifficulty);
    }

    for (const q of picked) {
      used.add(q.id);
      asked.push({ b: difficultyOf(q.id), correct: isCorrectAnswer(q, answers[q.id]) });
    }
    return { section, questions: picked };
  });
}

/** Builds the full plan of one test. A frozen test ignores the answers. An adaptive test
 * needs the answers given so far to choose its later chapters; with no answers it shows
 * the medium path, which has the same chapters, sizes and minutes. `seen` (adaptive only)
 * lists the pool items the student met in earlier tests (once per time met), to avoid repeating them. */
export function buildExam(testNumber: string, answers: Answers = {}, seen: readonly string[] = []): ExamPlanItem[] {
  const test = findExamTest(testNumber);
  if (!test) throw new Error(`unknown exam test ${testNumber}`);

  const frozen = frozenTests[testNumber];
  if (frozen) {
    return frozen.map((part, i) => {
      const core = CORE_SECTIONS[i];
      const pilot = part.pilot ? PILOT_CHAPTER[part.type as PilotChapterType] : null;
      const section: ExamSection = pilot
        ? { type: part.type, count: pilot.count, minutes: pilot.minutes, pilot: true }
        : core;
      return { section, questions: part.ids.map((id) => byId.get(id)!) };
    });
  }

  if (!test.adaptive) throw new Error(`exam test ${testNumber} is neither frozen nor adaptive`);
  const times = new Map<string, number>();
  for (const id of seen) times.set(id, (times.get(id) ?? 0) + 1);
  return [...buildAdaptive(testNumber, answers, times), ...(test.writing ? [writingChapter(testNumber)] : pilotChapters(testNumber))];
}
