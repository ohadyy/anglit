// The practice tests. The 5-digit number identifies a test. Numbers are random, not in
// sequence. The first 20 are frozen exactly as they were (content/frozenTests.ts). The
// adaptive ones draw each chapter from the exam-only pool by the student's level so far,
// like the real exam (see lib/examStructure.ts).
export type ExamTestDef = {
  number: string;
  /** Open to anyone signed in, no payment required. Exactly one test carries this. */
  free?: boolean;
  /** Chapters chosen by level from content/examPool.ts, instead of a frozen list */
  adaptive?: true;
  /** The 7-chapter version of the real exam: one writing task instead of the two pilot chapters */
  writing?: true;
};

export const examTests: ExamTestDef[] = [
  { number: "42894" },
  { number: "18052" },
  { number: "95815" },
  { number: "60317" },
  { number: "27608" },
  { number: "83441" },
  { number: "51926" },
  { number: "70243" },
  { number: "36789" },
  { number: "14685" },
  { number: "23570" },
  { number: "68104" },
  { number: "47293" },
  { number: "91836" },
  { number: "30562" },
  { number: "75418" },
  { number: "12947" },
  { number: "58360" },
  { number: "86021" },
  { number: "39675" },
  { number: "29417", adaptive: true },
  { number: "64083", adaptive: true },
  { number: "81356", adaptive: true },
  { number: "47720", adaptive: true, writing: true },
  { number: "15938", adaptive: true },
  { number: "73061", adaptive: true, writing: true },
  { number: "38254", adaptive: true },
  { number: "92607", adaptive: true },
  { number: "56149", adaptive: true, writing: true },
  { number: "20873", adaptive: true },
  { number: "61842", adaptive: true },
  { number: "34509", adaptive: true, writing: true },
  { number: "87216", adaptive: true },
  { number: "19473", adaptive: true },
  { number: "52638", adaptive: true },
  { number: "76094", adaptive: true },
  { number: "43851", adaptive: true },
  { number: "98327", adaptive: true },
  { number: "25760", adaptive: true },
  { number: "69185", adaptive: true, free: true },
];

/** The grammar-in-context sets, four items each. The first set is in questions.ts,
 * the rest are in grammarBank.ts. A test draws one of these when its chapter is grammar. */
export const grammarSetIds: string[][] = [
  ["gr-01", "gr-02", "gr-03", "gr-04"],
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16].map((n) => [1, 2, 3, 4].map((k) => `g${n}-${k}`)),
];

export function findExamTest(number: string): ExamTestDef | undefined {
  return examTests.find((t) => t.number === number);
}
