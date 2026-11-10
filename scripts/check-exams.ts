// Checks every practice test against the real exam's format and our scoring formula.
// Run: npx tsx scripts/check-exams.ts   (exits with code 1 on any failure)
//
// 1. Content: every core question has 4 distinct options, a valid key, an explanation and a level.
// 2. Pool: exam-pool items never appear in the practice bank.
// 3. Structure: each test has the six core chapters in NITE's order and sizes, no repeated
//    question, one passage per reading chapter, and (regular tests) two valid pilot chapters.
// 4. Adaptive: the test rebuilt by the server from the final answers equals the one the
//    browser built chapter by chapter; strong students are routed to harder chapters.
// 5. Scoring: one more right answer never lowers the score; all wrong / all right hit the ends.
// 6. Calibration: 19 of 23 right on an original test (133 under the old formula) gives
//    roughly what our two students got on the real exam (90–92).
// 7. Accuracy: simulated students of known level get, on average, their own level back,
//    and a simulated national population reproduces NITE's 2024 distribution.

import { questions, passages, isCorrectAnswer, type ExamQuestion } from "@/content/questions";
import { examTests } from "@/content/examTests";
import { frozenTests } from "@/content/frozenTests";
import { poolPassages, poolReading, poolRestatement, poolSentence } from "@/content/examPool";
import { levelOf } from "@/content/difficulty";
import { buildExam, CORE_SECTIONS, type ExamPlanItem } from "@/lib/examStructure";
import { PILOT_CHAPTER, PILOT_CHAPTER_TYPES } from "@/lib/pilotChapters";
import { difficultyOf, pCorrect, scoreExam, scoreFromAbility } from "@/lib/examScore";
import { seededRandom } from "@/lib/random";
import { buildFreeSet } from "@/lib/practice";
import { FREE_QUESTION_COUNT } from "@/content/practiceFacts";

let failures = 0;
function check(ok: boolean, msg: string) {
  if (!ok) {
    failures++;
    console.log("  FAIL", msg);
  }
}

// Seeded so every run gives the same numbers
const rand = seededRandom(12345);
const normal = () => Math.sqrt(-2 * Math.log(rand() || 1e-9)) * Math.cos(2 * Math.PI * rand());
const trueScore = (theta: number) => scoreFromAbility(theta);

type Answers = Record<string, number | null>;
const core = (plan: ExamPlanItem[]) => plan.filter((p) => !p.section.pilot).flatMap((p) => p.questions);
const wrongOption = (q: ExamQuestion) => ((("answer" in q ? q.answer : 0) + 1) % 4);

/** One simulated student at ability theta, going through the test chapter by chapter
 * the way the browser does; returns the answers and the final plan. */
function sitTest(number: string, theta: number, seen: string[] = []): { answers: Answers; plan: ExamPlanItem[]; progressive: ExamPlanItem[] } {
  const answers: Answers = {};
  let plan = buildExam(number, answers, seen);
  const shown: ExamPlanItem[] = [];
  for (let k = 0; k < plan.length; k++) {
    plan = buildExam(number, answers, seen);
    const part = plan[k];
    shown.push(part);
    for (const q of part.questions) {
      if (part.section.pilot || q.type === "wordformation") continue;
      answers[q.id] = rand() < pCorrect(theta, difficultyOf(q.id)) ? (q as { answer: number }).answer : wrongOption(q);
    }
  }
  return { answers, plan: buildExam(number, answers, seen), progressive: shown };
}

function scoreOf(plan: ExamPlanItem[], answers: Answers) {
  return scoreExam(Object.fromEntries(core(plan).map((q) => [q.id, isCorrectAnswer(q, answers[q.id])]))).estimatedScore;
}

