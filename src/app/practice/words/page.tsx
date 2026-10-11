import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { vocabulary } from "@/content/vocabulary";
import { FREE_WORD_LIMIT } from "@/lib/vocab";
import { WordChain } from "./WordChain";

export const metadata: Metadata = {
  title: "שרשרת מילים",
  description: "משחק קצר לזכירת מילים באנגלית, עם חזרה על המילים שטעיתם בהן.",
};

// Free visitors get the first approved, level-1 words; the full bank stays behind payment
const GAME_WORDS = vocabulary
  .filter((w) => w.status === "approved" && w.level === 1)
  .slice(0, FREE_WORD_LIMIT)
  .map(({ id, word, translation, example }) => ({ id, word, translation, example }));

export default async function WordChainPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/sign-in?next=/practice/words");

  return <WordChain words={GAME_WORDS} />;
}
