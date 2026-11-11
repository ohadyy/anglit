// One page per English placement level (/amirnet/level/[level]). People placed in a level search
// for it by name ("מתקדמים א׳ באנגלית"). Score ranges and course counts come from SCORE_LEVELS;
// the per-institution rows come from institutions.ts, so these pages only add the explaining text.

import { SCORE_LEVELS } from "@/lib/scoreLevels";
import { NITE_FACTS, SCORE_MAX } from "./facts";
import type { InstitutionBand } from "./institutions";

export type LevelPage = {
  slug: string;
  name: string;
  /** SCORE_LEVELS labels this page covers (pre-basic merges A and B) */
  labels: string[];
  /** Does an institution's band belong to this level? Institutions word their levels differently. */
  matches: (band: InstitutionBand) => boolean;
  answer: string;
  /** What changes when you climb out of this level */
  next: string;
};

const has = (b: InstitutionBand, s: string) => b.level.includes(s);

export const levelPages: LevelPage[] = [
  {
    slug: "pre-basic",
    name: "טרום בסיסי",
    labels: ["טרום בסיסי א׳", "טרום בסיסי ב׳"],
    matches: (b) => has(b, "טרום בסיסי"),
    answer:
      "טרום בסיסי היא רמת האנגלית הנמוכה ביותר. ברוב המוסדות משובצים אליה בציון אמירנט של 50 עד 84, ובחלק מהמוסדות היא מחולקת לא׳ (עד 69) ולב׳ (70 עד 84). בכמה מוסדות ציון בטווח הזה לא מספיק כדי להתקבל לתואר.",
    next: "עלייה לבסיסי (85) חוסכת בדרך כלל קורס אחד או שניים, ובכמה מוסדות היא ההבדל בין קבלה לדחייה.",
  },
  {
    slug: "basic",
    name: "בסיסי",
    labels: ["בסיסי"],
    matches: (b) => has(b, "בסיסי") && !has(b, "טרום"),
    answer:
      "רמת בסיסי באנגלית היא ציון אמירנט של 85 עד 99 ברוב המוסדות. מי שמשובץ אליה לומד בדרך כלל שלושה קורסי אנגלית לפני הפטור: בסיסי, מתקדמים א׳ ומתקדמים ב׳. ציון 85 הוא גם ציון הסף לקבלה בכמה מוסדות.",
    next: "עלייה למתקדמים א׳ (100) חוסכת את קורס הבסיסי, שהוא בדרך כלל גם הארוך מבין הקורסים.",
  },
  {
    slug: "advanced-a",
    name: "מתקדמים א׳",
    labels: ["מתקדמים א׳"],
    matches: (b) => has(b, "מתקדמים א"),
    answer:
      "מתקדמים א׳ באנגלית היא ציון אמירנט של 100 עד 119 ברוב המוסדות. מי שמשובץ אליה לומד בדרך כלל שני קורסי אנגלית לפני הפטור: מתקדמים א׳ ומתקדמים ב׳. בחלק מהמוסדות זו הרמה המינימלית לקבלה.",
    next: "עלייה למתקדמים ב׳ (120) משאירה קורס אנגלית אחד בלבד.",
  },
  {
    slug: "advanced-b",
    name: "מתקדמים ב׳",
    labels: ["מתקדמים ב׳"],
    matches: (b) => has(b, "מתקדמים ב"),
    answer: `מתקדמים ב׳ באנגלית היא ציון אמירנט של 120 עד 133 ברוב המוסדות, הרמה האחרונה לפני הפטור. מי שמשובץ אליה לומד בדרך כלל קורס אנגלית אחד. חסרות לו בין 1 ל-14 נקודות לפטור, שמתחיל ב-${NITE_FACTS.exemptionScore}.`,
    next: `ציון ${NITE_FACTS.exemptionScore} ומעלה פוטר מקורסי הרמה. ברמה הזו כל נקודה קרובה לפטור, ולכן ניסיון נוסף באמירנט שווה שיקול.`,
  },
];

export function getLevelPage(slug: string): LevelPage | undefined {
  return levelPages.find((l) => l.slug === slug);
}

/** The common score range and course count of a level page, read off SCORE_LEVELS */
export function levelRange(page: LevelPage) {
  const first = SCORE_LEVELS.findIndex((l) => l.label === page.labels[0]);
  const last = first + page.labels.length - 1;
  const max = SCORE_LEVELS[last + 1] ? SCORE_LEVELS[last + 1].min - 1 : SCORE_MAX;
  const [most, fewest] = [SCORE_LEVELS[first].courses, SCORE_LEVELS[last].courses];
  return { min: SCORE_LEVELS[first].min, max, courses: most === fewest ? `${most}` : `${fewest}–${most}` };
}
