// No imports on purpose: public client pages (the score calculator) use this without
// pulling the question bank into the browser.

export type ScoreLevel = {
  label: string;
  note: string;
  /** Lowest score in this band */
  min: number;
  /** English level courses still needed before the exemption */
  courses: number;
};

// The common placement bands, lowest first. NITE says each institution sets the level and
// the number of courses itself, so every screen that shows these says so.
export const SCORE_LEVELS: ScoreLevel[] = [
  { min: 50, courses: 5, label: "טרום בסיסי א׳", note: "חמישה קורסי אנגלית לפני הפטור." },
  { min: 70, courses: 4, label: "טרום בסיסי ב׳", note: "ארבעה קורסי אנגלית לפני הפטור." },
  { min: 85, courses: 3, label: "בסיסי", note: "שלושה קורסי אנגלית לפני הפטור." },
  { min: 100, courses: 2, label: "מתקדמים א׳", note: "שני קורסי אנגלית לפני הפטור." },
  { min: 120, courses: 1, label: "מתקדמים ב׳", note: "קורס אנגלית אחד לפני הפטור." },
  { min: 134, courses: 0, label: "פטור מאנגלית", note: "ציון 134 ומעלה פוטר בדרך כלל מקורסי הרמה באנגלית." },
];

export function scoreLevel(score: number): ScoreLevel {
  return SCORE_LEVELS.findLast((l) => score >= l.min) ?? SCORE_LEVELS[0];
}
