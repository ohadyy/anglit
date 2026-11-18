"use client";

import { getJson, removeItem, setItem } from "./safeStorage";
import { STORAGE_KEYS } from "./storageKeys";
import { SCORE_MAX, SCORE_MIN } from "@/content/facts";
import { isGender, type Gender } from "./gender";

// The answers from /onboarding, kept in the browser until the account exists (phone sign-up or Google).
export type Onboarding = {
  priorScore: number | null;
  targetScore: number | null;
  /** YYYY-MM-DD, or "" when there is no date yet */
  examDate: string;
  /** null = chose not to say */
  gender: Gender | null;
};

const isScore = (v: unknown): v is number => typeof v === "number" && Number.isInteger(v) && v >= SCORE_MIN && v <= SCORE_MAX;

/** The saved answers, or null when the visitor has not gone through /onboarding */
export function readOnboarding(): Onboarding | null {
  const raw = getJson(STORAGE_KEYS.onboarding);
  if (typeof raw !== "object" || raw === null) return null;
  const o = raw as Record<string, unknown>;
  return {
    priorScore: isScore(o.priorScore) ? o.priorScore : null,
    targetScore: isScore(o.targetScore) ? o.targetScore : null,
    gender: isGender(o.gender) ? o.gender : null,
    examDate: typeof o.examDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(o.examDate) ? o.examDate : "",
  };
}

export const saveOnboarding = (o: Onboarding) => setItem(STORAGE_KEYS.onboarding, JSON.stringify(o));
export const clearOnboarding = () => removeItem(STORAGE_KEYS.onboarding);
