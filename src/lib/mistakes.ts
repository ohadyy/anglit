// Wrong answers: question id -> the option the student picked (null when the exam timed out
// unanswered). A correct answer later, or "got it" in the review, takes the question off the list.
// Kept on this device for instant, offline-friendly reads, and synced to the server
// (/api/practice/mistakes) in the background whenever the student is signed in, so a cleared
// browser or a new device doesn't lose the list — signed-out guests stay local-only.

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

/** Overwrites the local copy — used once, after merging in the server's list on load */
export const saveMistakesLocally = write;

// Best-effort: a signed-out guest gets 401 and nothing is lost, since there's nothing of
// theirs on the server yet. Errors are swallowed either way — the local copy stays the source
// of truth for rendering, this is only the backup.
function syncToServer(answers: Record<string, { correct: boolean; chosen: number | null }>) {
  fetch("/api/practice/mistakes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ answers }),
  }).catch(() => {});
}

/** The signed-in student's mistakes as saved on the server, or null if signed out / offline */
export async function fetchServerMistakes(): Promise<Mistakes | null> {
  try {
    const res = await fetch("/api/practice/mistakes");
    if (!res.ok) return null;
    return (await res.json()) as Mistakes;
  } catch {
    return null;
  }
}

/** Adds wrong answers (with the picked option) and removes right ones, keyed by question id */
export function recordAnswers(results: Record<string, { correct: boolean; chosen: number | null }>) {
  const m = readMistakes();
  for (const [id, { correct, chosen }] of Object.entries(results)) {
    if (correct) delete m[id];
    else m[id] = chosen;
  }
  write(m);
  syncToServer(results);
}

export function removeMistake(id: string) {
  const m = readMistakes();
  delete m[id];
  write(m);
  syncToServer({ [id]: { correct: true, chosen: null } });
}