// ---------- 1 & 2: content and pool ----------
console.log("1–2. Content and pool");
const pool = [...poolSentence, ...poolRestatement, ...Object.values(poolReading).flat()];
const practiceIds = new Set(questions.map((q) => q.id));
const allCore = [
  ...questions.filter((q) => q.type === "sentence" || q.type === "restatement" || q.type === "reading"),
  ...pool,
];
const seenIds = new Set<string>();
for (const q of allCore) {
  check(!seenIds.has(q.id) || practiceIds.has(q.id), `duplicate id ${q.id}`);
  seenIds.add(q.id);
  if (!("options" in q)) continue;
  check(new Set(q.options).size === 4, `${q.id}: options are not 4 distinct`);
  check(q.answer >= 0 && q.answer <= 3, `${q.id}: bad answer index`);
  check(!!q.explanation?.trim(), `${q.id}: no explanation`);
  check(levelOf(q.id) !== undefined, `${q.id}: no difficulty level`);
}
for (const q of pool) check(!practiceIds.has(q.id), `${q.id}: exam-pool item is also in the practice bank`);
check(buildFreeSet().length === FREE_QUESTION_COUNT, `the free set has ${buildFreeSet().length} questions, FREE_QUESTION_COUNT says ${FREE_QUESTION_COUNT}`);
console.log(`  ${allCore.length} core questions checked, ${pool.length} in the exam-only pool`);
// Practice must reach every level, so students can train up to the exam's harder chapters
for (const type of ["sentence", "restatement", "reading"] as const) {
  const byLevel = [1, 2, 3, 4, 5].map((n) => questions.filter((q) => q.type === type && levelOf(q.id) === n).length);
  console.log(`  practice ${type.padEnd(11)} by level 1–5: ${byLevel.join(" / ")}`);
  byLevel.forEach((n, i) => check(n >= 3, `practice ${type}: only ${n} questions at level ${i + 1}`));
}

// ---------- 3 & 4: structure of every test ----------
console.log("3–4. Structure");
const knownPassages = new Set([...passages, ...poolPassages].map((p) => p.id));
function checkStructure(label: string, plan: ExamPlanItem[], regular: boolean) {
  const coreParts = plan.filter((p) => !p.section.pilot);
  check(coreParts.length === CORE_SECTIONS.length, `${label}: ${coreParts.length} core chapters`);
  CORE_SECTIONS.forEach((s, i) => {
    const part = coreParts[i];
    check(part?.section.type === s.type && part.questions.length === s.count, `${label}: chapter ${i + 1} should be ${s.count} ${s.type}`);
    check(part?.questions.every((q) => q.type === s.type), `${label}: chapter ${i + 1} mixes types`);
  });
  const ids = plan.flatMap((p) => p.questions.map((q) => q.id));
  check(new Set(ids).size === ids.length, `${label}: a question repeats inside the test`);
  const reading = coreParts.find((p) => p.section.type === "reading")?.questions ?? [];
  const pids = new Set(reading.map((q) => ("passageId" in q ? q.passageId : "")));
  check(pids.size === 1, `${label}: reading chapter spans ${pids.size} passages`);
  if (regular) {
    for (const id of pids) check(knownPassages.has(id), `${label}: passage ${id} missing`);
    const pilots = plan.filter((p) => p.section.pilot);
    const writing = pilots.filter((p) => p.section.type === "writing");
    // The 7-chapter version: one writing task instead of the two pilot chapters, never both
    if (writing.length) {
      check(pilots.length === 1 && !!writing[0].prompt && writing[0].questions.length === 0, `${label}: bad writing chapter`);
      return;
    }
    check(pilots.length === 2, `${label}: ${pilots.length} pilot chapters`);
    for (const p of pilots) {
      const t = p.section.type as (typeof PILOT_CHAPTER_TYPES)[number];
      check(PILOT_CHAPTER_TYPES.includes(t) && p.questions.length === PILOT_CHAPTER[t].count, `${label}: bad pilot chapter ${t}`);
    }
  }
}

const frozenNumbers = examTests.filter((t) => frozenTests[t.number]).map((t) => t.number);
const adaptiveNumbers = examTests.filter((t) => t.adaptive).map((t) => t.number);
check(frozenNumbers.length + adaptiveNumbers.length === examTests.length, "a test is neither frozen nor adaptive");
check(frozenNumbers.length === 20, `expected the 20 original tests frozen, found ${frozenNumbers.length}`);

for (const n of frozenNumbers) {
  const plan = buildExam(n);
  checkStructure(n, plan, true);
  const ids = plan.map((p) => p.questions.map((q) => q.id));
  check(JSON.stringify(ids) === JSON.stringify(frozenTests[n].map((p) => p.ids)), `${n}: does not match its frozen list`);
  check(JSON.stringify(buildExam(n, { [ids[0][0]]: 0 })) === JSON.stringify(plan), `${n}: frozen test changed with answers`);
}
for (const n of adaptiveNumbers) {
  for (const theta of [-2.5, -1, 0, 1, 2.5]) {
    const { answers, plan, progressive } = sitTest(n, theta);
    checkStructure(`${n}@${theta}`, plan, true);
    check(JSON.stringify(plan.map((p) => p.questions.map((q) => q.id))) === JSON.stringify(progressive.map((p) => p.questions.map((q) => q.id))), `${n}@${theta}: server rebuild differs from the browser's test`);
    check(JSON.stringify(buildExam(n, answers)) === JSON.stringify(plan), `${n}@${theta}: not deterministic`);
  }
}

