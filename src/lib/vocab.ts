import { vocabulary, type VocabWord } from "@/content/vocabulary";
import { randomOrder } from "@/lib/shuffle";

export const SESSION_SIZE = 10;
export const MAX_BOX = 3;
// Free visitors (no payment) get only the first words of the bank, everywhere it's used.
export const FREE_WORD_LIMIT = 20;

export function approvedWords(): VocabWord[] {
  return vocabulary.filter((w) => w.status === "approved");
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
