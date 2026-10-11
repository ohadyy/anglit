// The fixed practice tests. The 5-digit number identifies a test: the same number
// always gives the same experimental chapters, and the same seeded sentence,
// restatement and reading selection (see lib/examStructure.ts). Numbers are random,
// not in sequence.
export type ExamTestDef = {
  number: string;
  /** Open to anyone signed in, no payment required. Exactly one test carries this. */
  free?: boolean;
};

export const examTests: ExamTestDef[] = [
  { number: "42894", free: true },
  { number: "18052" },
  { number: "95815" },
  { number: "60317" },
  { number: "27608" },
  { number: "83441" },
  { number: "51926" },
  { number: "70243" },
  { number: "36789" },
  { number: "14685" },
];

/** The grammar-in-context sets, four items each. The first set is in questions.ts,
 * the rest are in grammarBank.ts. A test draws one of these when its chapter is grammar. */
export const grammarSetIds: string[][] = [
  ["gr-01", "gr-02", "gr-03", "gr-04"],
  ...[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => [1, 2, 3, 4].map((k) => `g${n}-${k}`)),
];

export function findExamTest(number: string): ExamTestDef | undefined {
  return examTests.find((t) => t.number === number);
}