// A student who already met some pool items: the test must still rebuild identically, and avoid them
for (const n of adaptiveNumbers.slice(0, 3)) {
  const earlier = core(sitTest(adaptiveNumbers[adaptiveNumbers.length - 1], 1).plan).map((q) => q.id);
  const { answers, plan, progressive } = sitTest(n, 1, earlier);
  check(JSON.stringify(plan.map((p) => p.questions.map((q) => q.id))) === JSON.stringify(progressive.map((p) => p.questions.map((q) => q.id))), `${n}: rebuild with a seen list differs`);
  check(JSON.stringify(buildExam(n, answers, earlier)) === JSON.stringify(plan), `${n}: not deterministic with a seen list`);
  const repeats = core(plan).filter((q) => earlier.includes(q.id)).length;
  check(repeats === 0, `${n}: repeated ${repeats} items from one earlier test`);
}

// Routing: the last chapter of a strong student should be harder than a weak student's
const meanB = (qs: ExamQuestion[]) => qs.reduce((s, q) => s + difficultyOf(q.id), 0) / qs.length;
for (const n of adaptiveNumbers) {
  const lastB = (theta: number) => {
    let s = 0;
    for (let i = 0; i < 40; i++) s += meanB(core(sitTest(n, theta).plan).slice(-4));
    return s / 40;
  };
  const weak = lastB(-2);
  const strong = lastB(2);
  check(strong > weak + 1, `${n}: routing too flat (last chapter difficulty ${weak.toFixed(2)} → ${strong.toFixed(2)})`);
}
console.log(`  ${frozenNumbers.length} frozen, ${adaptiveNumbers.length} adaptive, 1 hand-written tests checked`);

// Repeats: one student takes every adaptive test in turn. How many tests before anything repeats?
console.log("  repeats for one student taking all adaptive tests in turn:");
for (const theta of [-1, 0, 1, 2]) {
  const seen: string[] = [];
  let firstRepeat = 0;

  adaptiveNumbers.forEach((n, i) => {
    const ids = core(sitTest(n, theta, [...seen]).plan).map((q) => q.id);
    const r = ids.filter((id) => seen.includes(id)).length;
    if (r > 0 && firstRepeat === 0) firstRepeat = i + 1;
    seen.push(...ids);
  });
  const times = new Map<string, number>();
  for (const id of seen) times.set(id, (times.get(id) ?? 0) + 1);
  const worst = Math.max(...times.values());
  console.log(`    true score ${trueScore(theta)}: fresh tests before any repeat ${firstRepeat === 0 ? adaptiveNumbers.length : firstRepeat - 1}, distinct items met ${times.size}, most times one item was met ${worst}`);
  check(firstRepeat === 0 || firstRepeat > 3, `student at ${trueScore(theta)} meets a repeat already in test ${firstRepeat}`);
}

// ---------- 5: scoring sanity ----------
console.log("5. Scoring");
const everyTest = [...frozenNumbers, ...adaptiveNumbers];
for (const n of everyTest) {
  const plan = buildExam(n);
  const qs = core(plan);
  const s = (rightMask: boolean[]) => scoreExam(Object.fromEntries(qs.map((q, i) => [q.id, rightMask[i]]))).estimatedScore;
  check(s(qs.map(() => false)) <= 65, `${n}: all wrong scores ${s(qs.map(() => false))}`);
  // Monotonic: turning any wrong answer right never lowers the score
  for (let trial = 0; trial < 30; trial++) {
    const mask = qs.map(() => rand() < 0.5);
    const before = s(mask);
    const i = mask.findIndex((m) => !m);
    if (i < 0) continue;
    mask[i] = true;
    check(s(mask) >= before, `${n}: one more right answer lowered the score`);
  }
}

