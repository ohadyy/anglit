import type { Passage, Question } from "@/content/questions";

// Authoring format for the Anglit Platinum bank. The correct option comes first, then three
// wrong ones, and build() shuffles them by question id: the key is fixed, and nobody has to
// keep track of answer positions by hand. Every item is original writing for Anglit.
export type RawItem = [
  stem: string,
  correct: string,
  wrong: [string, string, string],
  why: string,
  /** 1-based paragraph a reading question points at */
  paragraph?: number,
];

export type RawTest = {
  /** 12 items: three chapters of four */
  sentence: RawItem[];
  /** 6 items: two chapters of three */
  restatement: RawItem[];
  passage: Omit<Passage, "id">;
  /** 5 items */
  reading: RawItem[];
};

export type PlatinumTestBank = {
  passage: Passage;
  sentence: Question[];
  restatement: Question[];
  reading: Question[];
};

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return h >>> 0;
}

function toQuestion(
  id: string,
  type: "sentence" | "restatement" | "reading",
  [stem, correct, wrong, why, paragraph]: RawItem,
  passageId: string,
): Question {
  const options = [correct, ...wrong].sort((a, b) => hash(id + a) - hash(id + b));
  const base = {
    id,
    stem,
    options: options as [string, string, string, string],
    answer: options.indexOf(correct) as 0 | 1 | 2 | 3,
    explanation: why,
    status: "approved" as const,
  };
  if (type === "reading") return { ...base, type, passageId, ...(paragraph ? { paragraph } : {}) };
  return { ...base, type };
}

export function build(n: number, raw: RawTest): PlatinumTestBank {
  const passageId = `pl${n}`;
  const make = (type: "sentence" | "restatement" | "reading", items: RawItem[], tag: string) =>
    items.map((item, i) => toQuestion(`pl${n}-${tag}-${String(i + 1).padStart(2, "0")}`, type, item, passageId));
  return {
    passage: { id: passageId, ...raw.passage },
    sentence: make("sentence", raw.sentence, "sc"),
    restatement: make("restatement", raw.restatement, "rs"),
    reading: make("reading", raw.reading, "rc"),
  };
}
