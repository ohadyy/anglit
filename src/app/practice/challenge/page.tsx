import type { Metadata } from "next";
import { questions, type Question } from "@/content/questions";
import { ChallengeGame } from "./ChallengeGame";

export const metadata: Metadata = {
  title: "אתגר נגד השעון",
  description: "ענו כמה שיותר נכון ברצף, לפני שהזמן נגמר.",
};

// Deterministic shuffle (fixed seed), so the question order is the same on the
// server and the client — no reshuffle needed after hydration.
function shuffle<T>(items: T[], seed: number): T[] {
  const out = [...items];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// Fast, single-stem question types only — reading/listening need a passage or
// audio clip on screen, which doesn't fit the pace of a speed round.
const POOL = questions.filter(
  (q): q is Question & { type: "sentence" | "restatement" } => q.type === "sentence" || q.type === "restatement",
);

const GAME_QUESTIONS: Question[] = shuffle(POOL, 42).slice(0, 30);

export default async function ChallengePage() {
  return <ChallengeGame questions={GAME_QUESTIONS} />;
}
