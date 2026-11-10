import type { Passage, Question } from "@/content/questions";
import type { Level } from "@/content/difficulty";

// Authoring format for the hand-written question banks. The correct option comes first, then three
// wrong ones, and build() shuffles them by question id: the key is fixed, and nobody has to
// keep track of answer positions by hand. Every item is original writing for Anglit.
type RawItem = [
  stem: string,
  correct: string,
  wrong: [string, string, string],
  why: string,
  /** 1-based paragraph a reading question points at */
  paragraph?: number,
];

type RawTest = {
  /** 12 items: three chapters of four */
  sentence: RawItem[];
  /** 6 items: two chapters of three */
  restatement: RawItem[];
  passage: Omit<Passage, "id">;
  /** 5 items */
  reading: RawItem[];
};

type TestBank = {
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

// The option order is a hash of id + option text, so it is stable for the same text. Editing an option's wording
// or an id reshuffles that question, and lib/mistakes.ts stores the chosen option INDEX. Same warning as place()
// in content/bankHelpers.ts, which spreads answers by item number instead.
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

export function build(n: number, raw: RawTest): TestBank {
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

/** A pool item: level first, then the same fields as RawItem */
export type PoolItem = [level: Level, stem: string, correct: string, wrong: [string, string, string], why: string, paragraph?: number];

export const pad = (n: number) => String(n).padStart(2, "0");

/** "id:level id:level ..." keeps several hundred ratings readable in a few lines */
export function parseLevels(s: string): Record<string, Level> {
  return Object.fromEntries(
    s
      .trim()
      .split(/\s+/)
      .map((pair) => {
        const [id, level] = pair.split(":");
        return [id, Number(level) as Level];
      }),
  );
}

export function makePool() {
  const levels: Record<string, Level> = {};
  function make(type: "sentence" | "restatement" | "reading", items: PoolItem[], idOf: (i: number) => string, passageId = "") {
    return items.map(([level, stem, correct, wrong, why, paragraph], i) => {
      const id = idOf(i);
      levels[id] = level;
      return toQuestion(id, type, [stem, correct, wrong, why, paragraph], passageId);
    });
  }
  return { levels, make };
}
