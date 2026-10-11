import { passages, questions, wordFormationQuestions, type ExamQuestion, type QuestionType } from "@/content/questions";
import { audioCompletionSets, lectureSets, wordFormationSets } from "@/content/pilotBank";
import { findExamTest, grammarSetIds } from "@/content/examTests";

// The structure follows NITE's published format (see the practice-test guide):
// six core chapters, the same in every test, then two experimental chapters.
// Each experimental chapter is one of four types, drawn at random, and the same
// type can appear twice. The student cannot choose them.
// This is a timing and format simulation with our own original questions, not a
// reproduction of NITE's content. The real test is also adaptive, and this site's
// tests are fixed; see docs/project-brain.md.
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
export type ExamPlanItem = { section: ExamSection; questions: ExamQuestion[] };

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

/** Builds the full plan of one fixed test. The number decides everything: the
 * core sections are drawn with a seed taken from the number, and the pilot chapters
 * come from pilotChapters(). The same number always produces the same test. */
export function buildExam(testNumber: string): ExamPlanItem[] {
  const test = findExamTest(testNumber);
  if (!test) throw new Error(`unknown exam test ${testNumber}`);

  const rand = seededRandom(Number(testNumber));

  const sentencePool = shuffle(questions.filter((q) => q.type === "sentence"), rand);
  const restatementPool = shuffle(questions.filter((q) => q.type === "restatement"), rand);

  // Reading uses one written passage with at least five questions
  const readablePassages = passages.filter(
    (p) => !p.audio && questions.filter((q) => q.type === "reading" && q.passageId === p.id).length >= 5,
  );
  const passage = readablePassages[Math.floor(rand() * readablePassages.length)];
  const readingPool = shuffle(
    questions.filter((q) => q.type === "reading" && q.passageId === passage.id),
    rand,
  );

  let sentenceIdx = 0;
  let restatementIdx = 0;
  let readingIdx = 0;

  const core = CORE_SECTIONS.map((section): ExamPlanItem => {
    if (section.type === "sentence") {
      const slice = sentencePool.slice(sentenceIdx, sentenceIdx + section.count);
      sentenceIdx += section.count;
      return { section, questions: slice };
    }
    if (section.type === "restatement") {
      const slice = restatementPool.slice(restatementIdx, restatementIdx + section.count);
      restatementIdx += section.count;
      return { section, questions: slice };
    }
    const slice = readingPool.slice(readingIdx, readingIdx + section.count);
    readingIdx += section.count;
    return { section, questions: slice };
  });

  return [...core, ...pilotChapters(testNumber)];
}
