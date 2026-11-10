// Difficulty of every core exam question, on one scale, so the score can weigh a right
// answer by how hard the question was (see lib/examScore.ts).
//
// Difficulty comes from REASONING, never from word rarity (rule set by the owner, 2026-11-09:
// words like austere, ornate or parsimonious do not appear on Amirnet, and a student who misses
// them wrongly concludes she is not ready). Every word in a question, answer or wrong option must
// be one an educated reader meets in news or textbooks. No literary or specialist words.
//
// 1  everyday words, wrong options plainly wrong, short sentence
// 2  common academic words, one clear clue, wrong options somewhat plausible
// 3  real Amirnet medium: B2–C1 words or a logic turn (contrast, negation, inversion),
//    long sentence, two options that both look possible
// 4  C1 words, all options in the same register, the whole sentence must be read;
//    restatements whose wrong options differ by one detail (scope, cause, certainty)
// 5  the clue is indirect: it needs two logic steps at once (a contrast that hides the answer,
//    a negation inside a concession, an inference across sentences), and every option is plausible
//    until the logic is applied. Still common words only.
//
// Rated by hand on 2026-11-04. The exam pool (content/examPool.ts) and the harder practice
// questions (content/practiceHard.ts) carry their own levels and are merged in below.

import { poolLevels } from "./examPool";
import { practiceLevels } from "./practiceHard";
import { parseLevels } from "./hardBank/build";

export type Level = 1 | 2 | 3 | 4 | 5;

const rated = parseLevels(`
sc-01:2 sc-02:2 sc-03:2 sc-04:1 sc-05:2 sc-06:1 sc-07:1 sc-08:1 sc-09:2 sc-10:1 sc-11:1 sc-12:2 sc-13:1 sc-14:1 sc-15:2 sc-16:2
rs-01:2 rs-02:2 rs-03:2 rs-04:2 rs-05:2 rs-06:1 rs-07:2 rs-08:1 rs-09:2 rs-10:1 rs-11:2 rs-12:2
rc-heat-1:1 rc-heat-2:1 rc-heat-3:2 rc-heat-4:2 rc-heat-5:2
rc-mt-1:1 rc-mt-2:2 rc-mt-3:2 rc-mt-4:2 rc-mt-5:2
rc-kelp-1:1 rc-kelp-2:1 rc-kelp-3:2 rc-kelp-4:1 rc-kelp-5:1
rc-let-1:1 rc-let-2:1 rc-let-3:1 rc-let-4:1 rc-let-5:1
sx-01:2 sx-02:2 sx-03:1 sx-04:1 sx-05:1 sx-06:2 sx-07:1 sx-08:1 sx-09:1 sx-10:1 sx-11:1 sx-12:1 sx-13:2 sx-14:1 sx-15:1
sx-16:1 sx-17:1 sx-18:1 sx-19:1 sx-20:1 sx-21:2 sx-22:2 sx-23:1 sx-24:2 sx-25:1 sx-26:1 sx-27:2 sx-28:1 sx-29:2 sx-30:1
rx-01:1 rx-02:2 rx-03:1 rx-04:2 rx-05:2 rx-06:1 rx-07:1 rx-08:1 rx-09:2 rx-10:1 rx-11:1 rx-12:1
rx-13:2 rx-14:1 rx-15:1 rx-16:2 rx-17:2 rx-18:1 rx-19:1 rx-20:1 rx-21:1 rx-22:1 rx-23:2 rx-24:1
sy-01:2 sy-02:1 sy-03:1 sy-04:1 sy-05:1 sy-06:1 sy-07:1 sy-08:1 sy-09:1 sy-10:1 sy-11:1 sy-12:1 sy-13:1 sy-14:2 sy-15:1 sy-16:2 sy-17:2 sy-18:1
sy-19:2 sy-20:2 sy-21:3 sy-22:2 sy-23:2 sy-24:1 sy-25:2 sy-26:1 sy-27:2 sy-28:1 sy-29:2 sy-30:3 sy-31:1 sy-32:1 sy-33:1 sy-34:2 sy-35:2 sy-36:2
ry-01:1 ry-02:1 ry-03:2 ry-04:1 ry-05:1 ry-06:2 ry-07:2 ry-08:1 ry-09:2 ry-10:1 ry-11:1 ry-12:1 ry-13:1 ry-14:2 ry-15:1 ry-16:1 ry-17:1 ry-18:1
cn-01:1 cn-02:1 cn-03:2 cn-04:2 cn-05:1 cn-06:2 cn-07:2 cn-08:2 cn-09:2 cn-10:1 cn-11:2 cn-12:3 cn-13:3 cn-14:1 cn-15:2
cn-16:2 cn-17:2 cn-18:1 cn-19:1 cn-20:2 cn-21:1 cn-22:2 cn-23:1 cn-24:2 cn-25:1 cn-26:1 cn-27:1 cn-28:1 cn-29:3 cn-30:1
`);

const levels: Record<string, Level> = { ...rated, ...poolLevels, ...practiceLevels };

export function levelOf(id: string): Level | undefined {
  return levels[id];
}
