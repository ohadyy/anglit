// Every key the site writes to localStorage (or sessionStorage / a cookie), in one place.
// No imports on purpose: the server layout inlines scripts that read two of these.
export const STORAGE_KEYS = {
  theme: "anglit-theme",
  /** sessionStorage: this tab already saw the home intro */
  introSeen: "anglit-intro-seen",
  studio: "anglit-studio",
  review: "anglit-review",
  mistakes: "anglit-mistakes",
  extraTime: "anglit-extra-time",
  daily: "anglit-daily",
  examDate: "anglit-exam-date",
  challengeBest: "anglit-challenge-best",
  chainBest: "anglit-chain-best",
  /** Shared by the two calm games: { thoughtsBest, eliminateBest } */
  calm: "anglit-calm",
  calmReview: "anglit-calm-review",
  journal: "anglit-journal",
  startChecklist: "anglit-start-checklist",
  accessibility: "anglit-a11y",
  /** localStorage and a cookie of the same name (the cookie is read by lib/meta.ts) */
  consent: "anglit-consent",
} as const;