// ---------- 6: calibration against the two real results ----------
console.log("6. Calibration (original tests, 19 of 23 right)");
const anchor: number[] = [];
for (const n of frozenNumbers) {
  const qs = core(buildExam(n));
  // 19 of 23 right = 133 on the old formula, about the "130" our two students kept getting. Averaged over which 4 they missed.
  let sum = 0;
  const trials = 300;
  for (let t = 0; t < trials; t++) {
    const wrong = new Set<number>();
    while (wrong.size < 4) wrong.add(Math.floor(rand() * qs.length));
    sum += scoreExam(Object.fromEntries(qs.map((q, i) => [q.id, !wrong.has(i)]))).estimatedScore;
  }
  anchor.push(sum / trials);
}
const anchorMean = anchor.reduce((a, b) => a + b, 0) / anchor.length;
console.log(`  19/23 right on an original test → ${anchorMean.toFixed(1)} (old formula: 133; their real exam: 90–92)`);
check(anchorMean >= 89 && anchorMean <= 97, `calibration off: 19/23 on the original tests gives ${anchorMean.toFixed(1)}, want 89–97`);

// ---------- 7: accuracy ----------
console.log("7. Accuracy on simulated students (adaptive tests)");
console.log("  true score | mean reported | bias | typical error");
for (const theta of [-1.6, -0.8, 0, 0.8, 1.35, 1.8]) {
  const errs: number[] = [];
  for (const n of adaptiveNumbers) for (let i = 0; i < 30; i++) {
    const { answers, plan } = sitTest(n, theta);
    errs.push(scoreOf(plan, answers) - trueScore(theta));
  }
  const bias = errs.reduce((a, b) => a + b, 0) / errs.length;
  const rmse = Math.sqrt(errs.reduce((a, b) => a + b * b, 0) / errs.length);
  console.log(`  ${String(trueScore(theta)).padStart(10)} | ${(trueScore(theta) + bias).toFixed(1).padStart(13)} | ${bias.toFixed(1).padStart(4)} | ±${rmse.toFixed(1)}`);
  check(Math.abs(bias) <= 7, `bias ${bias.toFixed(1)} at true score ${trueScore(theta)}`);
}

const population: number[] = [];
for (let i = 0; i < 3000; i++) {
  const n = adaptiveNumbers[i % adaptiveNumbers.length];
  const { answers, plan } = sitTest(n, normal());
  population.push(scoreOf(plan, answers));
}
const mean = population.reduce((a, b) => a + b, 0) / population.length;
const sd = Math.sqrt(population.reduce((a, b) => a + (b - mean) ** 2, 0) / population.length);
const pct = (min: number) => (100 * population.filter((s) => s >= min).length) / population.length;
console.log(`  simulated national population: mean ${mean.toFixed(1)} (NITE 101), SD ${sd.toFixed(1)} (24.8), 134+ ${pct(134).toFixed(1)}% (normal model 9%, NITE actual 11%), 120+ ${pct(120).toFixed(1)}% (normal model 22%, NITE actual 28%)`);
check(Math.abs(mean - 101) <= 5, `population mean ${mean.toFixed(1)}`);
check(sd >= 18 && sd <= 28, `population SD ${sd.toFixed(1)}`);

// ---------- per-test table ----------
console.log("\nPer test: average level, and the score for 50% / 70% / 90% right (old formula in brackets)");
for (const n of frozenNumbers) {
  const qs = core(buildExam(n));
  const avg = qs.reduce((s, q) => s + (levelOf(q.id) ?? 0), 0) / qs.length;
  const at = (ratio: number) => {
    const k = Math.round(qs.length * ratio);
    let sum = 0;
    for (let t = 0; t < 200; t++) {
      const order = qs.map((_, i) => i).sort(() => rand() - 0.5);
      const right = new Set(order.slice(0, k));
      sum += scoreExam(Object.fromEntries(qs.map((q, i) => [q.id, right.has(i)]))).estimatedScore;
    }
    return `${Math.round(sum / 200)} [${Math.round(50 + (k / qs.length) * 100)}]`;
  };
  console.log(`  ${n.padEnd(6)} level ${avg.toFixed(2)}   ${at(0.5).padEnd(10)} ${at(0.7).padEnd(10)} ${at(0.9)}`);
}

console.log(failures === 0 ? "\nAll checks passed." : `\n${failures} check(s) failed.`);
process.exit(failures === 0 ? 0 : 1);
