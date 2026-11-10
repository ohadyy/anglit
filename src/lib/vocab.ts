import { vocabulary, type VocabWord } from "@/content/vocabulary";
import { FREE_WORD_LIMIT } from "@/content/practiceFacts";
import { randomOrder } from "@/lib/random";

const SESSION_SIZE = 10;
export const MAX_BOX = 3;

export function approvedWords(): VocabWord[] {
  return vocabulary.filter((w) => w.status === "approved");
}

/** The first words of the bank: all that visitors without payment get, everywhere it's used */
export function freeWords(): VocabWord[] {
  return approvedWords().slice(0, FREE_WORD_LIMIT);
}

// Box 0 means never practiced. Lower boxes come first, so new and missed words
// come back before the ones a student already knows.
export function buildSession(boxes: Map<string, number>, words: VocabWord[]): VocabWord[] {
  // Shuffle first: the sort is stable, so words in the same box would otherwise stay in file (A-B-C) order.
  return randomOrder(words)
    .sort((a, b) => (boxes.get(a.id) ?? 0) - (boxes.get(b.id) ?? 0))
    .slice(0, SESSION_SIZE);
}

export function nextBox(current: number | undefined, knew: boolean): number {
  return knew ? Math.min((current ?? 0) + 1, MAX_BOX) : 1;
}
