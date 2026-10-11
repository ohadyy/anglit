import { questions, wordFormationQuestions, type QuestionType } from "@/content/questions";
import { PILOT_CHAPTER_TYPES } from "@/lib/examStructure";

// NITE scores Amirnet adaptively (item-response theory, calibrated item
// difficulty) and never publishes the exact formula — it's their IP, and
// without their item-bank calibration we couldn't reproduce it even if we
// wanted to. This is a plain, transparent estimate: linear from 50 (0
// correct) to 150 (all correct). Good enough to show direction and rough
// level, not a stand-in for the real score.
export function estimateScore(correct: number, total: number): number {
  const ratio = total > 0 ? correct / total : 0;
  return Math.round(50 + ratio * 100);
}

export type ScoreLevel = {
  label: string;
  note: string;
};

// Rough bands for display only. NITE's FAQ says the level and the number of courses
// are set by the institution where the student studies, so the result screen says so.
export function scoreLevel(score: number): ScoreLevel {
  if (score >= 134) return { label: "פטור מאנגלית", note: "ציון 134 ומעלה פוטר מלימודי אנגלית." };
  if (score >= 120) return { label: "מתקדמים ב׳", note: "קורס אנגלית אחד לפני הפטור." };
  if (score >= 100) return { label: "מתקדמים א׳", note: "שני קורסי אנגלית לפני הפטור." };
  if (score >= 85) return { label: "בסיסי", note: "שלושה קורסי אנגלית לפני הפטור." };
  return { label: "טרום בסיסי", note: "ארבעה קורסי אנגלית לפני הפטור." };
}

// A short, modest note under the score, by range. It encourages practice and makes no
// promise about a level or a result.
export function scoreMessage(score: number): string {
  if (score >= 134) return "ציון גבוה מאוד. כדאי לבדוק עם המוסד שבו תלמדו מה הציון מזכה אתכם בו.";
  if (score >= 120) return "רמה טובה מאוד. תרגול ממוקד על סוגי השאלות שטעיתם בהם יכול לחזק עוד את הבסיס.";
  if (score >= 100) return "יש בסיס טוב. תרגול קבוע על סוגי השאלות שטעיתם בהם יכול לעזור להעלות את הציון. אם תרצו ללמוד את זה בקבוצה קטנה, יש לנו מחזורים בזום.";
  return "יש מקום לשיפור, וזה טבעי בשלב הזה. תרגול קצר ומסודר כל יום יעזור לראות איפה נופלות התשובות. אם תרצו ללמוד את זה בקבוצה קטנה, יש לנו מחזורים בזום.";
}

// Experimental (pilot) sections always appear in the real test, but their weight
// is very small. Per NITE's official rules, a wrong answer costs nothing and a
// correct one can add a point or two. PILOT_MAX_BONUS is that cap. The core sections (sentence, restatement, reading)
// set the score on their own.
export const PILOT_MAX_BONUS = 2;

const typeById = new Map<string, QuestionType>([
  ...questions.map((q) => [q.id, q.type] as const),
  ...wordFormationQuestions.map((q) => [q.id, q.type] as const),
]);

export function isPilotQuestion(id: string): boolean {
  const type = typeById.get(id);
  return type !== undefined && (PILOT_CHAPTER_TYPES as readonly QuestionType[]).includes(type);
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
  let pilotCorrect = 0;
  let pilotTotal = 0;

  for (const [id, correct] of Object.entries(correctness)) {
    if (isPilotQuestion(id)) {
      pilotTotal++;
      if (correct) pilotCorrect++;
    } else {
      coreTotal++;
      if (correct) coreCorrect++;
    }
  }

  const pilotBonus = pilotTotal > 0 ? Math.round((PILOT_MAX_BONUS * pilotCorrect) / pilotTotal) : 0;
  const base = estimateScore(coreCorrect, coreTotal);

  return {
    estimatedScore: Math.min(150, base + pilotBonus),
    rawCorrect: coreCorrect + pilotCorrect,
    totalQuestions: coreTotal + pilotTotal,
    coreCorrect,
    coreTotal,
    pilotCorrect,
    pilotTotal,
    pilotBonus,
  };
}
