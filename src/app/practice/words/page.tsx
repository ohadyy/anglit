import type { Metadata } from "next";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { hasPaidAccess } from "@/lib/access";
import { freeWords } from "@/lib/vocab";
import { WordChain } from "./WordChain";

export const metadata: Metadata = {
  title: "שרשרת מילים",
  description: "משחק קצר לזכירת מילים באנגלית, עם חזרה על המילים שטעיתם בהן.",
};

// Everyone plays the free words; the full bank stays behind payment
const GAME_WORDS = freeWords().map(({ id, word, translation, example }) => ({ id, word, translation, example }));

export default async function WordChainPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const paid = session ? await hasPaidAccess(session.user.id) : false;
  return <WordChain words={GAME_WORDS} paid={paid} />;
}
