import type { QuestionType } from "@/content/questions";
import { PILOT_CHAPTER_TYPES } from "@/lib/pilotChapters";
import { findQuestion } from "@/lib/examQuestions";
import { SCORE_MAX, SCORE_MIN } from "@/content/facts";
import { scoreLevel } from "@/lib/scoreLevels";
import { levelOf, type Level } from "@/content/difficulty";

// NITE scores Amirnet with item-response theory (IRT): every question has a calibrated
// difficulty, the test estimates the examinee's ability from which questions they got
// right, and that ability is put on the 50–150 scale. NITE never publishes its item
// parameters, so this is our own version of the same method:
// - each question's difficulty comes from its level (content/difficulty.ts);
// - a right answer is a three-parameter logistic item with a fixed slope and a 20%
//   guessing floor (four options, and a blank counts as wrong, so everyone guesses);
// - ability is the posterior mean (EAP) under a standard normal prior;
// - the scale is NITE's own 2024 distribution: mean 101, SD 24.8 (69,425 examinees,
//   NITE's annual Amirnet report).
// Calibration (2026-11-04): two of our students who scored about 130 on the old linear
// formula (about 19 of 23 right on the original tests) got 90–92 on the real exam. LEVEL_B is
// set so that 19 of 23 right on those tests now lands near 93. scripts/check-exams.ts checks it.
// Scores already stored in the database were computed by the old formula and are never
// recomputed; this function only scores new attempts.

const SLOPE = 1.7;
const GUESS = 0.2;
const SCALE_MEAN = 101;
const SCALE_SD = 24.8;
// Slightly wider than the population (1.0), so strong and weak students are pulled less toward the mean
const PRIOR_SD = 1.2;

/** Item difficulty (logits) by level. Level 3, the real exam's medium, sits at the national
 * mean: an examinee of 101 gets about 60% of level-3 questions right. */
const LEVEL_B: Record<Level, number> = { 1: -1.6, 2: -0.8, 3: 0, 4: 0.8, 5: 1.6 };

export function pCorrect(theta: number, b: number): number {
  return GUESS + (1 - GUESS) / (1 + Math.exp(-SLOPE * (theta - b)));
}

/** EAP ability from the answered items, on a grid from -4 to 4 */
export function estimateAbility(items: { b: number; correct: boolean }[]): number {
  let num = 0;
  let den = 0;
  for (let i = 0; i <= 160; i++) {
    const t = -4 + i * 0.05;
    let w = Math.exp((-t * t) / (2 * PRIOR_SD * PRIOR_SD));
    for (const it of items) {
      const p = pCorrect(t, it.b);
      w *= it.correct ? p : 1 - p;
    }
    num += t * w;
    den += w;
  }
  return num / den;
}

export function scoreFromAbility(theta: number): number {
  return Math.max(SCORE_MIN, Math.min(SCORE_MAX, Math.round(SCALE_MEAN + SCALE_SD * theta)));
}

/** Difficulty of one question. An unrated id counts as medium; check-exams.ts fails on any. */
export function difficultyOf(id: string): number {
  return LEVEL_B[levelOf(id) ?? 3];
}

// A short, modest note under the score, by range. It encourages practice and makes no
// promise about a level or a result.
export function scoreMessage(score: number): string {
  // The bands are the placement levels: courses left 0 (exempt), 1, 2, and 3 or more
  const { courses } = scoreLevel(score);
  if (courses === 0) return "ציון גבוה מאוד. כדאי לבדוק עם המוסד שבו תלמדו מה הציון מזכה אתכם בו.";
  if (courses === 1) return "רמה טובה מאוד. תרגול ממוקד על סוגי השאלות שטעיתם בהם יכול לחזק עוד את הבסיס.";
  if (courses === 2) return "יש בסיס טוב. תרגול קבוע על סוגי השאלות שטעיתם בהם יכול לעזור להעלות את הציון. אם תרצו ללמוד את זה בקבוצה קטנה, יש לנו מחזורים בזום.";
  return "יש מקום לשיפור, וזה טבעי בשלב הזה. תרגול קצר ומסודר כל יום יעזור לראות איפה נופלות התשובות. אם תרצו ללמוד את זה בקבוצה קטנה, יש לנו מחזורים בזום.";
}

// Experimental (pilot) sections always appear in the real test, but their weight
// is very small. Per NITE's official rules, a wrong answer costs nothing and a
// correct one can add a point or two. PILOT_MAX_BONUS is that cap. The core sections (sentence, restatement, reading)
// set the score on their own.
export const PILOT_MAX_BONUS = 2;

function isPilotQuestion(id: string): boolean {
  const type = questionType(id);
  return type !== undefined && (PILOT_CHAPTER_TYPES as readonly QuestionType[]).includes(type);
}

export function questionType(id: string): QuestionType | undefined {
  return findQuestion(id)?.type;
}

export type ExamScore = {
  estimatedScore: number;
  rawCorrect: number;
  totalQuestions: number;
  coreCorrect: number;
  coreTotal: number;
  pilotCorrect: number;
  pilotTotal: number;
  pilotBonus: number;
};

/** Scores one attempt from per-question correctness. Only the questions that
 * were actually asked are counted, so a core-only attempt has no pilot part. */
export function scoreExam(correctness: Record<string, boolean>): ExamScore {
  let coreCorrect = 0;
  let coreTotal = 0;
  const core: { b: number; correct: boolean }[] = [];
  let pilotCorrect = 0;
  let pilotTotal = 0;

  for (const [id, correct] of Object.entries(correctness)) {
    if (isPilotQuestion(id)) {
      pilotTotal++;
      if (correct) pilotCorrect++;
    } else {
      coreTotal++;
      if (correct) coreCorrect++;
      core.push({ b: difficultyOf(id), correct });
    }
  }

  const pilotBonus = pilotTotal > 0 ? Math.round((PILOT_MAX_BONUS * pilotCorrect) / pilotTotal) : 0;
  const base = coreTotal > 0 ? scoreFromAbility(estimateAbility(core)) : SCORE_MIN;

  return {
    estimatedScore: Math.min(SCORE_MAX, base + pilotBonus),
    rawCorrect: coreCorrect + pilotCorrect,
    totalQuestions: coreTotal + pilotTotal,
    coreCorrect,
    coreTotal,
    pilotCorrect,
    pilotTotal,
    pilotBonus,
  };
}
