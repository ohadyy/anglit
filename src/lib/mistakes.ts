// Wrong answers, saved on this device for the review at /practice?type=mistakes:
// question id -> the option the student picked (null when the exam timed out unanswered).
// A correct answer later, or "got it" in the review, takes the question off the list.
// ponytail: localStorage only, so the list doesn't follow the student to another phone.
// Move it to the database (next to examAttempts) if students ask for that.

export const MISTAKES_KEY = "anglit-mistakes";

export type Mistakes = Record<string, number | null>;

export function readMistakes(): Mistakes {
  try {
    const raw: unknown = JSON.parse(localStorage.getItem(MISTAKES_KEY) ?? "{}");
    // The first version stored a plain list of ids, with no picked option
    if (Array.isArray(raw)) return Object.fromEntries(raw.filter((id) => typeof id === "string").map((id) => [id, null]));
    if (raw && typeof raw === "object") {
      return Object.fromEntries(
        Object.entries(raw).map(([id, v]) => [id, typeof v === "number" ? v : null]),
      );
    }
  } catch {}
  return {};
}

function write(m: Mistakes) {
  try {
    localStorage.setItem(MISTAKES_KEY, JSON.stringify(m));
  } catch {}
}

/** Adds wrong answers (with the picked option) and removes right ones, keyed by question id */
export function recordAnswers(results: Record<string, { correct: boolean; chosen: number | null }>) {
  const m = readMistakes();
  for (const [id, { correct, chosen }] of Object.entries(results)) {
    if (correct) delete m[id];
    else m[id] = chosen;
  }
  write(m);
}

export function removeMistake(id: string) {
  const m = readMistakes();
  delete m[id];
  write(m);
}
