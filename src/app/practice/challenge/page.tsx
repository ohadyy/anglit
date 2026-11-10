import type { Metadata } from "next";
import { buildSingleStemPool } from "@/lib/practice";
import { seededShuffle } from "@/lib/random";
import { ChallengeGame } from "./ChallengeGame";

export const metadata: Metadata = {
  title: "אתגר נגד השעון",
  description: "ענו כמה שיותר נכון ברצף, לפני שהזמן נגמר.",
};

// Fast, single-stem question types only: reading/listening need a passage or audio clip
// on screen, which doesn't fit the pace of a speed round. The fixed seed keeps the same 30
// questions on the server and the client.
const GAME_QUESTIONS = seededShuffle(buildSingleStemPool(), 42).slice(0, 30);

export default function ChallengePage() {
  return <ChallengeGame questions={GAME_QUESTIONS} />;
}
