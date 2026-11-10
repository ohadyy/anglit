// Checks the "ask Ohad" WhatsApp link: question, options and pick are in the text, passages are named.
// Run: npx tsx scripts/check-ask-ohad.ts   (exits with code 1 on any failure)

import assert from "node:assert/strict";
import { questions } from "@/content/questions";
import { askOhadLink } from "@/lib/askOhad";

const text = (url: string) => decodeURIComponent(new URL(url).search.slice("?text=".length));

const sentence = questions.find((q) => q.type === "sentence")!;
const url = askOhadLink(sentence, 1);
assert.ok(url.startsWith("https://wa.me/972"), "opens a chat with Ohad's number");
const body = text(url);
assert.ok(body.includes(sentence.id) && body.includes(sentence.stem), "has the id and the stem");
for (const [i, option] of sentence.options.entries()) assert.ok(body.includes(`${i + 1}. ${option}`), `has option ${i + 1}`);
assert.ok(body.includes("בחרתי: 2") && body.includes(`התשובה באתר: ${sentence.answer + 1}`), "has the pick and the key");
assert.ok(!body.includes("קטע:"), "a plain question names no passage");

assert.ok(!text(askOhadLink(sentence, null)).includes("בחרתי"), "no pick line when the question was skipped");

const reading = questions.find((q) => q.type === "reading" && q.paragraph)!;
assert.ok(/קטע: \S+, פסקה \d/.test(text(askOhadLink(reading, 0))), "a reading question names passage and paragraph");

console.log("ask-ohad link: ok");
