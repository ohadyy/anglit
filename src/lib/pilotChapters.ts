// No imports on purpose: examScore and examStructure both need this, and they must not import each other.

/** The four experimental chapter types, with their size from the published format */
export const PILOT_CHAPTER_TYPES = ["listening", "audiocomplete", "wordformation", "grammar"] as const;
export type PilotChapterType = (typeof PILOT_CHAPTER_TYPES)[number];

export const PILOT_CHAPTER: Record<PilotChapterType, { count: number; minutes: number }> = {
  listening: { count: 5, minutes: 7 },
  audiocomplete: { count: 4, minutes: 4 },
  wordformation: { count: 4, minutes: 3 },
  grammar: { count: 4, minutes: 4 },
};
