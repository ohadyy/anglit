// Run from anglit/: npm run check:vocab
// Word ids (vw-N) are saved with every student's progress (vocabProgress.wordId), so the list may only
// grow at the end: no insert, no reorder, no removal. This fails when an id no longer matches its position.
import assert from "node:assert/strict";
import { vocabulary } from "@/content/vocabulary";

// Raise this when you append words; it must never go down
const PINNED_COUNT = 1075;

assert.ok(vocabulary.length >= PINNED_COUNT, `vocabulary has ${vocabulary.length} words, ${PINNED_COUNT} were pinned: words were removed`);
assert.equal(new Set(vocabulary.map((v) => v.id)).size, vocabulary.length, "duplicate word id");
vocabulary.forEach((v, i) => {
  // The oldest ids are zero-padded (vw-01, vw-021), so compare the number, not the text
  assert.equal(Number(v.id.slice(3)), i + 1, `${v.id} (${v.word}) sits at position ${i + 1}: ids must stay vw-1…vw-N in array order`);
});
// Sentinels: the first word, the first word merged from vocabMoreA, and the pinned last one
assert.equal(vocabulary[0].word, "achieve");
assert.equal(vocabulary[466].word, "accept");
assert.equal(vocabulary[PINNED_COUNT - 1].word, "insofar");
console.log(`vocabulary ids ok (${vocabulary.length} words)`);
