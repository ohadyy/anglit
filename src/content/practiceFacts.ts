// Numbers that practice screens and their texts both use. Texts interpolate these, so they cannot drift.
// Client-safe: no question banks in here.

export const WRITING_MINUTES = 12;
/** The rule of the practice (the owner's decision); NITE does not publish one, so never present it as NITE's rule */
export const WRITING_MIN_WORDS = 150;

/** Words in a written answer: runs of non-space characters. The writing practice and the exam writing task both count with this. */
export const countWords = (text: string) => text.trim().split(/\s+/).filter(Boolean).length;

/** Seconds per question in the timed challenge (before any extra-time accommodation) */
export const CHALLENGE_SECONDS = 20;

export const FREE_QUESTION_COUNT = 5;
/** Words open to visitors without payment, in /vocabulary, the word chain and the vocab answer endpoint */
export const FREE_WORD_LIMIT = 20;

/** Levels (content/difficulty.ts, 1–5) grouped into the three choices of the practice level picker */
export const LEVEL_GROUPS = [
  { id: "easy", label: "קל", levels: [1] },
  { id: "medium", label: "בינוני", levels: [2, 3] },
  { id: "hard", label: "קשה", levels: [4, 5] },
] as const;
export type LevelGroup = (typeof LEVEL_GROUPS)[number]["id"];
export const isLevelGroup = (v: unknown): v is LevelGroup => LEVEL_GROUPS.some((g) => g.id === v);
